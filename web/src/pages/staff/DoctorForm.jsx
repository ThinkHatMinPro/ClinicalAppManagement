import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

export default function DoctorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const fetchDoctor = async () => {
      try {
        const result = await api.get(`/staff/doctors/${id}`);
        const doctor = result.data;

        setForm({
          name: doctor.name || "",
          specialty: doctor.specialty || "",
          email: doctor.email || "",
          phone: doctor.phone || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load doctor");
      } finally {
        setFetching(false);
      }
    };

    fetchDoctor();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Doctor name is required");
      return;
    }

    if (!form.specialty.trim()) {
      setError("Specialty is required");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      specialty: form.specialty.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/staff/doctors/${id}`, payload);
      } else {
        await api.post("/staff/doctors", payload);
      }

      navigate("/staff/doctors", {
        replace: true,
        state: {
          refresh: true,
        },
      });
    } catch (err) {
      setError(
        err.message ||
          (isEdit ? "Failed to update doctor" : "Failed to create doctor"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading doctor...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/staff/doctors")}
          className="rounded-md border p-2 hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div>
          <h1 className="text-2xl font-semibold">Add Doctor</h1>
          <p className="text-sm text-muted-foreground">
            Create a new doctor profile
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-6 shadow-sm"
      >
        {error && (
          <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Doctor Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter doctor name"
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Specialty</label>

            <input
              name="specialty"
              value={form.specialty}
              onChange={handleChange}
              placeholder="e.g. Cardiology"
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full rounded-lg border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/staff/doctors")}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}

            {loading ? "Creating..." : "Create Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}
