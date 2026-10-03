import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "@/lib/api";

const initialForm = {
  name: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
};

export default function PatientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const fetchPatient = async () => {
      try {
        const result = await api.get(`/staff/patients/${id}`);
        const patient = result.data;

        setFormData({
          name: patient.name || "",
          dateOfBirth: patient.dateOfBirth
            ? patient.dateOfBirth.slice(0, 10)
            : "",
          gender: patient.gender || "",
          phone: patient.phone || "",
          email: patient.email || "",
          address: patient.address || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load patient");
      } finally {
        setFetching(false);
      }
    };

    fetchPatient();
  }, [id, isEdit]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Patient name is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      phone: formData.phone.trim() || null,
      email: formData.email.trim() || null,
      address: formData.address.trim() || null,
    };

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/staff/patients/${id}`, payload);
        setSuccess("Patient updated successfully");
      } else {
        await api.post("/staff/patients", payload);
        setSuccess("Patient created successfully");
      }

      setTimeout(() => {
        navigate("/staff/patients", { replace: true });
      }, 500);
    } catch (err) {
      setError(
        err.message ||
          (isEdit ? "Failed to update patient" : "Failed to create patient"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading patient...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/staff/patients")}
          className="inline-flex size-10 items-center justify-center rounded-lg border bg-background hover:bg-muted"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Patient</h2>

          <p className="text-sm text-muted-foreground">
            Register a new patient in the clinic.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="name" className="text-sm font-medium">
                Patient Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium">
                Date of Birth
              </label>

              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter patient address"
                rows={4}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={() => navigate("/staff/patients")}
              disabled={loading}
              className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}

              {loading ? "Creating..." : "Create Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
