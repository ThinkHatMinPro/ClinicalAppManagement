import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const appointmentData = [
  {
    id: "A001",
    patient: "Rahul Kumar",
    reason: "General Consultation",
    date: "2026-09-30",
    time: "09:30 AM",
    status: "Completed",
  },
  {
    id: "A002",
    patient: "Priya Sharma",
    reason: "Follow-up",
    date: "2026-09-30",
    time: "10:30 AM",
    status: "Scheduled",
  },
  {
    id: "A003",
    patient: "Arjun Reddy",
    reason: "Fever & Cold",
    date: "2026-09-30",
    time: "12:00 PM",
    status: "Scheduled",
  },
  {
    id: "A004",
    patient: "Sneha Rao",
    reason: "Regular Checkup",
    date: "2026-09-30",
    time: "02:30 PM",
    status: "In Progress",
  },
  {
    id: "A005",
    patient: "Vikram Singh",
    reason: "Blood Pressure",
    date: "2026-10-01",
    time: "10:00 AM",
    status: "Scheduled",
  },
];

const statusStyles = {
  Scheduled: "bg-success/15 text-success",
  "In Progress": "bg-info/15 text-info",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-destructive/15 text-destructive",
};

export default function MyAppointments() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("2026-09-30");

  const filteredAppointments = useMemo(() => {
    return appointmentData.filter(
      (appointment) => appointment.date === selectedDate
    );
  }, [selectedDate]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          My Appointments
        </h1>

        <p className="mt-2 text-muted-foreground">
          View your appointments by date.
        </p>
      </div>

      {/* Date selector */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <label
          htmlFor="appointment-date"
          className="block text-base font-medium text-foreground"
        >
          Select Date
        </label>

        <div className="mt-4">
          <input
            id="appointment-date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full max-w-xs rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Appointments */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Appointments
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""} found.
          </p>
        </div>

        {filteredAppointments.length === 0 ? (
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
                        {appointment.patient}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {appointment.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {appointment.reason}
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      {appointment.time}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[appointment.status]
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/doctor/appointments/${appointment.id}`
                          )
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