import { Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";

const patients = [
  {
    id: "P001",
    name: "Ananya Reddy",
    email: "ananya@example.com",
    phone: "9876543210",
    gender: "Female",
    age: 28,
  },
  {
    id: "P002",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876501234",
    gender: "Male",
    age: 34,
  },
  {
    id: "P003",
    name: "Priya Rao",
    email: "priya@example.com",
    phone: "9123456780",
    gender: "Female",
    age: 25,
  },
  {
    id: "P004",
    name: "Arjun Kumar",
    email: "arjun@example.com",
    phone: "9988776655",
    gender: "Male",
    age: 42,
  },
];

export default function Patients() {
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((patient) => {
    const value = search.toLowerCase();

    return (
      patient.name.toLowerCase().includes(value) ||
      patient.email.toLowerCase().includes(value) ||
      patient.phone.includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
          <p className="text-sm text-muted-foreground">
            Manage registered clinic patients.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <UserPlus className="size-4" />
          Add Patient
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
              placeholder="Search patients..."
              className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            {filteredPatients.length} patients
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Patient ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Gender</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/40"
                >
                  <td className="px-4 py-4 text-muted-foreground">
                    {patient.id}
                  </td>

                  <td className="px-4 py-4 font-medium">{patient.name}</td>

                  <td className="px-4 py-4">{patient.email}</td>

                  <td className="px-4 py-4">{patient.phone}</td>

                  <td className="px-4 py-4">{patient.gender}</td>

                  <td className="px-4 py-4">{patient.age}</td>

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

          {filteredPatients.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No patients found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
