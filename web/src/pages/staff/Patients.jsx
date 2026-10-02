import { Search, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
const navigate = useNavigate();
    const fetchPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await api.get(
                `/staff/patients?search=${encodeURIComponent(search)}`
            );

            setPatients(result.patients || []);
        } catch (error) {
            setError(error.message || "Failed to fetch patients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPatients();
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Patients
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage registered clinic patients.
                    </p>
                </div>

                <button
    type="button"
    onClick={() => navigate("/patients/new")}
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
                        {patients.length} patients
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        Loading patients...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-sm text-destructive">
                        {error}
                    </div>
                ) : patients.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                        No patients found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Patient ID
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Gender
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {patients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="border-b transition-colors last:border-0 hover:bg-muted/40"
                                    >
                                        <td className="px-4 py-4 text-muted-foreground">
                                            {patient.id}
                                        </td>

                                        <td className="px-4 py-4 font-medium">
                                            {patient.name}
                                        </td>

                                        <td className="px-4 py-4">
                                            {patient.email || "-"}
                                        </td>

                                        <td className="px-4 py-4">
                                            {patient.phone || "-"}
                                        </td>

                                        <td className="px-4 py-4">
                                            {patient.gender || "-"}
                                        </td>

                                        <td className="px-4 py-4">
                                            <button
    type="button"
    onClick={() => navigate(`/patients/${patient.id}`)}
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