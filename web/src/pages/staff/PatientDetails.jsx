import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await api.get(`/staff/patients/${id}`);

        setPatient(result.data);
      } catch (error) {
        setError(error.message || "Failed to fetch patient");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading patient...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/staff/patients")}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Patients
        </button>

        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Patient not found.
      </div>
    );
  }

  const appointments = patient.appointments || [];

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${patient.name}? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      setActionError("");

      await api.delete(`/staff/patients/${patient.id}`);

      navigate("/staff/patients", { replace: true });
    } catch (err) {
      setActionError(err.message || "Failed to delete patient");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/staff/patients")}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to Patients
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patient Details</h2>

          <p className="text-sm text-muted-foreground">
            Patient profile and appointment history.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/staff/patients/${patient.id}/edit`)}
            className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 rounded-lg bg-destructive px-4 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-semibold">Personal Information</h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Patient ID</p>
            <p className="mt-1 font-medium">{patient.id}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="mt-1 font-medium">{patient.name || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date of Birth</p>
            <p className="mt-1">{formatDate(patient.dateOfBirth)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Gender</p>
            <p className="mt-1">{patient.gender || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="mt-1">{patient.phone || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1">{patient.email || "-"}</p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="mt-1">{patient.address || "-"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h3 className="font-semibold">Recent Appointments</h3>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Doctor</th>
                  <th className="px-5 py-3 font-medium">Specialty</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b last:border-0">
                    <td className="px-5 py-4">
                      {appointment.doctor?.name || "-"}
                    </td>

                    <td className="px-5 py-4">
                      {appointment.doctor?.specialty || "-"}
                    </td>

                    <td className="px-5 py-4">
                      {formatDate(appointment.startTime)}
                    </td>

                    <td className="px-5 py-4">{appointment.status || "-"}</td>
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
