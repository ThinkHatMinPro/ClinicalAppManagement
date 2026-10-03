import { Bell, UserRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwitchMode } from "@/components/theme/switch-mode";

export default function StaffHeader() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/auth", { replace: true });
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
            <div>
                <h1 className="text-lg font-semibold">
                    Staff Portal
                </h1>

                <p className="hidden text-sm text-muted-foreground sm:block">
                    Clinic Appointment Management
                </p>
            </div>

            <div className="flex items-center gap-2">
                <SwitchMode
                    width={56}
                    height={28}
                    darkColor="var(--background)"
                    lightColor="var(--secondary)"
                    knobDarkColor="var(--primary)"
                    knobLightColor="var(--card)"
                    borderDarkColor="var(--primary)"
                    borderLightColor="var(--border)"
                />

                <button
                    type="button"
                    className="relative flex size-9 items-center justify-center rounded-lg hover:bg-accent"
                >
                    <Bell className="size-5" />

                    <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
                </button>

                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <UserRound className="size-4" />
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-medium">
                            Staff
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Clinic Staff
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">
                        Logout
                    </span>
                </button>
            </div>
        </header>
    );
}