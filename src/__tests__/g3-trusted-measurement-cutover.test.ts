import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

function read(relativePath: string) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')
}

const cutover = fs.readFileSync(
  path.join(process.cwd(), 'supabase/migrations/20261002123000_g3_1_trusted_measurement_cutover.sql'),
  'utf8',
)
const po1b = fs.readFileSync(
  path.join(process.cwd(), 'supabase/migrations/20261002055000_po1b_session_observability.sql'),
  'utf8',
)
const instructor = fs.readFileSync(
  path.join(process.cwd(), 'src/app/instructor/page.tsx'),
  'utf8',
)
const telemetryRuntime = [
  fs.readFileSync(path.join(process.cwd(), 'src/hooks/useStudySession.ts'), 'utf8'),
  fs.readFileSync(path.join(process.cwd(), 'src/app/api/study-sessions/start/route.ts'), 'utf8'),
  fs.readFileSync(path.join(process.cwd(), 'src/app/api/study-sessions/activity/route.ts'), 'utf8'),
  fs.readFileSync(path.join(process.cwd(), 'src/app/api/study-sessions/end/route.ts'), 'utf8'),
  fs.readFileSync(path.join(process.cwd(), 'src/app/api/study-sessions/link-quiz-attempt/route.ts'), 'utf8'),
].join('\n').toLowerCase()

describe('G3-1 trusted measurement cutover', () => {
  it('revokes the legacy authenticated study-time mutation lane', () => {
    expect(cutover).toContain(
      'revoke execute on function public.record_study_activity(integer, text) from authenticated',
    )
    expect(cutover).toContain(
      'revoke execute on function public.record_study_activity(integer, text) from anon',
    )
    expect(cutover).toContain(
      'revoke execute on function public.record_study_activity(integer, text) from public',
    )
    expect(cutover).toContain('DEPRECATED: legacy study-time writer')
  })

  it('keeps only the authoritative PO-1B mutation RPCs available to authenticated learners', () => {
    expect(cutover).toContain(
      'grant execute on function public.begin_study_session(text, text) to authenticated',
    )
    expect(cutover).toContain(
      'grant execute on function public.record_learning_activity(uuid, text, timestamptz) to authenticated',
    )
    expect(cutover).toContain(
      'grant execute on function public.end_study_session(uuid, text) to authenticated',
    )
    expect(cutover).toContain(
      'grant execute on function public.link_study_quiz_attempt(uuid, uuid) to authenticated',
    )
    expect(po1b).toContain('insert into public.study_activity_days')
    expect(po1b).toContain('if v_credit_seconds > 0 then')
  })

  it('keeps instructor measurement on the trusted study_activity_days rollup', () => {
    expect(instructor).toContain(".from('study_activity_days')")
    expect(instructor).toContain('studyMinutesToday')
    expect(instructor).toContain('lastStudyActivityAt')
  })

  it('keeps trusted telemetry isolated from official H&A and grading writes', () => {
    expect(telemetryRuntime).not.toContain('hour_logs')
    expect(telemetryRuntime).not.toContain('effective_hour_logs')
    expect(telemetryRuntime).not.toContain('attendance_records')
    expect(telemetryRuntime).not.toContain('attendance_corrections')
    expect(telemetryRuntime).not.toContain('hour_adjustments')
    expect(telemetryRuntime).not.toContain('student_progress')
    expect(telemetryRuntime).not.toContain('update public.quiz_attempts')

    const cutoverLower = cutover.toLowerCase()
    expect(cutoverLower).not.toContain('hour_logs')
    expect(cutoverLower).not.toContain('attendance_records')
    expect(cutoverLower).not.toContain('attendance_corrections')
    expect(cutoverLower).not.toContain('hour_adjustments')
  })
  it('syncs trusted credited PO-1B events into the dashboard rollup exactly at the database boundary', () => {
    const sync = read('supabase/migrations/20261002131000_g3_1_session_delta_rollup_sync.sql')
    expect(sync).toContain('create or replace function public.sync_po1b_session_delta_to_study_day()')
    expect(sync).toContain('after update of active_seconds on public.study_sessions')
    expect(sync).toContain('when (new.active_seconds > old.active_seconds)')
    expect(sync).toContain('insert into public.study_activity_days')
    expect(sync).toContain('new.active_seconds - old.active_seconds')
    expect(sync).not.toContain('p_seconds integer')
    expect(sync).not.toContain('hour_logs')
    expect(sync).not.toContain('attendance_records')
    expect(sync).not.toContain('attendance_corrections')
  })

})
