# ASCYN PRO — Research & Intelligence Archive

**Archive Established:** 2026-08-14  
**Archivist:** Ping (CTO/CPO)  
**Purpose:** Permanent, organized preservation of approved and verified research for ASCYN PRO product and architecture decisions  
**Status:** ACTIVE — Stability/Support Mode  
**Protected Baseline:** `61a8ef8` (Phase 6 NABBA Demo)

---

## Archive Mission

This archive preserves competitive, licensing, product-strategy, and architecture research so that future decisions can trace back to the evidence that created them. It answers:

- What did we learn?
- Where did the information come from?
- When was it verified?
- How confident are we?
- What does it potentially mean for ASCYN PRO?
- Did we make a decision because of it?
- Has anything been implemented because of it?
- Does the information need to be reverified later?

---

## Critical Guardrails

**DO NOT:**
- Modify production code
- Modify Supabase
- Modify database schemas
- Modify the NABBA demo
- Modify curriculum
- Modify assessment logic
- Modify readiness calculations
- Implement CIB alignment
- Implement competency architecture
- Implement exam blueprint architecture
- Implement integrations
- Implement predictive analytics
- Refactor existing application code

**Protected Baseline:** `61a8ef8` — Do not disturb.

---

## Archive Structure

```
docs/research/
├── 00_MASTER_INDEX.md                    ← This file
├── competitive-intelligence/             ← Competitor research
│   ├── 00_INDEX.md
│   ├── pivot-point.md
│   ├── milady.md
│   ├── coursekey.md
│   ├── competitive-feature-matrix.md
│   ├── competitive-claims.md
│   └── nabba-objections.md
├── licensing-intelligence/               ← Licensing research
│   ├── 00_INDEX.md
│   ├── national-overview.md
│   ├── nic.md
│   ├── psi.md
│   ├── prov.md
│   ├── prometric.md
│   ├── dl-roope.md
│   ├── state-research/
│   │   ├── oklahoma.md
│   │   ├── texas.md
│   │   ├── alaska.md
│   │   ├── delaware.md
│   │   ├── washington.md
│   │   ├── wisconsin.md
│   │   └── west-virginia.md
│   ├── candidate-information-bulletins.md
│   ├── exam-blueprints.md
│   ├── exam-versions.md
│   └── 50-state-master-map.md
├── product-strategy/                     ← Product strategy research
│   ├── 00_INDEX.md
│   ├── current-product-position.md
│   ├── strategic-hypotheses.md
│   ├── validated-findings.md
│   ├── unvalidated-hypotheses.md
│   ├── nabba-positioning.md
│   └── deferred-ideas.md
├── architecture-research/                ← Architecture research
│   ├── 00_INDEX.md
│   ├── current-architecture-audit.md
│   ├── future-requirements.md
│   ├── exam-blueprint-requirements.md
│   ├── competency-requirements.md
│   ├── intervention-workflow-requirements.md
│   ├── integration-requirements.md
│   └── architecture-risks.md
├── nabba-validation/                     ← NABBA validation research
│   ├── 00_INDEX.md
│   ├── research-questions.md
│   ├── product-hypotheses.md
│   ├── school-feedback.md
│   ├── objections.md
│   ├── requested-features.md
│   ├── validation-results.md
│   └── post-nabba-findings.md
├── decision-log/                         ← Strategic decisions
│   ├── 00_INDEX.md
│   └── decisions.md
├── sources/                              ← Source index
│   ├── 00_INDEX.md
│   ├── competitor-sources.md
│   ├── licensing-sources.md
│   └── state-sources.md
└── CHANGELOG.md                          ← Research change log
```

---

## Research Record Standard

All research records must include:

