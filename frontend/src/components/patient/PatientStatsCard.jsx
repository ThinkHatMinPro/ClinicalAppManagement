export default function PatientStatCard({
  icon: Icon,
  value,
  label,
  iconClassName,
  containerClassName,
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${containerClassName}`}
    >
      <div
        className={`mb-5 flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <Icon size={20} />
      </div>

      <p className="text-center text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-center text-sm text-gray-500">
        {label}
      </p>
    </div>
  );
}