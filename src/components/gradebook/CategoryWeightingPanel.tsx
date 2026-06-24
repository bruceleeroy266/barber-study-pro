'use client'

import { GradeCategory } from '@/types'
import { validateWeights, getWeightDisplay } from '@/lib/gradebook'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface CategoryWeightingPanelProps {
  categories: GradeCategory[]
}

export default function CategoryWeightingPanel({ categories }: CategoryWeightingPanelProps) {
  const activeCategories = categories.filter((c) => c.isActive)
  const validation = validateWeights(activeCategories)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Category Weighting</h3>
        <div className="flex items-center gap-2 text-sm">
          {validation.valid ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Total {getWeightDisplay(validation.total)}</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">
                Total {getWeightDisplay(validation.total)} ({validation.difference} off)
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {activeCategories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-3"
          >
            <div>
              <div className="font-medium text-white">{category.name}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">{category.type}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-2 rounded-full"
                  style={{ width: `${category.weight * 100}%` }}
                />
              </div>
              <span className="text-white font-bold w-12 text-right">
                {getWeightDisplay(category.weight)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!validation.valid && (
        <p className="mt-4 text-xs text-yellow-400">
          Weights should sum to 100% for accurate overall grade calculations.
        </p>
      )}
    </div>
  )
}
