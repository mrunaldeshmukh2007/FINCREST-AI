export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 dark:bg-blue-600/25 blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-purple-600/20 dark:bg-purple-600/20 blur-[120px] animate-blob-slow" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-emerald-500/15 dark:bg-emerald-500/15 blur-[120px] animate-blob" style={{ animationDelay: '8s' }} />
    </div>
  );
}
