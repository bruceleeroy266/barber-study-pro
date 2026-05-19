'use client'

import { useState } from 'react'
import type { TabContent } from '@/lib/chapter-content'

interface TabbedContentProps {
  tabs: TabContent[]
}

export default function TabbedContent({ tabs }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0]

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab.id === activeTab
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30'
                : 'bg-gray-900/60 text-gray-400 border border-gray-800/50 hover:text-white hover:border-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab && (
        <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-6">
          {currentTab.title && (
            <h3 className="text-lg font-semibold text-white mb-4">{currentTab.title}</h3>
          )}

          {/* Bullets */}
          {currentTab.bullets && currentTab.bullets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {currentTab.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium text-sm">{bullet.label}</span>
                    <p className="text-gray-400 text-sm">{bullet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Facts */}
          {currentTab.facts && currentTab.facts.length > 0 && (
            <div className="bg-gray-800/40 rounded-lg p-4 mt-4">
              <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide mb-2">
                Historical Facts
              </div>
              <ul className="space-y-2">
                {currentTab.facts.map((fact, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    {fact.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eras */}
          {currentTab.eras && currentTab.eras.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {currentTab.eras.map((era, idx) => (
                <div key={idx} className="bg-gray-800/40 rounded-lg p-4">
                  <div className="text-sm font-semibold text-[#D4AF37] mb-1">{era.name}</div>
                  <p className="text-gray-400 text-sm">{era.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quote */}
          {currentTab.quote && (
            <blockquote className="border-l-2 border-[#D4AF37] pl-4 mt-4">
              <p className="text-gray-300 text-sm italic">{currentTab.quote}</p>
            </blockquote>
          )}

          {/* Trends */}
          {currentTab.trends && currentTab.trends.length > 0 && (
            <div className="space-y-3">
              {currentTab.trends.map((trend, idx) => (
                <div key={idx} className="bg-gray-800/40 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{trend.name}</span>
                    <span className="text-[#D4AF37] text-sm font-semibold">{trend.percentage}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trend.eras.map((era, eidx) => (
                      <span
                        key={eidx}
                        className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
                      >
                        {era}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
