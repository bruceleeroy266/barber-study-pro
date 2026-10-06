'use client'

export default function PilotReportPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden min-h-11 rounded-lg border border-[var(--color-brand-gold)]/40 px-4 py-2 font-medium text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10"
    >
      Print report
    </button>
  )
}
