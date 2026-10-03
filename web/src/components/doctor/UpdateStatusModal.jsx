import { useState } from "react";
import api from "../../lib/api";

const statuses = [
  {
    label: "Scheduled",
    value: "SCHEDULED",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Cancelled",
    value: "CANCELLED",
  },
];

export default function UpdateStatusModal({
  appointment,
  onClose,
  onUpdate,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    appointment.status
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.patch(
        `/doctor/appointments/${appointment.id}/status`,
        {
          status: selectedStatus,
        }
      );

      onUpdate(response.data);
    } catch (err) {
      setError(
        err.message || "Failed to update appointment status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Update Status
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update the appointment status.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md px-2 py-1 text-xl text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 p-6">
          {statuses.map((status) => (
            <label
              key={status.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition hover:bg-muted"
            >
              <input
                type="radio"
                name="appointment-status"
                value={status.value}
                checked={selectedStatus === status.value}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
                disabled={loading}
                className="h-4 w-4 accent-[var(--primary)]"
              />

              <span className="text-sm font-medium text-foreground">
                {status.label}
              </span>
            </label>
          ))}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-border p-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={
              loading ||
              selectedStatus === appointment.status
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}