export default function SchoolConfigurationLoading() {
  return (
    <div className="min-h-screen bg-gray-950 p-8 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="h-9 w-64 bg-gray-800 rounded-lg mb-2" />
          <div className="h-5 w-80 bg-gray-800/60 rounded-lg" />
        </div>

        {/* Configuration form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-gray-800/60 rounded" />
              <div className="h-12 w-full bg-gray-800 rounded-lg" />
            </div>
          ))}
          <div className="flex items-center justify-end gap-4 pt-4">
            <div className="h-10 w-24 bg-gray-800 rounded-lg" />
            <div className="h-10 w-32 bg-gray-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
