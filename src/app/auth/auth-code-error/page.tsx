import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Invitation Error | ASCYN PRO',
}

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-4">Invitation link is invalid or expired</h1>
        <p className="text-gray-400 mb-8">
          This can happen if the link was already used, expired, or opened by an email security scanner.
          Please ask your administrator to send a new invitation, or try signing in if you have already set
          your password.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-semibold rounded-lg transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
