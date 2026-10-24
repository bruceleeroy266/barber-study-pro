import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
const source = readFileSync('src/components/instructor/CoachingSearch.tsx','utf8')
const sql = readFileSync('supabase/migrations/20261022230000_exam_ready_live_status.sql','utf8')
const page = readFileSync('src/app/instructor/students/[studentId]/exam-ready/page.tsx','utf8')

describe('Instructor coaching search and exam monitor contracts', () => {
 it('searches prompts, question positions, and theory topics without exposing active attempts', () => {
  expect(source).toContain("q.position.toString()")
  expect(source).toContain("'q'+q.position")
  expect(source).toContain('q.prompt')
  expect(source).toContain("labels[q.domain]||q.domain")
  expect(source).toContain("domain==='all'||q.domain===domain")
  expect(source).toContain('q.selectedOption?.toLowerCase()!==q.correctOption?.toLowerCase()')
  expect(source).toContain('type="search"')
  expect(source).toContain('aria-live="polite"')
  expect(page).toContain("get_assigned_student_exam_coaching")
 })
 it('requires approved enabled assigned instructor in same school',()=>{
  for (const clause of ["role='instructor'","approval_status='approved'","coalesce(is_disabled,false)=false","a.instructor_id=auth.uid()","a.is_active=true","a.ended_at is null","s.school_id=v_school","t.school_id=v_school"]) expect(sql).toContain(clause)
  expect(sql).toContain("revoke all on function public.get_assigned_student_exam_live_status(uuid) from public,anon")
 })
 it('does not return live question text, student answers, or answer keys',()=>{
  expect(sql).toContain("'answeredCount'")
  expect(sql).toContain("'lastAnsweredPosition'")
  expect(sql).toContain("'remainingSeconds'")
  expect(sql).not.toContain('prompt_snapshot')
  expect(sql).not.toContain('correct_option_snapshot')
  expect(sql).not.toContain("'selectedOption'")
  expect(page).toContain('Current question being viewed:')
  expect(page).toContain('get_assigned_student_exam_live_position')
  expect(page).toContain('Last answered question:')
 })
})
