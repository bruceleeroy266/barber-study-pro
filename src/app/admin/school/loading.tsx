export default function SchoolLoading() {
  return (
    <div className="min-h-screen bg-black p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="h-9 w-64 bg-graphite rounded-lg mb-2" />
          <div className="h-5 w-80 bg-graphite/60 rounded-lg" />
        </div>

        {/* Overview metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-6">
              <div className="h-9 w-14 bg-graphite rounded mb-1" />
              <div className="h-4 w-28 bg-graphite/60 rounded" />
            </div>
          ))}
        </div>

        {/* Health score + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
            <div className="h-6 w-36 bg-graphite rounded" />
            <div className="h-32 w-full bg-graphite/50 rounded-lg" />
          </div>
          <div className="lg:col-span-2 bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
            <div className="h-6 w-32 bg-graphite rounded" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-black border border-graphite rounded-lg">
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

        {/* Performance panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
            <div className="h-6 w-44 bg-graphite rounded" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-graphite/60 rounded" />
                  <div className="h-4 w-12 bg-graphite rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
            <div className="h-6 w-44 bg-graphite rounded" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-graphite/60 rounded" />
                  <div className="h-4 w-12 bg-graphite rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <div className="h-6 w-40 bg-graphite rounded mb-4" />
          <div className="h-48 w-full bg-graphite/50 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
