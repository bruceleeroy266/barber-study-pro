// School admin pages require an authenticated school_admin/admin user, so they
// must be rendered dynamically at request time. Static generation would call
// createClient() without a user session and fail when Supabase env vars are missing.
export const dynamic = 'force-dynamic'

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
