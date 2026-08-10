import React, { useState } from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { exportToCSV, ExportColumn } from '@/lib/export-utils'

export interface ExportButtonProps {
  data: Record<string, unknown>[]
  columns: ExportColumn[]
  filename: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Export Button Component
 * 
 * Button with dropdown to export data in different formats
 * 
 * @example
 * ```tsx
 * <ExportButton
 *   data={students}
 *   columns={studentRosterColumns}
 *   filename="student-roster"
 * />
 * ```
 */
export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  columns,
  filename,
  variant = 'outline',
  size = 'md',
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleExportCSV = () => {
    exportToCSV(data, columns, filename)
    setShowMenu(false)
  }

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon')
    setShowMenu(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Export data"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-charcoal border border-graphite rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-light-gray hover:bg-graphite hover:text-white transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export as CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-light-gray hover:bg-graphite hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export as PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportButton
