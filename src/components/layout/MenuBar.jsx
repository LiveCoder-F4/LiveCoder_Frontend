import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MenuBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const navItems = [
    { label: "홈", to: isAuthenticated ? "/home/auth" : "/" },
    { label: "문제", to: isAuthenticated ? "/problems/auth" : "/problems" },
    { label: "커뮤니티", to: isAuthenticated ? "/community/auth" : "/community" },
    { label: "경쟁", to: "/battle/live" },
    { label: "친구", to: "/friends" },
    { label: "마이페이지", to: "/me" },
  ];

  return (
    <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-md sticky top-[60px] z-40">
      <nav className="container mx-auto max-w-6xl flex items-center gap-1 px-4 py-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
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
            end={item.to === "/" || item.to === "/home/auth"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
