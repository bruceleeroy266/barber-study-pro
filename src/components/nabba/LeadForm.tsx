'use client'

import { useState, useTransition } from 'react'
import { createLead, updateLead } from '@/app/admin/nabba/leads/actions'
import type { NabbaLead, LeadFormData, LeadTemperature, LeadStatus, LeadFollowUp, LeadInterest, LeadRole } from '@/types/nabba-leads'
import {
  LEAD_ROLE_OPTIONS,
  LEAD_INTEREST_OPTIONS,
  LEAD_TEMPERATURE_OPTIONS,
  LEAD_FOLLOW_UP_OPTIONS,
  LEAD_STATUS_OPTIONS,
  TEMPERATURE_LABELS,
} from '@/types/nabba-leads'
import { Check, Loader2, Thermometer, Briefcase, Mail, Phone, MapPin, FileText, Flag, User, Building } from 'lucide-react'

interface LeadFormProps {
  existingLead?: NabbaLead
  onSuccess?: (lead: NabbaLead) => void
  onCancel?: () => void
}

const emptyForm: LeadFormData = {
  name: '',
  organization: '',
  role: 'Student',
  email: '',
  phone: '',
  state: '',
  interests: [],
  temperature: 'WARM',
  notes: '',
  follow_up_action: 'No Action Yet',
}

export default function LeadForm({ existingLead, onSuccess, onCancel }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(
    existingLead
      ? {
          name: existingLead.name,
          organization: existingLead.organization,
          role: existingLead.role,
          email: existingLead.email,
          phone: existingLead.phone || '',
          state: existingLead.state || '',
          interests: existingLead.interests,
          temperature: existingLead.temperature,
          notes: existingLead.notes || '',
          follow_up_action: existingLead.follow_up_action,
        }
      : { ...emptyForm }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.organization.trim()) next.organization = 'Organization is required'
    if (!form.email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    startTransition(async () => {
      if (existingLead) {
        const result = await updateLead(existingLead.id, {
          ...form,
          status: existingLead.status,
        })
        if (result.success && result.lead) {
          setSaved(true)
          onSuccess?.(result.lead)
        }
      } else {
        const result = await createLead(form)
        if (result.success && result.lead) {
          setSaved(true)
          onSuccess?.(result.lead)
        }
      }
    })
  }

  const handleAddAnother = () => {
    setForm({ ...emptyForm })
    setSaved(false)
    setErrors({})
  }

  const update = <K extends keyof LeadFormData>(key: K, value: LeadFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  const toggleInterest = (interest: LeadInterest) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }))
  }

  if (saved && !existingLead) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Lead Saved!</h3>
        <p className="text-silver mb-6">{form.name} from {form.organization} has been captured.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleAddAnother}
            className="w-full py-3 px-4 bg-[var(--color-brand-gold)] text-black font-bold rounded-xl hover:bg-[var(--color-brand-gold-light)] transition-colors"
          >
            + Capture Another Lead
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full py-3 px-4 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <User className="w-4 h-4" /> Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Full name"
          className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base"
          autoFocus
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Organization */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <Building className="w-4 h-4" /> School / Organization <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.organization}
          onChange={(e) => update('organization', e.target.value)}
          placeholder="School or company name"
          className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base"
        />
        {errors.organization && <p className="text-red-400 text-xs mt-1">{errors.organization}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <Briefcase className="w-4 h-4" /> Role
        </label>
        <select
          value={form.role}
          onChange={(e) => update('role', e.target.value as LeadRole)}
          className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base appearance-none"
        >
          {LEAD_ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <Mail className="w-4 h-4" /> Email <span className="text-red-400">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="email@example.com"
          inputMode="email"
          className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base"
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Phone + State row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            <Phone className="w-4 h-4" /> Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="(optional)"
            inputMode="tel"
            className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            <MapPin className="w-4 h-4" /> State
          </label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            placeholder="OK, TX..."
            className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base"
          />
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <Flag className="w-4 h-4" /> Interest
        </label>
        <div className="flex flex-wrap gap-2">
          {LEAD_INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                form.interests.includes(interest)
                  ? 'bg-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/40'
                  : 'bg-[var(--color-background-secondary)] text-silver border-[var(--color-border-primary)] hover:border-white/30'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <Thermometer className="w-4 h-4" /> Lead Temperature
        </label>
        <div className="grid grid-cols-3 gap-2">
          {LEAD_TEMPERATURE_OPTIONS.map((temp) => {
            const info = TEMPERATURE_LABELS[temp]
            return (
              <button
                key={temp}
                type="button"
                onClick={() => update('temperature', temp)}
                className={`px-3 py-3 rounded-xl text-sm font-bold border transition-colors text-center ${
                  form.temperature === temp
                    ? info.color
                    : 'bg-[var(--color-background-secondary)] text-silver border-[var(--color-border-primary)] hover:border-white/30'
                }`}
                title={info.description}
              >
                {info.label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-silver-gray mt-1">
          {TEMPERATURE_LABELS[form.temperature].description}
        </p>
      </div>

      {/* Follow-up Action */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <Flag className="w-4 h-4" /> Follow-Up Action
        </label>
        <select
          value={form.follow_up_action}
          onChange={(e) => update('follow_up_action', e.target.value as LeadFollowUp)}
          className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base appearance-none"
        >
          {LEAD_FOLLOW_UP_OPTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Status (edit mode only) */}
      {existingLead && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Status
          </label>
          <select
            value={existingLead.status}
            onChange={(e) => {
              const newStatus = e.target.value as LeadStatus
              startTransition(async () => {
                await updateLead(existingLead.id, { status: newStatus })
              })
            }}
            className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base appearance-none"
          >
            {LEAD_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          <FileText className="w-4 h-4" /> Notes
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Quick notes about the conversation..."
          rows={3}
          className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-4 px-4 bg-[var(--color-brand-gold)] text-black font-bold rounded-xl hover:bg-[var(--color-brand-gold-light)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
          {existingLead ? 'Save Changes' : 'Save Lead'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-full py-3 px-4 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
