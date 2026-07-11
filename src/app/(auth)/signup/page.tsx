import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pilot Access — ASCYN PRO',
  description: 'ASCYN PRO is currently invite-only. Request pilot access for your school.',
}

export default function SignupPage() {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
      <div className="text-5xl mb-4">✂️</div>
      <h1 className="text-2xl font-bold text-white mb-4">Pilot Access Only</h1>
      <p className="text-gray-400 mb-6">
        ASCYN PRO is currently available by invitation to approved pilot schools.
        Public registration is closed. If your school is part of the pilot program,
        your administrator will provide login credentials.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/pilot"
          className="inline-block py-3 px-6 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-gray-950 font-semibold rounded-lg hover:from-[#F4E4A6] hover:to-[#D4AF37] transition-all duration-200"
        >
          Request Pilot Access
        </Link>
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600"
        >
          Pilot Login
        </Link>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-800">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
