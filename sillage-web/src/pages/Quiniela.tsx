import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from '../lib/supabase'

// ---------- Tipos ----------
type Winner = "A" | "B" | null;
type Match = {
  id: string; round: string; round_order: number; match_order: number;
  team_a: string; team_b: string; kickoff: string;
  actual_a: number | null; actual_b: number | null;
  actual_winner: Winner;
};
type Prediction = {
  user_id: string; match_id: string;
  pred_a: number; pred_b: number; extra_time: boolean;
  winner_pick: Winner;
};
type Player = { user_id: string; display_name: string };
type AwardPrediction = { user_id: string; award_key: string; guess: string };
type AwardResult = { award_key: string; actual: string };

const AWARDS = [
  { key: "champion", label: "Campeón", pts: 10 },
  { key: "subchampion", label: "Subcampeón", pts: 5 },
  { key: "topScorer", label: "Máximo goleador", pts: 4 },
  { key: "topAssist", label: "Máximo asistente", pts: 4 },
  { key: "bestKeeper", label: "Mejor portero", pts: 3 },
] as const;

const LOCK_MS = 60 * 60 * 1000;
const AWARDS_LOCK = new Date("2026-07-09T19:00:00Z").getTime();
const WINNER_PTS = 2; // puntos por acertar quien avanza en ET/penales

// ---------- Puntos ----------
function calcPoints(p: Prediction, m: Match): number | null {
  if (m.actual_a === null || m.actual_b === null) return null;
  const ao = m.actual_a > m.actual_b ? "A" : m.actual_a < m.actual_b ? "B" : "D";
  const po = p.pred_a > p.pred_b ? "A" : p.pred_a < p.pred_b ? "B" : "D";
  const exact = p.pred_a === m.actual_a && p.pred_b === m.actual_b;
  let pts = 0;
  if (exact) pts += 5;
  else if (po === ao) pts += 3;
  if (ao === "D" && po === "D") pts += 1;
  if (p.extra_time && ao === "D") pts += 2;
  if (ao === "D" && m.actual_winner && p.winner_pick === m.actual_winner) pts += WINNER_PTS;
  return pts;
}

