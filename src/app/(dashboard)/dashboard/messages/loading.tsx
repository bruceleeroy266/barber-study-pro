export default function MessagesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-9 w-40 bg-gray-800 rounded-lg mb-2" />
        <div className="h-5 w-64 bg-gray-800/60 rounded-lg" />
      </div>

      {/* Message center */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-gray-800 rounded" />
            <div className="h-4 w-52 bg-gray-800/60 rounded" />
          </div>
          <div className="h-9 w-32 bg-gray-800 rounded-lg" />
        </div>
        <div className="divide-y divide-gray-800">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 flex items-start gap-4">
              <div className="h-10 w-10 bg-gray-800 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-gray-800 rounded" />
                  <div className="h-3 w-16 bg-gray-800/60 rounded" />
                </div>
                <div className="h-3 w-full bg-gray-800/60 rounded" />
                <div className="h-3 w-2/3 bg-gray-800/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
