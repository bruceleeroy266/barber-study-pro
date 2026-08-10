export default function ChapterLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-graphite/60 rounded" />
        <div className="h-4 w-2 bg-graphite/60 rounded" />
        <div className="h-4 w-24 bg-graphite/60 rounded" />
      </div>

      {/* Back link */}
      <div className="h-4 w-32 bg-graphite/60 rounded" />

      {/* Chapter header */}
      <div className="bg-charcoal border border-graphite rounded-2xl p-8 space-y-4">
        <div className="h-4 w-28 bg-graphite/60 rounded" />
        <div className="h-10 w-3/4 bg-graphite rounded-lg" />
        <div className="h-5 w-full bg-graphite/60 rounded" />
        <div className="h-5 w-2/3 bg-graphite/60 rounded" />
        <div className="flex gap-4 pt-2">
          <div className="h-6 w-28 bg-graphite rounded-full" />
          <div className="h-6 w-28 bg-graphite rounded-full" />
          <div className="h-6 w-32 bg-graphite rounded-full" />
        </div>
      </div>

      {/* Lesson content sections */}
      {[0, 1].map((i) => (
        <div key={i} className="bg-charcoal border border-graphite rounded-2xl p-8 space-y-4">
          <div className="h-7 w-56 bg-graphite rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-graphite/60 rounded" />
            <div className="h-4 w-full bg-graphite/60 rounded" />
            <div className="h-4 w-5/6 bg-graphite/60 rounded" />
            <div className="h-4 w-4/6 bg-graphite/60 rounded" />
          </div>
        </div>
      ))}

      {/* Flashcards section */}
      <div className="bg-charcoal border border-graphite rounded-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-28 bg-graphite rounded" />
            <div className="h-4 w-64 bg-graphite/60 rounded" />
          </div>
        </div>
        <div className="h-56 w-full bg-graphite/50 rounded-xl" />
        <div className="flex items-center justify-between">
          <div className="h-10 w-24 bg-graphite rounded-lg" />
          <div className="h-4 w-16 bg-graphite/60 rounded" />
          <div className="h-10 w-24 bg-graphite rounded-lg" />
        </div>
      </div>

      {/* Quiz section */}
      <div className="bg-charcoal border border-graphite rounded-2xl p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-graphite rounded" />
          <div className="h-4 w-56 bg-graphite/60 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-5 w-3/4 bg-graphite rounded" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full bg-graphite/50 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Chapter navigation */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-4 w-24 bg-graphite/60 rounded" />
        <div className="h-4 w-24 bg-graphite/60 rounded" />
      </div>
    </div>
  )
}
