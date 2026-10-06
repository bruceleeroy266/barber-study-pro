'use client'

import { useState } from 'react'
import { setStudentHourContract } from '@/app/instructor/hours/actions'

interface Props {
  studentId: string
  returnTo: '/instructor/hours' | '/school/hours'
  programRequiredHours: number
  priorCreditMinutes: number
  requirementOverrideMinutes: number | null
  contractVersion: number
}

function hoursFromMinutes(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100
}

export default function StudentHoursSetupForm({
  studentId,
  returnTo,
  programRequiredHours,
  priorCreditMinutes,
  requirementOverrideMinutes,
  contractVersion,
}: Props) {
  const [startingFromZero, setStartingFromZero] = useState(priorCreditMinutes === 0)
  const [useSpecialRequirement, setUseSpecialRequirement] = useState(
    requirementOverrideMinutes !== null,
  )

  return (
    <form action={setStudentHourContract} className="space-y-4">
      <input type="hidden" name="studentId" value={studentId} />
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="expectedVersion" value={contractVersion} />

      <fieldset className="rounded-lg border border-graphite bg-black p-4">
        <legend className="px-1 text-sm font-semibold text-white">Is this student starting from zero hours?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-graphite p-3 text-sm text-light-gray">
            <input
              type="radio"
              name="startingFromZero"
              value="yes"
              checked={startingFromZero}
              onChange={() => setStartingFromZero(true)}
            />
            Yes
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-graphite p-3 text-sm text-light-gray">
            <input
              type="radio"
              name="startingFromZero"
              value="no"
              checked={!startingFromZero}
              onChange={() => setStartingFromZero(false)}
            />
            No
          </label>
        </div>

        {!startingFromZero && (
          <label className="mt-4 block space-y-1">
            <span className="text-sm font-medium text-silver">Accepted prior / transfer hours</span>
            <input
              name="priorCreditHours"
              type="number"
              min="0"
              max="16666.66"
              step="0.01"
              required
              defaultValue={hoursFromMinutes(priorCreditMinutes)}
              className="w-full rounded-lg border border-graphite bg-charcoal px-3 py-3 text-white"
            />
            <span className="block text-xs text-silver-gray">
              Enter only hours the school officially accepts from prior training. These are kept separate from attendance and hours earned here.
            </span>
          </label>
        )}

        {startingFromZero && <input type="hidden" name="priorCreditHours" value="0" />}
      </fieldset>

      <fieldset className="rounded-lg border border-graphite bg-black p-4">
        <legend className="px-1 text-sm font-semibold text-white">Does this student have a special total-hour requirement?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-graphite p-3 text-sm text-light-gray">
            <input
              type="radio"
              name="useSpecialRequirement"
              value="no"
              checked={!useSpecialRequirement}
              onChange={() => setUseSpecialRequirement(false)}
            />
            No — use {programRequiredHours}h
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-graphite p-3 text-sm text-light-gray">
            <input
              type="radio"
              name="useSpecialRequirement"
              value="yes"
              checked={useSpecialRequirement}
              onChange={() => setUseSpecialRequirement(true)}
            />
            Yes
          </label>
        </div>

        {useSpecialRequirement && (
          <label className="mt-4 block space-y-1">
            <span className="text-sm font-medium text-silver">Student-specific total required hours</span>
            <input
              name="specialRequirementHours"
              type="number"
              min="0.01"
              max="16666.66"
              step="0.01"
              required
              defaultValue={
                requirementOverrideMinutes !== null
                  ? hoursFromMinutes(requirementOverrideMinutes)
                  : programRequiredHours
              }
              className="w-full rounded-lg border border-graphite bg-charcoal px-3 py-3 text-white"
            />
            <span className="block text-xs text-warm-bronze">
              This changes only this student&apos;s requirement. It does not change the school&apos;s program requirement.
            </span>
          </label>
        )}

        {!useSpecialRequirement && (
          <input type="hidden" name="specialRequirementHours" value={programRequiredHours} />
        )}
      </fieldset>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium text-silver">Reason / situation</span>
          <select
            name="changeType"
            defaultValue={
              requirementOverrideMinutes !== null
                ? 'redo_requirement'
                : priorCreditMinutes > 0
                  ? 'transfer_credit'
                  : 'other'
            }
            className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
          >
            <option value="transfer_credit">Transfer / prior training</option>
            <option value="returning_student">Returning student</option>
            <option value="redo_requirement">Redo / special requirement</option>
            <option value="correction">Correction</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-silver">Source / document reference (optional)</span>
          <input
            name="sourceReference"
            type="text"
            maxLength={500}
            placeholder="Transcript, school record, board document..."
            className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium text-silver">Why is this change being made?</span>
        <textarea
          name="reason"
          minLength={10}
          maxLength={1000}
          required
          rows={3}
          placeholder="Example: School accepted 600 transfer hours from the student's prior licensed program."
          className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
        />
        <span className="block text-xs text-silver-gray">
          This reason is stored in the permanent audit history.
        </span>
      </label>

      <button
        type="submit"
        className="w-full rounded-lg bg-[var(--color-brand-gold)] px-4 py-3 font-semibold text-black sm:w-auto"
      >
        Save Student Hours Setup
      </button>
    </form>
  )
}
