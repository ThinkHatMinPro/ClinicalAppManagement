import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelector } from "@/components/ui/roleselector";

const loginSchema = z.object({
  role: z.enum(["PATIENT", "DOCTOR", "STAFF"], {
    message: "Please select your role",
  }),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "",
      email: "",
      password: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setNotice("");

    try {
      const payload = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const result = await api.post("/auth/login", payload);

const user = result.data?.user;
const token = result.data?.token;

if (!user || !token) {
    throw new Error("Invalid login response from server");
}

localStorage.setItem("token", token);
localStorage.setItem("role", user.role);
localStorage.setItem("user", JSON.stringify(user));

switch (user.role) {
    case "PATIENT":
        navigate("/patient/dashboard");
        break;

    case "DOCTOR":
        navigate("/doctor/dashboard");
        break;

    case "STAFF":
        navigate("/staff/dashboard");
        break;

    default:
        throw new Error("Invalid user role");
}
    } catch (error) {
      setNotice(
        error.message || "Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {getGreeting()}. Sign in to manage your appointments.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <input type="hidden" {...register("role")} />

          <RoleSelector
            value={selectedRole}
            onChange={(role) =>
              setValue("role", role, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.role?.message}
          />

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
              {...register("email")}
            />

            {errors.email && (
              <p role="alert" className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-xs">
                Password
              </Label>

              <Link
                to="/forgot-password"
                className="rounded-sm text-xs text-primary underline-offset-4 transition-colors hover:underline"
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
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted-foreground transition-colors hover:text-primary"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p role="alert" className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {notice && (
            <p
              role="alert"
              className="rounded-md border border-border bg-muted p-2.5 text-xs text-muted-foreground"
            >
              {notice}
            </p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="h-9 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}