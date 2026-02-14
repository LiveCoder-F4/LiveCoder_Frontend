export default function Card({ title, children, className='' }) {
  return (
    <section className={`group overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 hover:-translate-y-1 ${className}`}>
      {title && (
        <h2 className="mb-4 text-lg font-bold text-neutral-800 flex items-center gap-2">
          {title}
        </h2>
      )}
      <div className="text-neutral-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}