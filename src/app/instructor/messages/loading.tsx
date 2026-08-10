export default function InstructorMessagesLoading() {
  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-56 bg-graphite rounded-lg mb-2" />
            <div className="h-5 w-72 bg-graphite/60 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-graphite rounded-lg" />
        </div>

        {/* Message dashboard */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <div className="h-6 w-40 bg-graphite rounded mb-2" />
            <div className="h-4 w-56 bg-graphite/60 rounded" />
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
    </div>
  )
}
