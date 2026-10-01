import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelector } from "@/components/ui/RoleSelector";

/* =========================================================
   VALIDATION
========================================================= */

const registerSchema = z
  .object({
    role: z.enum(["PATIENT", "DOCTOR", "STAFF"], {
      message: "Please select your role",
    }),

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

    dateOfBirth: z.string().optional(),

    gender: z.string().optional(),

    address: z.string().optional(),

    specialty: z.string().optional(),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })

  /* Password Match */

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

  /* Patient - DOB */

  .refine((data) => data.role !== "PATIENT" || !!data.dateOfBirth, {
    message: "Date of birth is required",
    path: ["dateOfBirth"],
  })

  /* Patient - Gender */

  .refine((data) => data.role !== "PATIENT" || !!data.gender, {
    message: "Gender is required",
    path: ["gender"],
  })

  /* Patient - Address */

  .refine(
    (data) =>
      data.role !== "PATIENT" || (data.address && data.address.length >= 5),
    {
      message: "Please enter a valid address",
      path: ["address"],
    },
  )

  /* Doctor - Specialty */

  .refine((data) => data.role !== "DOCTOR" || !!data.specialty, {
    message: "Specialty is required",
    path: ["specialty"],
  });

/* =========================================================
   COMMON CONTROL STYLE
========================================================= */

const controlClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 dark:[color-scheme:dark]";

/* =========================================================
   REGISTER FORM
========================================================= */

