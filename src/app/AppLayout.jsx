import Header from "../components/layout/Header.jsx";
import MenuBar from "../components/layout/MenuBar.jsx";

export default function AppLayout({ right, children, showMenu=true }) {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="sticky top-0 z-50">
        <Header right={right} />
        {showMenu && <MenuBar />}
      </div>
      
      <main className="container mx-auto max-w-6xl px-4 py-10 fade-in">
        {children}
      </main>
    </div>
  );
}