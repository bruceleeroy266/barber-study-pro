export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-black p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="h-9 w-56 bg-graphite rounded-lg mb-2" />
          <div className="h-5 w-64 bg-graphite/60 rounded-lg" />
        </div>

        {/* KPI stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-6">
              <div className="h-9 w-14 bg-graphite rounded mb-1" />
              <div className="h-4 w-28 bg-graphite/60 rounded" />
            </div>
          ))}
        </div>

        {/* Management cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-graphite rounded" />
                <div className="h-5 w-5 bg-graphite rounded" />
              </div>
              <div className="h-4 w-full bg-graphite/60 rounded" />
              <div className="h-4 w-2/3 bg-graphite/60 rounded" />
              <div className="h-8 w-36 bg-graphite rounded-lg" />
            </div>
          ))}
        </div>

        {/* Feature list panel */}
        <div className="bg-charcoal/50 border border-graphite rounded-xl p-6 space-y-3">
          <div className="h-6 w-56 bg-graphite rounded" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 w-3/4 bg-graphite/60 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