export default function RegisterForm({ onSwitchToLogin }) {
  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notice, setNotice] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      role: "",
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      specialty: "",
      password: "",
      confirmPassword: "",
    },
  });

  /* =========================================================
     WATCH SELECTED ROLE
  ========================================================= */

  const selectedRole = watch("role");

  /* =========================================================
     DEVELOPMENT AUTOFILL
  ========================================================= */

  const handleDevAutofill = () => {
    if (!selectedRole) {
      setNotice("Please select a role first.");
      return;
    }

    setNotice("");

    /* -------------------------
       PATIENT
    ------------------------- */

    if (selectedRole === "PATIENT") {
      setValue("name", "Test Patient");
      setValue("email", "patient@test.com");
      setValue("phone", "9876543210");

      setValue("dateOfBirth", "2000-05-15");

      setValue("gender", "Female");

      setValue("address", "Hyderabad, Telangana");

      setValue("specialty", "");

      setValue("password", "Password@123");

      setValue("confirmPassword", "Password@123");
    }

    /* -------------------------
       DOCTOR
    ------------------------- */

    if (selectedRole === "DOCTOR") {
      setValue("name", "Dr Test");

      setValue("email", "doctor@test.com");

      setValue("phone", "9876543211");

      setValue("specialty", "Cardiology");

      /* Clear Patient fields */

      setValue("dateOfBirth", "");
      setValue("gender", "");
      setValue("address", "");

      setValue("password", "Password@123");

      setValue("confirmPassword", "Password@123");
    }

    /* -------------------------
       STAFF
    ------------------------- */

    if (selectedRole === "STAFF") {
      setValue("name", "Test Staff");

      setValue("email", "staff@test.com");

      setValue("phone", "9876543212");

      /* Clear role-specific fields */

      setValue("dateOfBirth", "");
      setValue("gender", "");
      setValue("address", "");
      setValue("specialty", "");

      setValue("password", "Password@123");

      setValue("confirmPassword", "Password@123");
    }
  };

  /* =========================================================
     NEXT STEP
  ========================================================= */

  const handleNext = async () => {
    let fields = ["role", "name", "phone"];

    /* Patient fields */

    if (selectedRole === "PATIENT") {
      fields.push("dateOfBirth", "gender", "address");
    }

    /* Doctor fields */

    if (selectedRole === "DOCTOR") {
      fields.push("specialty");
    }

    const isValid = await trigger(fields);

    if (isValid) {
      setNotice("");
      setStep(2);
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (data) => {
    setNotice("");

    try {
      const payload = {
        role: data.role,

        name: data.name.trim(),

        email: data.email.trim().toLowerCase(),

        phone: data.phone,

        password: data.password,

        /* Patient Data */

        ...(data.role === "PATIENT" && {
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
        }),

        /* Doctor Data */

        ...(data.role === "DOCTOR" && {
          specialty: data.specialty,
        }),
      };

      console.log("Register data:", payload);

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create account");
      }

      setNotice("Account created successfully.");

      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
    } catch (error) {
      setNotice(error.message || "Unable to create account. Please try again.");
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-md">
        {/* =================================================
            HEADING + AUTOFILL
        ================================================= */}

        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Select your role and enter your details.
            </p>
          </div>

          {/* DEVELOPMENT ONLY */}

          {import.meta.env.DEV && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDevAutofill}
              title="For development purpose only"
            >
              Autofill
            </Button>
          )}
        </div>

        {/* =================================================
            STEP INDICATOR
        ================================================= */}

        <StepIndicator step={step} />

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6">
          {/* Register role with React Hook Form */}

          <input type="hidden" {...register("role")} />

          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (
            <div className="space-y-3">
              {/* ROLE SELECTOR */}

              <RoleSelector
                value={selectedRole}
                onChange={(role) => {
                  setValue("role", role, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setNotice("");
                }}
                error={errors.role?.message}
              />

              {/* FULL NAME */}

              <Field
                label="Full name"
                htmlFor="register-name"
                error={errors.name}
              >
                <Input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className="h-10"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </Field>

              {/* PHONE */}

              <Field
                label="Phone number"
                htmlFor="register-phone"
                error={errors.phone}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-input px-3 text-sm text-muted-foreground">
                    +91
                  </span>

                  <Input
                    id="register-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    className="h-10 pl-14"
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                  />
                </div>
              </Field>

              {/* =================================================
                  PATIENT FIELDS
              ================================================= */}

              {selectedRole === "PATIENT" && (
                <>
                  {/* DOB + GENDER */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* DOB */}

                    <Field
                      label="Date of birth"
                      htmlFor="register-dob"
                      error={errors.dateOfBirth}
                    >
                      <input
                        id="register-dob"
                        type="date"
                        max={today}
                        autoComplete="bday"
                        className={controlClass}
                        aria-invalid={!!errors.dateOfBirth}
                        {...register("dateOfBirth")}
                      />
                    </Field>

                    {/* GENDER */}

                    <Field
                      label="Gender"
                      htmlFor="register-gender"
                      error={errors.gender}
                    >
                      <select
                        id="register-gender"
                        className={controlClass}
                        aria-invalid={!!errors.gender}
                        {...register("gender")}
                      >
                        <option value="">Select</option>

                        <option value="Male">Male</option>

                        <option value="Female">Female</option>

                        <option value="Other">Other</option>
                      </select>
                    </Field>
                  </div>

                  {/* ADDRESS */}

                  <Field
                    label="Address"
                    htmlFor="register-address"
                    error={errors.address}
                  >
                    <textarea
                      id="register-address"
                      rows={2}
                      autoComplete="street-address"
                      placeholder="House no., street, city, PIN code"
                      aria-invalid={!!errors.address}
                      className={`${controlClass} h-auto min-h-[4rem] resize-none py-2`}
                      {...register("address")}
                    />
                  </Field>
                </>
              )}

              {/* =================================================
                  DOCTOR FIELDS
              ================================================= */}

              {selectedRole === "DOCTOR" && (
                <Field
                  label="Specialty"
                  htmlFor="register-specialty"
                  error={errors.specialty}
                >
                  <Input
                    id="register-specialty"
                    type="text"
                    placeholder="e.g. Cardiology"
                    className="h-10"
                    aria-invalid={!!errors.specialty}
                    {...register("specialty")}
                  />
                </Field>
              )}

              {/* =================================================
                  STAFF

                  No extra Staff fields currently because
                  Prisma schema doesn't have a Staff model.
              ================================================= */}

              {/* NOTICE
                  Important because Autofill can show
                  "Please select a role first."
              */}

              {notice && (
                <p
                  role="status"
                  className="rounded-md border border-border bg-muted p-2.5 text-xs text-muted-foreground"
                >
                  {notice}
                </p>
              )}

              {/* NEXT */}

              <Button
                type="button"
                onClick={handleNext}
                className="h-10 w-full"
              >
                Next step
                <ChevronRight className="ml-2 size-4" aria-hidden="true" />
              </Button>
            </div>
          )}

          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (
            <div className="space-y-3">
              {/* EMAIL */}

              <Field
                label="Email"
                htmlFor="register-email"
                error={errors.email}
              >
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-10"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>

              {/* PASSWORD */}

              <Field
                label="Password"
                htmlFor="register-password"
                error={errors.password}
                hint="Use at least 8 characters."
              >
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="h-10 pr-10"
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />

                  <PasswordButton
                    show={showPassword}
                    setShow={setShowPassword}
                    label="password"
                  />
                </div>
              </Field>

              {/* CONFIRM PASSWORD */}

              <Field
                label="Confirm password"
                htmlFor="confirm-password"
                error={errors.confirmPassword}
              >
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    className="h-10 pr-10"
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />

                  <PasswordButton
                    show={showConfirmPassword}
                    setShow={setShowConfirmPassword}
                    label="confirm password"
                  />
                </div>
              </Field>

              {/* NOTICE */}

              {notice && (
                <p
                  role="status"
                  className="rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground"
                >
                  {notice}
                </p>
              )}

              {/* NAVIGATION */}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-10 flex-1"
                >
                  <ChevronLeft className="mr-2 size-4" aria-hidden="true" />
                  Back
                </Button>

                <Button
                  type="submit"
                  className="h-10 flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="mr-2 size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Creating...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>

              {/* TERMS */}

              <p className="pt-2 text-center text-xs leading-relaxed text-muted-foreground">
                By creating an account, you agree to our{" "}
                <a
                  href="/terms"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   STEP INDICATOR
========================================================= */

function StepIndicator({ step }) {
  return (
    <div className="mx-auto flex w-full max-w-[220px] items-start">
      {/* STEP 1 */}

      <div className="flex flex-col items-center">
        <div className="flex size-7 items-center justify-center rounded-full border-2 border-primary bg-primary text-xs font-semibold text-primary-foreground">
          {step > 1 ? <Check className="size-4" aria-hidden="true" /> : "1"}
        </div>

        <span className="mt-1.5 text-[11px] font-medium text-foreground">
          Details
        </span>
      </div>

      {/* LINE */}

      <div
        className={`mx-2 mt-4 h-0.5 flex-1 ${
          step > 1 ? "bg-primary" : "bg-border"
        }`}
      />

      {/* STEP 2 */}

      <div className="flex flex-col items-center">
        <div
          className={`flex size-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${
            step === 2
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground"
          }`}
        >
          2
        </div>

        <span
          className={`mt-1.5 text-[11px] ${
            step === 2 ? "font-medium text-foreground" : "text-muted-foreground"
          }`}
        >
          Security
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor} className="text-xs">
        {label}
      </Label>

      {children}

      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error.message}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/* =========================================================
   PASSWORD BUTTON
========================================================= */

function PasswordButton({ show, setShow, label = "password" }) {
  return (
    <button
      type="button"
      onClick={() => setShow((value) => !value)}
      className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={show ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={show}
    >
      {show ? (
        <EyeOff className="size-4" aria-hidden="true" />
      ) : (
        <Eye className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
