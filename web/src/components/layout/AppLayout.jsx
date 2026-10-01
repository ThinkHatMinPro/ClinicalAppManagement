import { Link, NavLink, Outlet } from "react-router-dom";
import { CalendarDays, LogOut, Stethoscope, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
];

const linkBase =
  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col border-b bg-card md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-4 py-4 font-semibold">
          <Stethoscope className="size-5" />
          Clinic Manager
        </div>

        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:px-3 md:pb-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  linkBase,
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

          <Link
            to="/login"
            className={cn(
              linkBase,
              "ml-auto text-muted-foreground hover:bg-accent hover:text-accent-foreground md:ml-0 md:mt-auto"
            )}
          >
            <LogOut className="size-4" />
            Sign out
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}