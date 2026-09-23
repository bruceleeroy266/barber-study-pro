import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Barbering-only pilot provisioning migration', () => {
  const migrationPath = path.join(
    process.cwd(),
    'supabase/migrations/20260923210500_barbering_only_pilot_provisioning.sql'
  )
  const sql = fs.readFileSync(migrationPath, 'utf8')

  it('normalizes the inquiry program type before enforcing support', () => {
    expect(sql).toContain("lower(trim(coalesce(v_inquiry.program_type, '')))")
  })

  it('allows only barber and barbering program values', () => {
    expect(sql).toContain("v_program_type not in ('barber', 'barbering')")
  })

  it('rejects unsupported programs before school creation', () => {
    const guardIndex = sql.indexOf("v_program_type not in ('barber', 'barbering')")
    const schoolInsertIndex = sql.indexOf('insert into public.schools')
    expect(guardIndex).toBeGreaterThan(-1)
    expect(schoolInsertIndex).toBeGreaterThan(guardIndex)
  })

  it('creates only a Barbering default program', () => {
    expect(sql).toContain("'Barbering'")
    expect(sql).not.toContain("when 'cosmetology'")
    expect(sql).not.toContain("else 'Barbering'")
  })

  it('keeps RPC execution unavailable to anonymous users', () => {
    expect(sql).toContain(
      'revoke execute on function public.create_school_from_inquiry(uuid) from anon'
    )
  })
})
