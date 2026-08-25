/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  GraduationCap,
  Layers,
  Zap,
  Eye,
  Volume2,
  MapPin,
  AlertTriangle,
  Users,
  School,
  Award,
  Menu,
  X,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Presentation,
  Contrast,
  RotateCcw,
} from "lucide-react";
import { Logo } from "@/components/brand";

const navItems = [
  { label: "Welcome", href: "#welcome" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Chapter 10", href: "#chapter10" },
  { label: "Consultation", href: "#consultation" },
  { label: "Flashcards", href: "#flashcards" },
  { label: "Quiz", href: "#quiz" },
  { label: "Learn From Mistakes", href: "#mistakes" },
  { label: "Progress", href: "#progress" },
  { label: "Future Vision", href: "#future" },
];

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function DemoClient() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedConsultAnswer, setSelectedConsultAnswer] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Presentation Mode State
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    "#welcome",
    "#dashboard",
    "#chapter10",
    "#consultation",
    "#flashcards",
    "#quiz",
    "#mistakes",
    "#progress",
    "#future",
  ];

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const navigateSection = useCallback((direction: 'next' | 'prev') => {
    setCurrentSection((prev) => {
      const next = direction === 'next' 
        ? Math.min(prev + 1, sections.length - 1)
        : Math.max(prev - 1, 0);
      scrollToSection(sections[next]);
      return next;
    });
  }, [sections]);

  const resetDemo = useCallback(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSelectedConsultAnswer(null);
    setCurrentSection(0);
    scrollToSection("#welcome");
  }, []);

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPresentationMode) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          navigateSection('next');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateSection('prev');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'h':
        case 'H':
          e.preventDefault();
          setHighContrast((v) => !v);
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          resetDemo();
          break;
        case 'Escape':
          e.preventDefault();
          setIsPresentationMode(false);
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, navigateSection, toggleFullscreen, resetDemo]);

  // Listen for fullscreen changes
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const quizQuestion = {
    question:
      "Which type of alopecia is characterized by sudden patchy hair loss and is considered an autoimmune disorder?",
    options: [
      "Androgenic alopecia",
      "Alopecia areata",
      "Traction alopecia",
      "Postpartum alopecia",
    ],
    correct: 1,
    explanation:
      "Alopecia areata is an autoimmune disorder where the immune system attacks hair follicles, causing sudden patchy hair loss. It is one of the most frequently tested conditions on barber board exams.",
  };

  const flashcards = [
    {
      front: "What is the technical term for dandruff?",
      back: "Pityriasis capitis simplex — a non-inflammatory, non-contagious scaling of the scalp caused by excessive shedding of dead skin cells.",
    },
    {
      front: "What is the difference between lanugo, vellus, and terminal hair?",
      back: "Lanugo is fine fetal hair. Vellus is short, fine, unpigmented body hair. Terminal hair is coarse, pigmented hair found on the scalp, face, and body.",
    },
    {
      front: "What is tinea capitis and why is it critical for barbers to recognize?",
      back: "Tinea capitis is a contagious fungal infection of the scalp (ringworm). Barbers must recognize it to refuse service and prevent spreading it to other clients.",
    },
  ];

  const [flippedCards, setFlippedCards] = useState<boolean[]>(
    new Array(flashcards.length).fill(false)
  );

  const toggleCard = (idx: number) => {
    setFlippedCards((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <main className={`min-h-screen text-[var(--color-brand-deep-navy)] scroll-smooth ${
      highContrast ? 'bg-white text-black' : 'bg-[var(--color-brand-off-white)]'
    } ${isPresentationMode ? 'presentation-mode' : ''}`}>
      {/* ── PRESENTATION MODE CONTROLS ── */}
      {isPresentationMode && (
        <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 bg-black/80 backdrop-blur-md rounded-xl p-3 shadow-2xl">
          <button
            onClick={() => navigateSection('prev')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Previous section (←)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-white/50 text-sm px-2">
            {currentSection + 1} / {sections.length}
          </span>
          <button
            onClick={() => navigateSection('next')}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Next section (→)"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setHighContrast((v) => !v)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle high contrast (H)"
          >
            <Contrast className="w-5 h-5" />
          </button>
          <button
            onClick={resetDemo}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset demo (R)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-1" />
          <button
            onClick={() => setIsPresentationMode(false)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Exit presentation (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ── PRESENTATION MODE TOGGLE ── */}
      {!isPresentationMode && (
        <button
          onClick={() => setIsPresentationMode(true)}
          className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 bg-[var(--color-brand-gold)] text-white font-semibold rounded-xl shadow-lg hover:bg-[var(--color-brand-gold)] transition-colors"
          title="Enter presentation mode"
        >
          <Presentation className="w-5 h-5" />
          <span className="hidden sm:inline">Present</span>
        </button>
      )}

      {/* ── DEMO BANNER ── */}
      {!isPresentationMode && (
        <div className="bg-[var(--color-brand-gold)]/10 border-b border-[var(--color-brand-gold)]/20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] text-xs font-bold rounded">PRESENTATION DEMO</span>
              <span className="text-[var(--color-brand-silver-gray)] text-sm">Sample student data. No real student records.</span>
            </div>
            <Link href="/demo" className="text-[var(--color-brand-gold)] text-sm font-medium hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Back to Demo Selection
            </Link>
          </div>
        </div>
      )}

      {/* ── STICKY NAVIGATION ── */}
      {!isPresentationMode && (
        <nav className="sticky top-0 z-50 bg-[var(--color-brand-off-white)]/95 backdrop-blur-md border-b border-[var(--color-brand-deep-navy)]/8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo variant="compact" size="md" className="lg:hidden" />
              <Logo variant="full" size="3xl" className="hidden lg:block" />
              <span className="font-semibold tracking-tight text-sm text-[var(--color-brand-deep-navy)] lg:hidden">
                ASCYN PRO
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="px-3 py-1.5 text-xs text-[var(--color-brand-silver-gray)] hover:text-[var(--color-brand-gold)] transition-colors rounded-md hover:bg-[var(--color-brand-deep-navy)]/5"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/demo"
                className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Demo Home
              </Link>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                className="lg:hidden p-2 rounded-md hover:bg-[var(--color-brand-deep-navy)]/5"
                aria-label="Toggle menu"
              >
                {mobileNavOpen ? (
                  <X className="w-5 h-5 text-[var(--color-brand-silver-gray)]" />
                ) : (
                  <Menu className="w-5 h-5 text-[var(--color-brand-silver-gray)]" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile nav dropdown */}
          {mobileNavOpen && (
            <div className="lg:hidden border-t border-[var(--color-brand-deep-navy)]/8 bg-[var(--color-brand-off-white)]/95 backdrop-blur-md px-4 pb-4">
              <div className="flex flex-col gap-1 pt-2">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      scrollToSection(item.href);
                      setMobileNavOpen(false);
                    }}
                    className="text-left px-3 py-2.5 text-sm text-[var(--color-brand-silver-gray)] hover:text-[var(--color-brand-gold)] transition-colors rounded-md hover:bg-[var(--color-brand-deep-navy)]/5"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 0 — WELCOME / THE PROBLEM          */}
      {/* ═══════════════════════════════════════════ */}
      <section
        id="welcome"
        className="min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-20"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/8 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Board-Aligned Curriculum
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[var(--color-brand-deep-navy)] leading-tight">
            Helping Licensing Students
            <br />
            <span className="text-[var(--color-brand-gold)]">Become Board Ready</span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-[var(--color-brand-graphite)] text-base sm:text-lg leading-relaxed">
              Students read the textbook. Then they forget 70% of it within 24 hours.
            </p>
            <p className="text-[var(--color-brand-silver-gray)] leading-relaxed text-sm sm:text-base">
              Schools lose students who fail the board exam. Instructors spend hours creating quizzes and grading papers. Students have no visibility into what they actually know.
            </p>
            <p className="text-[var(--color-brand-graphite)] leading-relaxed text-sm sm:text-base">
              ASCYN PRO changes that. Students learn, reinforce, test, and improve—with every step measured and every gap identified.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-[var(--color-brand-silver-gray)] pt-4">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--color-brand-gold)]" />
              Structured Lessons
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--color-brand-gold)]" />
              Active Recall
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[var(--color-brand-gold)]" />
              Board-Style Quizzes
            </span>
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-brand-gold)]" />
              Measurable Progress
            </span>
          </div>

          <button
            onClick={() => scrollToSection("#dashboard")}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--color-brand-gold)] text-white font-semibold rounded-lg hover:bg-[var(--color-brand-gold)] transition-colors text-sm sm:text-base"
          >
            See How It Works
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1 — STUDENT DASHBOARD              */}
      {/* ═══════════════════════════════════════════ */}
      <section id="dashboard" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 1
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Student Dashboard
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-2xl mx-auto text-sm sm:text-base">
              Every student sees exactly where they stand — and what to study next.
              No guessing. No surprises. Just measurable readiness.
            </p>
          </div>

          {/* ── ROW 1: Board Readiness + Chapter Progress + Study Consistency ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Board Readiness Score */}
            <div className="lg:col-span-1 bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-brand-silver-gray)] text-xs uppercase tracking-wider mb-4">
                  <Brain className="w-4 h-4 text-[var(--color-brand-gold)]" />
                  Board Readiness Score
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-[var(--color-brand-gold)]">78%</div>
                <div className="text-sm font-medium text-[var(--color-brand-gold)] mt-1">
                  Approaching Readiness
                </div>
              </div>
              <p className="text-xs text-[var(--color-brand-silver-gray)] mt-4 leading-relaxed">
                Weighted by chapter progress, quiz performance, and weak-area
                recovery. Not just quiz accuracy — readiness for the actual board exam.
              </p>
            </div>

            {/* Card 2: Chapter Progress */}
            <div className="lg:col-span-1 bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--color-brand-silver-gray)] text-xs uppercase tracking-wider mb-4">
                <BookOpen className="w-4 h-4 text-[var(--color-brand-gold)]" />
                Chapter Progress
              </div>
              <div className="text-4xl font-bold text-[var(--color-brand-deep-navy)]">13</div>
              <div className="text-sm text-[var(--color-brand-silver-gray)]">
                of <span className="text-[var(--color-brand-deep-navy)] font-medium">23</span> chapters
                complete
              </div>
              <div className="mt-4">
                <div className="w-full bg-[var(--color-brand-light-gray)] rounded-full h-2.5">
                  <div
                    className="bg-[var(--color-brand-gold)] h-2.5 rounded-full"
                    style={{ width: "56.5%" }}
                  />
                </div>
                <p className="text-xs text-[var(--color-brand-silver-gray)] mt-2">
                  Structured curriculum aligned with standard barber textbooks
                </p>
              </div>
            </div>

            {/* Card 3: Study Consistency */}
            <div className="lg:col-span-1 bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--color-brand-silver-gray)] text-xs uppercase tracking-wider mb-4">
                <TrendingUp className="w-4 h-4 text-[var(--color-brand-gold)]" />
                Study Consistency
              </div>
              <div className="text-4xl font-bold text-[var(--color-brand-deep-navy)]">12</div>
              <div className="text-sm text-[var(--color-brand-silver-gray)]">
                consecutive study days
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[var(--color-brand-graphite)]">
                  <Clock className="w-4 h-4 text-[var(--color-brand-silver-gray)]" />
                  <span>4.5 hours this week</span>
                </div>
                <p className="text-xs text-[var(--color-brand-silver-gray)]">
                  Consistent study predicts higher board pass rates than cramming.
                </p>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Focus Areas + Recommended Next Step ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Card 4: Focus Areas */}
            <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--color-brand-silver-gray)] text-xs uppercase tracking-wider mb-4">
                <Target className="w-4 h-4 text-[var(--color-brand-silver)]" />
                Focus Areas
              </div>
              <p className="text-xs text-[var(--color-brand-silver-gray)] mb-4">
                Specific topics this student needs to review before the board exam
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--color-brand-graphite)]">Hair &amp; Scalp Disorders</span>
                    <span className="text-[var(--color-brand-silver)] font-medium">62%</span>
                  </div>
                  <div className="w-full bg-[var(--color-brand-light-gray)] rounded-full h-2">
                    <div
                      className="bg-[var(--color-brand-silver)] h-2 rounded-full"
                      style={{ width: "62%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--color-brand-graphite)]">Alopecia</span>
                    <span className="text-[var(--color-brand-gold)] font-medium">68%</span>
                  </div>
                  <div className="w-full bg-[var(--color-brand-light-gray)] rounded-full h-2">
                    <div
                      className="bg-[var(--color-brand-gold)] h-2 rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--color-brand-graphite)]">Hair Growth Cycles</span>
                    <span className="text-[var(--color-brand-gold)] font-medium">71%</span>
                  </div>
                  <div className="w-full bg-[var(--color-brand-light-gray)] rounded-full h-2">
                    <div
                      className="bg-[var(--color-brand-gold)] h-2 rounded-full"
                      style={{ width: "71%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Recommended Next Step */}
            <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[var(--color-brand-silver-gray)] text-xs uppercase tracking-wider mb-4">
                <ChevronRight className="w-4 h-4 text-[var(--color-brand-gold)]" />
                Recommended Next Step
              </div>
              <div className="mb-4">
                <div className="text-base sm:text-lg font-semibold text-[var(--color-brand-deep-navy)]">
                  Chapter 10 — Hair &amp; Scalp Disorders
                </div>
                <p className="text-sm text-[var(--color-brand-silver-gray)] mt-1">
                  High board-exam weight. Covers contagious conditions,
                  contraindications, and consultation protocols.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--color-brand-graphite)] mb-4">
                <span className="text-[var(--color-brand-gold)]">Review flashcards</span>
                <span className="text-[var(--color-brand-silver-gray)]">→</span>
                <span className="text-[var(--color-brand-gold)]">Take quiz</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--color-brand-silver-gray)]">
                <Clock className="w-3.5 h-3.5" />
                Estimated time: 25 minutes
              </div>
            </div>
          </div>

          {/* Stakeholder value row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[var(--color-brand-gold)] text-xs uppercase tracking-wider mb-2">
                <School className="w-4 h-4" />
                For School Owners
              </div>
              <p className="text-sm text-[var(--color-brand-silver-gray)]">
                See which students are at risk of failing before they sit for the exam. Retain more students.
              </p>
            </div>
            <div className="bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[var(--color-brand-gold)] text-xs uppercase tracking-wider mb-2">
                <Users className="w-4 h-4" />
                For Instructors
              </div>
              <p className="text-sm text-[var(--color-brand-silver-gray)]">
                Know exactly who needs help with what topic — without creating quizzes or grading papers.
              </p>
            </div>
            <div className="bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-lg p-4">
              <div className="flex items-center gap-2 text-[var(--color-brand-gold)] text-xs uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                For Students
              </div>
              <p className="text-sm text-[var(--color-brand-silver-gray)]">
                Walk into the board exam knowing exactly what you know — and what you've already mastered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 2 — CHAPTER 10 LESSON              */}
      {/* ═══════════════════════════════════════════ */}
      <section id="chapter10" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Interactive Lesson
            </h2>
            <p className="text-lg sm:text-xl text-[var(--color-brand-graphite)]">
              Chapter 10 — Properties and Disorders of the Hair and Scalp
            </p>
          </div>

          {/* Problem statement */}
          <div className="bg-[var(--color-brand-silver)]/6 border border-[var(--color-brand-silver)]/15 rounded-xl p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-brand-silver)] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  The Problem: Passive Reading Does Not Retain
                </h3>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  Students read the textbook and forget 70% within 24 hours. Highlighting and re-reading create familiarity, not memory.
                  When the board exam asks about contagious scalp conditions, students who only read cannot reliably recall what they need to know.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-brand-deep-navy)] mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--color-brand-gold)]" />
                Why This Chapter Matters
              </h3>
              <ul className="space-y-3 text-[var(--color-brand-silver-gray)] text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--color-brand-gold)] mt-0.5 shrink-0" />
                  One of the most heavily weighted chapters on state board exams
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--color-brand-gold)] mt-0.5 shrink-0" />
                  Directly impacts client safety and barber liability
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--color-brand-gold)] mt-0.5 shrink-0" />
                  Required knowledge for recognizing contraindications
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--color-brand-gold)] mt-0.5 shrink-0" />
                  Essential for passing the written and practical examinations
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-brand-deep-navy)] mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--color-brand-gold)]" />
                Why Barber Safety Depends on It
              </h3>
              <p className="text-[var(--color-brand-silver-gray)] text-sm leading-relaxed mb-4">
                Barbers must recognize contagious conditions, allergic reactions,
                and scalp disorders before providing service. Failure to do so
                can spread infection, harm clients, and result in disciplinary
                action or loss of license.
              </p>
              <div className="bg-[var(--color-brand-off-white)] rounded-lg p-4 border border-[var(--color-brand-deep-navy)]/8">
                <p className="text-xs text-[var(--color-brand-silver-gray)] uppercase tracking-wider mb-2">
                  Key Competency
                </p>
                <p className="text-sm text-[var(--color-brand-graphite)]">
                  &ldquo;The barber must be able to identify conditions that
                  require referral to a medical professional and those that
                  contraindicate barbering services.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Representative Lesson Content */}
          <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-4">
              <BookOpen className="w-4 h-4" />
              Lesson Content Preview
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-brand-deep-navy)] mb-4">
              Understanding Hair Loss: Types of Alopecia
            </h3>

            <div className="space-y-6">
              <div className="border-l-2 border-[var(--color-brand-gold)] pl-4">
                <h4 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  Androgenic Alopecia
                </h4>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  The most common form of hair loss, caused by genetics and
                  hormones (DHT). Affects both men and women. In men, it
                  typically presents as a receding hairline and crown thinning.
                  In women, it causes diffuse thinning over the crown.
                </p>
              </div>

              <div className="border-l-2 border-[var(--color-brand-gold)] pl-4">
                <h4 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  Alopecia Areata
                </h4>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  An autoimmune disorder causing sudden patchy hair loss. The
                  immune system attacks hair follicles. Can progress to total
                  scalp hair loss (alopecia totalis) or complete body hair loss
                  (alopecia universalis). Critical for barbers to recognize and
                  refer.
                </p>
              </div>

              <div className="border-l-2 border-[var(--color-brand-gold)] pl-4">
                <h4 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  Traction Alopecia
                </h4>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  Hair loss caused by prolonged tension on the hair shaft from
                  tight hairstyles, braids, or extensions. Early detection allows
                  the barber to advise the client to change styling practices
                  before permanent follicle damage occurs.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--color-brand-deep-navy)]/8">
              <p className="text-xs text-[var(--color-brand-silver-gray)]">
                This is representative content from Chapter 10. The full chapter
                covers hair structure, growth cycles, disorders, infections, and
                treatment protocols — all aligned with standard barber curriculum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 3 — CLIENT CONSULTATION CHALLENGE  */}
      {/* ═══════════════════════════════════════════ */}
      <section id="consultation" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/8 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Professional Decision Making
            </div>
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 3
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Client Consultation Challenge
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-2xl mx-auto text-sm sm:text-base">
              Can this student apply what they learned in a real barber situation?
            </p>
          </div>

          {/* Scenario Card */}
          <div className="bg-white border border-[var(--color-brand-gold)]/30 rounded-xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-4">
              <AlertTriangle className="w-4 h-4" />
              Scenario
            </div>
            <p className="text-[var(--color-brand-deep-navy)] text-base sm:text-lg leading-relaxed mb-4">
              A client sits in your chair with <span className="text-[var(--color-brand-gold)] font-medium">circular patches of hair loss</span> on the scalp.
            </p>
            <div className="bg-[var(--color-brand-off-white)] rounded-lg p-4 border border-[var(--color-brand-deep-navy)]/8">
              <p className="text-[var(--color-brand-graphite)] italic text-sm sm:text-base">
                &ldquo;Can we continue with today&apos;s service?&rdquo;
              </p>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-[var(--color-brand-deep-navy)] font-medium text-base sm:text-lg mb-4">
              What is the MOST professional response?
            </p>

            <div className="space-y-3">
              {[
                {
                  letter: "A",
                  text: "Continue the service as normal.",
                  wrong: "Barbers must prioritize client safety. Continuing without assessment could spread a contagious condition or worsen an underlying medical issue.",
                },
                {
                  letter: "B",
                  text: "Diagnose the condition as alopecia areata.",
                  wrong: "Barbers are not licensed to diagnose medical conditions. Making a diagnosis exceeds the scope of practice and could create liability.",
                },
                {
                  letter: "C",
                  text: "Recognize the concern and recommend medical evaluation.",
                  correct: true,
                  explanation: "This is the correct professional response. Barbers should recognize potential disorders, pause service when appropriate, and refer clients to medical professionals for diagnosis and treatment.",
                },
                {
                  letter: "D",
                  text: "Apply a scalp treatment before proceeding.",
                  wrong: "Applying treatment without knowing the underlying condition could mask symptoms, cause adverse reactions, or delay proper medical care.",
                },
              ].map((option, idx) => {
                const isSelected = selectedConsultAnswer === idx;
                const isCorrect = option.correct;
                const showResult = selectedConsultAnswer !== null;

                let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 ";
                if (!showResult) {
                  btnClass += "bg-white border-[var(--color-brand-deep-navy)]/10 text-[var(--color-brand-graphite)] hover:border-[var(--color-brand-gold)]/50 hover:bg-[var(--color-brand-off-white)] cursor-pointer";
                } else if (isCorrect) {
                  btnClass += "bg-[var(--color-brand-gold)]/8 border-[var(--color-brand-gold)]/40 text-[var(--color-brand-gold)]";
                } else if (isSelected) {
                  btnClass += "bg-[var(--color-brand-silver)]/8 border-[var(--color-brand-silver)]/40 text-[var(--color-brand-silver)]";
                } else {
                  btnClass += "bg-white border-[var(--color-brand-deep-navy)]/10 text-[var(--color-brand-silver-gray)]";
                }

                return (
                  <div key={idx}>
                    <button
                      onClick={() => {
                        if (selectedConsultAnswer === null) {
                          setSelectedConsultAnswer(idx);
                        }
                      }}
                      disabled={showResult}
                      className={btnClass}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 mt-0.5 ${
                          showResult && isCorrect
                            ? "bg-[var(--color-brand-gold)]/15 text-[var(--color-brand-gold)]"
                            : showResult && isSelected && !isCorrect
                            ? "bg-[var(--color-brand-silver)]/15 text-[var(--color-brand-silver)]"
                            : "bg-[var(--color-brand-off-white)] text-[var(--color-brand-silver-gray)]"
                        }`}>
                          {option.letter}
                        </span>
                        <span className="pt-0.5">{option.text}</span>
                        {showResult && isCorrect && (
                          <CheckCircle className="w-5 h-5 ml-auto shrink-0 mt-0.5" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 ml-auto shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>

                    {/* Explanation for this option */}
                    {showResult && (isCorrect || isSelected) && (
                      <div className={`mt-2 p-4 rounded-lg border ${
                        isCorrect
                          ? "bg-[var(--color-brand-gold)]/5 border-[var(--color-brand-gold)]/20"
                          : "bg-[var(--color-brand-silver)]/5 border-[var(--color-brand-silver)]/20"
                      }`}>
                        {isCorrect ? (
                          <>
                            <p className="text-[var(--color-brand-gold)] font-medium text-sm mb-1">
                              Correct Answer
                            </p>
                            <p className="text-[var(--color-brand-graphite)] text-sm leading-relaxed">
                              {option.explanation}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-[var(--color-brand-silver)] font-medium text-sm mb-1">
                              Why this is incorrect
                            </p>
                            <p className="text-[var(--color-brand-silver-gray)] text-sm leading-relaxed">
                              {option.wrong}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Takeaways */}
          {selectedConsultAnswer !== null && (
            <div className="mt-8 bg-[var(--color-brand-gold)]/5 border border-[var(--color-brand-gold)]/20 rounded-xl p-5 sm:p-6">
              <h4 className="text-sm font-semibold text-[var(--color-brand-gold)] mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Key Takeaways
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: "Recognition", desc: "Identify abnormal conditions" },
                  { label: "Safety", desc: "Protect the client first" },
                  { label: "Referral", desc: "Know when to recommend medical evaluation" },
                  { label: "Professional Judgment", desc: "Stay within scope of practice" },
                  { label: "Board Readiness", desc: "Apply knowledge under pressure" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-lg p-3 border border-[var(--color-brand-deep-navy)]/8"
                  >
                    <p className="text-[var(--color-brand-deep-navy)] text-sm font-medium">{item.label}</p>
                    <p className="text-[var(--color-brand-silver-gray)] text-xs mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 4 — FLASHCARDS                     */}
      {/* ═══════════════════════════════════════════ */}
      <section id="flashcards" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 4
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Knowledge Reinforcement
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-2xl mx-auto text-sm sm:text-base">
              Students use active recall to strengthen memory retention and
              reinforce board-tested concepts.
            </p>
          </div>

          {/* Problem statement */}
          <div className="bg-[var(--color-brand-silver)]/6 border border-[var(--color-brand-silver)]/15 rounded-xl p-4 sm:p-6 mb-8 sm:mb-10 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-brand-silver)] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  The Problem: Re-Reading Creates False Confidence
                </h3>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  Students highlight, re-read, and think they know the material. But recognition is not recall.
                  When the exam asks them to produce the answer from memory, they draw a blank. Active recall — forcing the brain to retrieve information — is the only proven method for building durable memory.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {flashcards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => toggleCard(idx)}
                className="cursor-pointer group"
              >
                <div
                  className={`bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 min-h-[180px] sm:min-h-[200px] flex flex-col justify-center transition-all duration-300 hover:border-[var(--color-brand-gold)]/30 shadow-sm ${
                    flippedCards[idx] ? "border-[var(--color-brand-gold)]/50" : ""
                  }`}
                >
                  {!flippedCards[idx] ? (
                    <>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-4">
                        <Layers className="w-4 h-4" />
                        Flashcard {idx + 1}
                      </div>
                      <p className="text-[var(--color-brand-deep-navy)] font-medium text-base sm:text-lg leading-relaxed">
                        {card.front}
                      </p>
                      <p className="text-xs text-[var(--color-brand-silver-gray)] mt-4">
                        Tap to reveal answer
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-4">
                        <CheckCircle className="w-4 h-4" />
                        Answer
                      </div>
                      <p className="text-[var(--color-brand-graphite)] text-sm leading-relaxed">
                        {card.back}
                      </p>
                      <p className="text-xs text-[var(--color-brand-silver-gray)] mt-4">
                        Tap to flip back
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 text-center max-w-2xl mx-auto">
            <p className="text-[var(--color-brand-silver-gray)] text-sm">
              Each chapter includes 80–120 flashcards covering key terms, board exam alerts,
              common confusions, and practical application scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 4 — QUIZ                           */}
      {/* ═══════════════════════════════════════════ */}
      <section id="quiz" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 5
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Board Style Assessment
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-2xl mx-auto text-sm sm:text-base">
              Students test understanding using randomized board-style questions.
            </p>
          </div>

          {/* Problem statement */}
          <div className="bg-[var(--color-brand-silver)]/6 border border-[var(--color-brand-silver)]/15 rounded-xl p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-brand-silver)] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  The Problem: Unfamiliar Question Formats Cause Panic
                </h3>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  Students who have never seen board-style questions panic on exam day. The wording is different. The distractors are tricky.
                  Without practice, even students who know the material second-guess themselves and lose points.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-silver-gray)] mb-6">
              <Zap className="w-4 h-4" />
              Chapter 10 — Sample Question
            </div>

            <p className="text-base sm:text-lg text-[var(--color-brand-deep-navy)] font-medium mb-6 sm:mb-8 leading-relaxed">
              {quizQuestion.question}
            </p>

            <div className="space-y-3">
              {quizQuestion.options.map((option, idx) => {
                let btnClass =
                  "w-full text-left p-4 rounded-lg border transition-all duration-200 ";
                if (selectedAnswer === null) {
                  btnClass +=
                    "bg-[var(--color-brand-off-white)] border-[var(--color-brand-deep-navy)]/8 text-[var(--color-brand-graphite)] hover:border-[var(--color-brand-gold)]/50 hover:bg-[var(--color-brand-off-white)]";
                } else if (idx === quizQuestion.correct) {
                  btnClass +=
                    "bg-[var(--color-brand-gold)]/8 border-[var(--color-brand-gold)]/40 text-[var(--color-brand-gold)]";
                } else if (idx === selectedAnswer) {
                  btnClass +=
                    "bg-[var(--color-brand-silver)]/8 border-[var(--color-brand-silver)]/40 text-[var(--color-brand-silver)]";
                } else {
                  btnClass +=
                    "bg-[var(--color-brand-off-white)] border-[var(--color-brand-deep-navy)]/8 text-[var(--color-brand-silver-gray)]";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      setShowExplanation(true);
                    }}
                    disabled={selectedAnswer !== null}
                    className={btnClass}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--color-brand-deep-navy)]/5 flex items-center justify-center text-sm font-medium shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="pt-0.5">{option}</span>
                      {selectedAnswer !== null &&
                        idx === quizQuestion.correct && (
                          <CheckCircle className="w-5 h-5 ml-auto shrink-0 mt-0.5" />
                        )}
                      {selectedAnswer === idx &&
                        idx !== quizQuestion.correct && (
                          <XCircle className="w-5 h-5 ml-auto shrink-0 mt-0.5" />
                        )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-[var(--color-brand-off-white)] rounded-lg border border-[var(--color-brand-deep-navy)]/8">
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  <span className="text-[var(--color-brand-gold)] font-medium">
                    Explanation:
                  </span>{" "}
                  {quizQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[var(--color-brand-silver-gray)] text-sm">
              Each chapter includes 50–70 quiz questions across easy, medium, and hard difficulty levels.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 5 — LEARN FROM MISTAKES            */}
      {/* ═══════════════════════════════════════════ */}
      <section id="mistakes" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 6
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Learn From Mistakes
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-2xl mx-auto text-base sm:text-lg">
              Students do not simply receive a score. Every mistake becomes a
              learning opportunity.
            </p>
          </div>

          {/* Problem statement */}
          <div className="bg-[var(--color-brand-silver)]/6 border border-[var(--color-brand-silver)]/15 rounded-xl p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-brand-silver)] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  The Problem: Wrong Answers Teach Nothing Without Explanation
                </h3>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  A student misses a question and sees only "Incorrect." They remember they got it wrong, but not why.
                  The misconception remains. On the board exam, they make the same mistake again — because they were never taught the correct reasoning.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl overflow-hidden shadow-sm">
            {/* Incorrect Answer Header */}
            <div className="bg-[var(--color-brand-silver)]/6 border-b border-[var(--color-brand-silver)]/15 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-6 h-6 text-[var(--color-brand-silver)]" />
                <span className="text-[var(--color-brand-silver)] font-semibold text-sm sm:text-base">
                  Incorrect Answer Selected
                </span>
              </div>
              <p className="text-[var(--color-brand-deep-navy)] text-base sm:text-lg">
                &ldquo;Androgenic alopecia&rdquo;
              </p>
              <p className="text-[var(--color-brand-silver-gray)] text-sm mt-1">
                You selected: A — Androgenic alopecia
              </p>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Explanation */}
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[var(--color-brand-gold)]" />
                  Why This Is Wrong
                </h4>
                <p className="text-[var(--color-brand-silver-gray)] text-sm leading-relaxed">
                  Androgenic alopecia is genetic pattern baldness caused by
                  hormones (DHT), not an autoimmune response. While it is the
                  most common type of hair loss, it does not present as sudden
                  patchy loss and is not classified as an autoimmune disorder.
                </p>
              </div>

              {/* Correct Answer */}
              <div className="bg-[var(--color-brand-gold)]/6 border border-[var(--color-brand-gold)]/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-[var(--color-brand-gold)] mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Correct Answer
                </h4>
                <p className="text-[var(--color-brand-deep-navy)] font-medium">
                  B — Alopecia areata
                </p>
                <p className="text-[var(--color-brand-silver-gray)] text-sm mt-1 leading-relaxed">
                  Alopecia areata is an autoimmune disorder where the immune
                  system mistakenly attacks hair follicles, resulting in sudden
                  patchy hair loss. It is one of the most frequently tested
                  conditions on barber board exams because barbers must
                  recognize it and refer clients to medical professionals.
                </p>
              </div>

              {/* Recommended Review */}
              <div className="border-t border-[var(--color-brand-deep-navy)]/8 pt-6">
                <h4 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--color-brand-gold)]" />
                  Recommended Topic Review
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Types of Alopecia",
                    "Autoimmune Disorders",
                    "Hair Loss Classification",
                    "Client Consultation Protocols",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-md text-xs text-[var(--color-brand-graphite)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-brand-silver-gray)] mt-3">
                  These topics have been added to your Focus Areas for
                  additional review.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center max-w-2xl mx-auto">
            <p className="text-[var(--color-brand-silver-gray)] text-sm italic">
              &ldquo;The platform transforms every wrong answer into a targeted
              learning moment — not just a number on a score sheet.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 6 — PROGRESS TRACKING              */}
      {/* ═══════════════════════════════════════════ */}
      <section id="progress" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-3">
              Step 7
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Mastery & Readiness
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-2xl mx-auto text-sm sm:text-base">
              Students, instructors, and schools can measure improvement over
              time.
            </p>
          </div>

          {/* Problem statement */}
          <div className="bg-[var(--color-brand-silver)]/6 border border-[var(--color-brand-silver)]/15 rounded-xl p-4 sm:p-6 mb-8 sm:mb-10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-brand-silver)] mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-brand-deep-navy)] mb-1">
                  The Problem: No One Knows Who Needs Help Until It's Too Late
                </h3>
                <p className="text-sm text-[var(--color-brand-silver-gray)] leading-relaxed">
                  Instructors with 30 students cannot quiz each one individually. School owners discover a student is failing only when they fail the board exam.
                  Without measurement, there is no accountability. Without accountability, there is no improvement.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Before */}
            <div className="bg-white border border-[var(--color-brand-deep-navy)]/10 rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-silver-gray)] mb-6">
                <Clock className="w-4 h-4" />
                Before Review
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-[var(--color-brand-gold)] mb-2">
                  72%
                </div>
                <div className="text-sm text-[var(--color-brand-silver-gray)] mb-4">
                  Board Readiness Score
                </div>
                <div className="w-full bg-[var(--color-brand-light-gray)] rounded-full h-3 mb-4">
                  <div
                    className="bg-[var(--color-brand-gold)] h-3 rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Alopecia", "Contraindications", "Hair Growth"].map(
                    (topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 bg-[var(--color-brand-silver)]/8 border border-[var(--color-brand-silver)]/15 rounded-md text-xs text-[var(--color-brand-silver)]"
                      >
                        {topic}
                      </span>
                    )
                  )}
                </div>
                <p className="text-xs text-[var(--color-brand-silver-gray)] mt-3">
                  3 focus areas identified
                </p>
              </div>
            </div>

            {/* After */}
            <div className="bg-white border border-[var(--color-brand-gold)]/20 rounded-xl p-6 sm:p-8 relative shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-brand-gold)] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                After Targeted Review
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-brand-gold)] mb-6">
                <TrendingUp className="w-4 h-4" />
                After Review
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-[var(--color-brand-gold)] mb-2">
                  78%
                </div>
                <div className="text-sm text-[var(--color-brand-silver-gray)] mb-4">
                  Board Readiness Score
                </div>
                <div className="w-full bg-[var(--color-brand-light-gray)] rounded-full h-3 mb-4">
                  <div
                    className="bg-[var(--color-brand-gold)] h-3 rounded-full"
                    style={{ width: "78%" }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Contraindications"].map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 bg-[var(--color-brand-gold)]/8 border border-[var(--color-brand-gold)]/15 rounded-md text-xs text-[var(--color-brand-gold)]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-brand-silver-gray)] mt-3">
                  1 focus area remaining
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Metric */}
          <div className="mt-6 sm:mt-8 bg-[var(--color-brand-gold)]/6 border border-[var(--color-brand-gold)]/15 rounded-xl p-5 sm:p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-[var(--color-brand-gold)] mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Improvement
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-[var(--color-brand-gold)]">+6%</div>
            <p className="text-[var(--color-brand-silver-gray)] text-sm mt-2">
              Board Readiness improvement after targeted review of missed
              concepts
            </p>
          </div>

          {/* Stakeholder value */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 sm:mt-8">
            <div className="bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-lg p-4 text-center">
              <Users className="w-5 h-5 text-[var(--color-brand-gold)] mx-auto mb-2" />
              <p className="text-sm text-[var(--color-brand-graphite)] font-medium">For Instructors</p>
              <p className="text-xs text-[var(--color-brand-silver-gray)] mt-1">
                See exactly which students need help — without creating a single quiz.
              </p>
            </div>
            <div className="bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-lg p-4 text-center">
              <School className="w-5 h-5 text-[var(--color-brand-gold)] mx-auto mb-2" />
              <p className="text-sm text-[var(--color-brand-graphite)] font-medium">For Schools</p>
              <p className="text-xs text-[var(--color-brand-silver-gray)] mt-1">
                Prove readiness to accreditors and prospective students with real data.
              </p>
            </div>
            <div className="bg-[var(--color-brand-off-white)] border border-[var(--color-brand-deep-navy)]/8 rounded-lg p-4 text-center">
              <Award className="w-5 h-5 text-[var(--color-brand-gold)] mx-auto mb-2" />
              <p className="text-sm text-[var(--color-brand-graphite)] font-medium">For Students</p>
              <p className="text-xs text-[var(--color-brand-silver-gray)] mt-1">
                Walk into the board exam knowing exactly what you've mastered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 7 — FUTURE VISION                  */}
      {/* ═══════════════════════════════════════════ */}
      <section id="future" className={`py-16 sm:py-24 px-4 sm:px-6 border-t border-[var(--color-brand-deep-navy)]/8 ${
        isPresentationMode ? 'presentation-section' : ''
      }`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-brand-gold)]/8 border border-[var(--color-brand-gold)]/20 rounded-full text-[var(--color-brand-gold)] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Future Vision
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-brand-deep-navy)] mb-3">
              Roadmap Ahead
            </h2>
            <p className="text-[var(--color-brand-silver-gray)] max-w-xl mx-auto text-sm sm:text-base">
              These features represent the future direction of the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Volume2,
                title: "Listen Mode",
                description:
                  "Audio narration of chapter content for auditory learners and commute study sessions.",
              },
              {
                icon: Eye,
                title: "Instructor Dashboard",
                description:
                  "Real-time visibility into student progress, weak areas, and class-wide readiness metrics.",
              },
              {
                icon: BarChart3,
                title: "School Analytics",
                description:
                  "Aggregated reporting for schools and training programs to track cohort performance and identify curriculum gaps.",
              },
              {
                icon: Target,
                title: "AI-Powered Study Coaching",
                description:
                  "Automatically generates personalized study plans and adjusts learning paths based on student performance.",
              },
              {
                icon: MapPin,
                title: "State-Specific Board Preparation",
                description:
                  "Customized content and practice exams aligned to specific state board requirements and regulations.",
              },
              {
                icon: BookOpen,
                title: "Spanish Version",
                description:
                  "Bilingual study support for Spanish-speaking students.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-dashed border-[var(--color-brand-deep-navy)]/10 rounded-xl p-5 sm:p-6 opacity-70 hover:opacity-100 transition-opacity shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-gold)]/8 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-[var(--color-brand-gold)]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--color-brand-deep-navy)]">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-[var(--color-brand-silver-gray)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <p className="text-[var(--color-brand-silver-gray)] text-sm">
              Future features are conceptual and subject to development
              prioritization based on school and instructor feedback.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--color-brand-deep-navy)]/8 py-10 sm:py-12 px-4 sm:px-6 bg-[var(--color-brand-off-white)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo variant="icon" theme="gold" size="md" />
            <span className="text-lg font-semibold text-[var(--color-brand-deep-navy)]">
              ASCYN PRO
            </span>
          </div>
          <p className="text-[var(--color-brand-silver-gray)] text-sm">
            Board-aligned curriculum. Measurable readiness. Instructor
            visibility.
          </p>
          <p className="text-[var(--color-brand-silver-gray)] text-xs mt-4">
            &copy; {new Date().getFullYear()} ASCYN PRO. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
