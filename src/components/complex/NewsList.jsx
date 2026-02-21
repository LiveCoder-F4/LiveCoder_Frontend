export default function NewsList({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200">
        <p className="text-sm font-light">등록된 새 소식이 없습니다.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <ul className="space-y-4">
      {items.map((n, i) => (
        <li key={i} className="group border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
          <a 
            href={n.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                {n.title}
              </span>
              <span className="shrink-0 text-[11px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
                {formatDate(n.publishedAt || n.createdAt)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">Read More</span>
              <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}