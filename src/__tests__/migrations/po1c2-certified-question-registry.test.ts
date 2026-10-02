import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const migrationDir = path.join(process.cwd(), 'supabase/migrations')
const files = {
  config: '20261002143000_po1c2_comprehensive_exam_config_seed.sql',
  scientific: '20261002143100_po1c2_scientific_concepts_inventory.sql',
  implements: '20261002143200_po1c2_implements_equipment_inventory.sql',
  hair: '20261002143300_po1c2_hair_care_inventory.sql',
  facial: '20261002143400_po1c2_facial_hair_skin_inventory.sql',
}

const sql = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [
    key,
    fs.readFileSync(path.join(migrationDir, file), 'utf8'),
  ]),
) as Record<keyof typeof files, string>

const sourceIds = (text: string) =>
  [...text.matchAll(/\('((?:qq)-\d+-\d+)'\s*,\s*'chapter_quiz'/g)].map((match) => match[1])

describe('PO-1C.2 certified comprehensive-exam inventory', () => {
  it('creates only a draft versioned comprehensive-exam config', () => {
    expect(sql.config).toContain("'nic-barber-theory'")
    expect(sql.config).toContain("'draft'")
    expect(sql.config).toContain("'nic-barber-blueprint-2026-08-14'")
    expect(sql.config).toContain("'po1c2-certified-bank-2026-10-02'")
    expect(sql.config).toContain('null,')
    expect(sql.config).not.toContain("status = 'active'")
  })

  it('locks the four scored domains at 35/10/40/15', () => {
    expect(sql.config).toContain("('scientific_concepts'::text, 35, 35)")
    expect(sql.config).toContain("('implements_equipment'::text, 10, 10)")
    expect(sql.config).toContain("('hair_care_services'::text, 40, 40)")
    expect(sql.config).toContain("('facial_hair_skin_care_services'::text, 15, 15)")
  })

  it('imports the certified domain inventory with the expected exact counts', () => {
    expect(sourceIds(sql.scientific)).toHaveLength(48)
    expect(sourceIds(sql.implements)).toHaveLength(24)
    expect(sourceIds(sql.hair)).toHaveLength(52)
    expect(sourceIds(sql.facial)).toHaveLength(30)
  })

  it('contains 154 unique source question IDs with no cross-domain duplicate', () => {
    const ids = [
      ...sourceIds(sql.scientific),
      ...sourceIds(sql.implements),
      ...sourceIds(sql.hair),
      ...sourceIds(sql.facial),
    ]
    expect(ids).toHaveLength(154)
    expect(new Set(ids).size).toBe(154)
  })

  it('has enough unique inventory for each scored quota plus ten unscored reserve items overall', () => {
    const inventory = {
      scientific: sourceIds(sql.scientific).length,
      implements: sourceIds(sql.implements).length,
      hair: sourceIds(sql.hair).length,
      facial: sourceIds(sql.facial).length,
    }
    const scoredRequired = {
      scientific: 35,
      implements: 10,
      hair: 40,
      facial: 15,
    }

    expect(inventory.scientific).toBeGreaterThanOrEqual(scoredRequired.scientific)
    expect(inventory.implements).toBeGreaterThanOrEqual(scoredRequired.implements)
    expect(inventory.hair).toBeGreaterThanOrEqual(scoredRequired.hair)
    expect(inventory.facial).toBeGreaterThanOrEqual(scoredRequired.facial)

    const spare =
      inventory.scientific - scoredRequired.scientific +
      inventory.implements - scoredRequired.implements +
      inventory.hair - scoredRequired.hair +
      inventory.facial - scoredRequired.facial

    expect(spare).toBeGreaterThanOrEqual(10)
    expect(spare).toBe(54)
  })

  it('maps only approved premium chapter quiz sources into each domain', () => {
    for (const id of sourceIds(sql.scientific)) {
      expect(id).toMatch(/^qq-(4|6|7|8)-/)
    }
    for (const id of sourceIds(sql.implements)) {
      expect(id).toMatch(/^qq-5-/)
    }
    for (const id of sourceIds(sql.hair)) {
      expect(id).toMatch(/^qq-(11|14|18)-/)
    }
    for (const id of sourceIds(sql.facial)) {
      expect(id).toMatch(/^qq-(12|13)-/)
    }
  })

  it('records immutable repository provenance for imported questions', () => {
    for (const key of ['scientific', 'implements', 'hair', 'facial'] as const) {
      expect(sql[key]).toContain("'repository_path'")
      expect(sql[key]).toContain("'repository_commit'")
      expect(sql[key]).toContain("'15dc88e5561d05004a066d22a9c7c1e1e095d381'")
      expect(sql[key]).toContain("'current_premium_quiz'")
      expect(sql[key]).toContain("'po1c2_even_coverage'")
    }
  })

  it('registers every imported item as both scored-eligible and unscored-eligible', () => {
    for (const key of ['scientific', 'implements', 'hair', 'facial'] as const) {
      expect(sql[key]).toContain(
        'select cfg.id,qs.id,true,true,true from cfg cross join qs',
      )
    }
  })

  it('does not import reassessment reserve, legacy HTML, or missed-question content', () => {
    const all = Object.values(sql).join('\n').toLowerCase()
    expect(all).not.toContain('reassessment-questions')
    expect(all).not.toContain('reassessment_reserve')
    expect(all).not.toContain('missed-questions.html')
    expect(all).not.toContain('practice-exam.html')
    expect(all).not.toContain("source_kind','legacy")
  })

  it('does not activate the config before timer/pass policy is separately authorized', () => {
    const all = Object.values(sql).join('\n')
    expect(all).not.toContain('activate_comprehensive_exam_config(')
    expect(sql.config).toContain('time_limit_seconds')
    expect(sql.config).toContain('passing_percentage')
  })

  it('contains no simulator route, UI, attempt runtime, readiness, or H&A writes', () => {
    const all = Object.values(sql).join('\n').toLowerCase()
    expect(all).not.toContain('/api/comprehensive-exam/')
    expect(all).not.toContain('start_or_resume_comprehensive_exam')
    expect(all).not.toContain('submit_comprehensive_exam_attempt')
    expect(all).not.toContain('insert into public.hour_logs')
    expect(all).not.toContain('attendance_corrections')
    expect(all).not.toContain('insert into public.student_progress')
    expect(all).not.toContain('update public.student_progress')
  })
})
