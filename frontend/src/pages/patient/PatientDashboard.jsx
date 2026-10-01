import {
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Upcoming",
      value: 1,
      icon: CalendarDays,
      container: "bg-blue-50",
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Appointments",
      value: 2,
      icon: Clock,
      container: "bg-emerald-50",
      iconStyle: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Cancelled",
      value: 0,
      icon: XCircle,
      container: "bg-red-50",
      iconStyle: "bg-red-100 text-red-500",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, Shravya!
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your appointments and stay healthy.
        </p>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={`rounded-xl border p-5 ${stat.container}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconStyle}`}
              >
                <Icon size={20} />
              </div>

              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Appointment
          </h2>

          <button
            type="button"
            onClick={() => navigate("/patient/appointments")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-50">
              <span className="text-2xl font-bold">30</span>
              <span className="text-xs text-gray-500">Sep 2026</span>
              <span className="mt-1 text-xs text-gray-400">Tue</span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-3">
                  <UserRound className="mt-1 text-gray-500" size={20} />

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Dr. Anil Kumar
                    </h3>

                    <p className="text-sm text-gray-500">
                      General Physician
                    </p>
                  </div>
                </div>

                <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Confirmed
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={17} />
                  <span>10:00 AM - 10:30 AM</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={17} />
                  <span>City Care Clinic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/patient/book-appointment")}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Book New Appointment
        </button>
      </div>
    </div>
  );
}