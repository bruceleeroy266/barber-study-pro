export default function RetestLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-48 bg-graphite rounded-lg mb-2" />
        <div className="h-5 w-72 bg-graphite/60 rounded-lg" />
      </div>

      {/* Quiz container */}
      <div className="bg-charcoal border border-graphite rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-graphite rounded" />
          <div className="h-4 w-20 bg-graphite/60 rounded" />
        </div>
        <div className="h-2 w-full bg-graphite rounded-full" />
        <div className="space-y-4">
          <div className="h-5 w-3/4 bg-graphite rounded" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-12 w-full bg-graphite/50 rounded-lg" />
          ))}
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="h-10 w-24 bg-graphite rounded-lg" />
          <div className="h-10 w-24 bg-graphite rounded-lg" />
        </div>
      </div>
    </div>
  )
}
