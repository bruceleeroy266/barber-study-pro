# Quality Standards — Production Readiness Criteria

**Purpose:** This file defines what "done" means and how to meet production standards. Follow these standards to ensure all work meets the quality bar.

---

## Table of Contents

1. [Definition of Done](#definition-of-done)
2. [Code Quality Standards](#code-quality-standards)
3. [Testing Standards](#testing-standards)
4. [Documentation Standards](#documentation-standards)
5. [Security Standards](#security-standards)
6. [Performance Standards](#performance-standards)
7. [Accessibility Standards](#accessibility-standards)
8. [Production Readiness Checklist](#production-readiness-checklist)

---

## Definition of Done

### Core Principle

**Production-ready means stable, secure, responsive, accessible, maintainable, tested, and documented.**

### Done Criteria

A task is "done" when:

- [ ] **Code complete** — All code written and committed
- [ ] **Build passes** — `npm run build` exit code 0
- [ ] **Lint passes** — `npm run lint` exit code 0
- [ ] **TypeScript passes** — `npx tsc --noEmit` exit code 0
- [ ] **Tests pass** — All tests pass (if tests exist)
- [ ] **Manually verified** — Feature tested in browser/environment
- [ ] **Documented** — Documentation updated
- [ ] **No regressions** — Existing functionality still works
- [ ] **Evidence provided** — Verification documented with evidence

### Not Done Criteria

A task is NOT done if:

- ❌ Build fails
- ❌ Lint fails
- ❌ TypeScript fails
- ❌ Tests fail
- ❌ Feature not manually verified
- ❌ Documentation missing or outdated
- ❌ Regressions introduced
- ❌ No evidence of verification

---

## Code Quality Standards

### TypeScript Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Type safety** | No `any` types without justification | `npx tsc --noEmit` |
| **Strict mode** | TypeScript strict mode enabled | `tsconfig.json` |
| **Explicit types** | Function parameters and return types explicit | Code review |
| **No unused variables** | All variables used or prefixed with `_` | `npm run lint` |
| **Consistent naming** | camelCase for variables/functions, PascalCase for components | Code review |

### React Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Component structure** | Functional components with hooks | Code review |
| **Props typing** | All props typed with interfaces | `npx tsc --noEmit` |
| **Hook dependencies** | All hook dependencies included | `npm run lint` |
| **No inline styles** | Use Tailwind CSS classes | Code review |
| **Accessibility** | ARIA labels, keyboard navigation | Manual testing |

### Next.js Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **App Router** | Use App Router, not Pages Router | Code review |
| **Server Components** | Use Server Components by default | Code review |
| **Client Components** | Use `"use client"` only when needed | Code review |
| **Route handlers** | Use route handlers for API endpoints | Code review |
| **Middleware** | Use middleware for auth/logging | Code review |

### Code Organization Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **File naming** | kebab-case for files, PascalCase for components | Code review |
| **Directory structure** | Logical grouping by feature | Code review |
| **Import order** | React → Next.js → Third-party → Local | Code review |
| **Export style** | Named exports for utilities, default for components | Code review |
| **No dead code** | Remove unused imports, variables, functions | `npm run lint` |

---

## Testing Standards

### Test Coverage

| Area | Minimum Coverage | Target Coverage |
|------|-----------------|-----------------|
| **Critical paths** | 100% | 100% |
| **Authentication** | 100% | 100% |
| **Authorization** | 100% | 100% |
| **Data mutations** | 90% | 100% |
| **UI components** | 70% | 90% |
| **Utilities** | 80% | 100% |

### Test Types

| Type | Purpose | When to Use |
|------|---------|-------------|
| **Unit tests** | Test individual functions/components | For utilities, helpers, hooks |
| **Integration tests** | Test component interactions | For features, workflows |
| **E2E tests** | Test complete user flows | For critical paths |
| **Manual tests** | Test in browser/environment | For all features |

### Test Quality Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Test names** | Descriptive, follow "should [behavior] when [condition]" | Code review |
| **Test isolation** | Tests don't depend on each other | Test execution |
| **Test data** | Use fixtures, not production data | Code review |
| **Assertions** | Clear, specific assertions | Code review |
| **No flaky tests** | Tests pass consistently | Multiple runs |

### Manual Testing Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Happy path** | Test primary user flow | Manual testing |
| **Edge cases** | Test boundary conditions | Manual testing |
| **Error cases** | Test error handling | Manual testing |
| **Responsive** | Test on mobile, tablet, desktop | Manual testing |
| **Accessibility** | Test with keyboard, screen reader | Manual testing |

---

## Documentation Standards

### Code Documentation

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Complex logic** | Comments explain why, not what | Code review |
| **Public APIs** | JSDoc comments for exported functions | Code review |
| **Type definitions** | Comments for complex types | Code review |
| **TODOs** | Tracked in issue tracker, not code | Code review |

### Project Documentation

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **README** | Project overview, setup instructions | Manual review |
| **Architecture** | System design, data flow, components | Manual review |
| **API docs** | Endpoint documentation | Manual review |
| **Runbooks** | Operational procedures | Manual review |
| **Decision records** | Significant decisions documented | Manual review |

### Documentation Quality

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Accuracy** | Documentation matches reality | Manual review |
| **Currency** | Documentation updated with changes | Manual review |
| **Clarity** | Clear, concise language | Manual review |
| **Completeness** | All necessary information included | Manual review |
| **Evidence** | Claims backed by evidence | Manual review |

---

## Security Standards

### Authentication Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Password hashing** | Bcrypt or better | Code review |
| **Session management** | Secure session tokens | Code review |
| **MFA** | Optional but supported | Manual testing |
| **Password reset** | Secure token-based flow | Manual testing |
| **Account lockout** | After failed attempts | Manual testing |

### Authorization Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **RBAC** | Role-based access control | Code review |
| **Principle of least privilege** | Users have minimum necessary permissions | Code review |
| **Server-side checks** | All authorization checked on server | Code review |
| **RLS policies** | Database-level security | Manual testing |
| **Audit logging** | Security events logged | Code review |

### Data Protection Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Encryption at rest** | Database encryption | Infrastructure review |
| **Encryption in transit** | HTTPS only | Infrastructure review |
| **Input validation** | All inputs validated | Code review |
| **SQL injection prevention** | Parameterized queries | Code review |
| **XSS prevention** | Output encoding | Code review |

### Security Testing

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Penetration testing** | Before production launch | External audit |
| **Vulnerability scanning** | Regular scans | Tool execution |
| **Dependency scanning** | Check for known vulnerabilities | `npm audit` |
| **Security headers** | CSP, HSTS, etc. | Manual testing |
| **Error handling** | No sensitive data in errors | Manual testing |

---

## Performance Standards

### Load Time Standards

| Metric | Target | Maximum |
|--------|--------|---------|
| **First Contentful Paint** | < 1.0s | < 1.5s |
| **Largest Contentful Paint** | < 2.0s | < 2.5s |
| **Time to Interactive** | < 3.0s | < 4.0s |
| **Total Blocking Time** | < 200ms | < 300ms |
| **Cumulative Layout Shift** | < 0.1 | < 0.25 |

### Optimization Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Code splitting** | Route-based code splitting | Build analysis |
| **Image optimization** | Next.js Image component | Code review |
| **Font optimization** | Font subsetting, preload | Build analysis |
| **Bundle size** | < 500KB initial bundle | Build analysis |
| **Caching** | Appropriate cache headers | Manual testing |

### Database Performance

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Indexes** | Indexes on frequently queried columns | Database review |
| **Query optimization** | No N+1 queries | Code review |
| **Connection pooling** | Proper connection management | Infrastructure review |
| **Pagination** | Large datasets paginated | Code review |
| **Caching** | Frequently accessed data cached | Code review |

---

## Accessibility Standards

### WCAG Compliance

| Level | Requirement | Verification |
|-------|-------------|--------------|
| **WCAG 2.1 Level A** | Required | Manual testing |
| **WCAG 2.1 Level AA** | Target | Manual testing |
| **WCAG 2.1 Level AAA** | Nice to have | Manual testing |

### Accessibility Requirements

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Keyboard navigation** | All functionality keyboard accessible | Manual testing |
| **Screen reader** | Compatible with screen readers | Manual testing |
| **Focus indicators** | Visible focus indicators | Manual testing |
| **Color contrast** | 4.5:1 for normal text, 3:1 for large text | Tool testing |
| **Alt text** | All images have alt text | Code review |
| **ARIA labels** | Proper ARIA labels | Code review |
| **Form labels** | All form inputs labeled | Code review |
| **Error identification** | Errors clearly identified | Manual testing |

### Responsive Design Standards

| Standard | Requirement | Verification |
|----------|-------------|--------------|
| **Mobile-first** | Design for mobile first | Code review |
| **Breakpoints** | Consistent breakpoints | Code review |
| **Touch targets** | Minimum 44x44px | Manual testing |
| **Readable text** | Minimum 16px font size | Code review |
| **No horizontal scroll** | Content fits viewport | Manual testing |

---

## Production Readiness Checklist

### Pre-Deployment Checklist

**Build & Quality:**
- [ ] Build passes (`npm run build` exit code 0)
- [ ] Lint passes (`npm run lint` exit code 0)
- [ ] TypeScript passes (`npx tsc --noEmit` exit code 0)
- [ ] All tests pass
- [ ] No console errors in browser
- [ ] No console warnings in browser

**Security:**
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] RLS policies verified
- [ ] Input validation tested
- [ ] Error handling tested (no sensitive data leaked)
- [ ] Security headers configured
- [ ] Dependencies scanned (`npm audit`)

**Performance:**
- [ ] Load times meet targets
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Caching configured
- [ ] Database queries optimized

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] All images have alt text
- [ ] Forms properly labeled

**Documentation:**
- [ ] README updated
- [ ] Architecture docs updated
- [ ] API docs updated
- [ ] Runbooks updated
- [ ] Decision records updated

**Infrastructure:**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented

**Testing:**
- [ ] All critical paths tested
- [ ] Edge cases tested
- [ ] Error cases tested
- [ ] Responsive design tested
- [ ] Accessibility tested
- [ ] Cross-browser tested

### Post-Deployment Checklist

**Verification:**
- [ ] All routes return 200
- [ ] Auth flows work
- [ ] Database connections work
- [ ] Email delivery works
- [ ] Analytics tracking works
- [ ] Error tracking works

**Monitoring:**
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] User feedback positive
- [ ] No security incidents

**Documentation:**
- [ ] Deployment documented
- [ ] Known issues documented
- [ ] Rollback plan tested
- [ ] Runbooks updated

---

## Quality Gates

### Gate 1: Code Complete

**Criteria:**
- All code written
- All tests written
- Documentation drafted

**Verification:**
- Code review
- Test execution
- Documentation review

---

### Gate 2: Quality Verified

**Criteria:**
- Build passes
- Lint passes
- TypeScript passes
- All tests pass
- No regressions

**Verification:**
- `npm run build`
- `npm run lint`
- `npx tsc --noEmit`
- Test execution

---

### Gate 3: Production Ready

**Criteria:**
- All pre-deployment checklist items complete
- Security verified
- Performance verified
- Accessibility verified

**Verification:**
- Manual testing
- Security audit
- Performance testing
- Accessibility testing

---

### Gate 4: Deployed

**Criteria:**
- Deployed to production
- All post-deployment checklist items complete
- Monitoring active

**Verification:**
- Production testing
- Monitoring review
- User feedback

---

## Cross-References

- **[OPERATING_PROCEDURES.md](OPERATING_PROCEDURES.md)** — Step-by-step procedures for meeting standards
- **[VERIFICATION_PROTOCOL.md](VERIFICATION_PROTOCOL.md)** — How to verify standards are met
- **[CURRENT_STATE.md](CURRENT_STATE.md)** — Current state against standards
- **[DECISION_FRAMEWORK.md](DECISION_FRAMEWORK.md)** — How to make quality tradeoff decisions

---

*Quality is not negotiable. Every task must meet these standards before it's considered done. Verify with evidence, document with clarity, and never claim something works unless it's been tested.*
