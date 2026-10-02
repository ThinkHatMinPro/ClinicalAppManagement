import {
    Search,
    Stethoscope,
    UserPlus,
    Eye,
    Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function Doctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/staff/doctors?search=${encodeURIComponent(search)}`
            );

            console.log("Doctors API response:", response);

            setDoctors(response?.data?.doctors || []);
        } catch (err) {
            console.error("Fetch doctors error:", err);
            setError(err.message || "Failed to load doctors");
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Doctors
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage clinic doctors
                    </p>
                </div>

                <button
                    onClick={() => navigate("/staff/doctors/new")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                >
                    <UserPlus className="size-4" />
                    Add Doctor
                </button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search doctors..."
                    className="w-full rounded-lg border bg-background py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="size-6 animate-spin" />
                </div>
            ) : doctors.length === 0 ? (
                <div className="rounded-xl border bg-card py-16 text-center">
                    <Stethoscope className="mx-auto mb-4 size-10 text-muted-foreground" />

                    <h2 className="text-lg font-semibold">
                        No doctors found
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a doctor to see them here.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Doctor
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Specialty
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Email
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-medium">
                                        Phone
                                    </th>

                                    <th className="px-5 py-3 text-right text-sm font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {doctors.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="hover:bg-muted/30"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                                                    <Stethoscope className="size-4 text-primary" />
                                                </div>

                                                <div>
                                                    <p className="font-medium">
                                                        {doctor.name}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {doctor.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {doctor.specialty || "-"}
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {doctor.email || "-"}
                                        </td>

                                        <td className="px-5 py-4 text-sm">
                                            {doctor.phone || "-"}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/staff/doctors/${doctor.id}`
                                                    )
                                                }
                                                className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                                            >
                                                <Eye className="size-4" />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}