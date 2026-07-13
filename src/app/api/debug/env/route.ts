import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const hasUrl = !!supabaseUrl
  const hasKey = !!supabaseServiceKey
  const nodeEnv = process.env.NODE_ENV || 'unknown'

  let canInsert: boolean | null = null
  let insertError: string | null = null
  let insertedId: string | null = null

  if (hasUrl && hasKey) {
    const admin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data, error } = await admin
      .from('pilot_inquiries')
      .insert({
        school_name: 'DEBUG TEST',
        contact_name: 'Debug',
        email: 'debug@ascynpro.test',
        program_type: 'Barbering',
        is_test: true,
      })
      .select('id')
      .single()

    if (error) {
      canInsert = false
      insertError = error.message
    } else {
      canInsert = true
      insertedId = data?.id ?? null
      // Clean up debug row immediately
      if (data?.id) {
        await admin.from('pilot_inquiries').delete().eq('id', data.id)
      }
    }
  }

  return NextResponse.json({
    nodeEnv,
    hasSupabaseUrl: hasUrl,
    hasServiceRoleKey: hasKey,
    canInsert,
    insertError,
    insertedId,
  })
}
