'use client'

import { useState, useEffect, useCallback } from 'react'
import { SchoolConfiguration, AcademicProgram } from '@/types'
import { Plus, Trash2, Edit2, Check, X, Loader2, AlertCircle } from 'lucide-react'
import {
  getPrograms,
  createProgram,
  updateProgram,
  deactivateProgram,
  ProgramListItem,
} from '@/app/admin/school/programs/actions'

interface Props {
  config: SchoolConfiguration
  onChange: (programs: AcademicProgram[]) => void
}

const PROGRAM_TEMPLATES = [
  { name: 'Barbering', requiredHours: 1500, requiredAssessments: 10, requiredPracticals: 20 },
  { name: 'Cosmetology', requiredHours: 1500, requiredAssessments: 12, requiredPracticals: 24 },
  { name: 'Esthetics', requiredHours: 600, requiredAssessments: 8, requiredPracticals: 16 },
  { name: 'Nail Technology', requiredHours: 600, requiredAssessments: 6, requiredPracticals: 12 },
  { name: 'Instructor Training', requiredHours: 1000, requiredAssessments: 5, requiredPracticals: 10 },
]

function mapDbToAcademicProgram(db: ProgramListItem): AcademicProgram {
  return {
    id: db.id,
    name: db.name,
    requiredHours: db.required_hours,
    requiredAssessments: db.required_assessments,
    requiredPracticals: db.required_practicals,
    active: db.is_active,
  }
}

