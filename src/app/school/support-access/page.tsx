import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { setSchoolSupportConsent } from './actions'

type Authorization={active:boolean;expires_at:string;authorized_by:string;revoked_at:string|null}
export default async function SchoolSupportAccessPage(){
 const supabase=await createClient()
 const {data:{user}}=await supabase.auth.getUser()
 if(!user) redirect('/login')
 const {data:profile}=await supabase.from('profiles')
  .select('role,school_id,approval_status,is_disabled').eq('id',user.id).maybeSingle()
 if(!profile?.school_id||profile.role!=='school_admin'
  ||profile.approval_status!=='approved'||profile.is_disabled===true) redirect('/school')
 const {data,error}=await supabase.rpc('get_school_support_authorization')
 const grant=(!error&&Array.isArray(data)?data[0]:null) as Authorization|null
 return <section className="mx-auto max-w-2xl space-y-5 text-white">
  <h1 className="text-2xl font-bold">ASCYN PRO Support Access</h1>
  <p>Allow ASCYN PRO administrators to provide technical support to this school without using your password. This authorization does not approve changes to official grades, attendance, or completed hours.</p>
  <p role="status">{error?'Unable to verify authorization status':grant?.active?'Support enabled':'Support disabled'}</p>
  {grant?.active&&<p>Expires: {new Date(grant.expires_at).toLocaleDateString()}</p>}
  <p>Authorization lasts up to 90 days and can be revoked at any time. Revocation stops active support sessions. Only authorized school administrators can change this setting.</p>
  {!error&&<form action={setSchoolSupportConsent}>
   <input type="hidden" name="action" value={grant?.active?'revoke':'enable'}/>
   <button type="submit" className="rounded-lg bg-amber-400 px-4 py-3 font-semibold text-black">
    {grant?.active?'Revoke Support Access':'Authorize Technical Support for 90 Days'}
   </button>
  </form>}
 </section>
}
