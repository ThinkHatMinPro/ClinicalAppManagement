import { ChevronDown, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwitchMode } from "@/components/theme/switch-mode";

export default function DoctorHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex h-20 items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Doctor Portal
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <SwitchMode width={64} height={32} />

          <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Bell className="h-5 w-5" />

            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-info" />
          </button>

          <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              AN
            </div>

            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}