# ASCYN PRO Typography Guidelines

**Component-Level Typography Specification**
**Version:** 1.0
**Date:** 2026-08-09
**Status:** Canonical Reference
**Traces to:** BL-003 Typography System Implementation, TOKEN_ARCHITECTURE.md, TYPOGRAPHY_PRODUCT_APPLICATIONS.md

---

## Purpose

This document provides **component-level typography specifications** for every UI surface in ASCYN PRO. It translates the design tokens (implemented in BL-003) into concrete usage rules for developers building components.

**Rule:** Every typographic element must use the semantic classes or Tailwind utilities mapped to design tokens. Never hard-code font sizes, weights, line heights, or letter spacing.

---

## Quick Reference: Semantic Classes

| Class | Use Case |
|-------|----------|
| `.text-display` | Hero headlines only |
| `.text-h1` | Page titles |
| `.text-h2` | Section headers |
| `.text-h3` | Subsection headers |
| `.text-h4` | Card titles |
| `.text-body-lg` | Lead paragraphs, lesson content |
| `.text-body` | Default body text |
| `.text-body-sm` | Secondary text, descriptions |
| `.text-caption` | Metadata, timestamps |
| `.text-overline` | Section labels, breadcrumbs |
| `.text-button` | Button labels |
| `.text-code` | Code snippets |

---

## 1. Headings

### Display (Hero Headlines)

**Usage:** Marketing pages, landing pages, hero sections. One per page maximum.

```css
/* Semantic class */
.text-display

/* Tailwind equivalent */
text-5xl font-bold leading-tight tracking-tighter

/* Design tokens */
font-size: var(--font-size-display);      /* 2.25rem mobile / 4rem desktop */
font-weight: var(--font-weight-bold);      /* 700 */
line-height: var(--line-height-tight);     /* 1.1 */
letter-spacing: var(--letter-spacing-tighter); /* -0.02em */
```

**Rules:**
- Maximum 10 words
- Never used in app interfaces (Student Portal, Instructor Portal, Admin Portal)
- Always paired with generous whitespace
- Mobile: scales to 2.25rem (36px)

---

### H1 (Page Titles)

**Usage:** Page-level titles in all portals and marketing pages.

```css
/* Semantic class */
.text-h1

/* Tailwind equivalent */
text-4xl font-bold leading-tight tracking-tight

/* Design tokens */
font-size: var(--font-size-h1);           /* 1.875rem mobile / 3rem desktop */
font-weight: var(--font-weight-bold);      /* 700 */
line-height: var(--line-height-tight);     /* 1.1 */
letter-spacing: var(--letter-spacing-tight); /* -0.015em */
margin-bottom: var(--spacing-6);           /* 1.5rem */
```

**Rules:**
- One per page
- Describes the page's purpose
- Student Portal: Use 36px (text-3xl) instead of 48px for lesson titles
- Instructor/Admin Portal: Use 30px (text-2xl) for compact density

---

### H2 (Section Headers)

**Usage:** Major content sections within a page.

```css
/* Semantic class */
.text-h2

/* Tailwind equivalent */
text-3xl font-semibold leading-snug tracking-snug

/* Design tokens */
font-size: var(--font-size-h2);           /* 1.5rem mobile / 2.25rem desktop */
font-weight: var(--font-weight-semibold);  /* 600 */
line-height: var(--line-height-snug);      /* 1.2 */
letter-spacing: var(--letter-spacing-snug); /* -0.01em */
margin-top: var(--spacing-10);             /* 2.5rem */
margin-bottom: var(--spacing-5);           /* 1.25rem */
```

**Rules:**
- Organizes content into scannable sections
- Student Portal: Use 24px (text-2xl) for lesson sections
- Instructor/Admin Portal: Use 24px (text-2xl) for dashboard sections

---

### H3 (Subsection Headers)

**Usage:** Subsections within major sections.

