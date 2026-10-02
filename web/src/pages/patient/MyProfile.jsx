import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/api";

export default function MyProfile() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const profileQuery = useQuery({
    queryKey: ["patient-profile"],
    queryFn: async () => {
      const response = await api.get("/api/patient/profile");

      return (
        response?.data?.patient ||
        response?.data ||
        response?.patient ||
        null
      );
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      return api.put(
        "/api/patient/profile",
        profileData,
      );
    },
    onSuccess: async (response) => {
      const updatedProfile =
        response?.data?.patient ||
        response?.data ||
        response?.patient ||
        null;

      if (updatedProfile) {
        queryClient.setQueryData(
          ["patient-profile"],
          updatedProfile,
        );
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["patient-profile"],
        });
      }

      setMessage("Profile updated successfully.");
      setError("");
    },
    onError: (err) => {
      setError(
        err.message || "Failed to update profile",
      );
      setMessage("");
    },
  });

  if (profileQuery.isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">
          My Profile
        </h1>

        <p className="mt-4 text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">
          My Profile
        </h1>

        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileQuery.error?.message ||
            "Failed to load profile"}
        </div>
      </div>
    );
  }

  const profile = profileQuery.data || {};

  const currentName =
    name !== "" ? name : profile.name || "";

  const currentDateOfBirth =
    dateOfBirth !== ""
      ? dateOfBirth
      : profile.dateOfBirth
        ? profile.dateOfBirth.split("T")[0]
        : "";

  const currentGender =
    gender !== "" ? gender : profile.gender || "";

  const currentPhone =
    phone !== "" ? phone : profile.phone || "";

  const currentEmail =
    email !== "" ? email : profile.email || "";

  const currentAddress =
    address !== "" ? address : profile.address || "";

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentName.trim()) {
      setError("Name is required.");
      return;
    }

    updateProfileMutation.mutate({
      name: currentName.trim(),
      dateOfBirth: currentDateOfBirth
        ? currentDateOfBirth
        : null,
      gender: currentGender || null,
      phone: currentPhone.trim() || null,
      email: currentEmail.trim() || null,
      address: currentAddress.trim() || null,
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          My Profile
        </h1>

        <p className="mt-2 text-muted-foreground">
          View and update your personal information.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-background p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={currentName}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter your full name"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={currentEmail}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Enter your email"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            type="tel"
            value={currentPhone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="Enter your phone number"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>

          <input
            type="date"
            value={currentDateOfBirth}
            onChange={(event) =>
              setDateOfBirth(event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Gender
          </label>

          <select
            value={currentGender}
            onChange={(event) =>
              setGender(event.target.value)
            }
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">
              Select gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Address
          </label>

          <textarea
            value={currentAddress}
            onChange={(event) =>
              setAddress(event.target.value)
            }
            placeholder="Enter your address"
            rows={4}
            className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={
            updateProfileMutation.isPending
          }
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateProfileMutation.isPending
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
}