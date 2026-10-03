import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../lib/api";
import UpdateStatusModal from "../../components/doctor/UpdateStatusModal";

const statusStyles = {
  SCHEDULED: "bg-success/15 text-success",
  IN_PROGRESS: "bg-info/15 text-info",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/15 text-destructive",
};

const statusLabels = {
  SCHEDULED: "Scheduled",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString();
};

const formatTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/doctor/appointments/${id}`
        );

        setAppointment(response.data);
      } catch (err) {
        setError(
          err.message || "Failed to load appointment details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  const handleStatusUpdate = (updatedAppointment) => {
    setAppointment(updatedAppointment);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-8">
        <p className="text-muted-foreground">
          Loading appointment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{error}</p>

        <button
          onClick={() => navigate("/doctor/appointments")}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to Appointments
        </button>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Appointment not found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/doctor/appointments")}
              className="mb-3 text-sm font-medium text-primary hover:underline"
            >
              ← Back to Appointments
            </button>

            <h1 className="text-3xl font-bold text-foreground">
              Appointment Details
            </h1>

            <p className="mt-2 text-muted-foreground">
              View and manage appointment information.
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${
              statusStyles[appointment.status] ||
              "bg-muted text-muted-foreground"
            }`}
          >
            {statusLabels[appointment.status] ||
              appointment.status}
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Appointment Information
            </h2>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Patient
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.patient?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Reason
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.reason || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Date
              </p>

              <p className="mt-1 font-medium text-foreground">
                {formatDate(appointment.startTime)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Time
              </p>

              <p className="mt-1 font-medium text-foreground">
                {formatTime(appointment.startTime)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Phone
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.patient?.phone || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.patient?.email || "-"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">
                Notes
              </p>

              <p className="mt-1 leading-6 text-foreground">
                {appointment.notes || "No notes available."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Update Status
          </button>
        </div>
      </div>

      {isModalOpen && (
        <UpdateStatusModal
          appointment={appointment}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}