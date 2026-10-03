import { useEffect, useState } from "react";
import api from "@/lib/api";

const PatientDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/patient/dashboard");

        setDashboard(response.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your appointments and profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {dashboard?.statistics?.upcoming ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Completed Appointments
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {dashboard?.statistics?.completed ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Cancelled Appointments
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {dashboard?.statistics?.cancelled ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Next Appointment</h2>

        {dashboard?.nextAppointment ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm">
              <span className="font-medium">Doctor:</span>{" "}
              {dashboard.nextAppointment.doctor?.name}
            </p>

            <p className="text-sm">
              <span className="font-medium">Specialty:</span>{" "}
              {dashboard.nextAppointment.doctor?.specialty}
            </p>

            <p className="text-sm">
              <span className="font-medium">Start:</span>{" "}
              {new Date(dashboard.nextAppointment.startTime).toLocaleString()}
            </p>

            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {dashboard.nextAppointment.status}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No upcoming appointments.
          </p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