```css
/* Semantic class */
.text-h3

/* Tailwind equivalent */
text-2xl font-semibold leading-normal tracking-normal

/* Design tokens */
font-size: var(--font-size-h3);           /* 1.25rem mobile / 1.75rem desktop */
font-weight: var(--font-weight-semibold);  /* 600 */
line-height: var(--line-height-normal);    /* 1.25 */
letter-spacing: var(--letter-spacing-normal); /* -0.005em */
margin-top: var(--spacing-8);              /* 2rem */
margin-bottom: var(--spacing-4);           /* 1rem */
```

**Rules:**
- Breaks sections into digestible blocks
- Student Portal: Use 20px (text-xl) for lesson subsections
- Instructor/Admin Portal: Use 20px (text-xl) for compact density

---

### H4 (Card Titles)

**Usage:** Card titles, widget titles, group headings.

```css
/* Semantic class */
.text-h4

/* Tailwind equivalent */
text-xl font-semibold leading-relaxed tracking-normal

/* Design tokens */
font-size: var(--font-size-h4);           /* 1.125rem mobile / 1.375rem desktop */
font-weight: var(--font-weight-semibold);  /* 600 */
line-height: var(--line-height-relaxed);   /* 1.3 */
letter-spacing: var(--letter-spacing-body); /* 0 */
margin-top: var(--spacing-6);              /* 1.5rem */
margin-bottom: var(--spacing-3);           /* 0.75rem */
```

**Rules:**
- Used in feature cards, dashboard widgets, data cards
- Instructor/Admin Portal: Use 18px (text-lg) for compact cards
- Never smaller than 18px

---

## 2. Display Contexts

### Marketing Hero

```tsx
<h1 className="text-display">
  Elevate. Learn. Succeed.
</h1>
<p className="text-body-lg text-secondary">
  AI-powered licensing exam preparation for barbers and cosmetologists.
</p>
```

### Dashboard Hero Metric

```tsx
<div className="metric-hero">
  <span className="text-overline">Pass Rate</span>
  <span className="text-5xl font-bold leading-tight tracking-normal">
    87%
  </span>
  <span className="text-body-sm text-secondary">
    +12% from last month
  </span>
</div>
```

**Design tokens:**
- Metric value: `var(--font-size-display)` (48px+), `var(--font-weight-bold)` (700)
- Metric label: `var(--font-size-overline)` (11px), `var(--font-weight-medium)` (500), uppercase, `var(--letter-spacing-widest)` (0.08em)
- Metric change: `var(--font-size-body-sm)` (14px), `var(--font-weight-medium)` (500)

---

## 3. Cards

### Standard Card

```tsx
<div className="card">
  <h4 className="text-h4">Card Title</h4>
  <p className="text-body">
    Card description text goes here. This is the default body text style.
  </p>
  <span className="text-caption">Last updated 2 hours ago</span>
</div>
```

**Typography:**
- Title: `.text-h4` (18-22px, semibold)
- Body: `.text-body` (16px, regular)
- Metadata: `.text-caption` (12px, regular, muted color)

---

### Metric Card (Dashboard)

```tsx
<div className="metric-card">
  <span className="text-overline">Completion Rate</span>
  <span className="text-3xl font-bold leading-tight">68%</span>
  <span className="text-body-sm text-secondary">Module 3 of 12</span>
</div>
```

**Typography:**
- Label: `.text-overline` (11px, medium, uppercase, widest tracking)
- Value: `text-3xl font-bold` (36px, bold) — uses `var(--font-size-h2)`
- Context: `.text-body-sm` (14px, regular, secondary color)

---

### Feature Card (Marketing)

```tsx
<div className="feature-card">
  <h4 className="text-h4">AI-Powered Tutoring</h4>
  <p className="text-body">
    Get instant feedback on your practice exams with our AI tutor.
  </p>
  <a href="#" className="text-button">Learn More →</a>
</div>
```

**Typography:**
- Title: `.text-h4` (22px, semibold)
- Body: `.text-body` (16px, regular)
- CTA: `.text-button` (16px, medium)

---

## 4. Tables

### Data Table (Instructor/Admin Portal)

```tsx
<table>
  <thead>
    <tr>
      <th>Student Name</th>
      <th>Progress</th>
      <th>Last Active</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Patty Pineda</td>
      <td className="tabular-nums">68%</td>
      <td>2 hours ago</td>
    </tr>
  </tbody>
</table>
```

