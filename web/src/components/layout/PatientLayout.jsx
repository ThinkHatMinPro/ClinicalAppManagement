import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function PatientLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const links = [
    {
      label: "Dashboard",
      path: "/patient/dashboard",
    },
    {
      label: "Book Appointment",
      path: "/patient/book-appointment",
    },
    {
      label: "My Appointments",
      path: "/patient/appointments",
    },
    {
      label: "My Profile",
      path: "/patient/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="text-lg font-semibold"
          >
            Clinic Management
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <aside className="w-64 border-r bg-background p-4">
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}