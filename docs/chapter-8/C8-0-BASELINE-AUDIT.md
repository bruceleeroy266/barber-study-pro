# Chapter 8 Baseline Audit — C8-0

**Chapter:** Basics of Electricity  
**Framework:** ASCYN PRO Chapters 7+ Grading & Mastery  
**Status:** Source baseline and concept architecture started

## Source hierarchy

1. The Chapter 8 textbook screenshots are the primary reference for coverage, terminology, sequence, learning objectives, and source-specific cautions.
2. The current NIC Barber Theory CIB is used for exam-domain and competency alignment.
3. ASCYN PRO production content must use original wording. Textbook sentences, tables, figures, examples, and questions are not copied into runtime content.
4. Existing Chapter 8 lesson/flashcards/quiz are audit targets, not proof of correctness.

## Source material available

The connected Chapter 8 source folder contains 12 textbook screenshots covering pages 206–217.

Verified learning objectives from those pages:

- LO 1 — define electricity.
- LO 2 — define common electrical terms and measurements.
- LO 3 — describe electrical safety devices.
- LO 4 — examine barber-relevant electrotherapy modalities subject to licensing rules.
- LO 5 — explain the electromagnetic spectrum, visible spectrum, and invisible light.
- LO 6 — identify devices used in light-therapy treatments.

ASCYN PRO rewrites those objectives into application-oriented statements while preserving their subject scope.

## Verified source coverage

The source material covers:

- electricity as energy
- complete electrical circuits
- conductors and insulators
- direct and alternating current
- current conversion
- volts, amperes, ohms, watts, kilowatts, and kilowatt-hours
- fuses and circuit breakers
- grounding and plug safety
- equipment certification/inspection and protected outlets
- safe electrical-equipment handling
- electrotherapy terminology
- polarity, anode, cathode, and electrodes
- galvanic-current pole effects
- microcurrent
- Tesla/high-frequency current
- electromagnetic spectrum
- wavelength and frequency relationships
- visible and invisible light
- ultraviolet and infrared concepts
- light-therapy devices
- LEDs and therapeutic lamps
- client/eye protection and supervision during light-based services

## NIC alignment

Current NIC Barber Theory materials place electrotherapy and light therapy inside facial hair/skin-care services. NIC also includes electrical tools inside implements/equipment and requires safety/sanitation knowledge for equipment use.

NIC alignment therefore supports Chapter 8 emphasis on:

- safe electrical tools and equipment
- electrotherapy purpose/types
- light-therapy purpose/types
- procedure and safety reasoning around facial/skin services

NIC is used for competency alignment only. ASCYN PRO does not copy NIC exam items.

## Existing implementation baseline

Existing assets are substantial but predate the Chapter 7+ mastery architecture:

- premium immersive Chapter 8 lesson exists
- approximately 80 Chapter 8 flashcards are wired into the application
- a 30-question premium quiz exists
- older enhancement reports describe the chapter as production-ready

Those prior conclusions are not accepted as C8 certification.

## Known risks requiring re-audit

The current implementation contains claims that require source or current-safety review before reuse, including:

- public/runtime "BOARD EXAM ALERT" language
- categorical legal language such as GFCI "REQUIRED" without jurisdiction context
- voltage and injury-risk absolutes
- unsourced fatal-current thresholds
- fixed claims about warm cords and resistance
- treatment contraindications presented as universal
- treatment-distance/exposure instructions that may be source-specific rather than universally safe
- medical/therapeutic claims for LEDs, ultraviolet, infrared, microcurrent, or high-frequency services
- claims that a waiver changes safety or liability requirements
- source-era treatment practices that may require scope-of-practice or manufacturer-direction boundaries

These items must be classified KEEP / REWRITE / REPLACE / SOURCE-VERIFY during later hardening phases.

## Canonical Chapter 8 concept families

| ID | Concept family | Primary scope |
|---|---|---|
| `ch8-electricity-circuits` | Electricity, Circuits, Conductors & Insulators | Foundational electrical flow |
| `ch8-current-conversion` | Direct Current, Alternating Current & Conversion | Current types and conversion |
| `ch8-electrical-measurements` | Volts, Amperes, Ohms & Watts | Electrical measurement reasoning |
| `ch8-equipment-safety` | Electrical Equipment Safety & Protective Devices | Shock/fire prevention and protective systems |
| `ch8-electrotherapy-terminology` | Electrotherapy Terminology, Polarity & Electrodes | Core modality language |
| `ch8-galvanic-current` | Galvanic Current & Polarity Effects | Galvanic concepts |
| `ch8-microcurrent-high-frequency` | Microcurrent & High-Frequency Modalities | Additional electrical modalities |
| `ch8-electromagnetic-spectrum` | Electromagnetic Spectrum, Wavelength & Light | Light-energy foundations |
| `ch8-light-modalities` | Light-Therapy Devices & Modalities | Light-based professional devices |
| `ch8-light-therapy-safety` | Light-Therapy Safety, Client Protection & Contraindications | Cross-cutting safety |

## Grading/mastery rules inherited from Chapter 7+

Chapter 8 inherits the proven Chapter 7 framework unless a Chapter 8-specific safety requirement requires an explicit extension:

- micro knowledge checks: 20%
- flashcard mastery: 10%
- chapter assessment: 40%
- scenario/application evidence: 15%
- remediation/reassessment recovery: 15%
- completion remains separate from mastery
- first-attempt misses remain preserved
- confidence requires sufficient quantity, diversity, difficulty, consistency, and recency
- high-priority safety misses can escalate more aggressively than ordinary recall misses
- remediation uses unseen concept-mapped questions
- instructor presentation uses human-readable concepts and does not expose internal IDs
- identical evidence + reference time must produce deterministic results

## C8-0 exit criteria

C8-0 can close only when:

- source baseline is documented
- six learning objectives are represented
- ten stable concept families are registered
- architecture tests pass
- Engineering Verification passes
- Vercel preview is READY on the exact branch head

After C8-0, begin **C8-1 — Grading/Evidence Schema & Electrical-Safety Mastery Rules**, reusing the Chapter 7 engine architecture while defining Chapter 8 safety-specific escalation behavior before mapping existing assets.
