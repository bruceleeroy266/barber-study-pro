'use client'

import { useState } from 'react'
import { Check, Circle, Sparkles, ShieldCheck } from 'lucide-react'
import type { ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface ChecklistCategory {
  category: string
  icon: string
  items: {
    text: string
    isEssential: boolean
  }[]
}

interface AppearanceChecklistProps {
  title: string
  subtitle?: string
  categories: ChecklistCategory[]
  theme?: ChapterTheme
}

export default function AppearanceChecklist({ title, subtitle, categories, theme }: AppearanceChecklistProps) {
  const t = theme || defaultTheme
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleItem = (itemKey: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemKey)) {
        next.delete(itemKey)
      } else {
        next.add(itemKey)
      }
      return next
    })
  }

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0)
  const completedCount = checkedItems.size
  const progressPercent = Math.round((completedCount / totalItems) * 100)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${t.background}, ${t.backgroundAlt})`,
        borderColor: t.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: `0 8px 32px rgba(0,0,0,0.12)`,
      }}
    >
      {/* Header with Progress */}
      <div
        className="p-6"
        style={{
          background: `linear-gradient(135deg, ${t.primary}10, ${t.primary}03)`,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4" style={{ color: t.primary }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.primary }}>
            Professional Standards
          </span>
        </div>
        <h3 className="text-lg font-semibold" style={{ color: t.text }}>{title}</h3>
        {subtitle && <p className="text-sm mt-1" style={{ color: t.textMuted }}>{subtitle}</p>}

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span style={{ color: t.textMuted }}>Completion</span>
            <span style={{ color: t.primary }}>{completedCount}/{totalItems}</span>
          </div>
          <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: `${t.primary}15` }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${t.primary}, ${t.primaryLight})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-6 space-y-6">
        {categories.map((category, cIdx) => (
          <div key={cIdx}>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: t.primary }}>
              <Sparkles className="w-4 h-4" />
              {category.category}
            </h4>
            <div className="space-y-2">
              {category.items.map((item, iIdx) => {
                const itemKey = `${cIdx}-${iIdx}`
                const isChecked = checkedItems.has(itemKey)

                return (
                  <button
                    key={iIdx}
                    onClick={() => toggleItem(itemKey)}
                    className="w-full text-left rounded-lg p-3.5 transition-all duration-300 flex items-start gap-3 group"
                    style={{
                      backgroundColor: isChecked ? `${t.primary}08` : t.backgroundAlt,
                      borderColor: isChecked ? `${t.primary}40` : t.border,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                      style={{
                        backgroundColor: isChecked ? t.primary : 'transparent',
                        borderColor: isChecked ? t.primary : `${t.primary}40`,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                      }}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <span
                        className="text-sm transition-all"
                        style={{
                          color: isChecked ? t.text : t.textMuted,
                          textDecoration: isChecked ? 'line-through' : 'none',
                          textDecorationColor: `${t.primary}50`,
                        }}
                      >
                        {item.text}
                      </span>
                      {item.isEssential && (
                        <span
                          className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor: `${t.primary}15`,
                            color: t.primary,
                          }}
                        >
                          Essential
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {progressPercent === 100 && (
        <div
          className="p-4 text-center"
          style={{
            background: `linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))`,
            borderTop: `1px solid ${t.border}`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: '#10B981' }}>
            ✨ All standards met — You are client-ready
          </p>
        </div>
      )}
    </div>
  )
}
