'use client'

import { Lightbulb, Users, Award, Wrench, HeartPulse, ShieldCheck, Scale, Sparkles, Palette, MessageCircle, type LucideIcon } from 'lucide-react'
import type { FeatureItem } from '@/lib/chapter-content'

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
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, idx) => {
        const Icon = getIcon(feature.icon)
        return (
          <div
            key={idx}
            className="bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        )
      })}
    </div>
  )
}
