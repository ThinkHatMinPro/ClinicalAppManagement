import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

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

const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60000).toISOString().split("T")[0];
};

const getAppointmentDate = (startTime) => {
  if (!startTime) return "";

  const date = new Date(startTime);
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000).toISOString().split("T")[0];
};

const formatTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MyAppointments() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/doctor/appointments");

        setAppointments(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(
      (appointment) =>
        getAppointmentDate(appointment.startTime) === selectedDate,
    );
  }, [appointments, selectedDate]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">View your appointments by date.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <label
          htmlFor="appointment-date"
          className="block text-base font-medium text-foreground"
        >
          Select Date
        </label>

        <div className="mt-1">
          <input
            id="appointment-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Appointments
          </h2>

          {!loading && !error && (
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""} found.
            </p>
          )}
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">
              No appointments found for this date.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    Patient
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    Reason
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    Time
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {appointment.patient?.name || "Patient"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {appointment.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {appointment.reason || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatTime(appointment.startTime)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[appointment.status] ||
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {statusLabels[appointment.status] || appointment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/doctor/appointments/${appointment.id}`)
                        }
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
