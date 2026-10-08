export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen min-h-dvh overflow-y-auto flex items-start [@media(min-height:46rem)]:items-center justify-center bg-gradient-to-br from-black via-charcoal to-black px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] outline-none">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  )
}
