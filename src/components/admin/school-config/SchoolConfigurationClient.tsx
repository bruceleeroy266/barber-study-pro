'use client'

import { useState, useCallback, useMemo } from 'react'
import { SchoolConfiguration } from '@/types'
import {
  Building2,
  GraduationCap,
  Users,
  UserPlus,
  CalendarClock,
  Clock,
  Calculator,
  ClipboardCheck,
  MessageSquare,
  Bell,
  Shield,
  RotateCcw,
  Save,
  AlertCircle,
  CheckCircle2,
  Palette,
  UserCheck,
  Settings,
} from 'lucide-react'
import { validateSchoolConfiguration, ValidationErrors } from '@/lib/school-config/validation'
import { saveSchoolConfiguration } from '@/app/admin/school/configuration/actions'
import SchoolProfileSection from './SchoolProfileSection'
import BrandingSection from './BrandingSection'
import ProgramsSection from './ProgramsSection'
import InstructorsSection from './InstructorsSection'
import EnrollmentSection from './EnrollmentSection'
import AttendancePolicySection from './AttendancePolicySection'
import HoursPolicySection from './HoursPolicySection'
import GradebookConfigSection from './GradebookConfigSection'
import AssessmentDefaultsSection from './AssessmentDefaultsSection'
import StudentDefaultsSection from './StudentDefaultsSection'
import InstructorDefaultsSection from './InstructorDefaultsSection'
import MessagingPreferencesSection from './MessagingPreferencesSection'
import NotificationSettingsSection from './NotificationSettingsSection'
import RolePermissionsSection from './RolePermissionsSection'

type TabId =
  | 'profile'
  | 'branding'
  | 'programs'
  | 'instructors'
  | 'enrollment'
  | 'attendance'
  | 'hours'
  | 'gradebook'
  | 'assessments'
  | 'students'
  | 'instructor-defaults'
  | 'messaging'
  | 'notifications'
  | 'roles'

interface TabDef {
  id: TabId
  label: string
  icon: React.ElementType
}

