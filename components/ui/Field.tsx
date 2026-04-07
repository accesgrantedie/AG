export function Field({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#111827]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`mt-1 w-full rounded-lg border px-4 py-2 text-sm text-[#111827] shadow-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0A66C2] ${
          error ? 'border-red-300 focus:ring-red-400' : 'border-[#E5E7EB]'
        }`}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </label>
  )
}
