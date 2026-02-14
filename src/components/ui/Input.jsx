export default function Input(props) {
  return (
    <input 
      className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:bg-neutral-50 disabled:text-neutral-400" 
      {...props} 
    />
  );
}
