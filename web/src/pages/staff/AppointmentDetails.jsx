import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Mail,
    MapPin,
    Phone,
    Stethoscope,
    User,
} from "lucide-react";

import api from "../../lib/api";

export default function AppointmentDetails() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [appointment, setAppointment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =========================================================
    // FETCH APPOINTMENT
    // =========================================================

    useEffect(() => {
        let cancelled = false;

        const fetchAppointment =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    console.log(
                        "Appointment details ID:",
                        id
                    );

                    if (
                        !id ||
                        id === "undefined" ||
                        id === "null"
                    ) {
                        throw new Error(
                            "Invalid appointment ID"
                        );
                    }

                    const result =
                        await api.get(
                            `/staff/appointments/${id}`
                        );

                    console.log(
                        "Appointment details response:",
                        result
                    );

                    if (!cancelled) {
                        setAppointment(
                            result.data
                        );
                    }
                } catch (err) {
                    console.error(
                        "Fetch appointment error:",
                        err
                    );

                    if (!cancelled) {
                        setAppointment(
                            null
                        );

                        setError(
                            err.message ||
                                "Failed to load appointment"
                        );
                    }
                } finally {
                    if (!cancelled) {
                        setLoading(
                            false
                        );
                    }
                }
            };

        fetchAppointment();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // =========================================================
    // DATE
    // =========================================================

    const formatDate = (
        dateValue
    ) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(
            dateValue
        );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    // =========================================================
    // TIME
    // =========================================================

    const formatTime = (
        dateValue
    ) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(
            dateValue
        );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );
    };

    // =========================================================
    // STATUS
    // =========================================================

    const getStatusClass = (
        status
    ) => {
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
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

                    <p className="text-sm text-muted-foreground">
                        Loading appointment...
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (
        error ||
        !appointment
    ) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/staff/appointments"
                        )
                    }
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <ArrowLeft className="size-4" />

                    Back to Appointments
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                    <h2 className="text-lg font-semibold text-red-700">
                        Appointment not
                        found
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error ||
                            "Unable to find this appointment."}
                    </p>
                </div>
            </div>
        );
    }

    // =========================================================
    // DATA
    // =========================================================

    const patient =
        appointment.patient || {};

    const doctor =
        appointment.doctor || {};

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="space-y-6">
            {/* BACK */}

            <button
                type="button"
                onClick={() =>
                    navigate(
                        "/staff/appointments"
                    )
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:underline"
            >
                <ArrowLeft className="size-4" />

                Back to Appointments
            </button>

            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Appointment
                        Details
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        View appointment
                        information
                    </p>
                </div>

                <span
                    className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                        appointment.status
                    )}`}
                >
                    {appointment.status ||
                        "-"}
                </span>
            </div>

            {/* APPOINTMENT INFORMATION */}

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-5 text-primary" />

                        <h2 className="font-semibold">
                            Appointment
                            Information
                        </h2>
                    </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Date
                        </p>

                        <p className="mt-2 font-medium">
                            {formatDate(
                                appointment.startTime
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Start Time
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                            <Clock className="size-4 text-muted-foreground" />

                            <p className="font-medium">
                                {formatTime(
                                    appointment.startTime
                                )}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            End Time
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                            <Clock className="size-4 text-muted-foreground" />

                            <p className="font-medium">
                                {formatTime(
                                    appointment.endTime
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Reason
                        </p>

                        <p className="mt-2">
                            {appointment.reason ||
                                "-"}
                        </p>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Notes
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm">
                            {appointment.notes ||
                                "No notes available"}
                        </p>
                    </div>
                </div>
            </div>

            {/* PATIENT + DOCTOR */}

            <div className="grid gap-6 lg:grid-cols-2">
                {/* PATIENT */}

                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-4">
                        <div className="flex items-center gap-2">
                            <User className="size-5 text-primary" />

                            <h2 className="font-semibold">
                                Patient
                                Information
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 p-6">
                        <div>
                            <p className="text-xs font-medium uppercase text-muted-foreground">
                                Name
                            </p>

                            <p className="mt-1 font-semibold">
                                {patient.name ||
                                    "-"}
                            </p>
                        </div>

                        {patient.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 text-muted-foreground" />

                                <span>
                                    {
                                        patient.phone
                                    }
                                </span>
                            </div>
                        )}

                        {patient.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 text-muted-foreground" />

                                <span>
                                    {
                                        patient.email
                                    }
                                </span>
                            </div>
                        )}

                        {patient.gender && (
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    Gender
                                </p>

                                <p className="mt-1">
                                    {
                                        patient.gender
                                    }
                                </p>
                            </div>
                        )}

                        {patient.dateOfBirth && (
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    Date of
                                    Birth
                                </p>

                                <p className="mt-1">
                                    {formatDate(
                                        patient.dateOfBirth
                                    )}
                                </p>
                            </div>
                        )}

                        {patient.address && (
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                <span>
                                    {
                                        patient.address
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* DOCTOR */}

                <div className="rounded-xl border bg-card shadow-sm">
                    <div className="border-b px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="size-5 text-primary" />

                            <h2 className="font-semibold">
                                Doctor
                                Information
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 p-6">
                        <div>
                            <p className="text-xs font-medium uppercase text-muted-foreground">
                                Name
                            </p>

                            <p className="mt-1 font-semibold">
                                {doctor.name ||
                                    "-"}
                            </p>
                        </div>

                        {doctor.specialty && (
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground">
                                    Specialty
                                </p>

                                <p className="mt-1">
                                    {
                                        doctor.specialty
                                    }
                                </p>
                            </div>
                        )}

                        {doctor.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="size-4 text-muted-foreground" />

                                <span>
                                    {
                                        doctor.phone
                                    }
                                </span>
                            </div>
                        )}

                        {doctor.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 text-muted-foreground" />

                                <span>
                                    {
                                        doctor.email
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ID - useful while debugging */}

            <div className="rounded-lg border bg-muted/30 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                    Appointment ID:{" "}
                    <span className="font-mono">
                        {appointment.id}
                    </span>
                </p>
            </div>
        </div>
    );
}