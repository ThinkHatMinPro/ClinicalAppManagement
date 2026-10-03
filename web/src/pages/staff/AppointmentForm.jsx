import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

// ISO date from the API -> value for <input type="datetime-local">
const toLocalInput = (value) => {
  if (!value) return "";

  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AppointmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

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
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsResponse, doctorsResponse, appointmentResponse] =
          await Promise.all([
            api.get("/staff/patients?limit=100"),
            api.get("/staff/doctors?limit=100"),
            isEdit
              ? api.get(`/staff/appointments/${id}`)
              : Promise.resolve(null),
          ]);

        setPatients(patientsResponse?.data?.patients || []);
        setDoctors(doctorsResponse?.data?.doctors || []);

        if (appointmentResponse) {
          const appointment = appointmentResponse.data;

          setForm({
            patientId: appointment.patient?.id || "",
            doctorId: appointment.doctor?.id || "",
            startTime: toLocalInput(appointment.startTime),
            endTime: toLocalInput(appointment.endTime),
            reason: appointment.reason || "",
            notes: appointment.notes || "",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load appointment details");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.patientId) {
      setError("Please select a patient");
      return;
    }

    if (!form.doctorId) {
      setError("Please select a doctor");
      return;
    }

    if (!form.startTime) {
      setError("Please select start time");
      return;
    }

    if (!form.endTime) {
      setError("Please select end time");
      return;
    }

    const start = new Date(form.startTime);
    const end = new Date(form.endTime);

    if (end <= start) {
      setError("End time must be after start time");
      return;
    }

    const payload = {
      patientId: form.patientId,
      doctorId: form.doctorId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      reason: form.reason.trim(),
      notes: form.notes.trim(),
    };

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/staff/appointments/${id}`, payload);
      } else {
        await api.post("/staff/appointments", payload);
      }

      navigate(isEdit ? `/staff/appointments/${id}` : "/staff/appointments", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message ||
          (isEdit
            ? "Failed to update appointment"
            : "Failed to create appointment"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/staff/appointments")}
          className="rounded-md border p-2 hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">New Appointment</h1>

          <p className="text-sm text-muted-foreground">
            Schedule an appointment
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
      >
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Patient</label>

            <select
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select patient</option>

              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>

            {patients.length === 0 && (
              <p className="text-xs text-destructive">No patients available</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor</label>

            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select doctor</option>

              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>

            {doctors.length === 0 && (
              <p className="text-xs text-destructive">No doctors available</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Start Time</label>

            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Time</label>

            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reason</label>

          <input
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason for appointment"
            className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Additional notes"
            className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/staff/appointments")}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || patients.length === 0 || doctors.length === 0}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}

            {loading
              ? "Saving..."
              : isEdit
                ? "Save Changes"
                : "Create Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}
