import { CalendarCheck, CalendarDays, Stethoscope, Users } from "lucide-react";

const stats = [
  {
    label: "Total Patients",
    value: "124",
    icon: Users,
  },
  {
    label: "Total Doctors",
    value: "18",
    icon: Stethoscope,
  },
  {
    label: "Total Appointments",
    value: "286",
    icon: CalendarDays,
  },
  {
    label: "Today's Appointments",
    value: "12",
    icon: CalendarCheck,
  },
];

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

        <p className="text-sm text-muted-foreground">
          Overview of your clinic activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>

                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">Today's Appointments</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Today's scheduled patient appointments.
          </p>

          <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Appointment data will appear here
            </p>
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="font-semibold">Recent Patients</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Recently added patients.
          </p>

          <div className="mt-6 flex min-h-40 items-center justify-center rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Patient data will appear here
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
