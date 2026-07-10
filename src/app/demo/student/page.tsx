import DemoClient from "../DemoClient";

// ───────────────────────────────────────────────
// STUDENT DEMO — Board Readiness Experience
// Static demo data. No auth. No database. No API.
// ───────────────────────────────────────────────

export const metadata = {
  title: "ASCYN PRO — Student Demo",
  description:
    "Experience the ASCYN PRO student dashboard with board exam readiness tracking.",
};

export default function StudentDemoPage() {
  return <DemoClient />;
}
