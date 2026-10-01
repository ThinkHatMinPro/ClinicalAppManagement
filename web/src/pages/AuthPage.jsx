import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Stethoscope,
  CalendarDays,
  ShieldCheck,
  UserPlus,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import HeartbeatLine from "@/components/HeartbeatLine";
import { SwitchMode } from "@/components/theme/switch-mode";

/* =============================================
   PANEL CONTENT
============================================= */

const registerPitch = {
  heading: "New here?",
  description:
    "Create a patient account to book visits and stay connected with your clinic.",

  features: [
    {
      icon: CalendarDays,
      title: "Book appointments",
      description: "Choose a doctor and time in minutes.",
    },
    {
      icon: UserPlus,
      title: "Quick registration",
      description: "Set up your profile in a few steps.",
    },
    {
      icon: ShieldCheck,
      title: "Secure access",
      description: "Your data stays protected.",
    },
  ],

  cta: "Create account",
};

const loginPitch = {
  heading: "Welcome back.",
  description:
    "Sign in to pick up where you left off and manage your clinic visits.",

  features: [
    {
      icon: CalendarDays,
      title: "Upcoming visits",
      description: "See your schedule at a glance.",
    },
    {
      icon: RefreshCw,
      title: "Easy rescheduling",
      description: "Change or cancel in a tap.",
    },
    {
      icon: ClipboardList,
      title: "Your clinic info",
      description: "Everything in one place.",
    },
  ],

  cta: "Sign in",
};

/* =============================================
   PAGE
============================================= */

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const reduceMotion = useReducedMotion();

  const slide = (x) => ({
    initial: {
      opacity: 0,
      x: reduceMotion ? 0 : x,
    },

    animate: {
      opacity: 1,
      x: 0,
    },

    exit: {
      opacity: 0,
      x: reduceMotion ? 0 : x,
    },

    transition: {
      duration: 0.25,
    },
  });

  const fade = {
    initial: {
      opacity: 0,
    },

    animate: {
      opacity: 1,
    },

    exit: {
      opacity: 0,
    },

    transition: {
      duration: 0.25,
    },
  };

  return (
    <div className="relative min-h-dvh bg-background">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Header */}
      <header className="absolute right-4 top-4 z-20 md:right-6">
        <SwitchMode
          width={56}
          height={28}
          darkColor="var(--background)"
          lightColor="var(--secondary)"
          knobDarkColor="var(--primary)"
          knobLightColor="var(--card)"
          borderDarkColor="var(--primary)"
          borderLightColor="var(--border)"
        />
      </header>

      {/* Main */}
      <main className="relative z-10 flex items-center justify-center px-4 py-6 md:px-6">
        {/* Reduced from max-w-5xl to max-w-4xl */}
        {/* Removed min-h-[640px] */}
        <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/5 md:grid-cols-2">
          {/* ================= LEFT COLUMN ================= */}
          <div className="relative md:border-r md:border-border">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="login-form"
                  {...slide(-20)}
                  className="flex h-full items-center justify-center p-6 md:p-8"
                >
                  <LoginForm onSwitchToSignup={() => setMode("signup")} />
                </motion.div>
              ) : (
                <motion.div
                  key="login-info"
                  {...fade}
                  className="hidden h-full md:block"
                >
                  <InfoPanel
                    {...loginPitch}
                    onAction={() => setMode("login")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {mode === "signup" ? (
                <motion.div
                  key="register-form"
                  {...slide(20)}
                  className="flex h-full items-center justify-center p-6 md:p-8"
                >
                  <RegisterForm onSwitchToLogin={() => setMode("login")} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup-info"
                  {...fade}
                  className="hidden h-full md:block"
                >
                  <InfoPanel
                    {...registerPitch}
                    onAction={() => setMode("signup")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-2 text-center text-xs text-muted-foreground">
        {/* <p>Your information is protected and securely stored.</p>

        <nav
          aria-label="Legal"
          className="mt-1 flex justify-center gap-3 text-[11px]"
        >
          <a href="/privacy" className="underline-offset-4 hover:underline">
            Privacy
          </a>

          <a href="/terms" className="underline-offset-4 hover:underline">
            Terms
          </a>

          <a href="/help" className="underline-offset-4 hover:underline">
            Help
          </a>
        </nav> */}
      </footer>
    </div>
  );
}

/* =============================================
   INFO PANEL
============================================= */

function InfoPanel({ heading, description, features, cta, onAction }) {
  return (
    <div className="relative flex h-full min-h-[500px] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
      {/* Decorative shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary-foreground/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-12 size-64 rounded-full bg-primary-foreground/5"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:18px_18px]"
      />

      {/* Brand */}
      <div className="relative flex items-center gap-2 text-base font-semibold">
        <Stethoscope className="size-5" aria-hidden="true" />
        Clinic Appointment Manager
      </div>

      {/* Main content */}
      <div className="relative space-y-5">
        <HeartbeatLine className="h-12 w-full max-w-xs" />

        <div>
          <h2 className="text-2xl font-semibold leading-tight">{heading}</h2>

          <p className="mt-2 max-w-sm text-sm text-primary-foreground/85">
            {description}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature) => (
            <Feature key={feature.title} {...feature} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAction}
          className="inline-flex h-10 items-center justify-center rounded-md border border-primary-foreground/40 px-5 text-sm font-medium transition-colors hover:bg-primary-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

/* =============================================
   FEATURE
============================================= */

function Feature({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
        <Icon className="size-4" aria-hidden="true" />
      </div>

      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="text-xs text-primary-foreground/80">{description}</p>
      </div>
    </div>
  );
}
