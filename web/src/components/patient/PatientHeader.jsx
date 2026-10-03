import { Bell, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwitchMode } from "@/components/theme/switch-mode";

export default function PatientHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/auth", { replace: true });
  };

  return (
    <header className="top-0 z-40 h-16 shrink-0 border-b border-border bg-card">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        <div>
        </div>

        <div className="flex items-center gap-3">
          <SwitchMode width={56} height={28} />

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-info" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border-border px-3 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
              <UserRound className="size-4" />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Clinic Patient</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}