export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-lg font-semibold text-slate-900">{value}</span>
    </div>
  )
}
