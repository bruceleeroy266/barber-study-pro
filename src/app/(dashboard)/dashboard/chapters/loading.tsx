export default function ChaptersLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-gray-800 rounded-lg mb-2" />
        <div className="h-5 w-80 bg-gray-800/60 rounded-lg" />
      </div>

      {/* Chapter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-9 w-12 bg-gray-800 rounded" />
              <div className="h-5 w-20 bg-gray-800/60 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-800/60 rounded" />
            <div className="h-4 w-5/6 bg-gray-800/60 rounded" />
            <div className="h-2 w-full bg-gray-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
