import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, schools(*)')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Account Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                  {profile?.full_name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                  {profile?.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg capitalize">
                  {profile?.role}
                </div>
              </div>

              {profile?.schools && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">School</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {profile.schools.name}
                  </div>
                </div>
              )}

              {profile?.barber_shop_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Barber Shop</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {profile.barber_shop_name}
                  </div>
                </div>
              )}

              {profile?.mentor_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mentor</label>
                  <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                    {profile.mentor_name}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account Stats</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-[#D4AF37]">
                  {new Date(profile?.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">Member Since</div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">
                  {new Date(profile?.updated_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">Last Updated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <a
                href="/reset-password"
                className="block w-full text-center px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Change Password
              </a>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Need Help?</h2>
            <p className="text-gray-400 text-sm mb-4">
              Contact your instructor or school administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
