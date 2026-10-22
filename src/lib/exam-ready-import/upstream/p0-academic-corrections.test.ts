import { describe, expect, it } from 'vitest'
import { anatomyPhysiologyQuestions } from './anatomy-physiology'
import { infectionControlQuestions } from './infection-control-bank'
import { hairScalpDisorderQuestions } from './hair-scalp-disorders-bank'
import { scientificConceptGapQuestions } from './scientific-concepts-gap'

describe('P0 academic corrections: student-facing assembled questions', () => {
  it('AP-011–020 assembled anatomy keys and publisher-neutral student text', () => {
    for (let n = 11; n <= 20; n++) {
      const id = 'AP-' + String(n).padStart(3, '0')
      const q = anatomyPhysiologyQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.correctOptionId, id).toBe('a')
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    expect(anatomyPhysiologyQuestions.find(q => q.id === 'AP-011')!.explanation).toMatch(/clavicle.*sternum.*scapula/i)
    expect(anatomyPhysiologyQuestions.find(q => q.id === 'AP-014')!.explanation).toMatch(/masseter.*mandible/i)
  })

  it('AP-001–010 maintain anatomically correct answers and neutral learner-facing language', () => {
    for (let n = 1; n <= 10; n++) {
      const id = 'AP-' + String(n).padStart(3, '0')
      const q = anatomyPhysiologyQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    expect(anatomyPhysiologyQuestions.find(q => q.id === 'AP-004')!.explanation)
      .toMatch(/smooth muscle.*hair follicle/i)
  })

  it('IC-071–078 assembled safety questions preserve valid keys and original teaching facts', () => {
    for (let n = 71; n <= 78; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    const chemical = infectionControlQuestions.find(q => q.id === 'IC-077')!
    expect(chemical.explanation).toMatch(/Safety Data Sheet/)
    const exposure = infectionControlQuestions.find(q => q.id === 'IC-072')!
    expect(exposure.explanation).toMatch(/non-intact skin/)
  })

  it('IC-061–070 assembled infection-control questions use valid keys and neutral wording', () => {
    for (let n = 61; n <= 70; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    expect(infectionControlQuestions.find(q => q.id === 'IC-066')!.explanation).toMatch(/spores/i)
    expect(infectionControlQuestions.find(q => q.id === 'IC-070')!.explanation).toMatch(/Safety Data Sheet/i)
  })

  it('IC-051–060 assembled infection-control answers and publisher-neutral public text', () => {
    for (let n = 51; n <= 60; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    const byId = (id: string) => infectionControlQuestions.find(q => q.id === id)!
    expect(byId('IC-051').explanation).toMatch(/Safety Data Sheet/i)
    expect(byId('IC-058').explanation).toMatch(/regardless of reported health history/i)
    expect(byId('IC-059').explanation).toMatch(/head lice/i)
    expect(byId('IC-060').explanation).toMatch(/laundered/i)
  })

  it('IC-041–050 assembled safety keys and publisher-neutral learner fields', () => {
    for (let n = 41; n <= 50; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    expect(infectionControlQuestions.find(q => q.id === 'IC-042')!.explanation).toMatch(/clean and disinfect/i)
    expect(infectionControlQuestions.find(q => q.id === 'IC-050')!.explanation).toMatch(/recontaminated/i)
  })

  it('IC-031–040 retain correct assembled infection-control answers and neutral learner text', () => {
    for (let n = 31; n <= 40; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    expect(infectionControlQuestions.find(q => q.id === 'IC-031')!.explanation).toMatch(/potentially infectious/i)
    expect(infectionControlQuestions.find(q => q.id === 'IC-035')!.explanation).toMatch(/wet-contact time/i)
    expect(infectionControlQuestions.find(q => q.id === 'IC-039')!.explanation).toMatch(/cross-contamination/i)
  })

  it('IC-021–030 assembled safety items have answer-aligned options and neutral student text', () => {
    for (let n = 21; n <= 30; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect([q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
    const byId = (id: string) => infectionControlQuestions.find(q => q.id === id)!
    expect(byId('IC-021').options[0].text).toMatch(/state regulatory agency|state board/i)
    expect(byId('IC-024').options[0].text).toMatch(/medically treat/i)
    expect(byId('IC-025').options[0].text).toMatch(/pediculosis capitis/i)
    expect(byId('IC-026').options[0].text).toMatch(/laundered/i)
    expect(byId('IC-027').options[0].text).toMatch(/covered or closed/i)
  })

  it('IC-013–020 assembled infection-control keys match their teaching explanations', () => {
    for (let n = 13; n <= 20; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
      expect(q!.correctOptionId, id).toBe('a')
    }
    const cases = [
      ['IC-013', /cleaning removes (?:visible )?soil and debris/i],
      ['IC-014', /debris can (?:prevent disinfectant|shield part of the surface.*disinfectant)/i],
      ['IC-015', /dilution specified on the label/i],
      ['IC-016', /discard it after use/i],
      ['IC-017', /hand hygiene/i],
      ['IC-018', /barrier.*reduce exposure/i],
      ['IC-019', /replace the compromised glove/i],
      ['IC-020', /OSHA/i],
    ] as const
    for (const [id, expectedAnswer] of cases) {
      const q = infectionControlQuestions.find(item => item.id === id)!
      expect(q.options.find(o => o.id === q.correctOptionId)?.text, id).toMatch(expectedAnswer)
      expect([q.prompt, q.explanation, ...q.options.map(o => o.text)].join(' '), id)
        .not.toMatch(/\b(?:Milady|Cengage)\b/i)
    }
  })

  it('IC-001–012 preserve correct infection-control facts in assembled bank', () => {
    for (let n = 1; n <= 12; n++) {
      const id = 'IC-' + String(n).padStart(3, '0')
      const q = infectionControlQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.options, id).toHaveLength(4)
      expect(q!.options.filter(o => o.id === q!.correctOptionId), id).toHaveLength(1)
    }
    const contact = infectionControlQuestions.find(q => q.id === 'IC-002')!
    expect(contact.options.find(o => o.id === contact.correctOptionId)?.text).toMatch(/product label/i)
    expect(contact.explanation).toMatch(/wet-contact time/i)
    expect(contact.explanation).not.toMatch(/\b(?:Milady|Cengage)\b/i)
    const contagious = infectionControlQuestions.find(q => q.id === 'IC-007')!
    expect(contagious.prompt).toMatch(/description.*contagious disease/i)
    expect(contagious.options.find(o => o.id === contagious.correctOptionId)?.text).toMatch(/spread from one person to another/i)
    expect(contagious.explanation).toMatch(/spread from one person to another/i)
  })

  it('HS-023 asks an answerable androgenetic hair-loss question with coherent options', () => {
    const q = hairScalpDisorderQuestions.find(item => item.id === 'HS-023')
    expect(q).toBeDefined()
    expect(q!.prompt).toMatch(/androgenetic.*hair loss/i)
    expect(q!.prompt).not.toMatch(/Milady|Cengage/i)
    expect(q!.correctOptionId).toBe('a')
    const answer = q!.options.find(o => o.id === q!.correctOptionId)?.text
    expect(answer).toMatch(/genetics.*age.*hormonal/i)
    expect(answer).not.toMatch(/service decision|scalp assessment/i)
    expect(q!.explanation).toMatch(/inherited|androgen/i)
    // Protect public-facing wording only. Keep sourceBasis as restricted audit provenance.
    const publicFields = [q!.prompt, q!.explanation, ...q!.options.map(option => option.text)].join(' ')
    expect(publicFields).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    expect(q!.options).toHaveLength(4)
  })

  it('HS-021/022 remove publisher branding from visible question fields', () => {
    for (const id of ['HS-021', 'HS-022']) {
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q).toBeDefined()
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible).not.toMatch(/\\b(?:Milady|Cengage)\\b/i)
      expect(q!.correctOptionId).toBe('a')
    }
  })

  it('HS-024 through HS-027 have publisher-neutral assembled student wording', () => {
    for (const id of ['HS-024', 'HS-025', 'HS-026', 'HS-027']) {
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('HS-028/029 and SCG-007–012 present publisher-neutral learner text', () => {
    const targets = [
      ...['HS-028', 'HS-029'].map(id => hairScalpDisorderQuestions.find(q => q.id === id)),
      ...['SCG-007', 'SCG-008', 'SCG-009', 'SCG-010', 'SCG-011', 'SCG-012'].map(id => scientificConceptGapQuestions.find(q => q.id === id)),
    ]
    for (const q of targets) {
      expect(q).toBeDefined()
      expect(q!.correctOptionId).toBe('a')
      expect(q!.options).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(option => option.text)].join(' ')
      expect(visible).not.toMatch(/\\b(?:Milady|Cengage)\\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('SCG-013–020 have coherent keys and publisher-neutral learner wording', () => {
    for (let n = 13; n <= 20; n++) {
      const id = 'SCG-' + String(n).padStart(3, '0')
      const q = scientificConceptGapQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
    const ph = scientificConceptGapQuestions.find(item => item.id === 'SCG-017')!
    expect(ph.options.find(o => o.id === ph.correctOptionId)?.text).toMatch(/tenfold change in hydrogen-ion activity/)
    expect(ph.explanation).toMatch(/hydrogen-ion activity/)
  })

  it('SCG-021–028 preserve keys and avoid publisher-branded student text', () => {
    for (let n = 21; n <= 28; n++) {
      const id = 'SCG-' + String(n).padStart(3, '0')
      const q = scientificConceptGapQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
    const oxidation = scientificConceptGapQuestions.find(q => q.id === 'SCG-028')!
    expect(oxidation.explanation).toMatch(/oxidation-state changes/)
  })

  it('SCG-033–036 preserve student-safe wording and classify eczema as dermatitis', () => {
    for (let n = 33; n <= 36; n++) {
      const id = 'SCG-' + String(n).padStart(3, '0')
      const q = scientificConceptGapQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
    const eczema = scientificConceptGapQuestions.find(q => q.id === 'SCG-036')!
    expect(eczema.options.find(o => o.id === 'a')?.text).toMatch(/eczema is a type of dermatitis/i)
  })

  it('SCG-037–042 keep publisher references out of visible content and preserve safety keys', () => {
    for (let n = 37; n <= 42; n++) {
      const id = 'SCG-' + String(n).padStart(3, '0')
      const q = scientificConceptGapQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
    const inflamed = scientificConceptGapQuestions.find(q => q.id === 'SCG-042')!
    expect(inflamed.options.find(o => o.id === 'a')?.text).toMatch(/Avoid services over inflamed skin/)
  })

  it('HS-030–035 have correct keys and publisher-neutral visible wording', () => {
    for (let n = 30; n <= 35; n++) {
      const id = 'HS-' + String(n).padStart(3, '0')
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('HS-036–041 keep verified keys and avoid visible publisher attribution', () => {
    for (let n = 36; n <= 41; n++) {
      const id = 'HS-' + String(n).padStart(3, '0')
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('HS-042–047 have stable keys and publisher-neutral student fields', () => {
    for (let n = 42; n <= 47; n++) {
      const id = 'HS-' + String(n).padStart(3, '0')
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('HS-048–051 preserve key and remove publisher-facing attribution', () => {
    for (let n = 48; n <= 51; n++) {
      const id = 'HS-' + String(n).padStart(3, '0')
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
    const ringed = hairScalpDisorderQuestions.find(q => q.id === 'HS-051')!
    expect(ringed.explanation).toMatch(/pili annulati/i)
  })

  it('SCG-015 defines redox by oxidation-number change instead of mandatory oxygen gain', () => {
    const q = scientificConceptGapQuestions.find(item => item.id === 'SCG-015')
    expect(q).toBeDefined()
    expect(q!.correctOptionId).toBe('a')
    expect(q!.prompt).toMatch(/oxidation and reduction/i)
    const answer = q!.options.find(o => o.id === 'a')?.text ?? ''
    expect(answer).toMatch(/increases oxidation number.*decreases oxidation number/i)
    expect(q!.explanation).toMatch(/oxygen transfer.*not a requirement/i)
    // Protect public-facing wording only. Keep sourceBasis as restricted audit provenance.
    const publicFields = [q!.prompt, q!.explanation, ...q!.options.map(option => option.text)].join(' ')
    expect(publicFields).not.toMatch(/\\b(?:Milady|Cengage)\\b|sourceBasis|sourceProvenance/i)
    expect(q!.options).toHaveLength(4)
  })
})
