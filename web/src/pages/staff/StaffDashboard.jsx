import {
    CalendarDays,
    Clock,
    Stethoscope,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const formatTime = (value) => {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusClass = (status) => {
    switch (status) {
        case "SCHEDULED":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";

        case "IN_PROGRESS":
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";

        case "COMPLETED":
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

        case "CANCELLED":
            return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

        default:
            return "bg-muted text-muted-foreground";
    }
};

export default function StaffDashboard() {
    const [stats, setStats] = useState({
        patients: 0,
        doctors: 0,
        appointments: 0,
        todayAppointments: 0,
    });

    const [todayAppointments, setTodayAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const today = getToday();

            const [
                patientsResult,
                doctorsResult,
                appointmentsResult,
                todayAppointmentsResult,
            ] = await Promise.all([
                api.get("/staff/patients?limit=1"),
                api.get("/staff/doctors?limit=1"),
                api.get("/staff/appointments?limit=1"),
                api.get(
                    `/staff/appointments?date=${today}&limit=10`
                ),
            ]);

            setStats({
                patients: patientsResult.pagination?.total || 0,
                doctors: doctorsResult.pagination?.total || 0,
                appointments:
                    appointmentsResult.pagination?.total || 0,
                todayAppointments:
                    todayAppointmentsResult.pagination?.total || 0,
            });

            setTodayAppointments(
                todayAppointmentsResult.appointments || []
            );
        } catch (error) {
            setError(error.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const cards = [
        {
            title: "Total Patients",
            value: stats.patients,
            icon: Users,
        },
        {
            title: "Total Doctors",
            value: stats.doctors,
            icon: Stethoscope,
        },
        {
            title: "Total Appointments",
            value: stats.appointments,
            icon: CalendarDays,
        },
        {
            title: "Today's Appointments",
            value: stats.todayAppointments,
            icon: Clock,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Staff Dashboard
                </h2>

                <p className="text-sm text-muted-foreground">
                    Overview of clinic activity and appointments.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="rounded-xl border bg-card p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {card.title}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {loading ? "..." : card.value}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-primary/10 p-3">
                                    <Icon className="size-5 text-primary" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">
                                Today's Appointments
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Scheduled appointments for today.
                            </p>
                        </div>

                        <CalendarDays className="size-5 text-muted-foreground" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Loading appointments...
                    </div>
                ) : todayAppointments.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No appointments scheduled for today.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-5 py-3 font-medium">
                                        Time
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Patient
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Doctor
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Reason
                                    </th>

                                    <th className="px-5 py-3 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {todayAppointments.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="border-b last:border-0 hover:bg-muted/40"
                                    >
                                        <td className="px-5 py-4 font-medium">
                                            {formatTime(
                                                appointment.startTime
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {appointment.patient?.name || "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {appointment.doctor?.name || "-"}
                                        </td>

                                        <td className="max-w-[250px] px-5 py-4">
                                            <span className="line-clamp-1">
                                                {appointment.reason || "-"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                                    appointment.status
                                                )}`}
                                            >
                                                {appointment.status
                                                    ?.replace("_", " ")
                                                    .toLowerCase()
                                                    .replace(
                                                        /\b\w/g,
                                                        (char) =>
                                                            char.toUpperCase()
                                                    ) || "-"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}