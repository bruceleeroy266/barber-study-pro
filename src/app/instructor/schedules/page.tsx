import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'
import {
  assignTemplateSchedule,
  createScheduleTemplate,
  saveCustomStudentSchedule,
  saveScheduleOverride,
} from './actions'

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface PageProps {
  searchParams: Promise<{
    student?: string
    saved?: string
    error?: string
  }>
}

interface ScheduleDay {
  day_of_week: number
  is_scheduled: boolean
  start_time: string | null
  end_time: string | null
  break_minutes: number
}

function WeeklyScheduleFields() {
  return (
    <div className="space-y-2">
      {dayNames.map((day, index) => (
        <div
          key={day}
          className="grid grid-cols-1 gap-2 rounded-lg border border-graphite bg-black p-3 sm:grid-cols-[150px_1fr_1fr_120px]"
        >
          <label className="flex items-center gap-2 text-sm font-medium text-white">
            <input type="checkbox" name={`day-${index}-active`} className="h-4 w-4" />
            {day}
          </label>
          <label className="text-xs text-silver">
            Start
            <input
              type="time"
              name={`day-${index}-start`}
              defaultValue="08:30"
              className="mt-1 w-full rounded-md border border-graphite bg-charcoal px-2 py-2 text-white [color-scheme:dark]"
            />
          </label>
          <label className="text-xs text-silver">
            End
            <input
              type="time"
              name={`day-${index}-end`}
              defaultValue="16:00"
              className="mt-1 w-full rounded-md border border-graphite bg-charcoal px-2 py-2 text-white [color-scheme:dark]"
            />
          </label>
          <label className="text-xs text-silver">
            Break (min)
            <input
              type="number"
              name={`day-${index}-break`}
              min="0"
              max="480"
              step="5"
              defaultValue="30"
              className="mt-1 w-full rounded-md border border-graphite bg-charcoal px-2 py-2 text-white"
            />
          </label>
        </div>
      ))}
    </div>
  )
}

