export default function ComplianceLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-56 bg-gray-800 rounded-lg mb-2" />
        <div className="h-5 w-80 bg-gray-800/60 rounded-lg" />
      </div>

      {/* Compliance score cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
            <div className="h-5 w-32 bg-gray-800 rounded" />
            <div className="h-10 w-20 bg-gray-800 rounded" />
            <div className="h-3 w-24 bg-gray-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Alerts panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="h-6 w-40 bg-gray-800 rounded" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-950 border border-gray-800 rounded-lg">
              <div className="h-5 w-5 bg-gray-800 rounded mt-0.5" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-gray-800 rounded" />
                <div className="h-3 w-full bg-gray-800/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reporting center */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="h-6 w-48 bg-gray-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="p-4 bg-gray-950 border border-gray-800 rounded-lg space-y-2">
              <div className="h-5 w-32 bg-gray-800 rounded" />
              <div className="h-3 w-full bg-gray-800/60 rounded" />
              <div className="h-3 w-2/3 bg-gray-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
