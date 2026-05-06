export default function BlobBackground() {
    return (
        <section className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="fixed top-[-10%] left-[10%] w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[5%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] animate-blob pointer-events-none" style={{ animationDelay: '3s' }} />
            <div className="fixed top-[30%] left-[-5%] w-[400px] h-[400px] bg-rose-500/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '5s' }} />
            <div className="fixed top-[60%] right-[30%] w-[350px] h-[350px] bg-amber-600/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="fixed top-[10%] right-[20%] w-[300px] h-[300px] bg-fuchsia-500/15 rounded-full blur-[100px] animate-blob pointer-events-none" style={{ animationDelay: '4s' }} />
        </section>
    )
}