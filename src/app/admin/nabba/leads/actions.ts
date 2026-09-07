'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import type {
  NabbaLead,
  LeadFormData,
  LeadMetrics,
  LeadFilters,
  LeadTemperature,
  LeadStatus,
  LeadFollowUp,
  LeadInterest,
} from '@/types/nabba-leads'

/* ─── Authorization helper ─── */
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  return { supabase, user, profile }
}

/* ─── Create lead ─── */
export async function createLead(data: LeadFormData): Promise<{ success: boolean; lead?: NabbaLead; error?: string }> {
  const { supabase, user, profile } = await requireAdmin()

  const { data: lead, error } = await supabase
    .from('nabba_leads')
    .insert({
      event: 'NABBA 2026',
      name: data.name.trim(),
      organization: data.organization.trim(),
      role: data.role,
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      state: data.state?.trim() || null,
      interests: data.interests,
      temperature: data.temperature,
      notes: data.notes?.trim() || null,
      follow_up_action: data.follow_up_action,
      status: 'NEW',
      captured_by: user.id,
      captured_by_email: profile.email || null,
    })
    .select()
    .single()

  if (error) {
    console.error('[NABBA Leads] Create error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/nabba/leads')
  return { success: true, lead: lead as NabbaLead }
}

/* ─── Get all leads ─── */
export async function getLeads(filters?: LeadFilters): Promise<{ leads: NabbaLead[]; error?: string }> {
  const { supabase } = await requireAdmin()

  let query = supabase
    .from('nabba_leads')
    .select('*')
    .eq('event', 'NABBA 2026')
    .order('created_at', { ascending: false })

  if (filters?.temperature && filters.temperature !== 'all') {
    query = query.eq('temperature', filters.temperature)
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  if (filters?.role && filters.role !== 'all') {
    query = query.eq('role', filters.role)
  }
  if (filters?.interest && filters.interest !== 'all') {
    query = query.contains('interests', [filters.interest])
  }
  if (filters?.search?.trim()) {
    const term = filters.search.trim()
    query = query.or(`name.ilike.%${term}%,organization.ilike.%${term}%,email.ilike.%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('[NABBA Leads] Fetch error:', error)
    return { leads: [], error: error.message }
  }

  return { leads: (data || []) as NabbaLead[] }
}

/* ─── Get single lead ─── */
export async function getLead(id: string): Promise<{ lead?: NabbaLead; error?: string }> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('nabba_leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[NABBA Leads] Get single error:', error)
    return { error: error.message }
  }

  return { lead: data as NabbaLead }
}

/* ─── Update lead ─── */
export async function updateLead(
  id: string,
  data: Partial<LeadFormData> & { status?: LeadStatus }
): Promise<{ success: boolean; lead?: NabbaLead; error?: string }> {
  const { supabase } = await requireAdmin()

  const update: Record<string, unknown> = {}
  if (data.name !== undefined) update.name = data.name.trim()
  if (data.organization !== undefined) update.organization = data.organization.trim()
  if (data.role !== undefined) update.role = data.role
  if (data.email !== undefined) update.email = data.email.trim().toLowerCase()
  if (data.phone !== undefined) update.phone = data.phone?.trim() || null
  if (data.state !== undefined) update.state = data.state?.trim() || null
  if (data.interests !== undefined) update.interests = data.interests
  if (data.temperature !== undefined) update.temperature = data.temperature
  if (data.notes !== undefined) update.notes = data.notes?.trim() || null
  if (data.follow_up_action !== undefined) update.follow_up_action = data.follow_up_action
  if (data.status !== undefined) update.status = data.status

  const { data: lead, error } = await supabase
    .from('nabba_leads')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[NABBA Leads] Update error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/nabba/leads')
  return { success: true, lead: lead as NabbaLead }
}

/* ─── Delete lead ─── */
export async function deleteLead(id: string): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from('nabba_leads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[NABBA Leads] Delete error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/nabba/leads')
  return { success: true }
}

/* ─── Get metrics ─── */
export async function getLeadMetrics(): Promise<{ metrics: LeadMetrics; error?: string }> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('nabba_leads')
    .select('temperature, interests')
    .eq('event', 'NABBA 2026')

  if (error) {
    console.error('[NABBA Leads] Metrics error:', error)
    return {
      metrics: { total: 0, hot: 0, warm: 0, contact: 0, pilotInterest: 0, demoRequests: 0 },
      error: error.message,
    }
  }

  const leads = data || []
  const metrics: LeadMetrics = {
    total: leads.length,
    hot: leads.filter((l: { temperature: string }) => l.temperature === 'HOT').length,
    warm: leads.filter((l: { temperature: string }) => l.temperature === 'WARM').length,
    contact: leads.filter((l: { temperature: string }) => l.temperature === 'CONTACT').length,
    pilotInterest: leads.filter((l: { interests: string[] }) =>
      l.interests.includes('90-Day Pilot') || l.interests.includes('School Adoption')
    ).length,
    demoRequests: leads.filter((l: { interests: string[] }) =>
      l.interests.includes('ASCYN PRO Demo')
    ).length,
  }

  return { metrics }
}

/* ─── Export leads to CSV ─── */
export async function exportLeadsCsv(): Promise<{ csv: string; error?: string }> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('nabba_leads')
    .select('*')
    .eq('event', 'NABBA 2026')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[NABBA Leads] Export error:', error)
    return { csv: '', error: error.message }
  }

  const leads = (data || []) as NabbaLead[]
  const headers = [
    'Name',
    'Organization',
    'Role',
    'Email',
    'Phone',
    'State',
    'Interests',
    'Temperature',
    'Status',
    'Follow-Up Action',
    'Notes',
    'Captured By',
    'Created At',
  ]

  const rows = leads.map((l) => [
    l.name,
    l.organization,
    l.role,
    l.email,
    l.phone || '',
    l.state || '',
    l.interests.join('; '),
    l.temperature,
    l.status,
    l.follow_up_action,
    l.notes || '',
    l.captured_by_email || '',
    new Date(l.created_at).toLocaleString(),
  ])

  const escape = (val: string) => {
    const str = String(val).replace(/"/g, '""')
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str}"`
    }
    return str
  }

  const csv = [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n')
  return { csv }
}
