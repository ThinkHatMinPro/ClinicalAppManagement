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
      <div className="flex items-center justify-center min-h-[400px]">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Patient Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your appointments and profile.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Upcoming Appointments
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {dashboard?.upcomingAppointments ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Completed Appointments
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {dashboard?.completedAppointments ?? 0}
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Cancelled Appointments
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {dashboard?.cancelledAppointments ?? 0}
          </p>
        </div>
      </div>

      <div className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Next Appointment</h2>

        {dashboard?.nextAppointment ? (
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-medium">Doctor:</span>{" "}
              {dashboard.nextAppointment.doctor?.name}
            </p>

            <p>
              <span className="font-medium">Specialty:</span>{" "}
              {dashboard.nextAppointment.doctor?.specialty}
            </p>

            <p>
              <span className="font-medium">Start:</span>{" "}
              {new Date(
                dashboard.nextAppointment.startTime
              ).toLocaleString()}
            </p>

            <p>
              <span className="font-medium">Status:</span>{" "}
              {dashboard.nextAppointment.status}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            No upcoming appointments.
          </p>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;