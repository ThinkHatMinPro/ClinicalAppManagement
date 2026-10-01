import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Stethoscope } from "lucide-react";

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

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  // Login only checks presence; the password policy belongs to sign-up/reset.
  password: z.string().min(1, "Password is required"),
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // TODO: replace with a real API call when authentication is built.
  const onSubmit = async () => {
    setNotice(
      "Sign-in isn't connected yet. Authentication will be added in a later phase.",
    );
  };

  return (
    <div className="relative grid min-h-dvh lg:grid-cols-2">
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

      {/* Desktop-only brand panel */}
      <aside className="hidden flex-col justify-between gap-10 bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Stethoscope className="size-6" aria-hidden="true" />
          Clinic Appointment Manager
        </div>

        <div className="space-y-6">
          <HeartbeatLine className="h-16 w-full max-w-sm" />
          <p className="text-3xl font-semibold leading-tight">
            Every appointment, booked with confidence.
          </p>
          <p className="max-w-md text-primary-foreground/80">
            Schedules are checked for conflicts automatically, and access is
            limited by role so patient information stays protected.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/80">
          Authorized clinic staff only.
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center bg-background p-6">
        {/* Mobile brand row */}
        <div className="mb-8 flex w-full max-w-md items-center gap-2 text-lg font-semibold text-foreground lg:hidden">
          <Stethoscope className="size-6 text-primary" aria-hidden="true" />
          Clinic Appointment Manager
        </div>

        <Card className="w-full max-w-md border-border bg-card shadow-lg shadow-primary/5">
          <CardHeader>
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {getGreeting()}
            </h1>
            <CardDescription>
              Sign in to your account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@clinic.com"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
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

              {notice && (
                <p
                  role="status"
                  className="rounded-md bg-muted p-3 text-sm text-muted-foreground"
                >
                  {notice}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Don't have a patient account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Authorized clinic staff only.
        </p>
      </main>
    </div>
  );
}
