import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  Stethoscope,
  Users,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Patients",
    path: "/staff/patients",
    icon: Users,
  },
  {
    label: "Doctors",
    path: "/staff/doctors",
    icon: Stethoscope,
  },
  {
    label: "Appointments",
    path: "/staff/appointments",
    icon: CalendarDays,
  },
];

export default function StaffSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
      <div className="flex h-16 items-center border-b border-border px-5">
        <button type="button" className="text-lg font-semibold tracking-tight">
          Staff Portal
        </button>
      </div>

      <nav className="space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
