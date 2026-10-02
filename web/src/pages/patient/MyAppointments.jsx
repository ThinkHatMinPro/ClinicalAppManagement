import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export default function MyAppointments() {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: async () => {
      const response = await api.get("/patient/appointments");

      return (
        response?.data?.appointments ||
        response?.data ||
        response?.appointments ||
        []
      );
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (appointmentId) => {
      return api.patch(
        `/api/patient/appointments/${appointmentId}/cancel`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-dashboard"],
      });
    },
  });

  const appointments = Array.isArray(
    appointmentsQuery.data,
  )
    ? appointmentsQuery.data
    : [];

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDoctorName = (appointment) => {
    return (
      appointment.doctor?.name ||
      appointment.doctorName ||
      "Doctor"
    );
  };

  const getSpecialty = (appointment) => {
    return (
      appointment.doctor?.specialty ||
      appointment.specialty ||
      "General"
    );
  };

  const handleCancel = (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    cancelMutation.mutate(appointmentId);
  };

  if (appointmentsQuery.isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">
          My Appointments
        </h1>

        <p className="mt-4 text-muted-foreground">
          Loading appointments...
        </p>
      </div>
    );
  }

  if (appointmentsQuery.isError) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">
          My Appointments
        </h1>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {appointmentsQuery.error?.message ||
            "Failed to load appointments"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          My Appointments
        </h1>

        <p className="mt-2 text-muted-foreground">
          View and manage your appointments.
        </p>
      </div>

      {cancelMutation.isError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {cancelMutation.error?.message ||
            "Failed to cancel appointment"}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <h2 className="text-lg font-medium">
            No appointments
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any appointments yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const status =
              appointment.status || "SCHEDULED";

            const canCancel =
              status === "SCHEDULED" ||
              status === "IN_PROGRESS";

            return (
              <div
                key={appointment.id}
                className="rounded-xl border bg-background p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {getDoctorName(appointment)}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {getSpecialty(appointment)}
                    </p>

                    <div className="mt-4 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">
                          Date:
                        </span>{" "}
                        {formatDate(
                          appointment.startTime,
                        )}
                      </p>

                      <p>
                        <span className="font-medium">
                          Time:
                        </span>{" "}
                        {formatTime(
                          appointment.startTime,
                        )}{" "}
                        -{" "}
                        {formatTime(
                          appointment.endTime,
                        )}
                      </p>

                      {appointment.reason && (
                        <p>
                          <span className="font-medium">
                            Reason:
                          </span>{" "}
                          {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        status === "SCHEDULED"
                          ? "bg-blue-100 text-blue-700"
                          : status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status.replace("_", " ")}
                    </span>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCancel(
                            appointment.id,
                          )
                        }
                        disabled={
                          cancelMutation.isPending
                        }
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancelMutation.isPending
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}