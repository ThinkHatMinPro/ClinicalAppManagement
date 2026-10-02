import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Today's Appointments",
    value: "5",
    description: "Appointments scheduled today",
  },
  {
    title: "Completed",
    value: "18",
    description: "Appointments completed",
  },
  {
    title: "Upcoming",
    value: "12",
    description: "Upcoming appointments",
  },
  {
    title: "Total Patients",
    value: "42",
    description: "Patients under your care",
  },
];

const todayAppointments = [
  {
    id: "A001",
    patient: "Rahul Kumar",
    time: "09:30 AM",
    reason: "General Consultation",
    status: "Completed",
  },
  {
    id: "A002",
    patient: "Priya Sharma",
    time: "10:30 AM",
    reason: "Follow-up",
    status: "Scheduled",
  },
  {
    id: "A003",
    patient: "Arjun Reddy",
    time: "12:00 PM",
    reason: "Fever & Cold",
    status: "Scheduled",
  },
  {
    id: "A004",
    patient: "Sneha Rao",
    time: "02:30 PM",
    reason: "Regular Checkup",
    status: "In Progress",
  },
];

const statusStyles = {
  Scheduled: "bg-success/15 text-success",
  "In Progress": "bg-info/15 text-info",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Doctor Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back, Doctor. Here's your appointment overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Next Appointment */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Next Appointment
            </p>

            <h2 className="mt-1 text-xl font-semibold text-foreground">
              Priya Sharma
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Follow-up consultation
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-lg font-semibold text-primary">
              10:30 AM
            </p>

            <p className="text-sm text-muted-foreground">
              Today
            </p>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={() => navigate("/doctor/appointments/A002")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Appointment
          </button>
        </div>
      </div>

      {/* Today's appointments */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Today's Appointments
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your appointments scheduled for today.
            </p>
          </div>

          <button
            onClick={() => navigate("/doctor/appointments")}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </button>
        </div>

        <div className="divide-y divide-border">
          {todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {appointment.patient}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {appointment.reason}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  {appointment.time}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[appointment.status]
                  }`}
                >
                  {appointment.status}
                </span>

                <button
                  onClick={() =>
                    navigate(`/doctor/appointments/${appointment.id}`)
                  }
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}