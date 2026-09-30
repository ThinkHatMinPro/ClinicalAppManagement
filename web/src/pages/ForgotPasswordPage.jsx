import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, MailCheck, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { SwitchMode } from "@/components/switch-mode";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  // TODO: replace with a real API call when authentication is built.
  // Always show the same success message, whether or not the account exists,
  // so the form can't be used to discover which emails are registered.
  const onSubmit = async ({ email }) => {
    setSentTo(email);
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background p-6">
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

      <div className="mb-8 flex w-full max-w-md items-center gap-2 text-lg font-semibold text-foreground">
        <Stethoscope className="size-6 text-primary" aria-hidden="true" />
        Clinic Appointment Manager
      </div>

      <Card className="w-full max-w-md border-border bg-card shadow-lg shadow-primary/5">
        {sentTo ? (
          <>
            <CardHeader>
              <MailCheck
                className="mb-2 size-8 text-primary"
                aria-hidden="true"
              />
              <h1 className="text-2xl font-semibold leading-none tracking-tight">
                Check your email
              </h1>
              <CardDescription role="status">
                If an account exists for{" "}
                <span className="font-medium text-foreground">{sentTo}</span>,
                we've sent instructions to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setSentTo("")}
              >
                Use a different email
              </Button>
              <Button asChild className="w-full">
                <Link to="/login">Back to sign in</Link>
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <h1 className="text-2xl font-semibold leading-none tracking-tight">
                Forgot your password?
              </h1>
              <CardDescription>
                Enter your email and we'll send you a link to reset it.
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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to sign in
                </Link>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
