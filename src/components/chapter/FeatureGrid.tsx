'use client'

import { Lightbulb, Users, Award, Wrench, HeartPulse, ShieldCheck, Scale, Sparkles, Palette, MessageCircle, type LucideIcon } from 'lucide-react'
import type { FeatureItem, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Users,
  Award,
  Wrench,
  HeartPulse,
  ShieldCheck,
  Scale,
  Sparkles,
  Palette,
  MessageCircle,
}

function getIcon(name: string): LucideIcon {
  return iconMap[name] || Lightbulb
}

interface FeatureGridProps {
  features: FeatureItem[]
  theme?: ChapterTheme
}

export default function FeatureGrid({ features, theme }: FeatureGridProps) {
  const t = theme || defaultTheme
  const ft = t.featureGrid || {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, idx) => {
        const Icon = getIcon(feature.icon)
        return (
          <div
            key={idx}
            className="rounded-xl p-6 transition-colors"
            style={{
              backgroundColor: t.background,
              borderColor: (ft && ft.cardBorder) || t.border,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: (ft && ft.iconBg) || 'rgba(212, 175, 55, 0.1)' }}
            >
              <Icon className="w-5 h-5" style={{ color: (ft && ft.iconColor) || t.primary }} />
            </div>
            <h3 className="text-base font-semibold mb-2" style={{ color: t.text }}>{feature.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{feature.description}</p>
          </div>
        )
      })}
    </div>
  )
}
