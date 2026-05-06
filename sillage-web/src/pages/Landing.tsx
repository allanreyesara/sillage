import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'


 function Wallpaper() {
  return (
    <>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          25%       { transform: translate(80px,-100px) scale(1.15); }
          50%       { transform: translate(-60px,60px) scale(0.85); }
          75%       { transform: translate(120px,80px) scale(1.10); }
        }
        .blob { position: absolute; border-radius: 9999px; animation: blob 14s infinite ease-in-out; }
        .b1 { width: 540px; height: 540px; top: -10%; left: 8%;  background: rgba(245,158,11,0.22); filter: blur(120px); }
        .b2 { width: 620px; height: 620px; bottom: -15%; right: 4%; background: rgba(124,58,237,0.22); filter: blur(120px); animation-delay: 3s; }
        .b3 { width: 420px; height: 420px; top: 28%; left: -6%; background: rgba(244,63,94,0.18); filter: blur(100px); animation-delay: 5s; }
        .b4 { width: 360px; height: 360px; top: 60%; right: 28%; background: rgba(217,113,11,0.15); filter: blur(100px); animation-delay: 2s; }
        .b5 { width: 320px; height: 320px; top: 8%; right: 22%; background: rgba(217,70,239,0.14); filter: blur(100px); animation-delay: 4s; }
      `}</style>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
        <div className="blob b5" />
      </div>
    </>
  )
}

type BottleColor = 'amber' | 'violet' | 'rose'

const bottleStyles: Record<BottleColor, string> = {
  amber:  'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.42), rgba(255,255,255,0.10) 55%, transparent 70%), linear-gradient(180deg, #5a3a18 0%, #1a0e05 100%)',
  violet: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.42), rgba(255,255,255,0.10) 55%, transparent 70%), linear-gradient(180deg, #2a1d4a 0%, #0c0816 100%)',
  rose:   'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.42), rgba(255,255,255,0.10) 55%, transparent 70%), linear-gradient(180deg, #4a1a26 0%, #16070b 100%)',
}

function Bottle({ color, initial, fontSize = 44 }: { color: BottleColor; initial: string; fontSize?: number }) {
  return (
    <div
      className="relative flex items-end justify-center"
      style={{ width: '62%', height: '74%', filter: 'drop-shadow(0 30px 30px rgba(0,0,0,0.55))' }}
    >
      <div className="absolute z-10" style={{ top: 0, left: '32%', right: '32%', height: '14%', background: '#18181b', borderRadius: 4 }} />
      <div className="absolute z-10" style={{ top: '13%', left: '38%', right: '38%', height: '9%', background: '#0e0e12' }} />
      <div className="absolute" style={{ top: '21%', left: 0, right: 0, bottom: 0, borderRadius: '6px 6px 18px 18px', background: bottleStyles[color] }} />
      <div
        className="absolute text-center"
        style={{ top: '38%', left: 0, right: 0, fontFamily: "'Tenor Sans', serif", fontSize, color: 'rgba(255,255,255,0.35)' }}
      >
        {initial}
      </div>
    </div>
  )
}

function AccordBar({ name, pct, gradient }: { name: string; pct: number; gradient: string }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl px-5 py-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <span className="w-28 text-sm font-medium text-white">{name}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.10)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: gradient }} />
      </div>
      <span className="w-10 text-right text-xs tabular-nums" style={{ color: '#6b7280' }}>{pct}</span>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  const [ isAuthed, setIsAuthed ] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthed(true);      
      } else {
        setIsAuthed(false);
      }
    })
  }, [])

  const pillars = [
    {
      num: '01 — Discover',
      title: 'Search any fragrance. Add it in one tap.',
      desc: 'Powered by Fragella - search across thousands of fragrances and add them to your collection instantly. Accords, notes, seasons and occasions pulled automatically.',
    },
    {
      num: '02 — Understand',
      title: 'Every note. Every accord. No guesswork.',
      desc: 'Top, middle, base. Smoky vs. spicy. Spring morning or winter evening. Sillage breaks down what each bottle actually does so you stop reaching for the wrong one.',
    },
    {
      num: '03 — Recommend',
      title: 'The right bottle for the day - from what you own.',
      desc: 'Tell Sillage the occasion and the season. It surfaces the best match from your personal collection. No new purchases, no decision fatigue.',
    },
  ]

  const fragrances: { color: BottleColor; brand: string; name: string; meta: string; initial: string; imageUrl?: string }[] = [
    { color: 'violet', brand: 'Jean Paul Gaultier', name: 'Le Male Le Parfum',       meta: 'Warm Spicy · Vanilla · Lavender', initial: 'J', imageUrl: 'https://cdn.fragella.com/images/jean-paul-gaultier-le-parfum.jpg' },
    { color: 'amber',  brand: 'Armaf',              name: 'Club de Nuit Precieux 1', meta: 'Sweet · Amber · Fruity',          initial: 'A', imageUrl: 'https://cdn.fragella.com/images/armaf-club-de-nuit-precieux-1.jpg' },
    { color: 'rose',   brand: 'Valentino',          name: 'Born in Roma Intense',    meta: 'Vanilla · Lavender · Aromatic',   initial: 'V', imageUrl: 'https://cdn.fragella.com/images/valentino-uomo-born-in-roma-intense.jpg' },
    { color: 'amber',  brand: 'Nautica',            name: 'Voyage',                  meta: 'Green · Aquatic · Fresh',         initial: 'N', imageUrl: 'https://cdn.fragella.com/images/nautica-voyage.jpg' },
  ]

  const accords = [
    { name: 'Warm Spicy', pct: 92, gradient: 'linear-gradient(to right, #f59e0b, #fbbf24)' },
    { name: 'Vanilla',    pct: 80, gradient: 'linear-gradient(to right, #f59e0b, #fde68a)' },
    { name: 'Lavender',   pct: 68, gradient: 'linear-gradient(to right, #7c3aed, #a78bfa)' },
    { name: 'Aromatic',   pct: 54, gradient: 'linear-gradient(to right, #7c3aed, #f43f5e)' },
    { name: 'Powdery',    pct: 38, gradient: 'linear-gradient(to right, #8b5cf6, #c4b5fd)' },
    { name: 'Amber',      pct: 26, gradient: 'linear-gradient(to right, #f43f5e, #f59e0b)' },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0a0a0f', color: '#ffffff', fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <Wallpaper />

      {/* - Nav - */}
      <header className="relative z-10">
        <nav className="flex items-center justify-between max-w-6xl mx-auto px-8 py-6">
          <img
            src="/logo.png"
            alt="Sillage"
            className="h-14 w-auto cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <div className="hidden md:flex items-center gap-8">
            <a href="#how"      className="text-sm text-gray-400 hover:text-white transition-colors no-underline">How it works</a>
            <a href="#discover" className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Discover</a>
            <a href="#notes"    className="text-sm text-gray-400 hover:text-white transition-colors no-underline">Notes</a>
            {isAuthed ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              Sign in
            </button> )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            {isAuthed ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                Sign in
              </button>
            )}
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-8">

        {/* - Hero - */}
        <section
          className="grid gap-16 items-center py-20 pb-32"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))' }}
        >
          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>
              Your fragrance wardrobe
            </p>
            <h1
              className="font-normal leading-none mb-6"
              style={{ fontFamily: "'Tenor Sans', serif", fontSize: 'clamp(48px, 7vw, 88px)', letterSpacing: '-0.005em', lineHeight: 1.02 }}
            >
              Know what to wear before you{' '}
              <em style={{ fontStyle: 'italic', background: 'linear-gradient(110deg, #f59e0b 0%, #f43f5e 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                even open the drawer.
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{ color: '#9ca3af' }}>
              Sillage catalogs your collection, breaks down every accord and note, and recommends
              the right bottle for the day - based on season, occasion, and what you already own.
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              {isAuthed ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="px-7 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
                  style={{ background: 'linear-gradient(to right, #f59e0b, #f43f5e)', border: 'none' }}
                >
                  Start your collection →
                </button>
                ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="px-7 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
                  style={{ background: 'linear-gradient(to right, #f59e0b, #f43f5e)', border: 'none' }}
                >
                  Start your collection →
                </button> )}
              <button
                onClick={() => navigate('/discover')}
                className="px-5 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.10)', color: '#fff' }}
              >
                Browse fragrances
              </button>
            </div>
            <div className="flex flex-wrap gap-7 mt-10 text-sm items-center" style={{ color: '#6b7280' }}>
              <span>Free while in beta</span>
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#4b5563' }} />
              <span>No card required</span>
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#4b5563' }} />
              <span>Powered by Fragella</span>
            </div>
          </div>

          <div className="relative hidden md:block" style={{ aspectRatio: '1 / 1.05', perspective: 1400 }}>
            <div
              className="absolute rounded-3xl overflow-hidden backdrop-blur-sm"
              style={{ inset: '8% 18% 22% 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)', transform: 'rotateY(-6deg) rotateX(2deg)' }}
            >
              <div className="flex items-center justify-center p-6" style={{ aspectRatio: '1 / 1' }}>
                <Bottle color="violet" initial="J" fontSize={44} />
              </div>
              <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>Jean Paul Gaultier</p>
                <p className="text-sm font-semibold">Le Male Le Parfum</p>
              </div>
            </div>
            <div
              className="absolute rounded-3xl overflow-hidden backdrop-blur-sm"
              style={{ bottom: '4%', right: '4%', width: '46%', height: '42%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px -30px rgba(0,0,0,0.6)', transform: 'rotateY(8deg) rotateX(-2deg)' }}
            >
              <div className="flex items-center justify-center p-3.5" style={{ aspectRatio: '1 / 1' }}>
                <Bottle color="amber" initial="A" fontSize={30} />
              </div>
              <div className="px-3.5 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', fontSize: 10, letterSpacing: '0.22em' }}>Armaf</p>
                <p className="text-xs font-semibold">Club de Nuit Precieux</p>
              </div>
            </div>
            <div
              className="absolute rounded-3xl overflow-hidden backdrop-blur-sm"
              style={{ top: '4%', right: 0, width: '28%', height: '26%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', opacity: 0.85, transform: 'rotateY(10deg) rotateX(2deg)' }}
            >
              <div className="flex items-center justify-center p-2.5" style={{ aspectRatio: '1 / 1' }}>
                <Bottle color="rose" initial="V" fontSize={22} />
              </div>
            </div>
          </div>
        </section>

        {/* - How it works - */}
        <section id="how" className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>How it works</p>
            <h2 className="font-normal mb-4" style={{ fontFamily: "'Tenor Sans', serif", fontSize: 'clamp(34px, 4.5vw, 56px)', letterSpacing: '-0.005em', lineHeight: 1.05 }}>
              Three quiet steps. No more guessing what to wear.
            </h2>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#9ca3af' }}>
              Sillage doesn't replace the ritual of choosing a fragrance - it just gives you a clearer view of the wardrobe you already own.
            </p>
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
            {pillars.map((p) => (
              <div
                key={p.num}
                className="rounded-3xl p-8 backdrop-blur-sm transition-all cursor-default"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.30)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              >
                <p className="text-xs mb-7 tracking-widest" style={{ fontFamily: "'Tenor Sans', serif", color: 'rgba(245,158,11,0.7)', letterSpacing: '0.18em' }}>{p.num}</p>
                <h3 className="font-normal mb-3 leading-tight" style={{ fontFamily: "'Tenor Sans', serif", fontSize: 26, letterSpacing: '-0.005em' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* - Collection preview - */}
        <section id="discover" className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>A glimpse of your collection</p>
            <h2 className="font-normal mb-4" style={{ fontFamily: "'Tenor Sans', serif", fontSize: 'clamp(34px, 4.5vw, 56px)', letterSpacing: '-0.005em', lineHeight: 1.05 }}>
              Smoky, woody, spiced - at a glance.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9ca3af' }}>
              From real collections. Hover any card to see what it's made of.
            </p>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))' }}>
            {fragrances.map((f) => (
              <div
                key={f.name}
                className="rounded-3xl overflow-hidden backdrop-blur-sm transition-all cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.30)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div className="flex items-center justify-center p-6" style={{ aspectRatio: '1 / 1' }}>
                  {f.imageUrl ? (
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      className="h-full w-full object-contain"
                      style={{ maxHeight: 160 }}
                      onError={e => {
                        const target = e.currentTarget
                        target.style.display = 'none'
                        const fallback = target.nextElementSibling as HTMLElement | null
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div style={{ display: f.imageUrl ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Bottle color={f.color} initial={f.initial} />
                  </div>
                </div>
                <div className="px-4 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(245,158,11,0.7)', fontSize: 10, letterSpacing: '0.22em' }}>{f.brand}</p>
                  <p className="text-sm font-semibold leading-tight mb-1.5">{f.name}</p>
                  <p className="text-xs tracking-wide" style={{ color: '#6b7280', letterSpacing: '0.04em' }}>{f.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* - Accord section - */}
        <section id="notes" className="py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="grid gap-16 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))' }}>
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>The vocabulary of scent</p>
              <h2 className="font-normal mb-5" style={{ fontFamily: "'Tenor Sans', serif", fontSize: 'clamp(34px, 4.5vw, 56px)', letterSpacing: '-0.005em', lineHeight: 1.05 }}>
                An accord breakdown for every bottle.
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#9ca3af', maxWidth: 480 }}>
                We break each fragrance into the accords that actually drive how it wears - by weight, not marketing copy.
                See why <em>Le Male Le Parfum</em> is a night-out signature at a glance.
              </p>
              <p className="text-sm tracking-wide" style={{ color: '#6b7280', letterSpacing: '0.04em' }}>— Le Male Le Parfum · Jean Paul Gaultier</p>
            </div>
            <div className="flex flex-col gap-3.5">
              {accords.map((a) => (
                <AccordBar key={a.name} {...a} />
              ))}
            </div>
          </div>
        </section>

        {/* - CTA strip - */}
        <div
          className="my-24 p-16 rounded-3xl text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(244,63,94,0.10) 60%, rgba(124,58,237,0.10) 100%), rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(245,158,11,0.7)', letterSpacing: '0.22em' }}>Beta · free to join</p>
          <h2 className="font-normal mb-5" style={{ fontFamily: "'Tenor Sans', serif", fontSize: 'clamp(32px, 4.5vw, 52px)', letterSpacing: '-0.005em', lineHeight: 1.05 }}>
            Bring your shelf inside.
          </h2>
          <p className="text-base mx-auto mb-7" style={{ color: '#9ca3af', maxWidth: 480 }}>
            Log in, search your first bottle, and your collection is live in under a minute. Free while in beta.
          </p>
          <div className="flex items-center justify-center">
            {isAuthed ? (
              <button
              onClick={() => navigate('/collection')}
              className="px-7 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
              style={{ background: 'linear-gradient(to right, #f59e0b, #f43f5e)', border: 'none' }}
              >
              Manage Collection →
              </button> ) : (
              <button
              onClick={() => navigate('/auth')}
              className="px-7 py-3.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px"
              style={{ background: 'linear-gradient(to right, #f59e0b, #f43f5e)', border: 'none' }}
              >
              Create your account →
              </button>
            )}
            

          </div>  
        </div>

        {/* - Footer - */}
        <footer
          className="flex flex-wrap justify-between items-center gap-4 py-12 text-sm"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4b5563' }}
        >
          <span>© 2026 Sillage</span>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Press', 'Contact'].map((l) => (
              <a key={l} href="#" className="no-underline transition-colors" style={{ color: '#6b7280' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
              >
                {l}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}