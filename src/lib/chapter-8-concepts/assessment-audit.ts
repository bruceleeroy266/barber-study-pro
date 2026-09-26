export type Chapter8AssessmentAuditAction = 'KEEP' | 'REWRITE' | 'REPLACE'

export interface Chapter8AssessmentAuditEntry {
  questionId: `qq-8-${string}`
  action: Chapter8AssessmentAuditAction
  reason: string
}

const qq = (n: number): `qq-8-${string}` =>
  `qq-8-${String(n).padStart(3, '0')}`

export const chapter8AssessmentAudit: readonly Chapter8AssessmentAuditEntry[] = [
  { questionId: qq(1), action: 'KEEP', reason: 'Accurate foundational distinction between electricity as energy and matter; suitable as one of only three easy anchors.' },
  { questionId: qq(2), action: 'REWRITE', reason: 'Correct conductor concept, but recall-only and distractors are too easy for the Chapter 7+ standard.' },
  { questionId: qq(3), action: 'REWRITE', reason: 'Correct open-circuit concept, but should require applying the circuit idea to equipment behavior.' },
  { questionId: qq(4), action: 'KEEP', reason: 'Accurate DC direction concept; retained as a concise easy anchor.' },
  { questionId: qq(5), action: 'REWRITE', reason: 'Correct voltage definition but pure vocabulary recall; should be applied to a nameplate/supply decision.' },
  { questionId: qq(6), action: 'REPLACE', reason: 'A single universal “standard US wall voltage” question is unnecessarily broad and weak; replace with equipment-rating application.' },
  { questionId: qq(7), action: 'REPLACE', reason: 'UL-only framing is too narrow; replace with recognized listing/certification and workplace-equipment reasoning.' },
  { questionId: qq(8), action: 'REPLACE', reason: 'Universal “GFCI REQUIRED near all water sources” legal claim is not supportable across jurisdictions.' },
  { questionId: qq(9), action: 'REWRITE', reason: 'Source-backed visible-light fact can stay, but should be connected to visible versus invisible spectrum reasoning.' },
  { questionId: qq(10), action: 'REPLACE', reason: 'Universal five-minute light-therapy maximum conflicts with device-specific safety boundaries.' },

  { questionId: qq(11), action: 'REWRITE', reason: 'Body-conduction concept is sound but should test a wet-hand safety decision rather than recognition.' },
  { questionId: qq(12), action: 'REWRITE', reason: 'Short-circuit hazard is sound but should require stop-use/escalation reasoning.' },
  { questionId: qq(13), action: 'REPLACE', reason: '“Charger uses AC only” is conceptually incomplete because wall AC is converted to DC for the battery.' },
  { questionId: qq(14), action: 'KEEP', reason: 'Watts = amps × volts is a stable source-backed relationship and retained as the third easy anchor.' },
  { questionId: qq(15), action: 'REWRITE', reason: 'Fuse/breaker distinction is accurate but too recall-heavy; convert to an overload scenario.' },
  { questionId: qq(16), action: 'REWRITE', reason: 'Grounding concept is valid, but “safe escape path” language is too absolute; test the decision not the slogan.' },
  { questionId: qq(17), action: 'REWRITE', reason: 'Anode color is source-backed but recall-only; connect polarity identification to a permitted procedure setup.' },
  { questionId: qq(18), action: 'REWRITE', reason: 'Cataphoresis/anode association is source-backed but should be framed as source terminology, not guaranteed physiology.' },
  { questionId: qq(19), action: 'REPLACE', reason: '“Short wavelength penetrates less / long penetrates deeper” is an unsafe universal tissue-penetration shortcut.' },
  { questionId: qq(20), action: 'REPLACE', reason: 'Guaranteed blue-LED acne/bacteria treatment claim is too medical and device-independent.' },

  { questionId: qq(21), action: 'REPLACE', reason: 'The calculation is useful, but the explanation makes an unsupported universal circuit-capacity conclusion.' },
  { questionId: qq(22), action: 'REPLACE', reason: 'Collapses converter and rectifier terminology; replace with a correct AC-to-DC charging-system scenario.' },
  { questionId: qq(23), action: 'REWRITE', reason: 'Strong safety scenario; retain concept but make distractors more plausible and explanation more professional.' },
  { questionId: qq(24), action: 'REPLACE', reason: 'Universal galvanic contraindication list and “oily skin” exception are not safe device-independent assessment logic.' },
  { questionId: qq(25), action: 'REPLACE', reason: 'Universal pole/product rule should not be assessed without product/device/procedure qualification.' },
  { questionId: qq(26), action: 'REWRITE', reason: 'High-frequency characteristics are source-backed; increase application and distinguish from microcurrent/galvanic.' },
  { questionId: qq(27), action: 'REWRITE', reason: 'UVC germicidal association is source-backed, but “sterilization purposes” can imply replacement of required infection control.' },
  { questionId: qq(28), action: 'REPLACE', reason: 'Absolute pacemaker/metal-implant contraindication and waiver/liability wording must become device-specific screening logic.' },
  { questionId: qq(29), action: 'REWRITE', reason: 'Selective photothermolysis concept is sound; add barber-scope/authorization reasoning.' },
  { questionId: qq(30), action: 'REPLACE', reason: 'Medical-treatment wording plus fixed UV distance/exposure guidance is unsafe and outdated as a universal test item.' },
]

export const chapter8AssessmentAuditCounts = chapter8AssessmentAudit.reduce(
  (counts, entry) => {
    counts[entry.action] += 1
    return counts
  },
  { KEEP: 0, REWRITE: 0, REPLACE: 0 } as Record<Chapter8AssessmentAuditAction, number>,
)
