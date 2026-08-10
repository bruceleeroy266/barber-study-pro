export default function GradesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-graphite rounded-lg mb-2" />
        <div className="h-5 w-64 bg-graphite/60 rounded-lg" />
      </div>

      {/* Grade summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="h-8 w-12 bg-graphite rounded mb-1" />
            <div className="h-3 w-20 bg-graphite/60 rounded" />
          </div>
        ))}
      </div>

      {/* Grade performance widget */}
      <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
        <div className="h-6 w-44 bg-graphite rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 w-28 bg-graphite/60 rounded" />
                <div className="h-4 w-12 bg-graphite rounded" />
              </div>
            ))}
          </div>
          <div className="h-40 w-full bg-graphite/50 rounded-lg" />
        </div>
      </div>

      {/* Grade report table */}
      <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
        <div className="p-6 border-b border-graphite">
          <div className="h-6 w-36 bg-graphite rounded mb-2" />
          <div className="h-4 w-56 bg-graphite/60 rounded" />
        </div>
        <div className="divide-y divide-graphite">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-graphite rounded" />
                <div className="h-3 w-44 bg-graphite/60 rounded" />
              </div>
              <div className="flex items-center gap-6">
                <div className="h-4 w-12 bg-graphite/60 rounded" />
                <div className="h-6 w-16 bg-graphite rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
