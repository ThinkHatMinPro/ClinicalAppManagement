import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    Loader2,
    Stethoscope,
    Users,
} from "lucide-react";
import api from "@/lib/api";

export default function StaffDashboard() {
    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0,
    });

    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const today = new Date()
                .toISOString()
                .split("T")[0];

            const [
                patientsResponse,
                doctorsResponse,
                appointmentsResponse,
                todayAppointmentsResponse,
            ] = await Promise.all([
                api.get("/staff/patients?limit=1"),
                api.get("/staff/doctors?limit=1"),
                api.get("/staff/appointments?limit=1"),
                api.get(
                    `/staff/appointments?date=${today}&limit=10`
                ),
            ]);

            console.log(
                "Dashboard patients:",
                patientsResponse
            );

            console.log(
                "Dashboard doctors:",
                doctorsResponse
            );

            console.log(
                "Dashboard appointments:",
                appointmentsResponse
            );

            console.log(
                "Today's appointments:",
                todayAppointmentsResponse
            );

            setStats({
                patients:
                    patientsResponse?.data?.pagination?.total || 0,

                doctors:
                    doctorsResponse?.data?.pagination?.total || 0,

                appointments:
                    appointmentsResponse?.data?.pagination?.total || 0,
            });

            setTodayAppointments(
                todayAppointmentsResponse?.data?.appointments || []
            );
        } catch (err) {
            console.error("Dashboard error:", err);

            setError(
                err.message || "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const formatTime = (dateTime) => {
        if (!dateTime) {
            return "-";
        }

        return new Date(dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDate = (dateTime) => {
        if (!dateTime) {
            return "-";
        }

        return new Date(dateTime).toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-blue-100 text-blue-700";

            case "IN_PROGRESS":
                return "bg-yellow-100 text-yellow-700";

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-muted text-muted-foreground";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="size-7 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Staff Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of clinic activity
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Patients
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {stats.patients}
                            </p>
                        </div>

                        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="size-5 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Doctors
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {stats.doctors}
                            </p>
                        </div>

                        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                            <Stethoscope className="size-5 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Appointments
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {stats.appointments}
                            </p>
                        </div>

                        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                            <CalendarDays className="size-5 text-primary" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-5">
                    <div className="flex items-center gap-2">
                        <Clock className="size-5 text-primary" />

                        <div>
                            <h2 className="font-semibold">
                                Today's Appointments
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Appointments scheduled for today
                            </p>
                        </div>
                    </div>
                </div>

                {todayAppointments.length === 0 ? (
                    <div className="py-14 text-center">
                        <CalendarDays className="mx-auto mb-3 size-10 text-muted-foreground" />

                        <p className="font-medium">
                            No appointments today
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Today's scheduled appointments will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {todayAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {appointment.patient?.name ||
                                            "Unknown Patient"}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Doctor:{" "}
                                        {appointment.doctor?.name ||
                                            "Unknown Doctor"}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {appointment.reason ||
                                            "No reason provided"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {formatTime(
                                                appointment.startTime
                                            )}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {formatDate(
                                                appointment.startTime
                                            )}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                            appointment.status
                                        )}`}
                                    >
                                        {appointment.status
                                            ?.replace("_", " ")
                                            .toLowerCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}