**Typography (automatic via `@layer base`):**
- `th`: `var(--font-size-body-sm)` (14px), `var(--font-weight-medium)` (500), uppercase, `var(--letter-spacing-wider)` (0.01em), muted color
- `td`: `var(--font-size-body-sm)` (14px), `var(--font-weight-regular)` (400), `var(--line-height-body)` (1.5)
- Numeric cells: Add `tabular-nums` class for tabular figures

**Rules:**
- Always use `tabular-nums` for numeric columns
- Table headers are always uppercase
- Row height: minimum 44px for touch targets
- Compact density: 14px cells, 12px headers

---

### Comparison Table (Marketing)

```tsx
<table className="comparison-table">
  <thead>
    <tr>
      <th className="text-h4">Feature</th>
      <th className="text-h4">ASCYN PRO</th>
      <th className="text-h4">Competitors</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="text-body">AI Tutoring</td>
      <td className="text-body">✓</td>
      <td className="text-body">✗</td>
    </tr>
  </tbody>
</table>
```

**Typography:**
- Headers: `.text-h4` (22px, semibold)
- Cells: `.text-body` (16px, regular)
- Larger than data tables for marketing readability

---

## 5. Forms

### Standard Form

```tsx
<form>
  <label htmlFor="email">Email Address</label>
  <input type="email" id="email" placeholder="you@example.com" />
  <span className="text-body-sm text-secondary">
    We'll never share your email.
  </span>
</form>
```

**Typography (automatic via `@layer base`):**
- `label`: `var(--font-size-body-sm)` (14px), `var(--font-weight-medium)` (500), `var(--letter-spacing-wide)` (0.005em)
- `input`: `var(--font-size-input)` (16px), `var(--font-weight-regular)` (400), `var(--line-height-body)` (1.5)
- Help text: `.text-body-sm` (14px, regular, secondary color)

**Rules:**
- Labels are always visible (never placeholder-only)
- Input text is always 16px minimum (prevents mobile zoom)
- Help text is always present when a field might be ambiguous
- Error messages: `.text-body-sm` with error color

---

### Form Section

```tsx
<section>
  <h3 className="text-h3">Personal Information</h3>
  <p className="text-body-sm text-secondary">
    This information is used for your student profile.
  </p>
  {/* form fields */}
</section>
```

**Typography:**
- Section title: `.text-h3` (20-28px, semibold)
- Section description: `.text-body-sm` (14px, regular, secondary color)

---

## 6. Navigation

### Primary Navigation (Website)

```tsx
<nav>
  <a href="/features" className="nav-link">Features</a>
  <a href="/pricing" className="nav-link">Pricing</a>
  <a href="/about" className="nav-link">About</a>
</nav>
```

**Typography (automatic via `@layer base`):**
- `nav`: `var(--font-size-body-sm)` (14px), `var(--font-weight-medium)` (500), `var(--letter-spacing-wide)` (0.005em)
- Website nav: Override to 16px with `text-base`

**Rules:**
- Website: 16px, medium weight
- Student Portal: 14px, medium weight (sidebar)
- Instructor/Admin Portal: 14px, medium weight (sidebar)
- Active state: semibold weight + gold accent color

---

### Breadcrumbs

```tsx
<nav aria-label="Breadcrumb">
  <ol className="breadcrumb">
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/dashboard/chapters">Chapters</a></li>
    <li aria-current="page">Chapter 6</li>
  </ol>
</nav>
```

**Typography:**
- Use `.text-overline` (11px, medium, uppercase, widest tracking)
- Separator: "/" with 8px spacing
- Current page: semibold weight

---

### Tabs

```tsx
<div className="tabs">
  <button className="tab active">Overview</button>
  <button className="tab">Progress</button>
  <button className="tab">Quizzes</button>
</div>
```

**Typography:**
- Tab label: `var(--font-size-body-sm)` (14px), `var(--font-weight-medium)` (500)
- Active tab: `var(--font-weight-semibold)` (600) + gold accent color
- Mobile: 14px minimum for touch targets

