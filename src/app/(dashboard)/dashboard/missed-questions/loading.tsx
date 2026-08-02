export default function MissedQuestionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-56 bg-gray-800 rounded-lg mb-2" />
        <div className="h-5 w-96 bg-gray-800/60 rounded-lg" />
      </div>

      {/* Info banner */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-3">
        <div className="h-5 w-5 bg-gray-800 rounded mt-0.5" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-gray-800 rounded" />
          <div className="h-3 w-full bg-gray-800/60 rounded" />
        </div>
      </div>

      {/* Question bank */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-gray-800 rounded" />
            <div className="h-4 w-56 bg-gray-800/60 rounded" />
          </div>
          <div className="h-9 w-36 bg-gray-800 rounded-lg" />
        </div>
        <div className="divide-y divide-gray-800">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-800/60 rounded" />
                <div className="h-4 w-16 bg-gray-800/60 rounded" />
              </div>
              <div className="h-4 w-full bg-gray-800 rounded" />
              <div className="h-4 w-3/4 bg-gray-800/60 rounded" />
              <div className="flex gap-2 pt-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-8 w-20 bg-gray-800/50 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
