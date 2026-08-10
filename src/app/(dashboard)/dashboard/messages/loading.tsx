export default function MessagesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-graphite rounded-lg mb-2" />
        <div className="h-5 w-64 bg-graphite/60 rounded-lg" />
      </div>

      {/* Message center */}
      <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
        <div className="p-6 border-b border-graphite flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-graphite rounded" />
            <div className="h-4 w-52 bg-graphite/60 rounded" />
          </div>
          <div className="h-9 w-32 bg-graphite rounded-lg" />
        </div>
        <div className="divide-y divide-graphite">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 flex items-start gap-4">
              <div className="h-10 w-10 bg-graphite rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-graphite rounded" />
                  <div className="h-3 w-16 bg-graphite/60 rounded" />
                </div>
                <div className="h-3 w-full bg-graphite/60 rounded" />
                <div className="h-3 w-2/3 bg-graphite/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
