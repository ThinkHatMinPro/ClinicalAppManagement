import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

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

const formatTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashboardResponse, appointmentsResponse] = await Promise.all([
          api.get("/doctor/dashboard"),
          api.get("/doctor/appointments"),
        ]);

        setDashboard(dashboardResponse.data);
        setAppointments(appointmentsResponse.data || []);
      } catch (err) {
        setError(err.message || "Failed to load doctor dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();

    return appointments.filter((appointment) => {
      if (!appointment.startTime) return false;

      return new Date(appointment.startTime).toDateString() === today;
    });
  }, [appointments]);

  const totalPatients = useMemo(() => {
    const patientIds = new Set(
      appointments.map((appointment) => appointment.patientId).filter(Boolean),
    );

    return patientIds.size;
  }, [appointments]);

  const statistics = dashboard?.statistics || {};

  const stats = [
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      description: "Appointments scheduled today",
    },
    {
      title: "Completed",
      value: statistics.completed || 0,
      description: "Appointments completed",
    },
    {
      title: "Upcoming",
      value: statistics.scheduled || 0,
      description: "Upcoming appointments",
    },
    {
      title: "Total Patients",
      value: totalPatients,
      description: "Patients under your care",
    },
  ];

  const nextAppointment = dashboard?.nextAppointment;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
        Loading doctor dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back
          {dashboard?.doctor?.name
            ? `, ${dashboard.doctor.name}`
            : ", Doctor"}
          . Here's your appointment overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Next Appointment
        </p>

        {nextAppointment ? (
          <>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {nextAppointment.patient?.name || "Patient"}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {nextAppointment.reason || "Consultation"}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-lg font-semibold text-primary">
                  {formatTime(nextAppointment.startTime)}
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(nextAppointment.startTime).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() =>
                  navigate(`/doctor/appointments/${nextAppointment.id}`)
                }
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                View Appointment
              </button>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No upcoming appointments.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">Today's Appointments</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your appointments scheduled for today.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/doctor/appointments")}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No appointments scheduled for today.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {appointment.patient?.name || "Patient"}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {appointment.reason || "Consultation"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {formatTime(appointment.startTime)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[appointment.status] ||
                      "bg-muted text-muted-foreground"
                    }`}
                  >
                    {statusLabels[appointment.status] || appointment.status}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/doctor/appointments/${appointment.id}`)
                    }
                    className="font-medium text-primary hover:underline"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
