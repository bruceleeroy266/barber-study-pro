export default function StudentDetailLoading() {
  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-56 bg-graphite rounded-lg mb-2" />
            <div className="h-5 w-72 bg-graphite/60 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-graphite rounded-lg" />
        </div>

        {/* Student info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-5">
              <div className="h-8 w-12 bg-graphite rounded mb-1" />
              <div className="h-3 w-20 bg-graphite/60 rounded" />
            </div>
          ))}
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

        {/* Notes / history panel */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <div className="h-6 w-36 bg-graphite rounded mb-2" />
            <div className="h-4 w-48 bg-graphite/60 rounded" />
          </div>
          <div className="divide-y divide-graphite">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-graphite rounded" />
                  <div className="h-3 w-16 bg-graphite/60 rounded" />
                </div>
                <div className="h-3 w-full bg-graphite/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
