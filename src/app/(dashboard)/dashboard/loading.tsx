export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-48 bg-gray-800 rounded-lg mb-2" />
        <div className="h-5 w-72 bg-gray-800/60 rounded-lg" />
      </div>

      {/* Notification summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-800 rounded" />
                <div className="h-8 w-24 bg-gray-800 rounded" />
              </div>
              <div className="h-8 w-8 bg-gray-800 rounded-full" />
            </div>
            <div className="h-3 w-16 bg-gray-800/60 rounded mt-2" />
          </div>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="h-8 w-8 bg-gray-800 rounded mb-2" />
            <div className="h-9 w-14 bg-gray-800 rounded mb-1" />
            <div className="h-4 w-24 bg-gray-800/60 rounded" />
          </div>
        ))}
      </div>

      {/* Board readiness card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-800 rounded" />
          <div className="h-10 w-10 bg-gray-800 rounded-full" />
        </div>
        <div className="h-4 w-full bg-gray-800 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-800/60 rounded" />
      </div>

      {/* Analytics grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="h-6 w-44 bg-gray-800 rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-32 bg-gray-800/60 rounded" />
                <div className="h-4 w-10 bg-gray-800/60 rounded" />
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full" />
            </div>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
          <div className="h-6 w-36 bg-gray-800 rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 w-full bg-gray-800/60 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="h-6 w-32 bg-gray-800 rounded mb-4" />
        <div className="h-48 w-full bg-gray-800/50 rounded-lg" />
      </div>

      {/* Chapter grid */}
      <div>
        <div className="h-7 w-32 bg-gray-800 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-8 w-10 bg-gray-800 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-gray-800 rounded" />
              <div className="h-4 w-full bg-gray-800/60 rounded" />
              <div className="h-2 w-full bg-gray-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
