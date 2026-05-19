'use client'

import { Lightbulb, Users, Award, Flag, Shield, Wrench, HeartPulse, ShieldCheck, Scale, Sparkles, Palette, MessageCircle, type LucideIcon } from 'lucide-react'
import type { InfoCardItem } from '@/lib/chapter-content'

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
}

export default function InfoCard({ cards }: InfoCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => {
        const Icon = getIcon(card.icon)
        return (
          <div
            key={idx}
            className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{card.text}</p>
          </div>
        )
      })}
    </div>
  )
}
