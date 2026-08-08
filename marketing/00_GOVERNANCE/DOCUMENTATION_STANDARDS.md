# Documentation Standards

*Document ID:* 00_GOVERNANCE-001
*Version:* 0.1
*Status:* Approved
*Owner:* Gabriel Arcaina
*Author:* Ping
*Last Updated:* 2026-08-06
*Next Review:* 2026-09-06

---

## Purpose

Establish the standards, workflows, and rules governing all ASCYN PRO Brand & Marketing Workspace documentation.

## Scope

This document covers:
- Document lifecycle and status definitions
- File naming conventions
- Template usage
- Promotion workflow from workspace to Git repository
- Content policies and restrictions

This document does not cover:
- Specific brand content (covered in discovery documents)
- Technical implementation details

## Dependencies

None — this is a foundational governance document.

## Related Documents

- `00_MASTER_INDEX.md` — Navigation and status dashboard
- `DECISIONS_LOG.md` — Record of all approved decisions
- `templates/DOCUMENT_TEMPLATE.md` — Standard document template

---

## Document Lifecycle

All documents follow this lifecycle:

```
Draft → Review → Revision → Approved → Archived
```

### Status Definitions

| Status | Definition | Next Action |
|--------|-----------|-------------|
| **Draft** | Initial creation, work in progress | Submit for Review |
| **Review** | Under active review by owner | Provide feedback or approve |
| **Revision** | Feedback received, being updated | Resubmit for Review |
| **Approved** | Finalized and approved by owner | Promote to Git repository |
| **Archived** | Superseded or no longer active | Retain for historical record |

### Status Transitions

- **Draft → Review:** Author believes document is ready for owner review
- **Review → Revision:** Owner provides feedback requiring changes
- **Review → Approved:** Owner accepts document as final
- **Revision → Review:** Author completes revisions and resubmits
- **Approved → Archived:** Document is superseded by newer version or no longer relevant
- **Any → Archived:** Owner decides to retire document

---

## File Naming Conventions

### Folder Names

- Use `UPPER_SNAKE_CASE`
- Prefix with two-digit number for ordering: `01_`, `02_`, etc.
- Examples: `01_BRAND_FOUNDATION`, `18_STRATEGY`

### Document Names

- Use `UPPER_SNAKE_CASE.md`
- Be descriptive but concise
- Examples: `BRAND_MISSION.md`, `TARGET_AUDIENCE_PERSONAS.md`

### Version Control

- Version tracked in document header, not filename
- Git tracks file history; document header tracks approval status

---

## Document Template Standard

All documents must use the standard template located at:
`00_GOVERNANCE/templates/DOCUMENT_TEMPLATE.md`

Required header fields:
- Document ID
- Version
- Status
- Owner
- Author
- Last Updated
- Next Review

Required sections:
- Purpose
- Scope
- Dependencies
- Related Documents
- Revision History
- Approval

---

## Promotion Workflow

### Workspace → Git Repository

Only documents with **Approved** status may be promoted to the official Git repository.

**Promotion Checklist:**
- [ ] Document status is Approved
- [ ] All placeholders resolved or explicitly marked Pending
- [ ] Owner approval signature complete
- [ ] Cross-links verified
- [ ] No confidential or unapproved information included

**Promotion Process:**
1. Author confirms document meets checklist
2. Copy approved document to Git repository mirror location
3. Update Git repository README if new folder/document added
4. Commit with message: `docs: promote [Document Name] v[Version]`
5. Update workspace document with promotion date and commit hash

### Repository Structure

Git repository mirror located at:
`C:\Users\gabeb\Projects\barber-study-pro\marketing\`

Folder structure mirrors workspace exactly. Only Approved documents exist in repository.

---

## Content Policies

### Discovery Content Policy

All Brand Discovery content follows these rules:

1. **Raw Responses:** Record Gabriel's raw responses exactly as given
2. **Questions & Challenges:** Record all questions, challenges, and feedback
3. **Revised Versions:** Record all revised versions
4. **Final Approved:** Record the final approved version
5. **Promotion:** Only approved versions promoted to official documents
6. **Preservation:** Never overwrite previous drafts
7. **Evolution:** Preserve the entire evolution of each section

### Accuracy Standard

- **Accuracy > Speed:** When information is unknown, mark as "Pending"
- **No Assumptions:** Never invent facts or treat generated content as truth
- **Current vs. Future:** Separate current facts from future aspirations
- **Evidence Required:** All claims must be verifiable or marked as aspirational

### Placeholder Discipline

- Use `[Pending]` for unknown information
- Use `[Placeholder: description]` for structure awaiting content
- Never leave placeholders in Approved documents without explicit owner approval

---

## Notes

This document establishes the foundation for all ASCYN PRO documentation. Any changes to these standards require owner approval and a version increment.

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-08-06 | Ping | Initial draft |

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Owner | Gabriel Arcaina | 2026-08-06 | Approved via directive |

---

*This document is part of the ASCYN PRO Brand & Marketing Workspace. See `00_MASTER_INDEX.md` for navigation.*