| Field | Description |
|-------|-------------|
| **Finding** | What was discovered |
| **Source** | Official source URL or authoritative reference |
| **Source Type** | State licensing board, NIC, PSI, Prov, Prometric, DL Roope, competitor documentation, etc. |
| **Verified Date** | When the information was checked |
| **Confidence** | CONFIRMED / PARTIAL / UNVERIFIED |
| **ASCYN PRO Implication** | Potential impact on product, strategy, marketing, or architecture |
| **Implementation Status** | RESEARCH ONLY / APPROVED FOR FUTURE CONSIDERATION / AUTHORIZED / IMPLEMENTED |
| **Reverification** | Whether periodic checking is needed |

---

## Confidence Levels

| Level | Definition |
|-------|------------|
| **CONFIRMED** | Supported by authoritative evidence |
| **PARTIAL** | Some evidence exists but additional verification is needed |
| **UNVERIFIED** | Hypothesis/research lead only |

---

## Implementation Status Levels

| Level | Definition |
|-------|------------|
| **RESEARCH ONLY** | Documented for awareness; no action authorized |
| **APPROVED FOR FUTURE CONSIDERATION** | May be considered in future planning |
| **AUTHORIZED** | Explicitly authorized for implementation |
| **IMPLEMENTED** | Actually implemented in production |

---

## Quick Navigation

| Section | Purpose | Status |
|---------|---------|--------|
| [Competitive Intelligence](competitive-intelligence/00_INDEX.md) | Competitor capabilities and positioning | ✅ Active |
| [Licensing Intelligence](licensing-intelligence/00_INDEX.md) | State licensing requirements and exam structures | ✅ Active |
| [Product Strategy](product-strategy/00_INDEX.md) | Strategic hypotheses and positioning | ✅ Active |
| [Architecture Research](architecture-research/00_INDEX.md) | Current and future architecture findings | ✅ Active |
| [NABBA Validation](nabba-validation/00_INDEX.md) | Conference research and validation | ✅ Active |
| [Decision Log](decision-log/00_INDEX.md) | Strategic decisions and rationale | ✅ Active |
| [Source Index](sources/00_INDEX.md) | Centralized source tracking | ✅ Active |
| [Changelog](CHANGELOG.md) | Research change history | ✅ Active |

---

## Current Strategic Hypothesis

**Status:** STRATEGIC HYPOTHESIS — NOT YET FULLY VALIDATED

ASCYN PRO is investigating an instructor-centered workflow around:

```
Learning Gap
    ↓
Instructor Action
    ↓
Targeted Remediation
    ↓
Follow-Up
    ↓
Evidence of Improvement
```

within the context of licensure preparation.

**Do NOT document this as proven competitive exclusivity.** NABBA will help validate the hypothesis.

---

## Key Architectural Distinction

**EXAM DEVELOPER ≠ EXAM ADMINISTRATOR**

These are NOT the same concept and must not be collapsed:

- **Exam Developer:** Organization responsible for examination content (e.g., NIC, PSI)
- **Exam Administrator:** Organization responsible for delivering the examination (e.g., Prov, PSI, Prometric, DL Roope)

Example: Oklahoma uses NIC examination content administered through Prov.

---

## Versioning Requirement

Licensing information changes. Preserve:

```
Exam → Exam Version → Effective Date → CIB → Blueprint
```

Do not overwrite historical findings simply because a newer CIB appears. Preserve history when appropriate.

---

## Competitive Research Guardrail

Absence of public evidence does NOT mean a competitor lacks a capability.

Use: **"Not confirmed in reviewed public sources"**

Not: **"Competitor does not have this"**

unless authoritative evidence supports that conclusion.

---

## Workflow for New Research

```
Research supplied
    ↓
Check against archive for conflicts/duplicates
    ↓
Preserve sources and verification dates
    ↓
Update research record
    ↓
Update decision/architecture implications if applicable
    ↓
Report what changed
```

**No code implementation follows automatically.**

---

## Contact

**Archivist:** Ping (CTO/CPO)  
**Founder:** Gabriel Arcaina  
**Archive Location:** `docs/research/`  
**Last Updated:** 2026-08-14

---

*This archive is a living knowledge-management system. Update it as research is supplied, verified, and decisions are made.*
