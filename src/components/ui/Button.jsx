export default function Button({ children, variant='outline', className='', ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const styles = {
    outline: "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 focus:ring-2 focus:ring-neutral-200",
    solid: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
    ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
  };

  return (
    <button 
      className={`${base} ${styles[variant] || styles.outline} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}