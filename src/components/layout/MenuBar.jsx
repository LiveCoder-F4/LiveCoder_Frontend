import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { label: "홈", to: "/" },
  { label: "문제", to: "/problems" },
  { label: "커뮤니티", to: "/community" },
  { label: "경쟁", to: "/battle/live" },
  { label: "마이페이지", to: "/me" },
];

export default function MenuBar() {
  return (
    <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-[60px] z-40">
      <nav className="container mx-auto max-w-6xl flex items-center gap-1 px-4 py-1.5 overflow-x-auto no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
              ${isActive 
                ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
              }
            `}
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
