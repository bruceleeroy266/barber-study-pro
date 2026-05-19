'use client'

import { Lightbulb, Users, Award, Flag, Shield, Wrench, HeartPulse, ShieldCheck, Scale, Sparkles, Palette, MessageCircle, type LucideIcon } from 'lucide-react'
import type { InfoCardItem, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

const iconMap: Record<string, LucideIcon> = {
  Lightbulb,
  Users,
  Award,
  Flag,
  Shield,
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

interface InfoCardProps {
  cards: InfoCardItem[]
  theme?: ChapterTheme
}

export default function InfoCard({ cards, theme }: InfoCardProps) {
  const t = theme || defaultTheme

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = getIcon(card.icon)
        return (
          <div
            key={idx}
            className="rounded-xl p-6 transition-colors"
            style={{
              backgroundColor: t.background,
              borderColor: t.border,
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(201, 168, 76, 0.15)' }}
            >
              <Icon className="w-5 h-5" style={{ color: t.primary }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: t.text }}>{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: t.textMuted }}>{card.text}</p>
          </div>
        )
      })}
    </div>
  )
}
