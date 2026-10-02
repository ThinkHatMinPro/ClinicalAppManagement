import { useState } from "react";
import { Clock, UserRound } from "lucide-react";

const appointments = [
  {
    id: 1,
    day: "30",
    month: "Sep 2026",
    weekday: "Tue",
    doctor: "Dr. Anil Kumar",
    specialization: "General Physician",
    time: "10:00 AM - 10:30 AM",
    status: "Confirmed",
    type: "upcoming",
  },
  {
    id: 2,
    day: "15",
    month: "Sep 2026",
    weekday: "Tue",
    doctor: "Dr. Priya Sharma",
    specialization: "Dermatologist",
    time: "11:00 AM - 11:30 AM",
    status: "Completed",
    type: "past",
  },
];

export default function MyAppointments() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.type === activeTab
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Appointments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your upcoming and past appointments.
        </p>
      </div>

      <div className="mt-7 border-b">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`border-b-2 px-2 pb-3 text-sm font-medium ${
              activeTab === "upcoming"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Upcoming (1)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`border-b-2 px-2 pb-3 text-sm font-medium ${
              activeTab === "past"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            Past (1)
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-xl border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50">
                <span className="text-2xl font-bold text-gray-900">
                  {appointment.day}
                </span>

                <span className="text-xs font-medium text-gray-500">
                  {appointment.month}
                </span>

                <span className="mt-1 text-xs text-gray-400">
                  {appointment.weekday}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <UserRound
                    size={20}
                    className="mt-1 text-gray-500"
                  />

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {appointment.doctor}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {appointment.specialization}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={17} />
                  {appointment.time}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <span
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    appointment.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {appointment.status}
                </span>

                <button
                  type="button"
                  className="rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              No appointments found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}