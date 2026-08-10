import { useState } from 'react'
import { SchoolConfiguration, AcademicProgram } from '@/types'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

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

export default function ProgramsSection({ config, onChange }: Props) {
  const { programs } = config
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AcademicProgram>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newProgram, setNewProgram] = useState<Partial<AcademicProgram>>({
    name: '',
    requiredHours: 1500,
    requiredAssessments: 10,
    requiredPracticals: 20,
  })

  function generateId() {
    return `program-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function handleAddProgram() {
    if (!newProgram.name?.trim()) return

    const program: AcademicProgram = {
      id: generateId(),
      name: newProgram.name.trim(),
      requiredHours: newProgram.requiredHours ?? 1500,
      requiredAssessments: newProgram.requiredAssessments ?? 10,
      requiredPracticals: newProgram.requiredPracticals ?? 20,
      active: true,
    }

    onChange([...programs, program])
    setNewProgram({ name: '', requiredHours: 1500, requiredAssessments: 10, requiredPracticals: 20 })
    setIsAdding(false)
  }

  function handleEditProgram(program: AcademicProgram) {
    setEditingId(program.id)
    setEditForm(program)
  }

  function handleSaveEdit() {
    if (!editingId || !editForm.name?.trim()) return

    onChange(
      programs.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: editForm.name!.trim(),
              requiredHours: editForm.requiredHours ?? p.requiredHours,
              requiredAssessments: editForm.requiredAssessments ?? p.requiredAssessments,
              requiredPracticals: editForm.requiredPracticals ?? p.requiredPracticals,
            }
          : p
      )
    )
    setEditingId(null)
    setEditForm({})
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  function handleDeleteProgram(id: string) {
    if (programs.length <= 1) {
      alert('At least one program is required.')
      return
    }
    onChange(programs.filter((p) => p.id !== id))
  }

  function toggleActive(id: string) {
    onChange(
      programs.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  function applyTemplate(template: typeof PROGRAM_TEMPLATES[0]) {
    setNewProgram({
      name: template.name,
      requiredHours: template.requiredHours,
      requiredAssessments: template.requiredAssessments,
      requiredPracticals: template.requiredPracticals,
    })
  }

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

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
              className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border-secondary)] text-light-gray hover:bg-graphite transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddProgram}
              disabled={!newProgram.name?.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Program
            </button>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-3">
        {programs.map((program) => (
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
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-[var(--color-border-secondary)] text-light-gray hover:bg-graphite transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] transition-colors"
                  >
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
                    onClick={() => toggleActive(program.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                    onClick={() => handleDeleteProgram(program.id)}
                    className="p-2 rounded-lg text-silver hover:text-silver hover:bg-silver/10 transition-colors"
                    title="Delete program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {programs.length === 0 && (
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
