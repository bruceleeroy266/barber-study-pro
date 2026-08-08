import { useState } from 'react'
import { SchoolConfiguration, GradebookConfig, GradeCategory, GradeCategoryType } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

interface Props {
  config: SchoolConfiguration
  onChange: (config: GradebookConfig) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

const GRADE_CATEGORY_TYPES: { value: GradeCategoryType; label: string }[] = [
  { value: 'WRITTEN_EXAM', label: 'Written Exam' },
  { value: 'PRACTICAL_EXAM', label: 'Practical Exam' },
  { value: 'QUIZ', label: 'Quiz' },
  { value: 'HOMEWORK', label: 'Homework' },
  { value: 'PARTICIPATION', label: 'Participation' },
  { value: 'ATTENDANCE', label: 'Attendance' },
]

export default function GradebookConfigSection({ config, onChange, errors }: Props) {
  const { gradebookConfig } = config
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<GradeCategory>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<GradeCategory>>({
    name: '',
    type: 'QUIZ',
    weight: 10,
  })

  function generateId() {
    return `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  function handleAddCategory() {
    if (!newCategory.name?.trim()) return

    const category: GradeCategory = {
      id: generateId(),
      name: newCategory.name.trim(),
      type: newCategory.type as GradeCategoryType,
      weight: newCategory.weight ?? 10,
      isActive: true,
    }

    onChange({
      ...gradebookConfig,
      categories: [...gradebookConfig.categories, category],
    })
    setNewCategory({ name: '', type: 'QUIZ', weight: 10 })
    setIsAdding(false)
  }

  function handleEditCategory(category: GradeCategory) {
    setEditingId(category.id)
    setEditForm(category)
  }

  function handleSaveEdit() {
    if (!editingId || !editForm.name?.trim()) return

    onChange({
      ...gradebookConfig,
      categories: gradebookConfig.categories.map((c) =>
        c.id === editingId
          ? {
              ...c,
              name: editForm.name!.trim(),
              type: editForm.type as GradeCategoryType,
              weight: editForm.weight ?? c.weight,
            }
          : c
      ),
    })
    setEditingId(null)
    setEditForm({})
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditForm({})
  }

  function handleDeleteCategory(id: string) {
    onChange({
      ...gradebookConfig,
      categories: gradebookConfig.categories.filter((c) => c.id !== id),
    })
  }

  function toggleActive(id: string) {
    onChange({
      ...gradebookConfig,
      categories: gradebookConfig.categories.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      ),
    })
  }

  const totalWeight = gradebookConfig.categories
    .filter((c) => c.isActive)
    .reduce((sum, c) => sum + c.weight, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Gradebook Configuration</h2>
        <p className="text-sm text-gray-400">Passing thresholds and grade categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="gradebook-passing" className="block text-sm font-medium text-gray-300 mb-2">
            Passing %
          </label>
          <input
            id="gradebook-passing"
            type="number"
            min={0}
            max={100}
            value={gradebookConfig.passingPercentage}
            onChange={(e) =>
              onChange({ ...gradebookConfig, passingPercentage: Number(e.target.value) })
            }
            aria-invalid={!!errors.gradebookPassing}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.gradebookPassing} />
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="grading-scale" className="block text-sm font-medium text-gray-300 mb-2">
            Grading Scale
          </label>
          <select
            id="grading-scale"
            value={gradebookConfig.gradingScale}
            onChange={(e) =>
              onChange({
                ...gradebookConfig,
                gradingScale: e.target.value as GradebookConfig['gradingScale'],
              })
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="percentage">Percentage</option>
            <option value="letter">Letter Grade</option>
          </select>
        </div>
      </div>

      {/* Grade Categories */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-300">Grade Categories</p>
            <p className="text-xs text-gray-500 mt-1">
              Total weight: {totalWeight}% {totalWeight !== 100 && totalWeight > 0 && '(should equal 100%)'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#D4AF37] text-gray-950 hover:bg-[#c4a030] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Add New Category Form */}
        {isAdding && (
          <div className="mb-4 p-4 bg-gray-900 border border-[#D4AF37]/30 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Add New Category</h4>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory.name || ''}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g., Chapter Quizzes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as GradeCategoryType })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  {GRADE_CATEGORY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newCategory.weight || 0}
                  onChange={(e) => setNewCategory({ ...newCategory, weight: Number(e.target.value) })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategory.name?.trim()}
                className="px-3 py-1.5 rounded-lg text-sm bg-[#D4AF37] text-gray-950 hover:bg-[#c4a030] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-2">
          {gradebookConfig.categories.map((category) => (
            <div
              key={category.id}
              className={`flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 ${
                !category.isActive ? 'opacity-60' : ''
              }`}
            >
              {editingId === category.id ? (
                /* Edit Mode */
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as GradeCategoryType })}
                    className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  >
                    {GRADE_CATEGORY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.weight || 0}
                    onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                    className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="p-1.5 rounded text-green-400 hover:bg-green-500/10"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="p-1.5 rounded text-gray-400 hover:bg-gray-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-white text-sm font-medium">{category.name}</p>
                      <span className="text-xs text-gray-500">
                        {GRADE_CATEGORY_TYPES.find((t) => t.value === category.type)?.label}
                      </span>
                      {!category.isActive && (
                        <span className="text-xs text-gray-600">(Inactive)</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Weight: {category.weight}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(category.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        category.isActive
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}
                    >
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditCategory(category)}
                      className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {gradebookConfig.categories.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No grade categories configured. Add categories to track different types of grades.
          </p>
        )}
      </div>
    </div>
  )
}
