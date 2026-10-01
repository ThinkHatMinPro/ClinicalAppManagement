import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* =========================================================
   VALIDATION
========================================================= */

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

/* =========================================================
   GREETING
========================================================= */

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

/* =========================================================
   LOGIN FORM
========================================================= */

export default function LoginForm({ onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (data) => {
    setNotice("");

    try {
      console.log("Login data:", data);

      // TODO:
      // Connect POST /api/auth/login here.

      setNotice(
        "Sign-in isn't connected yet. Authentication will be added later.",
      );
    } catch (error) {
      setNotice(error.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-sm">
        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {getGreeting()}. Sign in to manage your appointments.
          </p>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          {/* Email */}

          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs">
              Email
            </Label>

            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="h-9"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />

            {errors.email && (
              <p
                id="login-email-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-xs">
                Password
              </Label>

              <Link
                to="/forgot-password"
                className="rounded-sm text-xs text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-9 pr-10"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                id="login-password-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Notice */}

          {notice && (
            <p
              role="status"
              className="rounded-md border border-border bg-muted p-2.5 text-xs text-muted-foreground"
            >
              {notice}
            </p>
          )}

          {/* Sign In */}

          <div className="pt-2">
            <Button
              type="submit"
              className="h-9 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}

              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