const tabs: TabDef[] = [
  { id: 'profile', label: 'School Profile', icon: Building2 },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'programs', label: 'Programs', icon: GraduationCap },
  { id: 'instructors', label: 'Instructors', icon: Users },
  { id: 'enrollment', label: 'Enrollment', icon: UserPlus },
  { id: 'attendance', label: 'Attendance', icon: CalendarClock },
  { id: 'hours', label: 'Hours', icon: Clock },
  { id: 'gradebook', label: 'Gradebook', icon: Calculator },
  { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
  { id: 'students', label: 'Student Defaults', icon: UserCheck },
  { id: 'instructor-defaults', label: 'Instructor Defaults', icon: Settings },
  { id: 'messaging', label: 'Messaging', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
]

interface SchoolConfigurationClientProps {
  initialConfig: SchoolConfiguration
  isDemo: boolean
}

export default function SchoolConfigurationClient({
  initialConfig,
  isDemo,
}: SchoolConfigurationClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>('profile')
  const [config, setConfig] = useState<SchoolConfiguration>(initialConfig)
  const [savedConfig, setSavedConfig] = useState<SchoolConfiguration>(initialConfig)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  )

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(config) !== JSON.stringify(savedConfig)
  }, [config, savedConfig])

  const validate = useCallback((nextConfig: SchoolConfiguration) => {
    const nextErrors = validateSchoolConfiguration(nextConfig)
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [])

  function updateConfig(partial: Partial<SchoolConfiguration>) {
    setConfig((prev) => {
      const next = { ...prev, ...partial, updatedAt: new Date().toISOString() }
      validate(next)
      return next
    })
  }

  async function handleSave() {
    const isValid = validate(config)
    if (!isValid) {
      setFeedback({ type: 'error', message: 'Please fix validation errors before saving.' })
      return
    }

    setIsSaving(true)
    setFeedback(null)

    const result = await saveSchoolConfiguration(config)

    setIsSaving(false)
    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    })

    if (result.success && result.savedConfig) {
      setSavedConfig(result.savedConfig)
      setConfig(result.savedConfig)
      setErrors({})
    }
  }

  function handleReset() {
    setConfig(savedConfig)
    setErrors({})
    setFeedback(null)
  }

  return (
    <div className="min-h-screen bg-black p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">School Configuration</h1>
            <p className="text-silver">
              Manage school settings, programs, policies, and role permissions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {hasUnsavedChanges && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-warm-bronze/10 text-warm-bronze border border-warm-bronze/20">
                <AlertCircle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}
            {isDemo && (
              <div className="bg-warm-bronze/10 border border-warm-bronze/20 rounded-lg px-4 py-2 text-sm text-warm-bronze">
                Demo mode: changes are not saved
              </div>
            )}
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
              feedback.type === 'success'
                ? 'bg-gold/10 text-gold border-gold/20'
                : 'bg-silver/10 text-silver border-silver/20'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <nav className="lg:w-64 shrink-0" role="tablist" aria-label="Configuration sections">
            <div className="bg-charcoal border border-graphite rounded-xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20'
                        : 'text-silver hover:bg-graphite hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              className="bg-charcoal border border-graphite rounded-xl p-6"
            >
              {activeTab === 'profile' && (
                <SchoolProfileSection
                  config={config}
                  onChange={(school) => updateConfig({ school })}
                  errors={errors}
                />
              )}
              {activeTab === 'branding' && (
                <BrandingSection
                  config={config}
                  onChange={(branding) => updateConfig({ branding })}
                  errors={errors}
                />
              )}
              {activeTab === 'programs' && (
                <ProgramsSection
                  config={config}
                  onChange={(programs) => updateConfig({ programs })}
                />
              )}
              {activeTab === 'instructors' && <InstructorsSection config={config} />}
              {activeTab === 'enrollment' && (
                <EnrollmentSection
                  config={config}
                  onChange={(enrollment) => updateConfig({ enrollment })}
                />
              )}
              {activeTab === 'attendance' && (
                <AttendancePolicySection
                  config={config}
                  onChange={(attendancePolicy) => updateConfig({ attendancePolicy })}
                  errors={errors}
                />
              )}
              {activeTab === 'hours' && (
                <HoursPolicySection
                  config={config}
                  onChange={(hoursPolicy) => updateConfig({ hoursPolicy })}
                  errors={errors}
                />
              )}
              {activeTab === 'gradebook' && (
                <GradebookConfigSection
                  config={config}
                  onChange={(gradebookConfig) => updateConfig({ gradebookConfig })}
                  errors={errors}
                />
              )}
              {activeTab === 'assessments' && (
                <AssessmentDefaultsSection
                  config={config}
                  onChange={(assessmentDefaults) => updateConfig({ assessmentDefaults })}
                  errors={errors}
                />
              )}
              {activeTab === 'students' && (
                <StudentDefaultsSection
                  config={config}
                  onChange={(studentDefaults) => updateConfig({ studentDefaults })}
                  errors={errors}
                />
              )}
              {activeTab === 'instructor-defaults' && (
                <InstructorDefaultsSection
                  config={config}
                  onChange={(instructorDefaults) => updateConfig({ instructorDefaults })}
                />
              )}
              {activeTab === 'messaging' && (
                <MessagingPreferencesSection
                  config={config}
                  onChange={(messagingPreferences) => updateConfig({ messagingPreferences })}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationSettingsSection
                  config={config}
                  onChange={(notificationSettings) => updateConfig({ notificationSettings })}
                />
              )}
              {activeTab === 'roles' && (
                <RolePermissionsSection
                  config={config}
                  onChange={(rolePermissions) => updateConfig({ rolePermissions })}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sticky save/reset bar */}
        <div className="sticky bottom-6 z-30">
          <div className="bg-charcoal/95 backdrop-blur border border-graphite rounded-xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-silver">
              {hasUnsavedChanges ? (
                <span className="text-warm-bronze">You have unsaved changes.</span>
              ) : (
                <span>All changes saved.</span>
              )}
              {isDemo && (
                <span className="block sm:inline sm:ml-2 text-warm-bronze/80">
                  Demo preview: settings will not be saved after refresh.
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasUnsavedChanges || isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-[var(--color-border-secondary)] text-light-gray hover:bg-graphite disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Changes
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
