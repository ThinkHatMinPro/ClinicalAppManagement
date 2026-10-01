import { useState } from "react";

export default function MyProfile() {
  const [formData, setFormData] = useState({
    fullName: "Shravya",
    dateOfBirth: "1995-03-12",
    gender: "Female",
    phone: "9876543210",
    email: "shravya@example.com",
    address: "123 Main Street, Hyderabad, TS",
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

    console.log("Updated profile:", formData);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and update your personal information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>

            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Gender
            </label>

            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Phone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="address"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Address
          </label>

          <textarea
            id="address"
            name="address"
            rows={4}
            value={formData.address}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}