import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UpdateStatusModal from "../../components/doctor/UpdateStatusModal";

const appointmentData = {
  A001: {
    id: "A001",
    patient: "Rahul Kumar",
    reason: "General Consultation",
    date: "2026-09-30",
    time: "09:30 AM",
    phone: "+91 98765 43210",
    email: "rahul@example.com",
    notes: "Patient reported mild headache and fatigue.",
    status: "Completed",
  },

  A002: {
    id: "A002",
    patient: "Priya Sharma",
    reason: "Follow-up",
    date: "2026-09-30",
    time: "10:30 AM",
    phone: "+91 98765 12345",
    email: "priya@example.com",
    notes: "Follow-up consultation for previous treatment.",
    status: "Scheduled",
  },

  A003: {
    id: "A003",
    patient: "Arjun Reddy",
    reason: "Fever & Cold",
    date: "2026-09-30",
    time: "12:00 PM",
    phone: "+91 99887 66554",
    email: "arjun@example.com",
    notes: "Patient experiencing fever and cold symptoms.",
    status: "Scheduled",
  },

  A004: {
    id: "A004",
    patient: "Sneha Rao",
    reason: "Regular Checkup",
    date: "2026-09-30",
    time: "02:30 PM",
    phone: "+91 98765 99887",
    email: "sneha@example.com",
    notes: "Routine health checkup.",
    status: "In Progress",
  },
};

const statusStyles = {
  Scheduled: "bg-success/15 text-success",
  "In Progress": "bg-info/15 text-info",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(
    appointmentData[id] || appointmentData.A002
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusUpdate = (updatedAppointment) => {
    setAppointment(updatedAppointment);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
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
              statusStyles[appointment.status]
            }`}
          >
            {appointment.status}
          </span>
        </div>

        {/* Appointment information */}
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
                {appointment.patient}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Reason
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.reason}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Date
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.date}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Time
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.time}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Phone
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="mt-1 font-medium text-foreground">
                {appointment.email}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">
                Notes
              </p>

              <p className="mt-1 leading-6 text-foreground">
                {appointment.notes}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Status Modal */}
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