---

## 7. Charts

### Chart Labels

```tsx
<LineChart>
  <XAxis 
    tick={{ 
      fontSize: 'var(--font-size-caption)', 
      fontWeight: 'var(--font-weight-regular)',
      fill: 'var(--color-text-muted)' 
    }} 
  />
  <YAxis 
    tick={{ 
      fontSize: 'var(--font-size-caption)', 
      fontWeight: 'var(--font-weight-regular)',
      fill: 'var(--color-text-muted)' 
    }} 
  />
</LineChart>
```

**Typography:**
- Axis labels: `var(--font-size-caption)` (12px), `var(--font-weight-regular)` (400), muted color
- Data labels: `var(--font-size-caption)` (12px), `var(--font-weight-medium)` (500)
- Legend: `var(--font-size-body-sm)` (14px), `var(--font-weight-regular)` (400)

**Rules:**
- All numeric data uses tabular figures (`tabular-nums`)
- No decorative typography on charts
- No 3D effects, gradients, or ornamental elements
- Chart titles: `.text-h4` (18-22px, semibold)

---

### Chart Title

```tsx
<div className="chart-container">
  <h4 className="text-h4">Student Progress Over Time</h4>
  <p className="text-body-sm text-secondary">
    Average quiz scores for the last 30 days
  </p>
  <LineChart>{/* ... */}</LineChart>
</div>
```

**Typography:**
- Title: `.text-h4` (18-22px, semibold)
- Subtitle: `.text-body-sm` (14px, regular, secondary color)

---

## 8. AI Responses

### AI Tutor Chat Message

```tsx
<div className="chat-message ai-message">
  <p className="text-body">
    That's a great question. Let me explain the difference between 
    clipper guards and clipper blades.
  </p>
  <p className="text-body">
    <strong className="font-medium">Clipper guards</strong> are plastic 
    attachments that snap onto the clipper to control hair length.
  </p>
  <code className="text-code">
    Guard #3 = 3/8 inch (10mm)
  </code>
</div>
```

**Typography:**
- AI message body: `var(--font-size-body)` (16px), `var(--font-weight-regular)` (400), `var(--line-height-body-lg)` (1.7)
- AI message heading: `var(--font-size-body-lg)` (18px), `var(--font-weight-semibold)` (600)
- Emphasis: `var(--font-weight-medium)` (500)
- Code: `.text-code` (JetBrains Mono, 14px)

**Rules:**
- Line height is 1.7 for AI messages (extended reading)
- User messages and AI messages use identical typography
- Distinction comes from layout (alignment, background color), not typography
- No animated text, no typing indicators with animated dots
- Feedback (correct/incorrect): medium weight, never red, never all caps

---

### AI-Generated Feedback

```tsx
<div className="feedback correct">
  <p className="text-body font-medium">
    That's right. Clipper guards control the length of hair left after cutting.
  </p>
</div>

<div className="feedback incorrect">
  <p className="text-body font-medium">
    That's not quite right — and that's okay. Let me explain it a different way.
  </p>
</div>
```

**Typography:**
- Feedback text: `var(--font-size-body)` (16px), `var(--font-weight-medium)` (500), `var(--line-height-body-lg)` (1.6)
- Correct: gold accent color (`var(--color-text-accent)`)
- Incorrect: silver accent color (`var(--color-text-secondary)`)

**Rules:**
- Never use red for incorrect answers
- Never use exclamation marks in feedback typography
- Never use all caps
- Tone is patient, encouraging, honest

---

## 9. Flashcards

### Flashcard Front

```tsx
<div className="flashcard flashcard-front">
  <span className="text-overline">Term</span>
  <h3 className="text-h3">Clipper Guard</h3>
  <p className="text-body-sm text-secondary">Tap to reveal definition</p>
</div>
```

**Typography:**
- Label: `.text-overline` (11px, medium, uppercase, widest tracking)
- Term: `.text-h3` (20-28px, semibold) — or 20px fixed for flashcards
- Hint: `.text-body-sm` (14px, regular, secondary color)

---

