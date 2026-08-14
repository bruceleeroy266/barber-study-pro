'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

export type DemoPerspective = 'student' | 'instructor'

interface DemoPresentationContextType {
  // Perspective
  perspective: DemoPerspective
  setPerspective: (p: DemoPerspective) => void
  
  // Presentation mode
  isPresentationMode: boolean
  setIsPresentationMode: (v: boolean) => void
  
  // Fullscreen
  isFullscreen: boolean
  setIsFullscreen: (v: boolean) => void
  toggleFullscreen: () => void
  
  // High contrast
  highContrast: boolean
  setHighContrast: (v: boolean) => void
  
  // Reset trigger
  resetTrigger: number
  triggerReset: () => void
  
  // Guided step (for presentation mode indicator)
  guidedStep: string
  setGuidedStep: (step: string) => void
}

// ───────────────────────────────────────────────
// Context
// ───────────────────────────────────────────────

const DemoPresentationContext = createContext<DemoPresentationContextType | null>(null)

// ───────────────────────────────────────────────
// Provider
// ───────────────────────────────────────────────

export function DemoPresentationProvider({ children }: { children: ReactNode }) {
  const [perspective, setPerspective] = useState<DemoPerspective>('student')
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [guidedStep, setGuidedStep] = useState('Dashboard')

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  const triggerReset = useCallback(() => {
    setResetTrigger((prev) => prev + 1)
    setGuidedStep('Dashboard')
  }, [])

  return (
    <DemoPresentationContext.Provider
      value={{
        perspective,
        setPerspective,
        isPresentationMode,
        setIsPresentationMode,
        isFullscreen,
        setIsFullscreen,
        toggleFullscreen,
        highContrast,
        setHighContrast,
        resetTrigger,
        triggerReset,
        guidedStep,
        setGuidedStep,
      }}
    >
      {children}
    </DemoPresentationContext.Provider>
  )
}

// ───────────────────────────────────────────────
// Hook
// ───────────────────────────────────────────────

export function useDemoPresentation() {
  const context = useContext(DemoPresentationContext)
  if (!context) {
    throw new Error('useDemoPresentation must be used within DemoPresentationProvider')
  }
  return context
}

// ───────────────────────────────────────────────
// Presentation Controls Component
// ───────────────────────────────────────────────

import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Contrast, RotateCcw, X, Users, GraduationCap } from 'lucide-react'
import Link from 'next/link'

interface PresentationControlsProps {
  // Current view info
  viewLabel: string
  
  // Navigation
  onBack?: () => void
  onNext?: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  
  // Perspective switching
  showPerspectiveSwitch?: boolean
  perspectiveSwitchLabel?: string
  perspectiveSwitchHref?: string
  
  // Reset
  onReset: () => void
  
  // Exit
  onExit: () => void
}

export function PresentationControls({
  viewLabel,
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  showPerspectiveSwitch = false,
  perspectiveSwitchLabel,
  perspectiveSwitchHref,
  onReset,
  onExit,
}: PresentationControlsProps) {
  const {
    perspective,
    isFullscreen,
    toggleFullscreen,
    highContrast,
    setHighContrast,
    guidedStep,
  } = useDemoPresentation()

  return (
    <div className="fixed bottom-20 right-4 z-[100] flex flex-col gap-2">
      {/* Guided Step Indicator (subtle) */}
      <div className="text-right text-xs text-white/40 px-2">
        {perspective === 'student' ? 'Student Experience' : 'Instructor Experience'} · {guidedStep}
      </div>
      
      {/* Main Controls */}
      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-xl p-3 shadow-2xl">
        {/* Back */}
        {onBack && (
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
            title="Previous (←)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* View Label */}
        <span className="text-white/50 text-sm px-2 min-w-[80px] text-center">
          {viewLabel}
        </span>
        
        {/* Next */}
        {onNext && (
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
            title="Next (→)"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        {/* Perspective Switch */}
        {showPerspectiveSwitch && perspectiveSwitchHref && (
          <>
            <Link
              href={perspectiveSwitchHref}
              className="flex items-center gap-2 px-3 py-2 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 rounded-lg transition-colors text-sm font-medium"
              title={perspectiveSwitchLabel}
            >
              {perspective === 'student' ? (
                <>
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Instructor</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Student</span>
                </>
              )}
            </Link>
            <div className="w-px h-6 bg-white/20 mx-1" />
          </>
        )}
        
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Toggle fullscreen (F)"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        
        {/* High Contrast */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`p-2 rounded-lg transition-colors ${
            highContrast 
              ? 'text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle high contrast (H)"
        >
          <Contrast className="w-5 h-5" />
        </button>
        
        {/* Reset */}
        <button
          onClick={onReset}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Reset demo (R)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <div className="w-px h-6 bg-white/20 mx-1" />
        
        {/* Exit */}
        <button
          onClick={onExit}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Exit presentation (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────
// Perspective Switch Button (for non-presentation mode)
// ───────────────────────────────────────────────

export function PerspectiveSwitchButton({ 
  href, 
  label 
}: { 
  href: string
  label: string 
}) {
  const { perspective } = useDemoPresentation()
  
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-silver hover:text-white hover:border-[var(--color-brand-gold)]/30 hover:bg-[var(--color-brand-gold)]/5 transition-all text-sm"
    >
      {perspective === 'student' ? (
        <>
          <Users className="w-4 h-4" />
          {label}
        </>
      ) : (
        <>
          <GraduationCap className="w-4 h-4" />
          {label}
        </>
      )}
    </Link>
  )
}
