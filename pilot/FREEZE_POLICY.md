# ASCYN PRO - Pilot Production Freeze Policy

**Version:** 1.0  
**Effective Date:** 2026-08-03  
**Status:** Active

---

## Purpose

Establish clear governance for production changes during the pilot period to ensure stability and isolate pilot issues from new development.

---

## Freeze Policy

### Main Branch Restrictions

The `main` branch accepts **ONLY** the following types of changes:

| Type | Description | Approval Required |
|---|---|---|
| Critical Bug Fixes | Fixes for system-down, data-loss, or security issues | Project Owner |
| Security Fixes | Patches for vulnerabilities | Project Owner |
| Production Hotfixes | Urgent fixes for production issues | Project Owner |

### Prohibited Changes

The following are **NOT ALLOWED** on `main` during pilot:

- New features
- Enhancements to existing features
- UI/UX improvements (unless critical)
- Performance optimizations (unless critical)
- Refactoring
- Documentation updates (unless critical)
- Dependency updates (unless security-related)

---

## Feature Branch Workflow

### All New Development Must Use Feature Branches

```
main (protected)
  │
  ├── feature/new-feature-name
  ├── fix/bug-description
  └── hotfix/urgent-fix
```

### Branch Naming Convention

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New features | `feature/messaging-system` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `hotfix/` | Urgent production fixes | `hotfix/security-patch` |
| `chore/` | Maintenance | `chore/update-deps` |

### Merge Process

1. **Create feature branch** from `main`
2. **Develop and test** in feature branch
3. **Create pull request** with description
4. **Review and approve** (Project Owner)
5. **Merge to main** (only if approved for pilot)
6. **Deploy to production** (automatic)

---

## Pilot Period

### Start Date

2026-08-03

### End Date

TBD — To be determined based on pilot feedback and success criteria

### Review Points

- **Weekly:** Review pilot metrics and feedback
- **Mid-Pilot:** Assess if freeze should continue
- **Post-Pilot:** Evaluate and plan next phase

---

## Exception Process

### Requesting an Exception

If a change is needed that doesn't fit the freeze policy:

1. **Document the need** — Why is this change necessary?
2. **Assess the risk** — What could go wrong?
3. **Propose mitigation** — How will you minimize risk?
4. **Get approval** — Project Owner must approve
5. **Document decision** — Record in CHANGELOG.md

### Emergency Changes

For critical production issues:

1. **Fix immediately** — Don't wait for approval
2. **Notify stakeholders** — As soon as possible
3. **Document after** — Complete post-incident review
4. **Review process** — Improve for next time

---

## Enforcement

### Automated Checks

- Branch protection rules on `main`
- Required reviews before merge
- Status checks must pass

### Manual Review

- Project Owner reviews all merges
- Technical Lead reviews all deployments
- Weekly review of all changes

---

## Violations

### If Unauthorized Changes Are Merged

1. **Immediate rollback** — Revert the change
2. **Document incident** — Record in INCIDENTS.md
3. **Review process** — How did this happen?
4. **Update controls** — Prevent recurrence

---

## Communication

### Stakeholders

| Role | Responsibility |
|---|---|
| Project Owner | Final approval on all changes |
| Technical Lead | Review and deploy changes |
| Developers | Follow freeze policy |
| Pilot Users | Report issues, not expect new features |

### Channels

- **GitHub:** All code changes
- **SITREP:** Weekly status updates
- **Daily Log:** Daily operations

---

## Review and Update

### This Policy Will Be Reviewed

- **Weekly** during pilot
- **Post-pilot** for next phase
- **As needed** for exceptions

### Updates

Updates to this policy require:
- Project Owner approval
- Documentation in CHANGELOG.md
- Communication to all stakeholders

---

## Acknowledgment

By participating in the ASCYN PRO pilot, all team members acknowledge and agree to follow this freeze policy.

---

**End of Freeze Policy**
