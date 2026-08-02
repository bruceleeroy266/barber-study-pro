export default function GradebookLoading() {
  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-48 bg-gray-800 rounded-lg mb-2" />
            <div className="h-5 w-64 bg-gray-800/60 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-gray-800 rounded-lg" />
        </div>

        {/* Category weighting panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="h-6 w-48 bg-gray-800 rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 bg-gray-800/60 rounded" />
                <div className="h-8 w-full bg-gray-800 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Gradebook table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="h-6 w-36 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-800/60 rounded" />
          </div>
          <div className="divide-y divide-gray-800">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-800 rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-800 rounded" />
                    <div className="h-3 w-44 bg-gray-800/60 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {[0, 1, 2, 3].map((j) => (
                    <div key={j} className="h-4 w-12 bg-gray-800/60 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance report */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="h-6 w-44 bg-gray-800 rounded mb-4" />
          <div className="h-48 w-full bg-gray-800/50 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
