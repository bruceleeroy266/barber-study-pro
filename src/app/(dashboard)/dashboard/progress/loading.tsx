export default function ProgressLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-graphite rounded-lg mb-2" />
        <div className="h-5 w-80 bg-graphite/60 rounded-lg" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="h-8 w-12 bg-graphite rounded mb-1" />
            <div className="h-3 w-20 bg-graphite/60 rounded" />
          </div>
        ))}
      </div>

      {/* Board readiness card */}
      <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-graphite rounded" />
          <div className="h-10 w-10 bg-graphite rounded-full" />
        </div>
        <div className="h-4 w-full bg-graphite rounded-full" />
        <div className="h-4 w-3/4 bg-graphite/60 rounded" />
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
          <div className="h-6 w-44 bg-graphite rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-graphite/60 rounded" />
                <div className="h-4 w-10 bg-graphite/60 rounded" />
              </div>
              <div className="h-2 w-full bg-graphite rounded-full" />
            </div>
          ))}
        </div>
        <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-3">
          <div className="h-6 w-36 bg-graphite rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 w-full bg-graphite/60 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-charcoal border border-graphite rounded-xl p-6">
        <div className="h-6 w-32 bg-graphite rounded mb-4" />
        <div className="h-48 w-full bg-graphite/50 rounded-lg" />
      </div>

      {/* Study recommendations */}
      <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
        <div className="h-6 w-48 bg-graphite rounded" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-5 w-5 bg-graphite rounded mt-0.5" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-graphite rounded" />
                <div className="h-3 w-full bg-graphite/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
