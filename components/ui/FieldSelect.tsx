export function FieldSelect({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#111827]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 w-full rounded-lg border px-4 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0A66C2] ${
          error ? 'border-red-300 focus:ring-red-400' : 'border-[#E5E7EB]'
        }`}
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </label>
  )
}
