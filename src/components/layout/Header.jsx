export default function Header({ right = null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-md group-hover:shadow-indigo-500/30 transition-shadow">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-indigo-700 transition-colors">
            LiveCoder
          </span>
        </a>
        <div className="flex items-center gap-4">
          {right}
        </div>
      </div>
    </header>
  );
}