### Flashcard Back

```tsx
<div className="flashcard flashcard-back">
  <span className="text-overline">Definition</span>
  <p className="text-body-lg">
    A plastic attachment that snaps onto hair clippers to control the 
    length of hair left after cutting. Guards are numbered (#0 through #8) 
    and correspond to specific lengths in inches or millimeters.
  </p>
  <button className="text-button">Got It</button>
</div>
```

**Typography:**
- Label: `.text-overline` (11px, medium, uppercase, widest tracking)
- Definition: `.text-body-lg` (18px, regular, 1.6 line height)
- Button: `.text-button` (16px, medium)

**Rules:**
- Front: semibold weight for the term (20px)
- Back: regular weight for the definition (18px)
- Generous line height (1.6) for readability
- Constrained width: 60-70 characters per line

---

## 10. Quizzes

### Quiz Question

```tsx
<div className="quiz-question">
  <span className="text-overline">Question 3 of 10</span>
  <h3 className="text-body-lg font-medium">
    What is the primary purpose of a clipper guard?
  </h3>
  <div className="quiz-options">
    <label className="quiz-option">
      <input type="radio" name="q3" />
      <span className="text-body">To control hair length</span>
    </label>
    <label className="quiz-option">
      <input type="radio" name="q3" />
      <span className="text-body">To sharpen the blades</span>
    </label>
  </div>
</div>
```

**Typography:**
- Progress: `.text-overline` (11px, medium, uppercase, widest tracking)
- Question: `var(--font-size-body-lg)` (18px), `var(--font-weight-medium)` (500), `var(--line-height-body-lg)` (1.6)
- Answer options: `var(--font-size-body)` (16px), `var(--font-weight-regular)` (400), `var(--line-height-body)` (1.5)

**Rules:**
- Questions use medium weight for clear identification
- Answers use regular weight for scannability
- Correct answer feedback: gold accent color
- Incorrect answer feedback: silver accent color + explanation
- Never use red for incorrect answers

---

### Quiz Results

```tsx
<div className="quiz-results">
  <h2 className="text-h2">Your Results</h2>
  <div className="score-display">
    <span className="text-5xl font-bold">8/10</span>
    <span className="text-body-lg text-secondary">80% Correct</span>
  </div>
  <p className="text-body">
    Great work! You're ready to move on to the next chapter.
  </p>
</div>
```

**Typography:**
- Title: `.text-h2` (24-36px, semibold)
- Score: `text-5xl font-bold` (48px, bold) — uses `var(--font-size-display)`
- Percentage: `.text-body-lg` (18px, regular, secondary color)
- Message: `.text-body` (16px, regular)

---

## 11. Reports

### Student Progress Report

```tsx
<div className="report">
  <header className="report-header">
    <h1 className="text-h1">Student Progress Report</h1>
    <p className="text-body-sm text-secondary">
      Patty Pineda • August 9, 2026
    </p>
  </header>
  
  <section className="report-section">
    <h2 className="text-h2">Overall Progress</h2>
    <div className="metric-grid">
      <div className="metric">
        <span className="text-overline">Completion</span>
        <span className="text-3xl font-bold">68%</span>
      </div>
      <div className="metric">
        <span className="text-overline">Avg Score</span>
        <span className="text-3xl font-bold">87%</span>
      </div>
    </div>
  </section>
  
  <section className="report-section">
    <h2 className="text-h2">Chapter Breakdown</h2>
    <table>
      <thead>
        <tr>
          <th>Chapter</th>
          <th>Progress</th>
          <th>Quiz Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Chapter 1: Sanitation</td>
          <td className="tabular-nums">100%</td>
          <td className="tabular-nums">95%</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>
```

**Typography:**
- Report title: `.text-h1` (30-48px, bold)
- Metadata: `.text-body-sm` (14px, regular, secondary color)
- Section headings: `.text-h2` (24-36px, semibold)
- Metric values: `text-3xl font-bold` (36px, bold)
- Table: automatic via `@layer base` (14px cells, tabular numerals)

