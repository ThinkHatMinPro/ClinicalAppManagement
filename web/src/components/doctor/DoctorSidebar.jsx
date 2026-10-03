import { NavLink } from "react-router-dom";
import { CalendarDays, LayoutDashboard } from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    path: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Appointments",
    path: "/doctor/appointments",
    icon: CalendarDays,
  },
];

export default function DoctorSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
      <div className="flex h-16 items-center border-b border-border px-5">
        <button
          type="button"
          className="text-lg font-semibold tracking-tight"
        >
          Doctor Portal
        </button>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="size-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
