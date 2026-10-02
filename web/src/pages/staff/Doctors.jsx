import { Search, Stethoscope, UserPlus } from "lucide-react";
import { useState } from "react";

const doctors = [
  {
    id: "D001",
    name: "Dr. Ananya Rao",
    specialty: "Cardiology",
    email: "ananya.rao@clinic.com",
    phone: "9876543210",
    status: "Available",
  },
  {
    id: "D002",
    name: "Dr. Rahul Verma",
    specialty: "General Medicine",
    email: "rahul.verma@clinic.com",
    phone: "9988776655",
    status: "Available",
  },
  {
    id: "D003",
    name: "Dr. Priya Sharma",
    specialty: "Dermatology",
    email: "priya.sharma@clinic.com",
    phone: "9123456780",
    status: "Unavailable",
  },
  {
    id: "D004",
    name: "Dr. Kiran Reddy",
    specialty: "Orthopedics",
    email: "kiran.reddy@clinic.com",
    phone: "9000012345",
    status: "Available",
  },
];

export default function Doctors() {
  const [search, setSearch] = useState("");

  const filteredDoctors = doctors.filter((doctor) => {
    const value = search.toLowerCase();

    return (
      doctor.name.toLowerCase().includes(value) ||
      doctor.specialty.toLowerCase().includes(value) ||
      doctor.email.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Doctors</h2>
          <p className="text-sm text-muted-foreground">
            Manage clinic doctors and specialties.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <UserPlus className="size-4" />
          Add Doctor
        </button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search doctors..."
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Stethoscope className="size-4" />
            {filteredDoctors.length} doctors
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Doctor</th>
                <th className="px-4 py-3 font-medium">Specialty</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doctor.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">{doctor.specialty}</td>

                  <td className="px-4 py-4">{doctor.email}</td>

                  <td className="px-4 py-4">{doctor.phone}</td>

                  <td className="px-4 py-4">
                    <span
                      className={
                        doctor.status === "Available"
                          ? "rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                          : "rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                      }
                    >
                      {doctor.status}
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

          {filteredDoctors.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No doctors found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
