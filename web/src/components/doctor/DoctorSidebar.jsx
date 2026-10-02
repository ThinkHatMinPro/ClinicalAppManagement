import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/doctor/dashboard",
  },
  {
    label: "My Appointments",
    path: "/doctor/appointments",
  },
];

export default function DoctorSidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-73px)] w-64 shrink-0 border-r border-border bg-card lg:block">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}