export default function InstructorMessagesLoading() {
  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-56 bg-gray-800 rounded-lg mb-2" />
            <div className="h-5 w-72 bg-gray-800/60 rounded-lg" />
          </div>
          <div className="h-10 w-36 bg-gray-800 rounded-lg" />
        </div>

        {/* Message dashboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="h-6 w-40 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-800/60 rounded" />
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
    </div>
  )
}