function formatTime(value: string | null) {
  if (!value) return '—'
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`
}

export default async function StudentSchedulesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !hasPermission(actor.role, 'manage_attendance')) {
    redirect('/dashboard')
  }

  const [{ data: studentsData }, { data: templatesData }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('school_id', actor.school_id)
      .in('role', ['student', 'apprentice'])
      .order('full_name'),
    supabase
      .from('school_schedule_templates')
      .select('id, name, description')
      .eq('school_id', actor.school_id)
      .eq('is_active', true)
      .order('name'),
  ])

  const students = (studentsData || []) as Array<{ id: string; full_name: string; email: string }>
  const templates = (templatesData || []) as Array<{ id: string; name: string; description: string | null }>
  const selectedStudentId =
    params.student && students.some((student) => student.id === params.student)
      ? params.student
      : students[0]?.id || ''
  const selectedStudent = students.find((student) => student.id === selectedStudentId) || null

  const [{ data: profilesData }, { data: overridesData }] = selectedStudentId
    ? await Promise.all([
        supabase
          .from('student_schedule_profiles')
          .select('id, name, source_template_id, effective_from, effective_to, is_active, notes, created_at')
          .eq('school_id', actor.school_id)
          .eq('student_id', selectedStudentId)
          .eq('is_active', true)
          .order('effective_from', { ascending: false }),
        supabase
          .from('student_schedule_overrides')
          .select('id, override_date, override_type, start_time, end_time, break_minutes, reason')
          .eq('school_id', actor.school_id)
          .eq('student_id', selectedStudentId)
          .order('override_date', { ascending: false })
          .limit(20),
      ])
    : [{ data: [] }, { data: [] }]

  const profiles = (profilesData || []) as Array<{
    id: string
    name: string
    source_template_id: string | null
    effective_from: string
    effective_to: string | null
    is_active: boolean
    notes: string | null
    created_at: string
  }>

  const profileIds = profiles.map((profile) => profile.id)
  const { data: daysData } = profileIds.length
    ? await supabase
        .from('student_schedule_days')
        .select('schedule_profile_id, day_of_week, is_scheduled, start_time, end_time, break_minutes')
        .in('schedule_profile_id', profileIds)
        .order('day_of_week')
    : { data: [] }

  const days = (daysData || []) as Array<ScheduleDay & { schedule_profile_id: string }>
  const overrides = (overridesData || []) as Array<{
    id: string
    override_date: string
    override_type: 'scheduled' | 'off' | 'makeup'
    start_time: string | null
    end_time: string | null
    break_minutes: number
    reason: string | null
  }>

  const today = new Date().toISOString().slice(0, 10)
  const successMessage =
    params.saved === 'template'
      ? 'Schedule template saved.'
      : params.saved === 'schedule'
        ? 'Student schedule saved.'
        : params.saved === 'override'
          ? 'One-day schedule override saved.'
          : null
  const errorMessage =
    params.error === 'invalid-template-name'
      ? 'Enter a template name.'
      : params.error === 'duplicate-template'
        ? 'A schedule template with that name already exists.'
        : params.error === 'missing-fields'
          ? 'Complete the required schedule fields.'
          : params.error === 'invalid-time'
            ? 'Each scheduled day needs a valid start time earlier than the end time.'
            : params.error === 'invalid-break'
              ? 'Break minutes must be between 0 and 480.'
              : params.error === 'no-days'
                ? 'Select at least one scheduled day.'
                : params.error === 'invalid-dates'
                  ? 'The end date cannot be before the start date.'
                  : params.error === 'student-not-found'
                    ? 'That student is not in your school.'
                    : params.error === 'template-not-found'
                      ? 'That schedule template is unavailable.'
                      : params.error === 'template-incomplete'
                        ? 'That template is incomplete and cannot be assigned.'
                        : params.error === 'save-failed'
                          ? 'The schedule could not be saved. Please try again.'
                          : null

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-xs font-bold uppercase tracking-wide text-gold">Segment A</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Student Schedules</h1>
          <p className="mt-2 max-w-3xl text-silver">
            Set each student&apos;s expected weekly schedule without changing attendance or hour totals yet.
            Schedules can be recurring, temporary, template-based, custom, or overridden for one day.
          </p>
        </header>

        {successMessage && (
          <div className="rounded-xl border border-gold/30 bg-gold/10 p-4 text-gold">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{errorMessage}</div>
        )}

        <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Choose Student</h2>
          <form method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              name="student"
              defaultValue={selectedStudentId}
              className="min-h-11 flex-1 rounded-lg border border-graphite bg-black px-3 text-white [color-scheme:dark]"
            >
              {students.length === 0 && <option value="">No students available</option>}
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={students.length === 0}
              className="rounded-lg border border-gold px-4 py-2 font-semibold text-gold disabled:opacity-40"
            >
              View Schedule
            </button>
          </form>
        </section>

        {selectedStudent && (
          <>
            <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Assign a Reusable Template</h2>
                <p className="mt-1 text-sm text-silver">
                  Use this for standard schedules such as Full-Time, Part-Time AM, Part-Time PM, or Evening.
                </p>
              </div>
              <form action={assignTemplateSchedule} className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <input type="hidden" name="studentId" value={selectedStudent.id} />
                <label className="space-y-1 lg:col-span-2">
                  <span className="text-sm text-silver">Template</span>
                  <select
                    name="templateId"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  >
                    <option value="" disabled>Select a template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">Effective From</span>
                  <input
                    name="effectiveFrom"
                    type="date"
                    required
                    defaultValue={today}
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">Effective To (optional)</span>
                  <input
                    name="effectiveTo"
                    type="date"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  />
                </label>
                <label className="space-y-1 md:col-span-2 lg:col-span-3">
                  <span className="text-sm text-silver">Notes (optional)</span>
                  <input
                    name="notes"
                    maxLength={500}
                    placeholder="Example: temporary evening schedule through November"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                  />
                </label>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={templates.length === 0}
                    className="w-full rounded-lg bg-gold px-4 py-3 font-semibold text-black disabled:opacity-40"
                  >
                    Assign Template
                  </button>
                </div>
              </form>
              {templates.length === 0 && (
                <p className="mt-3 text-sm text-silver">Create a reusable template below first.</p>
              )}
            </section>

            <details className="rounded-xl border border-graphite bg-charcoal">
              <summary className="cursor-pointer p-4 text-lg font-semibold text-white sm:p-6">
                Create Custom / Temporary Schedule
              </summary>
              <form action={saveCustomStudentSchedule} className="space-y-5 px-4 pb-4 sm:px-6 sm:pb-6">
                <input type="hidden" name="studentId" value={selectedStudent.id} />
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-sm text-silver">Schedule Name</span>
                    <input
                      name="name"
                      maxLength={100}
                      defaultValue="Custom Schedule"
                      className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm text-silver">Effective From</span>
                    <input
                      name="effectiveFrom"
                      type="date"
                      required
                      defaultValue={today}
                      className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm text-silver">Effective To (optional)</span>
                    <input
                      name="effectiveTo"
                      type="date"
                      className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                    />
                  </label>
                </div>
                <WeeklyScheduleFields />
                <label className="block space-y-1">
                  <span className="text-sm text-silver">Notes (optional)</span>
                  <input
                    name="notes"
                    maxLength={500}
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                  />
                </label>
                <button type="submit" className="rounded-lg bg-gold px-5 py-3 font-semibold text-black">
                  Save Student Schedule
                </button>
              </form>
            </details>

            <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-white">One-Day Override</h2>
              <p className="mt-1 text-sm text-silver">
                Use for a day off, changed hours, or a makeup session without changing the student&apos;s recurring schedule.
              </p>
              <form action={saveScheduleOverride} className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <input type="hidden" name="studentId" value={selectedStudent.id} />
                <label className="space-y-1">
                  <span className="text-sm text-silver">Date</span>
                  <input
                    name="overrideDate"
                    type="date"
                    required
                    defaultValue={today}
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">Type</span>
                  <select
                    name="overrideType"
                    defaultValue="scheduled"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  >
                    <option value="scheduled">Changed Schedule</option>
                    <option value="off">Day Off</option>
                    <option value="makeup">Makeup / Extra Session</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">Start</span>
                  <input
                    name="startTime"
                    type="time"
                    defaultValue="08:30"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">End</span>
                  <input
                    name="endTime"
                    type="time"
                    defaultValue="16:00"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">Break (min)</span>
                  <input
                    name="breakMinutes"
                    type="number"
                    min="0"
                    max="480"
                    defaultValue="30"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                  />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-sm text-silver">Reason (optional)</span>
                  <input
                    name="reason"
                    maxLength={500}
                    placeholder="Example: makeup clinic day"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                  />
                </label>
                <div className="flex items-end">
                  <button type="submit" className="w-full rounded-lg bg-gold px-4 py-3 font-semibold text-black">
                    Save Override
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-white">{selectedStudent.full_name}&apos;s Schedule History</h2>
              <div className="mt-4 space-y-4">
                {profiles.map((profile) => {
                  const profileDays = days.filter((day) => day.schedule_profile_id === profile.id)
                  return (
                    <article key={profile.id} className="rounded-lg border border-graphite bg-black p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="font-semibold text-white">{profile.name}</div>
                          <div className="text-sm text-silver">
                            {profile.effective_from} → {profile.effective_to || 'ongoing'}
                            {profile.source_template_id ? ' · Template snapshot' : ' · Custom'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {profileDays
                          .filter((day) => day.is_scheduled)
                          .map((day) => (
                            <div key={day.day_of_week} className="rounded-md border border-graphite p-3 text-sm">
                              <div className="font-medium text-white">{dayNames[day.day_of_week]}</div>
                              <div className="text-silver">
                                {formatTime(day.start_time)}–{formatTime(day.end_time)}
                              </div>
                              {day.break_minutes > 0 && (
                                <div className="text-xs text-silver-gray">{day.break_minutes} min break</div>
                              )}
                            </div>
                          ))}
                      </div>
                      {profile.notes && <p className="mt-3 text-sm text-silver">{profile.notes}</p>}
                    </article>
                  )
                })}
                {profiles.length === 0 && (
                  <div className="rounded-lg border border-graphite bg-black p-5 text-silver">
                    No recurring schedule has been assigned yet.
                  </div>
                )}
              </div>

              <h3 className="mt-7 text-lg font-semibold text-white">Recent One-Day Overrides</h3>
              <div className="mt-3 space-y-2">
                {overrides.map((override) => (
                  <div key={override.id} className="rounded-lg border border-graphite bg-black p-4 text-sm">
                    <div className="font-medium text-white">
                      {override.override_date} · {override.override_type === 'off' ? 'Day Off' : override.override_type === 'makeup' ? 'Makeup / Extra Session' : 'Changed Schedule'}
                    </div>
                    {override.override_type !== 'off' && (
                      <div className="mt-1 text-silver">
                        {formatTime(override.start_time)}–{formatTime(override.end_time)} · {override.break_minutes} min break
                      </div>
                    )}
                    {override.reason && <div className="mt-1 text-silver-gray">{override.reason}</div>}
                  </div>
                ))}
                {overrides.length === 0 && <p className="text-sm text-silver">No one-day overrides recorded.</p>}
              </div>
            </section>
          </>
        )}

        <details className="rounded-xl border border-graphite bg-charcoal">
          <summary className="cursor-pointer p-4 text-lg font-semibold text-white sm:p-6">
            Manage Reusable Schedule Templates
          </summary>
          <div className="space-y-5 px-4 pb-4 sm:px-6 sm:pb-6">
            {templates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <span key={template.id} className="rounded-full border border-gold/30 px-3 py-1 text-sm text-gold">
                    {template.name}
                  </span>
                ))}
              </div>
            )}
            <form action={createScheduleTemplate} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm text-silver">Template Name</span>
                  <input
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Example: Full-Time"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-sm text-silver">Description (optional)</span>
                  <input
                    name="description"
                    maxLength={500}
                    placeholder="Example: Standard Monday–Thursday daytime schedule"
                    className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
                  />
                </label>
              </div>
              <WeeklyScheduleFields />
              <button type="submit" className="rounded-lg bg-gold px-5 py-3 font-semibold text-black">
                Create Template
              </button>
            </form>
          </div>
        </details>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-silver">
          Segment A only stores expected schedules. It does not create attendance records or student hours.
          That connection will be added in the next segment after this foundation is certified.
        </div>
      </div>
    </div>
  )
}
