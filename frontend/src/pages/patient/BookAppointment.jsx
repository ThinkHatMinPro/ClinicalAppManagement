import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Appointment:", formData);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Book Appointment
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Choose a doctor, date and time for your visit.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="doctor"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select Doctor <span className="text-red-500">*</span>
          </label>

          <select
            id="doctor"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select a doctor</option>
            <option value="anil">
              Dr. Anil Kumar (General Physician)
            </option>
            <option value="priya">
              Dr. Priya Sharma (Dermatologist)
            </option>
            <option value="michael">
              Dr. Michael Brown (Cardiologist)
            </option>
          </select>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Date <span className="text-red-500">*</span>
            </label>

            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Time <span className="text-red-500">*</span>
            </label>

            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select time</option>
              <option value="09:00">09:00 AM - 09:30 AM</option>
              <option value="10:00">10:00 AM - 10:30 AM</option>
              <option value="11:00">11:00 AM - 11:30 AM</option>
              <option value="14:00">02:00 PM - 02:30 PM</option>
              <option value="15:00">03:00 PM - 03:30 PM</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="reason"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Reason for Visit
          </label>

          <textarea
            id="reason"
            name="reason"
            rows={5}
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter reason for your visit"
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/patient/dashboard")}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
}