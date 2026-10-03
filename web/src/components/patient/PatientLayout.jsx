import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

import PatientHeader from "../patient/PatientHeader";

export default function PatientLayout() {
  const navigate = useNavigate();

  const links = [
    {
      label: "Dashboard",
      path: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Book Appointment",
      path: "/patient/book-appointment",
      icon: CalendarDays,
    },
    {
      label: "My Appointments",
      path: "/patient/appointments",
      icon: CalendarDays,
    },
    {
      label: "My Profile",
      path: "/patient/profile",
      icon: UserRound,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-16 items-center border-b border-border px-5">
          <button
            type="button"
            onClick={() => navigate("/patient/dashboard")}
            className="text-lg font-semibold tracking-tight"
          >
          <h1 className="text-xl font-semibold tracking-tight">
            Patient Portal
          </h1>
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="size-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <PatientHeader />

        <main className="min-w-0 flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
