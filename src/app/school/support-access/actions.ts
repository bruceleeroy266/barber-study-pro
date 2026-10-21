'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function setSchoolSupportConsent(formData: FormData) {
 const action=String(formData.get('action')||'')
 if(action!=='enable'&&action!=='revoke') throw new Error('Invalid consent action')
 const supabase=await createClient()
 const {data:{user}}=await supabase.auth.getUser()
 if(!user) redirect('/login')
 const {error}=await supabase.rpc('set_school_support_authorization',{p_enable:action==='enable'})
 if(error) throw new Error('School authorization update denied')
 revalidatePath('/school/support-access')
 redirect('/school/support-access')
}
