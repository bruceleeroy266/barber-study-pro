export default function AssessmentsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-48 bg-gray-800 rounded-lg mb-2" />
        <div className="h-5 w-72 bg-gray-800/60 rounded-lg" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="h-8 w-12 bg-gray-800 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Assessment records panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="h-6 w-44 bg-gray-800 rounded" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-lg">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-800 rounded" />
                <div className="h-3 w-48 bg-gray-800/60 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-gray-800/60 rounded" />
                <div className="h-6 w-20 bg-gray-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubrics section */}
      <div>
        <div className="h-7 w-32 bg-gray-800 rounded mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <div className="h-6 w-40 bg-gray-800 rounded" />
              <div className="space-y-2">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-4 w-full bg-gray-800/60 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
