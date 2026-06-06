import {
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  LayoutDashboard,
  Target,
  TrendingUp,
} from "lucide-react";

// ───────────────────────────────────────────────
// DEMO DASHBOARD — Milady / NABBA Pitch Screen
// Static demo data. No auth. No database. No API.
// ───────────────────────────────────────────────

export const metadata = {
  title: "Barber Study Pro — Board Readiness Dashboard",
  description:
    "Professional barbering education platform. Measurable board exam preparation.",
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top bar */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-semibold tracking-tight">
              Barber Study Pro
            </span>
          </div>
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Demo
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Student Progress Overview
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Board readiness metrics and recommended study path
          </p>
        </div>

        {/* ── ROW 1: Board Readiness + Chapter Progress + Study Consistency ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Board Readiness Score */}
          <div className="lg:col-span-1 bg-[#111111] border border-white/5 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-4">
                <Brain className="w-4 h-4 text-[#D4AF37]" />
                Board Readiness Score
              </div>
              <div className="text-6xl font-bold text-[#f59e0b]">78%</div>
              <div className="text-sm font-medium text-[#f59e0b] mt-1">
                Approaching Readiness
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Weighted by chapter progress, quiz performance, and weak-area
              recovery.
            </p>
          </div>

          {/* Card 2: Chapter Progress */}
          <div className="lg:col-span-1 bg-[#111111] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              Chapter Progress
            </div>
            <div className="text-4xl font-bold text-white">13</div>
            <div className="text-sm text-gray-400">
              of <span className="text-white font-medium">23</span> chapters
              complete
            </div>
            <div className="mt-4">
              <div className="w-full bg-[#1a1a1a] rounded-full h-2.5">
                <div
                  className="bg-[#D4AF37] h-2.5 rounded-full"
                  style={{ width: "56.5%" }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Structured curriculum progress
              </p>
            </div>
          </div>

          {/* Card 3: Study Consistency */}
          <div className="lg:col-span-1 bg-[#111111] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-4">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              Study Consistency
            </div>
            <div className="text-4xl font-bold text-white">12</div>
            <div className="text-sm text-gray-400">consecutive study days</div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>4.5 hours this week</span>
              </div>
              <p className="text-xs text-gray-500">
                Consistent study predicts higher board pass rates.
              </p>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Focus Areas + Recommended Next Step ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 4: Focus Areas */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-4">
              <Target className="w-4 h-4 text-[#ef4444]" />
              Focus Areas
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Recommended review before board exam
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">Hair Disorders</span>
                  <span className="text-[#ef4444] font-medium">62%</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className="bg-[#ef4444] h-2 rounded-full"
                    style={{ width: "62%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">Alopecia</span>
                  <span className="text-[#f59e0b] font-medium">68%</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className="bg-[#f59e0b] h-2 rounded-full"
                    style={{ width: "68%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-300">Hair Growth Cycles</span>
                  <span className="text-[#f59e0b] font-medium">71%</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                  <div
                    className="bg-[#f59e0b] h-2 rounded-full"
                    style={{ width: "71%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Recommended Next Step */}
          <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-4">
              <ChevronRight className="w-4 h-4 text-[#22c55e]" />
              Recommended Next Step
            </div>
            <div className="mb-4">
              <div className="text-lg font-semibold text-white">
                Chapter 10 — Hair &amp; Scalp Disorders
              </div>
              <p className="text-sm text-gray-400 mt-1">
                High board-exam weight. Covers contagious conditions,
                contraindications, and consultation protocols.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <span className="text-[#D4AF37]">Review flashcards</span>
              <span className="text-gray-600">→</span>
              <span className="text-[#D4AF37]">Take quiz</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              Estimated time: 25 minutes
            </div>
          </div>
        </div>

        {/* ── ROW 3: Recent Performance ── */}
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-4">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            Recent Performance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-400">Last Quiz</div>
              <div className="text-lg font-semibold text-white mt-1">
                Chapter 10 — Hair &amp; Scalp Disorders
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-3xl font-bold text-[#f59e0b] mt-1">
                72%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Missed Topics</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {["Alopecia", "Contraindications", "Hair Growth"].map(
                  (topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 bg-[#1a1a1a] border border-white/5 rounded-md text-xs text-gray-300"
                    >
                      {topic}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer note ── */}
        <div className="border-t border-white/5 pt-6 pb-10">
          <p className="text-xs text-gray-600 text-center">
            Barber Study Pro — Board-aligned curriculum. Measurable readiness.
            Instructor visibility.
          </p>
        </div>
      </div>
    </main>
  );
}
