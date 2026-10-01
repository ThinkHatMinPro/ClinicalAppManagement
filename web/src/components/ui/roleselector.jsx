import { motion } from "framer-motion";
import { User, Stethoscope, Users } from "lucide-react";

const roles = [
  {
    value: "PATIENT",
    label: "Patient",
    icon: User,
  },
  {
    value: "DOCTOR",
    label: "Doctor",
    icon: Stethoscope,
  },
  {
    value: "STAFF",
    label: "Staff",
    icon: Users,
  },
];

export function RoleSelector({
  value,
  onChange,
  error,
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">
        Select your role
      </p>

      <div className="grid grid-cols-3 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = value === role.value;

          return (
            <motion.button
              key={role.value}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(role.value)}
              className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
              aria-pressed={isSelected}
            >
              <Icon className="size-4" />

              {role.label}
            </motion.button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}