export default function ProgramsSection({ config: _config, onChange }: Props) {
  // config.programs is intentionally NOT used as display source.
  // dbPrograms (loaded from server) is the single source of truth.
  const [dbPrograms, setDbPrograms] = useState<ProgramListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AcademicProgram>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newProgram, setNewProgram] = useState<Partial<AcademicProgram>>({
    name: '',
    requiredHours: 1500,
    requiredAssessments: 10,
    requiredPracticals: 20,
  })
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  // Load programs from database on mount
  const loadPrograms = useCallback(async () => {
    setIsLoading(true)
    setActionError(null)
    const result = await getPrograms()
    setIsLoading(false)
    if (result.success && result.data) {
      setDbPrograms(result.data)
      // Sync the parent config with DB-backed programs (single source of truth)
      const academicPrograms = result.data.map(mapDbToAcademicProgram)
      onChange(academicPrograms)
    } else if (result.error) {
      setActionError(result.error)
    }
  }, [onChange])

  useEffect(() => {
    loadPrograms()
  }, [loadPrograms])

  function handleEditProgram(program: AcademicProgram) {
    setEditingId(program.id)
    setEditForm(program)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  function applyTemplate(template: typeof PROGRAM_TEMPLATES[0]) {
    setNewProgram({
      name: template.name,
      requiredHours: template.requiredHours,
      requiredAssessments: template.requiredAssessments,
      requiredPracticals: template.requiredPracticals,
    })
  }

  // --------------------------------------------------------------------------
  // Database-backed actions
  // --------------------------------------------------------------------------

  async function handleDbCreate() {
    const name = newProgram.name?.trim()
    if (!name) return

    setPendingAction('create')
    setActionError(null)

    const result = await createProgram({
      name,
      required_hours: newProgram.requiredHours ?? 1500,
      required_assessments: newProgram.requiredAssessments ?? 10,
      required_practicals: newProgram.requiredPracticals ?? 20,
    })

    setPendingAction(null)

    if (result.success) {
      setNewProgram({ name: '', requiredHours: 1500, requiredAssessments: 10, requiredPracticals: 20 })
      setIsAdding(false)
      await loadPrograms()
    } else {
      setActionError(result.error ?? 'Failed to create program.')
    }
  }

  async function handleDbUpdate(programId: string) {
    if (!editForm.name?.trim()) return

    setPendingAction(`update-${programId}`)
    setActionError(null)

    const result = await updateProgram(programId, {
      name: editForm.name.trim(),
      required_hours: editForm.requiredHours,
      required_assessments: editForm.requiredAssessments,
      required_practicals: editForm.requiredPracticals,
    })

    setPendingAction(null)

    if (result.success) {
      setEditingId(null)
      setEditForm({})
      await loadPrograms()
    } else {
      setActionError(result.error ?? 'Failed to update program.')
    }
  }

  async function handleDbDeactivate(programId: string) {
    // Count only non-deleted DB programs for the minimum-one-program guard.
    const activeDbPrograms = dbPrograms.filter((p) => p.deleted_at === null)
    if (activeDbPrograms.length <= 1) {
      setActionError('At least one program is required.')
      return
    }

    setPendingAction(`deactivate-${programId}`)
    setActionError(null)

    const result = await deactivateProgram(programId)

    setPendingAction(null)

    if (result.success) {
      await loadPrograms()
    } else {
      setActionError(result.error ?? 'Failed to deactivate program.')
    }
  }

  // Single source of truth: always use DB-loaded programs.
  // If DB is still loading and empty, show nothing (loading state handles this).
  const displayPrograms = dbPrograms.map(mapDbToAcademicProgram)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Academic Programs</h2>
          <p className="text-sm text-silver">Programs offered by the school and their requirements</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {actionError}
        </div>
      )}

      {isLoading && dbPrograms.length === 0 && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-brand-gold)]" />
          <span className="ml-2 text-sm text-silver">Loading programs…</span>
        </div>
      )}

      {/* Add New Program Form */}
      {isAdding && (
        <div className="bg-black border border-[var(--color-brand-gold)]/30 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Add New Program</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-silver hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Templates */}
          <div>
            <p className="text-sm text-silver mb-2">Quick Templates:</p>
            <div className="flex flex-wrap gap-2">
              {PROGRAM_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => applyTemplate(template)}
                  className="px-3 py-1.5 rounded-lg text-sm bg-graphite text-light-gray hover:bg-[var(--color-border-secondary)] border border-[var(--color-border-secondary)] transition-colors"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-light-gray mb-1">
                Program Name <span className="text-silver">*</span>
              </label>
              <input
                type="text"
                value={newProgram.name || ''}
                onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                placeholder="e.g., Barbering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">
                Required Hours
              </label>
              <input
                type="number"
                min={0}
                value={newProgram.requiredHours || 0}
                onChange={(e) => setNewProgram({ ...newProgram, requiredHours: Number(e.target.value) })}
                className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">
                Required Assessments
              </label>
              <input
                type="number"
                min={0}
                value={newProgram.requiredAssessments || 0}
                onChange={(e) => setNewProgram({ ...newProgram, requiredAssessments: Number(e.target.value) })}
                className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-gray mb-1">
                Required Practicals
              </label>
              <input
                type="number"
                min={0}
                value={newProgram.requiredPracticals || 0}
                onChange={(e) => setNewProgram({ ...newProgram, requiredPracticals: Number(e.target.value) })}
                className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              disabled={pendingAction === 'create'}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border-secondary)] text-light-gray hover:bg-graphite disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDbCreate}
              disabled={!newProgram.name?.trim() || pendingAction === 'create'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pendingAction === 'create' && <Loader2 className="w-4 h-4 animate-spin" />}
              Add Program
            </button>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-3">
        {displayPrograms.map((program) => (
          <div
            key={program.id}
            className={`bg-black border rounded-lg p-4 transition-colors ${
              program.active ? 'border-graphite' : 'border-graphite opacity-60'
            }`}
          >
            {editingId === program.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-light-gray mb-1">
                      Program Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-gray mb-1">
                      Required Hours
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.requiredHours || 0}
                      onChange={(e) => setEditForm({ ...editForm, requiredHours: Number(e.target.value) })}
                      className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-gray mb-1">
                      Required Assessments
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.requiredAssessments || 0}
                      onChange={(e) => setEditForm({ ...editForm, requiredAssessments: Number(e.target.value) })}
                      className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-gray mb-1">
                      Required Practicals
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.requiredPracticals || 0}
                      onChange={(e) => setEditForm({ ...editForm, requiredPracticals: Number(e.target.value) })}
                      className="w-full bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={pendingAction === `update-${program.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-[var(--color-border-secondary)] text-light-gray hover:bg-graphite disabled:opacity-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDbUpdate(program.id)}
                    disabled={pendingAction === `update-${program.id}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {pendingAction === `update-${program.id}` && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium text-white">{program.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        program.active
                          ? 'bg-gold/10 text-gold border border-gold/20'
                          : 'bg-graphite text-silver border border-[var(--color-border-secondary)]'
                      }`}
                    >
                      {program.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-2 text-sm text-silver">
                    <span>{program.requiredHours} hours</span>
                    <span>{program.requiredAssessments} assessments</span>
                    <span>{program.requiredPracticals} practicals</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDbDeactivate(program.id)}
                    disabled={pendingAction === `deactivate-${program.id}`}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                      program.active
                        ? 'bg-warm-bronze/10 text-warm-bronze border border-warm-bronze/20 hover:bg-warm-bronze/20'
                        : 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20'
                    }`}
                  >
                    {program.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditProgram(program)}
                    className="p-2 rounded-lg text-silver hover:text-white hover:bg-graphite transition-colors"
                    title="Edit program"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDbDeactivate(program.id)}
                    disabled={pendingAction === `deactivate-${program.id}`}
                    className="p-2 rounded-lg text-silver hover:text-silver hover:bg-silver/10 transition-colors disabled:opacity-50"
                    title="Delete program"
                  >
                    {pendingAction === `deactivate-${program.id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {displayPrograms.length === 0 && !isLoading && (
        <div className="text-center py-8 bg-black border border-graphite rounded-lg">
          <p className="text-silver">No programs configured.</p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Program
          </button>
        </div>
      )}
    </div>
  )
}


