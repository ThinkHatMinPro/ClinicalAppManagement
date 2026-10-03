import { useState } from "react";

const statuses = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function UpdateStatusModal({
  appointment,
  onClose,
  onUpdate,
}) {
  const [selectedStatus, setSelectedStatus] = useState(
    appointment.status
  );

  const handleUpdate = () => {
    onUpdate({
      ...appointment,
      status: selectedStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
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
            className="rounded-md px-2 py-1 text-xl text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 p-6">
          {statuses.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 transition hover:bg-muted"
            >
              <input
                type="radio"
                name="appointment-status"
                value={status}
                checked={selectedStatus === status}
                onChange={(event) =>
                  setSelectedStatus(event.target.value)
                }
                className="h-4 w-4 accent-[var(--primary)]"
              />

              <span className="text-sm font-medium text-foreground">
                {status}
              </span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}