export default function SchoolLoading() {
  return (
    <div className="min-h-screen bg-gray-950 p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="h-9 w-64 bg-gray-800 rounded-lg mb-2" />
          <div className="h-5 w-80 bg-gray-800/60 rounded-lg" />
        </div>

        {/* Overview metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="h-9 w-14 bg-gray-800 rounded mb-1" />
              <div className="h-4 w-28 bg-gray-800/60 rounded" />
            </div>
          ))}
        </div>

        {/* Health score + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="h-6 w-36 bg-gray-800 rounded" />
            <div className="h-32 w-full bg-gray-800/50 rounded-lg" />
          </div>
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-800 rounded" />
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
        </div>

        {/* Performance panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="h-6 w-44 bg-gray-800 rounded" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-800/60 rounded" />
                  <div className="h-4 w-12 bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="h-6 w-44 bg-gray-800 rounded" />
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-gray-800/60 rounded" />
                  <div className="h-4 w-12 bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="h-6 w-40 bg-gray-800 rounded mb-4" />
          <div className="h-48 w-full bg-gray-800/50 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
