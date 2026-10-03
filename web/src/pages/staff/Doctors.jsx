import {
    Search,
    Stethoscope,
    UserPlus,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import api from "@/lib/api";

export default function Doctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                const result = await api.get(
                    `/staff/doctors?search=${encodeURIComponent(search)}`
                );

                console.log(
                    "Doctors API response:",
                    result
                );

                if (cancelled) return;

                setDoctors(
                    result.data?.doctors || []
                );

                setError("");
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Failed to fetch doctors:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to fetch doctors"
                );

                setDoctors([]);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search]);

    return (
        <div className="space-y-6">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Doctors
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage registered clinic doctors.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/staff/doctors/new")
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
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
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search doctors..."
                            className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />

                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <Stethoscope className="size-4" />

                        {doctors.length} doctors

                    </div>

                </div>

                {loading ? (

                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Loading doctors...
                    </div>

                ) : error ? (

                    <div className="p-8 text-center text-sm text-destructive">
                        {error}
                    </div>

                ) : doctors.length === 0 ? (

                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No doctors found.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Doctor ID
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Name
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Specialty
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Email
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Phone
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {doctors.map((doctor) => (

                                    <tr
                                        key={doctor.id}
                                        className="border-b transition-colors last:border-0 hover:bg-muted/40"
                                    >

                                        <td className="px-4 py-4 text-muted-foreground">
                                            {doctor.id}
                                        </td>

                                        <td className="px-4 py-4 font-medium">
                                            {doctor.name}
                                        </td>

                                        <td className="px-4 py-4">
                                            {doctor.specialty || "-"}
                                        </td>

                                        <td className="px-4 py-4">
                                            {doctor.email || "-"}
                                        </td>

                                        <td className="px-4 py-4">
                                            {doctor.phone || "-"}
                                        </td>

                                        <td className="px-4 py-4">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/staff/doctors/${doctor.id}`
                                                    )
                                                }
                                                className="font-medium text-primary hover:underline"
                                            >
                                                View
                                            </button>

                                        </td>

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