import {
    CalendarDays,
    Eye,
    Loader2,
    Plus,
    Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function Appointments() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                const result = await api.get(
                    `/staff/appointments?search=${encodeURIComponent(search)}`
                );

                console.log("Appointments response:", result);

                if (cancelled) return;

                setAppointments(
                    result.data?.appointments || []
                );

                setError("");
            } catch (err) {
                if (cancelled) return;

                console.error(
                    "Fetch appointments error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to fetch appointments"
                );

                setAppointments([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search]);

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Appointments
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage clinic appointments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/staff/appointments/new")
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    <Plus className="size-4" />
                    Add Appointment
                </button>
            </div>

            {/* APPOINTMENTS CARD */}
            <div className="rounded-xl border bg-card shadow-sm">

                {/* SEARCH */}
                <div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">

                    <div className="relative w-full sm:max-w-sm">

                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search appointments..."
                            className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />

                        {appointments.length} appointments
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                        <Loader2 className="size-5 animate-spin" />
                        Loading appointments...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-sm text-destructive">
                        {error}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="py-14 text-center">

                        <CalendarDays className="mx-auto mb-3 size-10 text-muted-foreground" />

                        <p className="font-medium">
                            No appointments found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Create an appointment to see it here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Patient
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Doctor
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Date
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Time
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Reason
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-right font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {appointments.map(
                                    (appointment) => (
                                        <tr
                                            key={appointment.id}
                                            className="border-b transition-colors last:border-0 hover:bg-muted/40"
                                        >

                                            <td className="px-4 py-4 font-medium">
                                                {appointment.patient
                                                    ?.name || "-"}
                                            </td>

                                            <td className="px-4 py-4">
                                                {appointment.doctor
                                                    ?.name || "-"}
                                            </td>

                                            <td className="px-4 py-4">
                                                {formatDate(
                                                    appointment.startTime
                                                )}
                                            </td>

                                            <td className="px-4 py-4">
                                                {formatTime(
                                                    appointment.startTime
                                                )}
                                            </td>

                                            <td className="px-4 py-4">
                                                {appointment.reason ||
                                                    "-"}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                                                    {appointment.status ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/staff/appointments/${appointment.id}`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                                                >
                                                    <Eye className="size-4" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}