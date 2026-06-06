import DemoClient from "./DemoClient";

// ───────────────────────────────────────────────
// DEMO STORYBOARD — Milady / NABBA Pitch Experience
// Static demo data. No auth. No database. No API.
// ───────────────────────────────────────────────

export const metadata = {
  title: "Barber Study Pro — Board Readiness Dashboard",
  description:
    "Professional barbering education platform. Measurable board exam preparation.",
};

export default function DemoPage() {
  return <DemoClient />;
}
