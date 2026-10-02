import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function AppointmentDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await api.get(
                    `/staff/appointments/${id}`
                );

                setAppointment(result.appointment || result);
            } catch (error) {
                setError(
                    error.message || "Failed to fetch appointment"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAppointment();
    }, [id]);

    const updateStatus = async (status) => {
        try {
            setSaving(true);
            setError("");

            const result = await api.put(
                `/staff/appointments/${id}`,
                {
                    status,
                }
            );

            setAppointment(result.appointment || result);
        } catch (error) {
            setError(
                error.message || "Failed to update appointment"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground">
                Loading appointment...
            </div>
        );
    }

    if (error && !appointment) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate("/staff/appointments")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <ArrowLeft className="size-4" />
                    Back to Appointments
                </button>

                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            </div>
        );
    }

    if (!appointment) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground">
                Appointment not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/staff/appointments")}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
                <ArrowLeft className="size-4" />
                Back to Appointments
            </button>

            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Appointment Details
                </h2>
                <p className="text-sm text-muted-foreground">
                    View and update appointment information.
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="mb-5 text-lg font-semibold">
                        Appointment Information
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Appointment ID
                            </p>
                            <p className="mt-1 font-medium">
                                {appointment.id}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Date
                            </p>
                            <p className="mt-1">
                                {formatDate(appointment.startTime)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Time
                            </p>
                            <p className="mt-1">
                                {formatTime(appointment.startTime)} -{" "}
                                {formatTime(appointment.endTime)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Reason
                            </p>
                            <p className="mt-1">
                                {appointment.reason || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Notes
                            </p>
                            <p className="mt-1">
                                {appointment.notes || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-sm text-muted-foreground">
                                Status
                            </p>

                            <select
                                value={appointment.status || ""}
                                disabled={saving}
                                onChange={(event) =>
                                    updateStatus(event.target.value)
                                }
                                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="SCHEDULED">
                                    Scheduled
                                </option>
                                <option value="IN_PROGRESS">
                                    In Progress
                                </option>
                                <option value="COMPLETED">
                                    Completed
                                </option>
                                <option value="CANCELLED">
                                    Cancelled
                                </option>
                            </select>

                            {saving && (
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Updating status...
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-5 text-lg font-semibold">
                            Patient
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>
                                <p className="mt-1 font-medium">
                                    {appointment.patient?.name || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Phone
                                </p>
                                <p className="mt-1">
                                    {appointment.patient?.phone || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="mt-1">
                                    {appointment.patient?.email || "-"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <h3 className="mb-5 text-lg font-semibold">
                            Doctor
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>
                                <p className="mt-1 font-medium">
                                    {appointment.doctor?.name || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Specialty
                                </p>
                                <p className="mt-1">
                                    {appointment.doctor?.specialty || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Phone
                                </p>
                                <p className="mt-1">
                                    {appointment.doctor?.phone || "-"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="mt-1">
                                    {appointment.doctor?.email || "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}