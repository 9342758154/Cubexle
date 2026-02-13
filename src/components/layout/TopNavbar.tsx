import { Bell, LogOut, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Search", path: "/search" },
  { label: "Admin", path: "/admin" },
  { label: "Report", path: "/report" },
];

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="bg-nav text-nav-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-border/30 bg-card/10 flex items-center justify-center">
            <span className="text-xs text-nav-foreground/70">□</span>
          </div>
          <span className="text-xl font-semibold tracking-wide">Logo</span>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-3">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-button-primary ${
                location.pathname === item.path
                  ? "ring-2 ring-primary-foreground/40"
                  : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-1.5 hover:bg-nav-foreground/10 rounded transition-colors">
            <Bell className="w-5 h-5 text-warning" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 nav-button bg-destructive text-destructive-foreground hover:opacity-90"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Welcome bar */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div />
        <div className="bg-card/10 border border-border/20 rounded px-8 py-1 text-sm">
          Welcome User Name
        </div>
        <button className="p-1.5 hover:bg-nav-foreground/10 rounded transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;
