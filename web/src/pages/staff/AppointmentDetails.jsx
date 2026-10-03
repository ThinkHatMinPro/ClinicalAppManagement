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

function Field({ label, value }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  );
}

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const result = await api.get(`/staff/appointments/${id}`);

        setAppointment(result.data);
      } catch (err) {
        setError(err.message || "Failed to fetch appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading appointment...
      </div>
    );
  }

  if (error || !appointment) {
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
          {error || "Appointment not found."}
        </div>
      </div>
    );
  }

  const canCancel =
    appointment.status === "SCHEDULED" || appointment.status === "IN_PROGRESS";

  const handleCancel = async () => {
    if (!window.confirm("Cancel this appointment?")) {
      return;
    }

    try {
      setBusy(true);
      setActionError("");

      await api.put(`/staff/appointments/${appointment.id}`, {
        status: "CANCELLED",
      });

      setAppointment((current) => ({
        ...current,
        status: "CANCELLED",
      }));
    } catch (err) {
      setActionError(err.message || "Failed to cancel appointment");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this appointment? This cannot be undone.")) {
      return;
    }

    try {
      setBusy(true);
      setActionError("");

      await api.delete(`/staff/appointments/${appointment.id}`);

      navigate("/staff/appointments", { replace: true });
    } catch (err) {
      setActionError(err.message || "Failed to delete appointment");
      setBusy(false);
    }
  };

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

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Appointment Details
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatDate(appointment.startTime)},{" "}
            {formatTime(appointment.startTime)} -{" "}
            {formatTime(appointment.endTime)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/staff/appointments/${appointment.id}/edit`)
            }
            disabled={busy}
            className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Edit / Reschedule
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={busy}
              className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Cancel Appointment
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="h-10 rounded-lg bg-destructive px-4 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-semibold">Appointment</h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Status" value={appointment.status} />
          <Field label="Date" value={formatDate(appointment.startTime)} />
          <Field label="Start Time" value={formatTime(appointment.startTime)} />
          <Field label="End Time" value={formatTime(appointment.endTime)} />
          <Field label="Reason" value={appointment.reason} />
          <Field label="Notes" value={appointment.notes} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-semibold">Patient</h3>

          <div className="space-y-4">
            <Field label="Name" value={appointment.patient?.name} />
            <Field label="Phone" value={appointment.patient?.phone} />
            <Field label="Email" value={appointment.patient?.email} />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-semibold">Doctor</h3>

          <div className="space-y-4">
            <Field label="Name" value={appointment.doctor?.name} />
            <Field label="Specialty" value={appointment.doctor?.specialty} />
            <Field label="Phone" value={appointment.doctor?.phone} />
          </div>
        </div>
      </div>
    </div>
  );
}
