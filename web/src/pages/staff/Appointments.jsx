import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    CalendarDays,
    Clock,
    Eye,
    Plus,
    Search,
} from "lucide-react";

import api from "../../lib/api";

export default function Appointments() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================================================
    // FETCH APPOINTMENTS
    // =========================================================

    useEffect(() => {
        let cancelled = false;

        const fetchAppointments = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await api.get(
                    `/staff/appointments?search=${encodeURIComponent(
                        search
                    )}`
                );

                console.log(
                    "Appointments API response:",
                    result
                );

                const appointmentList =
                    result.data?.appointments || [];

                console.log(
                    "Appointments:",
                    appointmentList
                );

                if (!cancelled) {
                    setAppointments(appointmentList);
                }
            } catch (err) {
                console.error(
                    "Fetch appointments error:",
                    err
                );

                if (!cancelled) {
                    setAppointments([]);

                    setError(
                        err.message ||
                            "Failed to load appointments"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        const timer = setTimeout(() => {
            fetchAppointments();
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search]);

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // =========================================================
    // STATUS STYLE
    // =========================================================

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
                return "bg-gray-100 text-gray-700";
        }
    };

    // =========================================================
    // VIEW APPOINTMENT
    // =========================================================

    const handleViewAppointment = (appointment) => {
        console.log(
            "Clicked appointment:",
            appointment
        );

        const appointmentId = appointment?.id;

        console.log(
            "Appointment ID:",
            appointmentId
        );

        if (!appointmentId) {
            console.error(
                "Appointment ID is missing:",
                appointment
            );

            setError(
                "Unable to open appointment because the appointment ID is missing."
            );

            return;
        }

        navigate(
            `/staff/appointments/${appointmentId}`
        );
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="space-y-6">
            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Appointments
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage clinic appointments
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/staff/appointments/new"
                        )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                    <Plus className="size-4" />

                    Add Appointment
                </button>
            </div>

            {/* SEARCH */}

            <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search appointments..."
                        className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* APPOINTMENTS TABLE */}

            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-5 text-primary" />

                        <h2 className="font-semibold">
                            Appointment List
                        </h2>
                    </div>

                    {!loading && (
                        <span className="text-sm text-muted-foreground">
                            {appointments.length}{" "}
                            {appointments.length === 1
                                ? "appointment"
                                : "appointments"}
                        </span>
                    )}
                </div>

                {/* LOADING */}

                {loading ? (
                    <div className="flex min-h-[250px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />

                            <p className="text-sm text-muted-foreground">
                                Loading appointments...
                            </p>
                        </div>
                    </div>
                ) : appointments.length === 0 ? (
                    /* EMPTY STATE */

                    <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
                        <CalendarDays className="mb-3 size-10 text-muted-foreground/50" />

                        <h3 className="font-medium">
                            No appointments found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {search
                                ? "Try a different search term."
                                : "Create your first appointment."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/staff/appointments/new"
                                    )
                                }
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                            >
                                <Plus className="size-4" />

                                Add Appointment
                            </button>
                        )}
                    </div>
                ) : (
                    /* TABLE */

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr className="border-b text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-6 py-3">
                                        Patient
                                    </th>

                                    <th className="px-6 py-3">
                                        Doctor
                                    </th>

                                    <th className="px-6 py-3">
                                        Date
                                    </th>

                                    <th className="px-6 py-3">
                                        Time
                                    </th>

                                    <th className="px-6 py-3">
                                        Reason
                                    </th>

                                    <th className="px-6 py-3">
                                        Status
                                    </th>

                                    <th className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {appointments.map(
                                    (appointment) => (
                                        <tr
                                            key={
                                                appointment.id
                                            }
                                            className="border-b transition-colors last:border-b-0 hover:bg-muted/40"
                                        >
                                            {/* PATIENT */}

                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium">
                                                        {appointment
                                                            .patient
                                                            ?.name ||
                                                            "-"}
                                                    </p>

                                                    {appointment
                                                        .patient
                                                        ?.phone && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .phone
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* DOCTOR */}

                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium">
                                                        {appointment
                                                            .doctor
                                                            ?.name ||
                                                            "-"}
                                                    </p>

                                                    {appointment
                                                        .doctor
                                                        ?.specialty && (
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {
                                                                appointment
                                                                    .doctor
                                                                    .specialty
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* DATE */}

                                            <td className="px-6 py-4 text-sm">
                                                {formatDate(
                                                    appointment.startTime
                                                )}
                                            </td>

                                            {/* TIME */}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock className="size-4 text-muted-foreground" />

                                                    {formatTime(
                                                        appointment.startTime
                                                    )}
                                                </div>
                                            </td>

                                            {/* REASON */}

                                            <td className="max-w-[220px] px-6 py-4 text-sm">
                                                <span
                                                    className="block truncate"
                                                    title={
                                                        appointment.reason ||
                                                        ""
                                                    }
                                                >
                                                    {appointment.reason ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* STATUS */}

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        appointment.status
                                                    )}`}
                                                >
                                                    {appointment.status ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* VIEW */}

                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewAppointment(
                                                            appointment
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:underline"
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