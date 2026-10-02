import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/staff/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/staff/patients",
    label: "Patients",
    icon: Users,
  },
  {
    to: "/staff/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    to: "/staff/appointments",
    label: "Appointments",
    icon: CalendarDays,
  },
];

export default function StaffSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="flex w-full flex-col border-b bg-card md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Stethoscope className="size-5" />
        </div>

        <div>
          <p className="font-semibold">Clinic Manager</p>
          <p className="text-xs text-muted-foreground">Staff Portal</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t p-3 md:block">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}