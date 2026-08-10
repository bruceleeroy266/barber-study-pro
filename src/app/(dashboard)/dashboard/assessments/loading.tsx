export default function AssessmentsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-48 bg-graphite rounded-lg mb-2" />
        <div className="h-5 w-72 bg-graphite/60 rounded-lg" />
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

      {/* Assessment records panel */}
      <div className="bg-charcoal border border-graphite rounded-xl p-5 space-y-4">
        <div className="h-6 w-44 bg-graphite rounded" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-black border border-graphite rounded-lg">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-graphite rounded" />
                <div className="h-3 w-48 bg-graphite/60 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-graphite/60 rounded" />
                <div className="h-6 w-20 bg-graphite rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubrics section */}
      <div>
        <div className="h-7 w-32 bg-graphite rounded mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
              <div className="h-6 w-40 bg-graphite rounded" />
              <div className="space-y-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-4 w-full bg-graphite/60 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
