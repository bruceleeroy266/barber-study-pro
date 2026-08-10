import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">✂️</span>
          <span className="font-bold text-white text-xl">ASCYN PRO</span>
        </div>

        <div className="bg-charcoal/50 border border-graphite rounded-2xl p-8 space-y-6">
          <div className="text-6xl mb-4">🔍</div>

          <h1 className="text-3xl font-bold text-white">404</h1>

          <p className="text-xl text-light-gray">Page not found</p>

          <p className="text-silver leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-[var(--color-brand-gold)] text-black font-semibold rounded-xl hover:bg-[var(--color-brand-gold-light)] transition-all shadow-lg shadow-gold/20 text-center"
            >
              Return Home
            </Link>
            <Link
              href="/login"
              className="flex-1 px-6 py-3 bg-graphite text-white font-semibold rounded-xl hover:bg-[var(--color-border-secondary)] transition-all border border-[var(--color-border-secondary)] text-center"
            >
              Sign In
            </Link>
          </div>
        </div>

        <p className="text-silver-gray text-sm">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  )
}
