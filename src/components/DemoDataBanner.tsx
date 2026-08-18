/**
 * Phase 6B-1 R-3 — Visible Demo/Fallback Indicator.
 *
 * Renders an unmistakable banner whenever instructor-facing demo/fallback
 * data is actually being displayed. This banner must NEVER appear when real
 * instructor/student data is being displayed.
 */
export default function DemoDataBanner() {
  return (
    <div
      role="alert"
      data-testid="demo-data-banner"
      className="bg-warm-bronze/20 border border-warm-bronze rounded-lg px-4 py-3 mb-6"
    >
      <p className="text-warm-bronze font-semibold text-sm tracking-wide">
        ⚠️ DEMO DATA — Fictional student information
      </p>
      <p className="text-warm-bronze/80 text-xs mt-1">
        The data shown below is simulated for demonstration purposes only and
        does not represent real students.
      </p>
    </div>
  )
}
