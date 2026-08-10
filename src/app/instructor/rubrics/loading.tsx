export default function RubricsLoading() {
  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="h-9 w-56 bg-graphite rounded-lg mb-2" />
          <div className="h-5 w-72 bg-graphite/60 rounded-lg" />
        </div>

        {/* Rubrics grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
              <div className="h-6 w-40 bg-graphite rounded" />
              <div className="space-y-2">
                {[0, 1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 w-full bg-graphite/60 rounded" />
                ))}
              </div>
              <div className="h-10 w-full bg-graphite/50 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
