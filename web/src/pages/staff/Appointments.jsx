import { CalendarDays, Search } from "lucide-react";
import { useState } from "react";

const appointments = [
  {
    id: "A001",
    patient: "Ananya Reddy",
    doctor: "Dr. Rahul Verma",
    date: "02 Oct 2026",
    time: "09:30 AM",
    reason: "General Checkup",
    status: "SCHEDULED",
  },
  {
    id: "A002",
    patient: "Rahul Sharma",
    doctor: "Dr. Ananya Rao",
    date: "02 Oct 2026",
    time: "10:30 AM",
    reason: "Chest Pain",
    status: "IN_PROGRESS",
  },
  {
    id: "A003",
    patient: "Priya Rao",
    doctor: "Dr. Priya Sharma",
    date: "01 Oct 2026",
    time: "02:00 PM",
    reason: "Skin Consultation",
    status: "COMPLETED",
  },
  {
    id: "A004",
    patient: "Arjun Kumar",
    doctor: "Dr. Kiran Reddy",
    date: "03 Oct 2026",
    time: "11:00 AM",
    reason: "Knee Pain",
    status: "CANCELLED",
  },
];

const statusClasses = {
  SCHEDULED: "bg-info/10 text-info",
  IN_PROGRESS: "bg-warning/10 text-warning",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
};

export default function Appointments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredAppointments = appointments.filter((appointment) => {
    const value = search.toLowerCase();

    const matchesSearch =
      appointment.patient.toLowerCase().includes(value) ||
      appointment.doctor.toLowerCase().includes(value) ||
      appointment.reason.toLowerCase().includes(value);

    const matchesStatus = status === "ALL" || appointment.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>

        <p className="text-sm text-muted-foreground">
          View and manage clinic appointments.
        </p>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search appointments..."
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
              <CalendarDays className="size-4" />
              {filteredAppointments.length}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Doctor</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-4 text-muted-foreground">
                    {appointment.id}
                  </td>

                  <td className="px-4 py-4 font-medium">
                    {appointment.patient}
                  </td>

                  <td className="px-4 py-4">{appointment.doctor}</td>

                  <td className="px-4 py-4">{appointment.date}</td>

                  <td className="px-4 py-4">{appointment.time}</td>

                  <td className="px-4 py-4">{appointment.reason}</td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusClasses[appointment.status]
                      }`}
                    >
                      {appointment.status.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAppointments.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
