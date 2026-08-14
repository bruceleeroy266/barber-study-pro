import DemoInstructorClient from './DemoInstructorClient'

// ───────────────────────────────────────────────
// INSTRUCTOR DEMO — Class 2026 Experience
// Static demo data. No auth. No database. No API.
// ───────────────────────────────────────────────

export const metadata = {
  title: 'ASCYN PRO — Instructor Demo',
  description:
    'Experience the ASCYN PRO instructor dashboard with class readiness tracking and student intervention tools.',
}

export default function InstructorDemoPage() {
  return <DemoInstructorClient />
}
