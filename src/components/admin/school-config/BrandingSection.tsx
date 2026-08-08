import { useState, useRef } from 'react'
import { SchoolConfiguration } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'
import { X, Image as ImageIcon } from 'lucide-react'

interface Props {
  config: SchoolConfiguration
  onChange: (branding: SchoolConfiguration['branding']) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function BrandingSection({ config, onChange, errors }: Props) {
  const { branding } = config
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleColorChange(field: 'primaryColor' | 'secondaryColor', value: string) {
    onChange({ ...branding, [field]: value })
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB.')
      return
    }

    setIsUploading(true)

    try {
      // In a real implementation, this would upload to Supabase Storage
      // For now, we'll create a local object URL
      const objectUrl = URL.createObjectURL(file)
      onChange({ ...branding, logoUrl: objectUrl })
    } catch (error) {
      console.error('Failed to upload logo:', error)
      alert('Failed to upload logo. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemoveLogo() {
    onChange({ ...branding, logoUrl: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Branding</h2>
        <p className="text-sm text-gray-400">Customize your school&apos;s visual identity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Color */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="primary-color" className="block text-sm font-medium text-gray-300 mb-2">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="primary-color"
              type="color"
              value={branding.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="h-12 w-12 rounded bg-transparent cursor-pointer border border-gray-700"
            />
            <input
              type="text"
              value={branding.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              aria-invalid={!!errors.brandingPrimaryColor}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500 font-mono text-sm"
              placeholder="#D4AF37"
            />
          </div>
          <FieldError message={errors.brandingPrimaryColor} />
          <p className="text-xs text-gray-500 mt-2">
            Used for buttons, links, and primary accents throughout the platform.
          </p>
        </div>

        {/* Secondary Color */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-300 mb-2">
            Secondary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="secondary-color"
              type="color"
              value={branding.secondaryColor}
              onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
              className="h-12 w-12 rounded bg-transparent cursor-pointer border border-gray-700"
            />
            <input
              type="text"
              value={branding.secondaryColor}
              onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
              aria-invalid={!!errors.brandingSecondaryColor}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500 font-mono text-sm"
              placeholder="#1F2937"
            />
          </div>
          <FieldError message={errors.brandingSecondaryColor} />
          <p className="text-xs text-gray-500 mt-2">
            Used for backgrounds, cards, and secondary UI elements.
          </p>
        </div>
      </div>

      {/* Logo Upload */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          School Logo
        </label>

        {branding.logoUrl ? (
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <img
                src={branding.logoUrl}
                alt="School logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">Logo uploaded successfully</p>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove Logo
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer inline-flex flex-col items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-gray-400">Uploading...</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-400">
                    Click to upload logo
                  </span>
                  <span className="text-xs text-gray-600">
                    PNG, JPG, SVG up to 2MB
                  </span>
                </>
              )}
            </label>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Recommended size: 200x200 pixels. Logo will appear in the navigation and on certificates.
        </p>
      </div>

      {/* Preview */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-300 mb-3">Preview</p>
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: branding.primaryColor }}
          >
            {config.school.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-medium">{config.school.name}</p>
            <p className="text-sm text-gray-400">School Portal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
