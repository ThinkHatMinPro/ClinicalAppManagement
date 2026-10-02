import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function PatientForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await api.post("/staff/patients", {
                name: form.name,
                dateOfBirth: form.dateOfBirth || null,
                gender: form.gender || null,
                phone: form.phone || null,
                email: form.email || null,
                address: form.address || null,
            });

            navigate("/patients");
        } catch (error) {
            setError(error.message || "Failed to create patient");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Add Patient
                </h2>
                <p className="text-sm text-muted-foreground">
                    Register a new patient in the clinic.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
            >
                {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Full Name
                        </label>

                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Enter patient name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Date of Birth
                        </label>

                        <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Gender
                        </label>

                        <select
                            name="gender"
                            value={form.gender}
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
                        <label className="text-sm font-medium">
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Enter email address"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            rows={4}
                            className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Enter patient address"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/patients")}
                        className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create Patient"}
                    </button>
                </div>
            </form>
        </div>
    );
}