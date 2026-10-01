import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Stethoscope,
  UserPlus,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import HeartbeatLine from "@/components/HeartbeatLine";
import { SwitchMode } from "@/components/theme/switch-mode";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Enter a valid email address"),

    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),

    dateOfBirth: z.string().min(1, "Date of birth is required"),

    gender: z.string().min(1, "Gender is required"),

    address: z
      .string()
      .min(1, "Address is required")
      .min(5, "Please enter a valid address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notice, setNotice] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    setNotice("");
    setServerError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      password: formData.password,

      // Public registration creates patients only.
      role: "PATIENT",
    };

    try {
      /*
       * Replace this section with your real API request
       * when signup is connected.
       */

      console.log("Signup payload:", payload);

      setNotice(
        "Registration form is ready. Connect POST /api/auth/signup to create the account.",
      );

      /*
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create account",
        );
      }

      navigate("/login", {
        state: {
          message:
            "Account created successfully. Please sign in.",
        },
      });
      */
    } catch (error) {
      setServerError(
        error.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="relative grid min-h-dvh lg:grid-cols-2">
      {/* Theme switch */}
      <div className="absolute right-4 top-4 z-50 lg:right-6 lg:top-6">
        <SwitchMode
          width={72}
          height={36}
          darkColor="var(--background)"
          lightColor="var(--secondary)"
          knobDarkColor="var(--primary)"
          knobLightColor="var(--card)"
          borderDarkColor="var(--primary)"
          borderLightColor="var(--border)"
        />
      </div>

      {/* Desktop brand panel */}
      <aside className="hidden flex-col justify-between gap-10 bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Stethoscope className="size-6" aria-hidden="true" />
          Clinic Appointment Manager
        </div>

        <div className="space-y-6">
          <HeartbeatLine className="h-16 w-full max-w-sm" />

          <p className="text-3xl font-semibold leading-tight">
            Your healthcare journey starts here.
          </p>

          <p className="max-w-md text-primary-foreground/80">
            Create your patient account to manage appointments, access your
            schedule, and stay connected with your clinic.
          </p>

          <div className="space-y-4 pt-2">
            <Feature
              icon={<CalendarDays className="size-5" />}
              title="Manage appointments"
              description="Book and keep track of your clinic visits."
            />

            <Feature
              icon={<ShieldCheck className="size-5" />}
              title="Secure access"
              description="Your account is protected with secure authentication."
            />

            <Feature
              icon={<UserPlus className="size-5" />}
              title="Simple registration"
              description="Create your patient profile in just a few steps."
            />
          </div>
        </div>

        <p className="text-sm text-primary-foreground/80">
          Secure patient registration.
        </p>
      </aside>

      {/* Signup section */}
      <main className="flex flex-col items-center justify-center bg-background p-6 py-12">
        {/* Mobile brand */}
        <div className="mb-8 flex w-full max-w-lg items-center gap-2 text-lg font-semibold text-foreground lg:hidden">
          <Stethoscope className="size-6 text-primary" aria-hidden="true" />
          Clinic Appointment Manager
        </div>

        <Card className="w-full max-w-lg border-border bg-card shadow-lg shadow-primary/5">
          <CardHeader>
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              Create your account
            </h1>

            <CardDescription>
              Register as a patient to manage your appointments.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Full name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>

                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                />

                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email + phone */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />

                  {errors.email && (
                    <p
                      id="email-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>

                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    {...register("phone")}
                  />

                  {errors.phone && (
                    <p
                      id="phone-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* DOB + Gender */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of birth</Label>

                  <Input
                    id="dateOfBirth"
                    type="date"
                    aria-invalid={!!errors.dateOfBirth}
                    aria-describedby={
                      errors.dateOfBirth ? "dob-error" : undefined
                    }
                    {...register("dateOfBirth")}
                  />

                  {errors.dateOfBirth && (
                    <p
                      id="dob-error"
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>

                  <select
                    id="gender"
                    aria-invalid={!!errors.gender}
                    {...register("gender")}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select gender</option>

                    <option value="Male">Male</option>

                    <option value="Female">Female</option>

                    <option value="Other">Other</option>
                  </select>

                  {errors.gender && (
                    <p role="alert" className="text-sm text-destructive">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>

                <Input
                  id="address"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Enter your address"
                  aria-invalid={!!errors.address}
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                  {...register("address")}
                />

                {errors.address && (
                  <p
                    id="address-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="pr-10"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
                        ? "confirm-password-error"
                        : undefined
                    }
                    className="pr-10"
                    {...register("confirmPassword")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <p
                  role="alert"
                  className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {serverError}
                </p>
              )}

              {/* Notice */}
              {notice && (
                <p
                  role="status"
                  className="rounded-md bg-muted p-3 text-sm text-muted-foreground"
                >
                  {notice}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Your information is protected and securely stored.
        </p>
      </main>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
        {icon}
      </div>

      <div>
        <p className="font-medium">{title}</p>

        <p className="mt-1 text-sm text-primary-foreground/70">{description}</p>
      </div>
    </div>
  );
}
