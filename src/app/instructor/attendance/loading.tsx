export default function AttendanceLoading() {
  return (
    <div className="min-h-screen bg-black p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="h-9 w-64 bg-graphite rounded-lg mb-2" />
          <div className="h-5 w-80 bg-graphite/60 rounded-lg" />
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-charcoal border border-graphite rounded-xl p-4 text-center">
              <div className="h-9 w-10 bg-graphite rounded mx-auto mb-1" />
              <div className="h-3 w-14 bg-graphite/60 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* Attendance table */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-graphite rounded" />
              <div className="h-4 w-64 bg-graphite/60 rounded" />
            </div>
            <div className="h-9 w-36 bg-graphite rounded-lg" />
          </div>
          <div className="divide-y divide-graphite">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-graphite rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-graphite rounded" />
                    <div className="h-3 w-44 bg-graphite/60 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="h-4 w-16 bg-graphite/60 rounded" />
                  <div className="h-6 w-20 bg-graphite rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
