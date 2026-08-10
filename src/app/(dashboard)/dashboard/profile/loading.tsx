export default function ProfileLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-graphite rounded-lg mb-2" />
        <div className="h-5 w-64 bg-graphite/60 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-6">
            <div className="h-6 w-44 bg-graphite rounded" />
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-graphite/60 rounded" />
                  <div className="h-12 w-full bg-graphite rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-4">
            <div className="h-6 w-32 bg-graphite rounded" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-4 w-full bg-graphite/60 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
