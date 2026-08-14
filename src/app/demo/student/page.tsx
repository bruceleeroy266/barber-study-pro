import DemoStudentClient from './DemoStudentClient'

// ───────────────────────────────────────────────
// STUDENT DEMO — Isabella Martinez Experience
// Static demo data. No auth. No database. No API.
// ───────────────────────────────────────────────

export const metadata = {
  title: 'ASCYN PRO — Student Demo',
  description:
    'Experience the ASCYN PRO student dashboard with board exam readiness tracking.',
}

export default function StudentDemoPage() {
  return <DemoStudentClient />
}