export default function QuinielaPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [preds, setPreds] = useState<Prediction[]>([]);
  const [awardPreds, setAwardPreds] = useState<AwardPrediction[]>([]);
  const [awardResults, setAwardResults] = useState<AwardResult[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [now, setNow] = useState(Date.now());
  const [sync, setSync] = useState("");
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const uid = session?.user.id ?? null;
  const myPlayer = players.find(p => p.user_id === uid) ?? null;

  // ---------- Auth ----------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session); setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // ---------- Carga + Realtime ----------
  const loadAll = useCallback(async () => {
    const [pl, ma, pr, ap, ar, ad] = await Promise.all([
      supabase.from("quiniela_players").select("*"),
      supabase.from("quiniela_matches").select("*").order("round_order").order("match_order"),
      supabase.from("quiniela_predictions").select("*"),
      supabase.from("quiniela_award_predictions").select("*"),
      supabase.from("quiniela_award_results").select("*"),
      supabase.from("quiniela_admins").select("user_id"),
    ]);
    if (pl.data) setPlayers(pl.data);
    if (ma.data) setMatches(ma.data);
    if (pr.data) setPreds(pr.data);
    if (ap.data) setAwardPreds(ap.data);
    if (ar.data) setAwardResults(ar.data);
    setIsAdmin(!!ad.data?.some(a => a.user_id === uid));
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    loadAll();
    const ch = supabase.channel("quiniela-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "quiniela_matches" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "quiniela_predictions" }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "quiniela_award_results" }, loadAll)
      .subscribe();
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    return () => { supabase.removeChannel(ch); clearInterval(tick); };
  }, [uid, loadAll]);

  // ---------- Escrituras ----------
  const debounce = (key: string, fn: () => void) => {
    clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(fn, 450);
  };

  const upsertPrediction = (matchId: string, patch: Partial<Prediction>) => {
    if (!uid) return;
    setPreds(prev => {
      const existing = prev.find(p => p.user_id === uid && p.match_id === matchId);
      const next: Prediction = {
        user_id: uid, match_id: matchId,
        pred_a: existing?.pred_a ?? 0, pred_b: existing?.pred_b ?? 0,
        extra_time: existing?.extra_time ?? false,
        winner_pick: existing?.winner_pick ?? null,
        ...patch,
      };
      // si el marcador ya no es empate, el winner_pick sobra
      if (next.pred_a !== next.pred_b) next.winner_pick = null;
      const rest = prev.filter(p => !(p.user_id === uid && p.match_id === matchId));
      debounce(matchId, async () => {
        setSync("Guardando...");
        const { error } = await supabase.from("quiniela_predictions").upsert(next);
        setSync(error ? "No se guardó (¿partido cerrado?)" : "Guardado");
      });
      return [...rest, next];
    });
  };

  const upsertAward = (awardKey: string, guess: string) => {
    if (!uid) return;
    setAwardPreds(prev => {
      const rest = prev.filter(a => !(a.user_id === uid && a.award_key === awardKey));
      const next = { user_id: uid, award_key: awardKey, guess };
      debounce("aw-" + awardKey, async () => {
        const { error } = await supabase.from("quiniela_award_predictions").upsert(next);
        setSync(error ? "No se guardó (premios cerrados)" : "Guardado");
      });
      return [...rest, next];
    });
  };

  const adminUpdateMatch = (matchId: string, patch: Partial<Match>) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;
      const next = { ...m, ...patch };
      // si el resultado ya no es empate, limpiar actual_winner
      if (next.actual_a !== null && next.actual_b !== null && next.actual_a !== next.actual_b) {
        next.actual_winner = null;
        patch = { ...patch, actual_winner: null };
      }
      return next;
    }));
    debounce("adm-" + matchId, async () => {
      const { error } = await supabase.from("quiniela_matches").update(patch).eq("id", matchId);
      setSync(error ? "Error (¿sos admin?)" : "Guardado");
    });
  };

  const adminUpsertAwardResult = (awardKey: string, actual: string) => {
    setAwardResults(prev => {
      const rest = prev.filter(a => a.award_key !== awardKey);
      return [...rest, { award_key: awardKey, actual }];
    });
    debounce("awr-" + awardKey, async () => {
      const { error } = await supabase.from("quiniela_award_results").upsert({ award_key: awardKey, actual });
      setSync(error ? "Error (¿sos admin?)" : "Guardado");
    });
  };

  const registerPlayer = async () => {
    if (!uid || !nameInput.trim()) return;
    const { error } = await supabase.from("quiniela_players")
      .upsert({ user_id: uid, display_name: nameInput.trim() });
    if (!error) loadAll();
  };

  // ---------- Tabla de posiciones ----------
  const standings = useMemo(() => {
    const norm = (s: string) => s.trim().toLowerCase();
    return players.map(pl => {
      let total = 0;
      matches.forEach(m => {
        const p = preds.find(x => x.user_id === pl.user_id && x.match_id === m.id);
        if (p) { const pts = calcPoints(p, m); if (pts !== null) total += pts; }
      });
      AWARDS.forEach(a => {
        const res = awardResults.find(r => r.award_key === a.key);
        const guess = awardPreds.find(g => g.user_id === pl.user_id && g.award_key === a.key);
        if (res && guess && norm(guess.guess) === norm(res.actual)) total += a.pts;
      });
      return { ...pl, total };
    }).sort((a, b) => b.total - a.total);
  }, [players, matches, preds, awardPreds, awardResults]);

  // ---------- Render ----------
  if (!authChecked) return <Center>Cargando...</Center>;
  if (!session) return (
    <Center>
      <p className="mb-2 font-bold">Iniciá sesión para entrar a la quiniela</p>
      <p className="text-sm text-neutral-500">Usá el login normal de la app. Si no tenés cuenta, registrate primero.</p>
    </Center>
  );
  if (!myPlayer) return (
    <Center>
      <p className="mb-3 font-bold">¿Cómo querés aparecer en la quiniela?</p>
      <div className="flex gap-2">
        <input className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          placeholder="Tu nombre" value={nameInput} maxLength={16}
          onChange={e => setNameInput(e.target.value)} />
        <button onClick={registerPlayer}
          className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-bold text-white">Entrar</button>
      </div>
    </Center>
  );

  const rounds = [...new Map(matches.map(m => [m.round, m.round_order])).entries()]
    .sort((a, b) => a[1] - b[1]).map(([r]) => r);
  const awardsLocked = now >= AWARDS_LOCK;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24">
      <header className="rounded-2xl bg-emerald-950 p-5 text-white">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Copa Mundial FIFA 2026</p>
        <h1 className="mb-4 mt-1 text-2xl font-extrabold">Quiniela del Mundial</h1>
        <div className="flex flex-col gap-2">
          {standings.map((pl, i) => (
            <div key={pl.user_id} className="flex items-center justify-between rounded-xl bg-emerald-900 px-4 py-2.5">
              <span className="text-[15px] font-bold">
                {i + 1}. {pl.display_name}{pl.user_id === uid ? " (vos)" : ""}
              </span>
              <span className="text-2xl font-extrabold text-amber-400">{pl.total}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-right text-[11px] text-emerald-200">{sync}</p>
      </header>

      <details className="mt-4 rounded-xl border border-neutral-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-[15px] font-bold text-emerald-950">Reglas de puntuación</summary>
        <div className="px-4 pb-4 text-[13px] leading-relaxed text-neutral-600">
          Pronosticás el marcador exacto de los 90 minutos. Si pronosticás empate, elegí también quién avanza.
          Las predicciones cierran 1 hora antes de cada partido y las de los demás se revelan al cierre.
          <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {[["Marcador exacto","5 pts"],["Resultado correcto","3 pts"],["Bono empate","+1 pt"],["Bono tiempo extra","+2 pts"],["Quién avanza (ET/penales)",`+${WINNER_PTS} pts`],["Campeón","10 pts"],["Subcampeón","5 pts"],["Máx. goleador","4 pts"],["Máx. asistente","4 pts"],["Mejor portero","3 pts"]].map(([l, v]) => (
              <div key={l} className="flex justify-between rounded-lg bg-emerald-50 px-3 py-1.5">
                <span>{l}</span><b className="text-emerald-950">{v}</b>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="mt-3 rounded-xl border border-neutral-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-[15px] font-bold text-emerald-950">
          Premios y campeón {awardsLocked ? "· cerrado" : ""}
        </summary>
        <div className="divide-y divide-neutral-200 px-4 pb-4">
          {AWARDS.map(a => {
            const mine = awardPreds.find(g => g.user_id === uid && g.award_key === a.key);
            const res = awardResults.find(r => r.award_key === a.key);
            return (
              <div key={a.key} className="py-3">
                <div className="mb-2 flex justify-between text-[13.5px] font-bold text-amber-800">
                  <span>{a.label}</span><span>{a.pts} pts</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="rounded-lg border border-neutral-300 px-3 py-2 text-[13px] disabled:bg-neutral-100"
                    placeholder="Tu pronóstico" disabled={awardsLocked}
                    value={mine?.guess ?? ""}
                    onChange={e => upsertAward(a.key, e.target.value)} />
                  <input className="rounded-lg border border-orange-400 bg-orange-50 px-3 py-2 text-[13px] disabled:opacity-60"
                    placeholder="Resultado real" disabled={!isAdmin}
                    value={res?.actual ?? ""}
                    onChange={e => adminUpsertAwardResult(a.key, e.target.value)} />
                </div>
                {awardsLocked && (
                  <div className="mt-2 text-[12px] text-neutral-500">
                    {players.filter(p => p.user_id !== uid).map(p => {
                      const g = awardPreds.find(x => x.user_id === p.user_id && x.award_key === a.key);
                      return <div key={p.user_id}>{p.display_name}: {g?.guess ?? "—"}</div>;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </details>

      {rounds.map(round => (
        <section key={round}>
          <h2 className="mb-2 mt-6 px-1 text-sm font-bold text-emerald-950">{round}</h2>
          {matches.filter(m => m.round === round).map(m => {
            const locked = now >= new Date(m.kickoff).getTime() - LOCK_MS;
            const mine = preds.find(p => p.user_id === uid && p.match_id === m.id);
            const myDraw = !!mine && mine.pred_a === mine.pred_b;
            const actualDraw = m.actual_a !== null && m.actual_b !== null && m.actual_a === m.actual_b;
            return (
              <div key={m.id} className="mb-3 rounded-xl border border-neutral-200 bg-white p-4">
                <div className="mb-1 flex items-center gap-2">
                  <TeamName value={m.team_a} editable={isAdmin}
                    onChange={v => adminUpdateMatch(m.id, { team_a: v })} />
                  <span className="text-[11px] font-bold text-neutral-400">vs</span>
                  <TeamName value={m.team_b} editable={isAdmin}
                    onChange={v => adminUpdateMatch(m.id, { team_b: v })} />
                </div>
                <div className="mb-2 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>{new Date(m.kickoff).toLocaleString("es-CR", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
                  <span className={`rounded-md px-2 py-0.5 font-bold ${locked ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-700"}`}>
                    {locked ? "Cerrado" : "Abierto"}
                  </span>
                </div>

                {/* Mi predicción */}
                <div className="border-t border-neutral-100 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-14 shrink-0 truncate text-xs font-bold text-emerald-800">Vos</span>
                    <ScoreInput value={mine?.pred_a ?? null} disabled={locked}
                      onChange={v => upsertPrediction(m.id, { pred_a: v ?? 0 })} />
                    <span className="text-neutral-400">-</span>
                    <ScoreInput value={mine?.pred_b ?? null} disabled={locked}
                      onChange={v => upsertPrediction(m.id, { pred_b: v ?? 0 })} />
                    <label className="ml-1 flex items-center gap-1 text-[11px] text-neutral-500">
                      <input type="checkbox" checked={mine?.extra_time ?? false} disabled={locked}
                        onChange={e => upsertPrediction(m.id, { extra_time: e.target.checked })} />
                      ET
                    </label>
                    <PtsTag pts={mine ? calcPoints(mine, m) : null} />
                  </div>
                  {myDraw && (
                    <WinnerPicker
                      label="¿Quién avanza?"
                      teamA={m.team_a} teamB={m.team_b}
                      value={mine?.winner_pick ?? null}
                      disabled={locked}
                      onChange={w => upsertPrediction(m.id, { winner_pick: w })}
                    />
                  )}
                </div>

                {/* Predicciones de otros */}
                {players.filter(p => p.user_id !== uid).map(p => {
                  const pr = preds.find(x => x.user_id === p.user_id && x.match_id === m.id);
                  return (
                    <div key={p.user_id} className="flex items-center gap-2.5 border-t border-neutral-100 py-2">
                      <span className="w-14 shrink-0 truncate text-xs font-bold text-neutral-500">{p.display_name}</span>
                      {pr ? (
                        <>
                          <span className="text-sm font-bold">{pr.pred_a} - {pr.pred_b}</span>
                          {pr.extra_time && <span className="text-[10px] font-bold text-neutral-400">ET</span>}
                          {pr.winner_pick && (
                            <span className="text-[10px] text-neutral-500">
                              avanza {pr.winner_pick === "A" ? m.team_a : m.team_b}
                            </span>
                          )}
                          <PtsTag pts={calcPoints(pr, m)} />
                        </>
                      ) : (
                        <span className="text-xs italic text-neutral-400">
                          {locked ? "Sin predicción" : "Oculta hasta el cierre"}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Resultado real: solo admin */}
                <div className="mt-1 border-t-2 border-orange-400 pt-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-14 shrink-0 text-xs font-bold text-orange-600">Real</span>
                    <ScoreInput value={m.actual_a} accent disabled={!isAdmin}
                      onChange={v => adminUpdateMatch(m.id, { actual_a: v })} />
                    <span className="text-neutral-400">-</span>
                    <ScoreInput value={m.actual_b} accent disabled={!isAdmin}
                      onChange={v => adminUpdateMatch(m.id, { actual_b: v })} />
                    {!isAdmin && <span className="text-[10px] text-neutral-400">solo admin</span>}
                  </div>
                  {actualDraw && (
                    isAdmin ? (
                      <WinnerPicker
                        label="¿Quién avanzó?"
                        teamA={m.team_a} teamB={m.team_b}
                        value={m.actual_winner}
                        accent
                        onChange={w => adminUpdateMatch(m.id, { actual_winner: w })}
                      />
                    ) : m.actual_winner && (
                      <p className="mt-1.5 pl-[66px] text-[11px] font-bold text-orange-600">
                        Avanzó {m.actual_winner === "A" ? m.team_a : m.team_b}
                      </p>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

// ---------- Subcomponentes ----------
function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">{children}</div>;
}

function PtsTag({ pts }: { pts: number | null }) {
  return <span className="ml-auto min-w-[26px] text-right text-xs font-extrabold text-emerald-700">{pts !== null ? `+${pts}` : ""}</span>;
}

function WinnerPicker({ label, teamA, teamB, value, onChange, disabled, accent }: {
  label: string; teamA: string; teamB: string;
  value: Winner; onChange: (w: Winner) => void;
  disabled?: boolean; accent?: boolean;
}) {
  const base = "rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors disabled:opacity-50";
  const off = accent ? "border-orange-300 text-orange-600" : "border-neutral-300 text-neutral-500";
  const on = accent ? "border-orange-500 bg-orange-500 text-white" : "border-emerald-700 bg-emerald-700 text-white";
  return (
    <div className="mt-1.5 flex items-center gap-1.5 pl-[66px]">
      <span className={`text-[11px] ${accent ? "text-orange-600" : "text-neutral-500"}`}>{label}</span>
      {(["A", "B"] as const).map(side => (
        <button key={side} type="button" disabled={disabled}
          className={`${base} ${value === side ? on : off} max-w-[130px] truncate`}
          onClick={() => onChange(value === side ? null : side)}>
          {side === "A" ? teamA : teamB}
        </button>
      ))}
    </div>
  );
}

function TeamName({ value, editable, onChange }: { value: string; editable: boolean; onChange: (v: string) => void }) {
  if (!editable) return <span className="min-w-0 flex-1 truncate py-1 text-sm font-bold">{value}</span>;
  return (
    <input className="min-w-0 flex-1 border-b border-neutral-200 bg-transparent py-1 text-sm font-bold outline-none focus:border-emerald-700"
      value={value} onChange={e => onChange(e.target.value)} />
  );
}

function ScoreInput({ value, onChange, disabled, accent }: {
  value: number | null; onChange: (v: number | null) => void;
  disabled?: boolean; accent?: boolean;
}) {
  return (
    <input type="number" min={0} max={20} inputMode="numeric" disabled={disabled}
      className={`h-9 w-11 rounded-lg border text-center text-[15px] font-bold outline-none
        ${accent ? "border-orange-400 bg-orange-50" : "border-neutral-300"}
        disabled:bg-neutral-100 disabled:text-neutral-400`}
      value={value === null ? "" : value}
      onChange={e => {
        const v = e.target.value === "" ? null : Math.max(0, parseInt(e.target.value, 10));
        onChange(Number.isNaN(v as number) ? null : v);
      }} />
  );
}