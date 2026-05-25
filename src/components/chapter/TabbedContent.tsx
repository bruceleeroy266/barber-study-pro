'use client'

import { useState } from 'react'
import type { TabContent, ChapterTheme } from '@/lib/chapter-content'
import { defaultTheme } from '@/lib/chapter-content'

interface TabbedContentProps {
  tabs: TabContent[]
  theme?: ChapterTheme
}

export default function TabbedContent({ tabs, theme }: TabbedContentProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '')
  const t = theme || defaultTheme
  const tt = t.tabbed || {}

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0]

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: tab.id === activeTab 
                ? ((tt && tt.activeBg) || 'rgba(212, 175, 55, 0.1)') 
                : ((tt && tt.inactiveBg) || t.backgroundAlt),
              color: tab.id === activeTab 
                ? ((tt && tt.activeText) || t.primary) 
                : ((tt && tt.inactiveText) || t.textMuted),
              borderColor: tab.id === activeTab 
                ? ((tt && tt.activeBorder) || t.primary) 
                : ((tt && tt.inactiveBorder) || t.border),
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab && (
        <div 
          className="rounded-xl p-6"
          style={{
            backgroundColor: (tt && tt.panelBg) || t.backgroundAlt,
            borderColor: (tt && tt.panelBorder) || t.border,
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          {currentTab.title && (
            <h3 className="text-lg font-semibold mb-4" style={{ color: t.text }}>{currentTab.title}</h3>
          )}

          {/* Bullets */}
          {currentTab.bullets && currentTab.bullets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {currentTab.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-3">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: t.primary }}
                  />
                  <div>
                    <span className="font-medium text-sm" style={{ color: t.text }}>{bullet.label}</span>
                    <p className="text-sm" style={{ color: t.textMuted }}>{bullet.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Facts */}
          {currentTab.facts && currentTab.facts.length > 0 && (
            <div 
              className="rounded-lg p-4 mt-4"
              style={{ backgroundColor: t.background }}
            >
              <div 
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: t.primary }}
              >
                Historical Facts
              </div>
              <ul className="space-y-2">
                {currentTab.facts.map((fact, idx) => (
                  <li key={idx} className="text-sm flex gap-2" style={{ color: t.textMuted }}>
                    <span style={{ color: t.primary }}>•</span>
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
                <div 
                  key={idx} 
                  className="rounded-lg p-4"
                  style={{ backgroundColor: t.background }}
                >
                  <div className="text-sm font-semibold mb-1" style={{ color: t.primary }}>{era.name}</div>
                  <p className="text-sm" style={{ color: t.textMuted }}>{era.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quote */}
          {currentTab.quote && (
            <blockquote 
              className="border-l-2 pl-4 mt-4"
              style={{ borderColor: t.primary }}
            >
              <p className="text-sm italic" style={{ color: t.textMuted }}>{currentTab.quote}</p>
            </blockquote>
          )}

          {/* Trends */}
          {currentTab.trends && currentTab.trends.length > 0 && (
            <div className="space-y-3">
              {currentTab.trends.map((trend, idx) => (
                <div 
                  key={idx} 
                  className="rounded-lg p-4"
                  style={{ backgroundColor: t.background }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: t.text }}>{trend.name}</span>
                    <span className="text-sm font-semibold" style={{ color: t.primary }}>{trend.percentage}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trend.eras.map((era, eidx) => (
                      <span
                        key={eidx}
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: t.backgroundAlt,
                          color: t.textMuted 
                        }}
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
