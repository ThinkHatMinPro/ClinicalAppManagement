import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function AppointmentForm() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [form, setForm] = useState({
        patientId: "",
        doctorId: "",
        startTime: "",
        endTime: "",
        reason: "",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);
                setError("");

                const [patientsResult, doctorsResult] = await Promise.all([
                    api.get("/staff/patients?limit=100"),
                    api.get("/staff/doctors?limit=100"),
                ]);

                setPatients(patientsResult.patients || []);
                setDoctors(doctorsResult.doctors || []);
            } catch (error) {
                setError(error.message || "Failed to load patients and doctors");
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (new Date(form.endTime) <= new Date(form.startTime)) {
            setError("End time must be after start time");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await api.post("/staff/appointments", {
                patientId: Number(form.patientId),
                doctorId: Number(form.doctorId),
                startTime: new Date(form.startTime).toISOString(),
                endTime: new Date(form.endTime).toISOString(),
                reason: form.reason || null,
                notes: form.notes || null,
            });

            navigate("/staff/appointments");
        } catch (error) {
            setError(error.message || "Failed to create appointment");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="p-8 text-center text-sm text-muted-foreground">
                Loading appointment form...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Create Appointment
                </h2>
                <p className="text-sm text-muted-foreground">
                    Schedule an appointment for a patient.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
            >
                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Patient
                        </label>

                        <select
                            name="patientId"
                            value={form.patientId}
                            onChange={handleChange}
                            required
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select patient</option>

                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.name}
                                    {patient.phone ? ` - ${patient.phone}` : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Doctor
                        </label>

                        <select
                            name="doctorId"
                            value={form.doctorId}
                            onChange={handleChange}
                            required
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Select doctor</option>

                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                    {doctor.specialty
                                        ? ` - ${doctor.specialty}`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Start Time
                        </label>

                        <input
                            type="datetime-local"
                            name="startTime"
                            value={form.startTime}
                            onChange={handleChange}
                            required
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            End Time
                        </label>

                        <input
                            type="datetime-local"
                            name="endTime"
                            value={form.endTime}
                            onChange={handleChange}
                            required
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">
                            Reason
                        </label>

                        <input
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Reason for appointment"
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Additional notes"
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/staff/appointments")}
                        className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create Appointment"}
                    </button>
                </div>
            </form>
        </div>
    );
}