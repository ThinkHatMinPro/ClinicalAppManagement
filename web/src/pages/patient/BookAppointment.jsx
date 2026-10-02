import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function BookAppointment() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const doctorsQuery = useQuery({
    queryKey: ["patient-doctors"],
    queryFn: async () => {
      const response = await api.get("/api/patient/doctors");

      return (
        response?.data?.doctors ||
        response?.data ||
        response?.doctors ||
        []
      );
    },
  });

  const slotsQuery = useQuery({
    queryKey: ["doctor-slots", doctorId, date],
    queryFn: async () => {
      const response = await api.get(
        `/api/patient/doctors/${doctorId}/available-slots?date=${date}`,
      );

      return (
        response?.data?.slots ||
        response?.data ||
        response?.slots ||
        []
      );
    },
    enabled: Boolean(doctorId && date),
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      return api.post("/api/patient/appointments", {
        doctorId,
        startTime: `${date}T${startTime}`,
        endTime: `${date}T${endTime}`,
        reason: reason.trim() || null,
      });
    },
    onSuccess: () => {
      setSuccess("Appointment booked successfully.");
      setError("");

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1000);
    },
    onError: (err) => {
      setError(err.message || "Failed to book appointment");
      setSuccess("");
    },
  });

  const doctors = Array.isArray(doctorsQuery.data)
    ? doctorsQuery.data
    : [];

  const slots = Array.isArray(slotsQuery.data)
    ? slotsQuery.data
    : [];

  const handleDoctorChange = (event) => {
    setDoctorId(event.target.value);
    setStartTime("");
    setEndTime("");
    setError("");
    setSuccess("");
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
    setStartTime("");
    setEndTime("");
    setError("");
    setSuccess("");
  };

  const handleSlotChange = (event) => {
    const selectedStartTime = event.target.value;

    const selectedSlot = slots.find(
      (slot) =>
        (slot.startTime || slot.start) === selectedStartTime,
    );

    setStartTime(selectedStartTime);
    setEndTime(
      selectedSlot?.endTime ||
        selectedSlot?.end ||
        "",
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!doctorId) {
      setError("Please select a doctor.");
      return;
    }

    if (!date) {
      setError("Please select an appointment date.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Please select an available time.");
      return;
    }

    bookingMutation.mutate();
  };

  const formatTime = (value) => {
    if (!value) {
      return "";
    }

    const [hours, minutes] = value.split(":");
    const hour = Number(hours);

    if (Number.isNaN(hour)) {
      return value;
    }

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Book Appointment
        </h1>

        <p className="mt-2 text-muted-foreground">
          Select a doctor, date and available time.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-background p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Doctor
          </label>

          <select
            value={doctorId}
            onChange={handleDoctorChange}
            disabled={doctorsQuery.isLoading}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              {doctorsQuery.isLoading
                ? "Loading doctors..."
                : "Select a doctor"}
            </option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {doctor.specialty}
              </option>
            ))}
          </select>

          {doctorsQuery.isError && (
            <p className="mt-2 text-sm text-red-600">
              {doctorsQuery.error?.message ||
                "Failed to load doctors"}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Appointment Date
          </label>

          <input
            type="date"
            value={date}
            min={today}
            onChange={handleDateChange}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {doctorId && date && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Available Time
            </label>

            {slotsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading available slots...
              </p>
            ) : slotsQuery.isError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {slotsQuery.error?.message ||
                  "Failed to load available slots"}
              </p>
            ) : slots.length === 0 ? (
              <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                No available slots for this date.
              </div>
            ) : (
              <select
                value={startTime}
                onChange={handleSlotChange}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  Select a time
                </option>

                {slots.map((slot, index) => {
                  const start =
                    slot.startTime || slot.start;

                  const end =
                    slot.endTime || slot.end;

                  return (
                    <option
                      key={`${start}-${end}-${index}`}
                      value={start}
                    >
                      {formatTime(start)} -{" "}
                      {formatTime(end)}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Reason for Visit
          </label>

          <textarea
            value={reason}
            onChange={(event) =>
              setReason(event.target.value)
            }
            placeholder="Describe your reason for the appointment"
            rows={4}
            className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={
            bookingMutation.isPending ||
            doctorsQuery.isLoading
          }
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bookingMutation.isPending
            ? "Booking..."
            : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}