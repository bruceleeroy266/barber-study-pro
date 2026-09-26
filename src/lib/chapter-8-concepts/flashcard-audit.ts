export type Chapter8FlashcardAuditAction = 'KEEP' | 'REWRITE' | 'REPLACE'

export interface Chapter8FlashcardAuditEntry {
  flashcardId: `fc-8-${string}`
  action: Chapter8FlashcardAuditAction
  reason: string
}

const fc = (n: number): `fc-8-${string}` => `fc-8-${String(n).padStart(3, '0')}`

export const chapter8FlashcardAudit: readonly Chapter8FlashcardAuditEntry[] = [
  { flashcardId: fc(1), action: 'KEEP', reason: 'Source-backed electricity-as-energy definition; wording is original and materially sound.' },
  { flashcardId: fc(2), action: 'KEEP', reason: 'Source-backed conductor/insulator distinction with acceptable examples.' },
  { flashcardId: fc(3), action: 'REWRITE', reason: 'Remove board-exam certainty and harden wet-hand/body-conduction safety wording.' },
  { flashcardId: fc(4), action: 'KEEP', reason: 'Complete/open circuit concept is source-backed and clear.' },
  { flashcardId: fc(5), action: 'REWRITE', reason: 'Keep short-circuit concept but avoid implying a narrow universal cause list.' },

  { flashcardId: fc(6), action: 'KEEP', reason: 'DC versus AC distinction is source-backed and useful.' },
  { flashcardId: fc(7), action: 'REWRITE', reason: 'Current wording incorrectly collapses converter and rectifier into one bidirectional definition.' },
  { flashcardId: fc(8), action: 'REWRITE', reason: 'Remove board-exam label and distinguish charger AC input from rectified DC charging output.' },

  { flashcardId: fc(9), action: 'REWRITE', reason: 'Keep voltage-pressure concept while avoiding a single universal U.S. supply statement.' },
  { flashcardId: fc(10), action: 'REWRITE', reason: 'Keep ampere/milliampere definitions; device-use statement needs scope/device boundary.' },
  { flashcardId: fc(11), action: 'KEEP', reason: 'Ohm and rheostat definitions are source-backed.' },
  { flashcardId: fc(12), action: 'KEEP', reason: 'Watt definition and P = V × I relationship are source-backed.' },
  { flashcardId: fc(13), action: 'REWRITE', reason: 'Math is valid but breaker-capacity conclusion is too broad and ignores circuit/load context.' },
  { flashcardId: fc(14), action: 'KEEP', reason: 'Mnemonic reinforces measurement distinctions without changing the concept.' },

  { flashcardId: fc(15), action: 'KEEP', reason: 'Fuse versus circuit-breaker distinction is source-backed.' },
  { flashcardId: fc(16), action: 'REWRITE', reason: 'Grounding concept is valid but “safe escape path” is overly absolute.' },
  { flashcardId: fc(17), action: 'REPLACE', reason: 'Universal “REQUIRED near all water sources” legal claim must become a purpose/code-context card.' },
  { flashcardId: fc(18), action: 'REWRITE', reason: 'Replace UL-only framing with recognized certification/listing and workplace requirements.' },
  { flashcardId: fc(19), action: 'REPLACE', reason: 'Board-exam certainty and “five devices every barber should know” claim should become a functional safety-device review card.' },
  { flashcardId: fc(20), action: 'REWRITE', reason: 'Stop-use response is correct; remove legal/negligence characterization.' },
  { flashcardId: fc(21), action: 'REWRITE', reason: 'Remove “water turns insulators into conductors” and fatality language; retain moisture-risk reasoning.' },
  { flashcardId: fc(22), action: 'REWRITE', reason: 'Continuous supervision is appropriate; remove negligence/legal language and speculative failure chain.' },
  { flashcardId: fc(23), action: 'REPLACE', reason: 'The 80% breaker rule and advice to spread loads across circuits are not appropriate as a universal barber rule.' },
  { flashcardId: fc(24), action: 'REWRITE', reason: 'Remove board-exam certainty and convert absolutes into professional equipment-safety decisions.' },

  { flashcardId: fc(25), action: 'REWRITE', reason: 'Electrotherapy definition is useful but scope/training/device requirements need precise wording.' },
  { flashcardId: fc(26), action: 'REWRITE', reason: 'Anode/cathode source associations should be presented as source-described modality effects, not guaranteed outcomes.' },
  { flashcardId: fc(27), action: 'REWRITE', reason: 'Mnemonic can stay only if clearly framed as source terminology rather than universal physiology.' },
  { flashcardId: fc(28), action: 'REWRITE', reason: 'Cataphoresis definition needs source-described-effect boundary.' },
  { flashcardId: fc(29), action: 'REWRITE', reason: 'Anaphoresis definition needs source-described-effect boundary.' },
  { flashcardId: fc(30), action: 'REWRITE', reason: 'Desincrustation should remain a source-described galvanic cleansing concept, not a guaranteed treatment result.' },
  { flashcardId: fc(31), action: 'REWRITE', reason: 'Iontophoresis concept is source-backed; universal pole/product rule needs device/product/procedure qualification.' },
  { flashcardId: fc(32), action: 'REPLACE', reason: 'Universal contraindication list is unsafe; replace with device-specific/client-screening decision card.' },
  { flashcardId: fc(33), action: 'REWRITE', reason: 'Microcurrent definition can stay, but “mirrors natural impulses” and sub-sensory/benefit claims require qualification.' },
  { flashcardId: fc(34), action: 'REWRITE', reason: 'High-frequency terminology is source-backed; broad benefits must be labeled source-described and device-dependent.' },

  { flashcardId: fc(35), action: 'KEEP', reason: 'Electromagnetic spectrum ordering is stable and source-backed.' },
  { flashcardId: fc(36), action: 'REWRITE', reason: 'Wavelength/frequency/energy relationship is useful, but penetration claims are too universal.' },
  { flashcardId: fc(37), action: 'KEEP', reason: 'Visible-light percentage/colors are explicitly source-backed Chapter 8 terminology.' },
  { flashcardId: fc(38), action: 'REWRITE', reason: 'UVA/UVB/UVC distinctions are source-backed but health/effect wording needs careful qualification.' },
  { flashcardId: fc(39), action: 'REWRITE', reason: 'Mnemonic oversimplifies UV effects and “Clean” can imply disinfection equivalence.' },
  { flashcardId: fc(40), action: 'REWRITE', reason: 'Remove fixed 30-inch rule and guaranteed product/therapeutic effects.' },

  { flashcardId: fc(41), action: 'REPLACE', reason: 'Universal five-minute maximum is not appropriate; replace with device-specific exposure/supervision card.' },
  { flashcardId: fc(42), action: 'REWRITE', reason: 'Keep source-described LED color associations but remove guaranteed treatment/medical outcome language.' },
  { flashcardId: fc(43), action: 'REWRITE', reason: 'Keep source therapeutic-lamp categories while avoiding guaranteed treatment claims.' },
  { flashcardId: fc(44), action: 'REPLACE', reason: 'Fixed distance/time and improvised light-path rule should become device-specific client-protection guidance.' },
  { flashcardId: fc(45), action: 'REWRITE', reason: 'Selective photothermolysis concept is useful; laser scope/authorization boundary should be explicit.' },

  { flashcardId: fc(46), action: 'REWRITE', reason: 'Fuse/breaker distinction is good; remove “on the state board exam” certainty.' },
  { flashcardId: fc(47), action: 'REWRITE', reason: 'Scope-check decision is good but should include client screening and manufacturer/device requirements.' },
  { flashcardId: fc(48), action: 'KEEP', reason: 'Rejecting tape as a permanent repair and removing damaged equipment from use is appropriate.' },
  { flashcardId: fc(49), action: 'REPLACE', reason: 'Absolute pacemaker/metal-implant contraindication and liability claim must become device-specific contraindication screening.' },
  { flashcardId: fc(50), action: 'REPLACE', reason: '“Every state board exam” claim and compressed unsafe review list should become a neutral high-value concept synthesis card.' },
]

export const chapter8FlashcardAuditCounts = chapter8FlashcardAudit.reduce(
  (counts, entry) => {
    counts[entry.action] += 1
    return counts
  },
  { KEEP: 0, REWRITE: 0, REPLACE: 0 } as Record<Chapter8FlashcardAuditAction, number>,
)