**Rules:**
- Reports use compact density (Instructor/Admin Portal scale)
- All numeric data uses tabular figures
- Section spacing: `var(--spacing-10)` margin-top for h2
- Print-friendly: ensure adequate contrast for black-and-white printing

---

## 12. Emails

### Transactional Email

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #000000;
    }
    h1 {
      font-size: 28px;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: -0.01em;
    }
    .button {
      font-size: 16px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <h1>Welcome to ASCYN PRO</h1>
  <p>Your account has been created successfully.</p>
  <a href="#" class="button">Get Started</a>
  <p class="footer">
    <small>ASCYN PRO LLC • Oklahoma City, OK</small>
  </p>
</body>
</html>
```

**Typography (hard-coded for email client compatibility):**
- Headline: 28px, bold (700), -0.01em letter spacing, 1.25 line height
- Body: 16px, regular (400), 1.6 line height
- Button: 16px, semibold (600)
- Footer: 12px, regular (400), 1.4 line height

**Rules:**
- Never use CSS custom properties (email clients don't support them)
- Use email-safe font stack: `'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif`
- Inline styles for maximum compatibility
- No web font loading tricks (no `@font-face` with conditional comments)
- Fallback to Helvetica/Arial for clients that don't support Inter
- Maximum width: 600px
- All text meets WCAG AA contrast (4.5:1 minimum)

---

### Email Notification

```html
<div style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <h2 style="font-size: 20px; font-weight: 600; line-height: 1.3;">
    New Quiz Results Available
  </h2>
  <p style="font-size: 16px; line-height: 1.6;">
    Patty Pineda completed Chapter 6 Quiz with a score of 90%.
  </p>
  <p style="font-size: 14px; line-height: 1.5; color: #666;">
    View detailed results in your instructor dashboard.
  </p>
</div>
```

**Typography:**
- Section heading: 20px, semibold (600), 1.3 line height
- Body: 16px, regular (400), 1.6 line height
- Secondary text: 14px, regular (400), 1.5 line height, muted color

---

## 13. PDFs

### PDF Report (jsPDF)

```typescript
import jsPDF from 'jspdf';

const doc = new jsPDF();

// Title
doc.setFontSize(24);
doc.setFont('helvetica', 'bold');
doc.text('Student Progress Report', 20, 20);

// Metadata
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('Patty Pineda • August 9, 2026', 20, 30);

// Section heading
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('Overall Progress', 20, 45);

// Body text
doc.setFontSize(11);
doc.setFont('helvetica', 'normal');
doc.text('Completion Rate: 68%', 20, 55);

doc.save('progress-report.pdf');
```

**Typography (jsPDF point values):**
- Report title: 24pt, bold
- Section headings: 16pt, bold
- Body text: 11pt, regular
- Metadata: 10pt, regular
- Caption: 9pt, regular

**Rules:**
- jsPDF requires numeric point values (not CSS units)
- Use Helvetica (built-in PDF font) as Inter substitute
- 1pt ≈ 1.33px at 96 DPI
- Line height: 1.4-1.6 (use `doc.setLineHeightFactor()`)
- Ensure adequate contrast for black-and-white printing
- Embed Inter as custom font if brand consistency is critical (requires font file)

---

### PDF Certificate

```typescript
// Certificate name
doc.setFontSize(36);
doc.setFont('helvetica', 'bold');
doc.text('Patty Pineda', 105, 100, { align: 'center' });

// Certificate title
doc.setFontSize(18);
doc.setFont('helvetica', 'normal');
doc.text('Certificate of Completion', 105, 120, { align: 'center' });

// Body text
doc.setFontSize(12);
doc.text('has successfully completed the ASCYN PRO Barber Fundamentals course', 105, 140, { align: 'center' });

// Date
doc.setFontSize(10);
doc.text('August 9, 2026', 105, 160, { align: 'center' });
```

**Typography:**
- Name: 36pt, bold
- Title: 18pt, regular
- Body: 12pt, regular
- Date: 10pt, regular

**Rules:**
- Certificates use larger sizes for print readability
- Center-aligned for formal presentation
- Generous spacing between elements
- Consider using Source Serif 4 for print certificates (requires custom font embedding)

---

## Design Token Quick Reference

### Font Sizes (Responsive)

| Token | Mobile | Desktop | Use Case |
|-------|--------|---------|----------|
| `--font-size-display` | 36px | 64px | Hero headlines |
| `--font-size-h1` | 30px | 48px | Page titles |
| `--font-size-h2` | 24px | 36px | Section headers |
| `--font-size-h3` | 20px | 28px | Subsection headers |
| `--font-size-h4` | 18px | 22px | Card titles |
| `--font-size-body-lg` | 18px | 20px | Lead paragraphs |
| `--font-size-body` | 16px | 16px | Default body |
| `--font-size-body-sm` | 14px | 14px | Secondary text |
| `--font-size-caption` | 12px | 12px | Metadata |
| `--font-size-overline` | 11px | 12px | Labels |

### Font Weights

| Token | Value | Use Case |
|-------|-------|----------|
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | Buttons, labels, emphasis |
| `--font-weight-semibold` | 600 | Headings h2-h4 |
| `--font-weight-bold` | 700 | Display, h1 |

### Line Heights

| Token | Value | Use Case |
|-------|-------|----------|
| `--line-height-tight` | 1.1 | Display, h1 |
| `--line-height-snug` | 1.2 | h2 |
| `--line-height-normal` | 1.25 | h3 |
| `--line-height-relaxed` | 1.3 | h4 |
| `--line-height-loose` | 1.4 | Captions |
| `--line-height-body` | 1.5 | Body small, inputs |
| `--line-height-body-lg` | 1.6 | Body, body large |

### Letter Spacing

| Token | Value | Use Case |
|-------|-------|----------|
| `--letter-spacing-tighter` | -0.02em | Display |
| `--letter-spacing-tight` | -0.015em | h1 |
| `--letter-spacing-snug` | -0.01em | h2 |
| `--letter-spacing-normal` | -0.005em | h3 |
| `--letter-spacing-body` | 0 | Body, h4 |
| `--letter-spacing-wide` | 0.005em | Body small |
| `--letter-spacing-wider` | 0.01em | Captions, buttons |
| `--letter-spacing-widest` | 0.08em | Overlines |

---

## Accessibility Checklist

- ✅ Body text never below 16px on any digital product
- ✅ Caption text never below 12px on any digital product
- ✅ Line height 1.5-1.7 for body text (non-negotiable)
- ✅ All text meets WCAG AAA contrast (7:1 for body, 4.5:1 for large text)
- ✅ Touch targets minimum 44x44px (button labels 16px semibold)
- ✅ Reading width constrained to 60-75 characters per line
- ✅ No decorative typography that sacrifices readability
- ✅ Tabular numerals for all numeric data in tables and dashboards
- ✅ Clear hierarchy: maximum 3 type sizes visible on any single screen
- ✅ Focus indicators: 2px gold outline (`var(--color-border-accent)`)

---

## Exceptions

### Email Templates
- Hard-coded font sizes, weights, line heights (email clients don't support CSS custom properties)
- Use email-safe font stack: `'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif`

### PDF Reports
- jsPDF requires numeric point values (not CSS units)
- Use Helvetica as Inter substitute (built-in PDF font)
- 1pt ≈ 1.33px at 96 DPI

### Legacy Chapter Content
- Chapters 18-20 use self-contained scoped CSS
- Intentionally excluded from design token system

### Presentation/Print Modes
- NABBA demo materials use intentional `!important` overrides
- Optimized for projection and print, not screen reading

---

## Governance

**Every typographic decision must trace to approved governance:**

- Phase 4 TYPOGRAPHY_SYSTEM.md
- Phase 4 TYPOGRAPHY_PRODUCT_APPLICATIONS.md
- Phase 4 COLOR_SYSTEM.md
- Phase 4 Visual Identity Strategy
- BL-003 Typography System Implementation
- TOKEN_ARCHITECTURE.md

**No invented philosophy. No trend-based decisions. Typography exists to help students learn.**

---

*This document is the canonical reference for component-level typography in ASCYN PRO. All future UI components must follow these specifications.*
