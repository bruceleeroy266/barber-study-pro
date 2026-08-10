# NABBA Demo Plan
**ASCYN PRO — Conference Demonstration Build**  
**Date:** 2026-08-09  
**Target:** NABBA Conference 2026  

---

## 1. Demo Overview

### 1.1 Demo Objectives

| Objective | Success Metric |
|-----------|---------------|
| Demonstrate board readiness tracking | Audience understands the 78% score meaning |
| Show active recall learning | Audience sees flashcard flip and quiz interaction |
| Prove instructor visibility | Audience sees at-risk student identification |
| Generate pilot interest | 10+ pilot commitments captured |

### 1.2 Demo Modes

| Mode | Duration | Use Case |
|------|----------|----------|
| **5-Minute** | 5:00 | Busy executives, large groups |
| **10-Minute** | 10:00 | Engaged audiences, Q&A |
| **Booth** | Variable | One-on-one conversations |
| **Self-Guided** | Unlimited | Attendees explore independently |

---

## 2. Demo Environment Setup

### 2.1 Production Demo (Primary)

**URL:** https://ascynpro.com/demo  
**Requirements:**
- Internet connection
- Modern browser (Chrome, Safari, Firefox, Edge)
- Screen resolution 1920x1080 or higher

**Features:**
- Full interactive demo
- Real-time data (demo mode)
- All functionality available

### 2.2 Local Demo (Backup)

**Setup:**
```bash
# Clone repository
git clone <repo-url> ascyn-pro-demo
cd ascyn-pro-demo

# Install dependencies
npm install

# Set demo mode
echo "NEXT_PUBLIC_DEMO_MODE=true" > .env.local

# Build and start
npm run build
npm start
```

**URL:** http://localhost:3000/demo  
**Requirements:**
- Node.js 20+
- No internet required after build

### 2.3 Static Export (Offline)

**Setup:**
```bash
# Build static export
npm run build
npx next export

# Serve locally
npx serve out
```

**URL:** http://localhost:3000  
**Limitations:**
- No server-side features
- No authentication
- Static data only

---

## 3. Demo Accounts

### 3.1 Static Demo (No Auth Required)

| Role | Access | URL |
|------|--------|-----|
| Student | Public | `/demo/student` |
| Instructor | Public | `/demo/instructor` |
| Admin | N/A | Not implemented |

### 3.2 Live Demo (Supabase Auth)

For personalized demos with real data persistence:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Demo Student | demo-student@ascynpro.com | `Demo2026!` | Show student experience |
| Demo Instructor | demo-instructor@ascynpro.com | `Demo2026!` | Show instructor portal |
| Demo Admin | demo-admin@ascynpro.com | `Demo2026!` | Show admin features |

**Setup Script:**
```sql
-- Run in Supabase SQL editor to create demo accounts
-- See: scripts/create-demo-accounts.sql
```

---

## 4. Demo Data

### 4.1 Student Demo Data

**Profile:** Demo Student  
**Readiness:** 78% (Approaching Readiness)  
**Progress:** 13/23 chapters complete  
**Focus Areas:**
- Hair & Scalp Disorders (62%)
- Alopecia (68%)
- Hair Growth Cycles (71%)

**Recent Activity:**
- Completed Chapter 10 lesson
- Reviewed 45 flashcards
- Scored 85% on Chapter 10 quiz

### 4.2 Instructor Demo Data

**Class:** Demo Academy — Summer 2026 Cohort  
**Students:** 6 sample students

| Student | Program | Readiness | Risk | Weakest Topic |
|---------|---------|-----------|------|---------------|
| Alex Johnson | Barbering | 89% | Low | Chemical Texture |
| Maria Garcia | Cosmetology | 64% | Medium | State Rules & Laws |
| Jordan Smith | Barbering | 42% | High | Infection Control |
| Taylor Williams | Barbering | 76% | Low | Hair & Scalp Disorders |
| Riley Brown | Cosmetology | 55% | Medium | Chemical Services |
| Morgan Lee | Barbering | 81% | Low | Nail Care |

**Class Metrics:**
- Average Readiness: 68%
- Average Confidence: 71%
- Average Quiz Score: 72%

### 4.3 Demo Data Seeding

**Script:** `scripts/seed-demo-data.ts`

```bash
# Seed demo data to Supabase
npx tsx scripts/seed-demo-data.ts

# Reset demo data
npx tsx scripts/seed-demo-data.ts --reset
```

---

## 5. Booth Workflow

### 5.1 Pre-Demo Checklist

- [ ] Laptop charged (100%)
- [ ] Backup laptop/tablet ready
- [ ] Internet connection verified
- [ ] Local demo server running (backup)
- [ ] Screenshots/video backup accessible
- [ ] Business cards stocked
- [ ] One-pagers printed
- [ ] QR codes visible
- [ ] Demo script reviewed
- [ ] Water bottle ready

### 5.2 5-Minute Demo Flow

| Time | Action | Talking Points |
|------|--------|---------------|
| 0:00 | Open dashboard | "This is what a student sees when they log in" |
| 0:30 | Show readiness score | "78% board ready — weighted by exam importance" |
| 1:00 | Show focus areas | "Specific gaps identified — not vague suggestions" |
| 1:30 | Open Chapter 10 | "Most-tested chapter on state boards" |
| 2:00 | Scroll lesson | "Interactive content, not just reading" |
| 2:30 | Show flashcards | "Active recall — proven to improve retention" |
| 3:00 | Start quiz | "Board-style questions with immediate feedback" |
| 3:30 | Miss question intentionally | "Every wrong answer is a teaching moment" |
| 4:00 | Show explanation | "Detailed feedback locks in correct understanding" |
| 4:30 | Show progress | "Students see growth, instructors see gaps" |
| 5:00 | Close | "Better retention. Better preparation. Measurable results." |

### 5.3 10-Minute Demo Flow

Extend 5-minute flow with:

| Time | Action | Talking Points |
|------|--------|---------------|
| 5:00 | Show instructor dashboard | "Instructors see the same data for every student" |
| 5:30 | Show at-risk students | "Identify who needs help before they fail" |
| 6:00 | Open student detail | "Drill into individual readiness" |
| 6:30 | Show intervention notes | "Track follow-ups and interventions" |
| 7:00 | Show class report | "Export data for accreditation and reporting" |
| 7:30 | Show weak areas heatmap | "Class-wide trends inform teaching" |
| 8:00 | Discuss pilot program | "Join our pilot — shape the product" |
| 8:30 | Show roadmap | "Listen mode, AI coaching, state-specific prep" |
| 9:00 | Q&A | Address specific questions |
| 10:00 | Close with vision | "This is where barber education is going" |

### 5.4 Booth Conversation Flow

```
┌─────────────────┐
│  Attendee walks  │
│      up         │
└────────┬────────┘
         ▼
┌─────────────────┐
│  "Are you a     │
│  school owner,   │
│  instructor, or  │
│  with NABBA?"    │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Tailor pitch    │
│  to role         │
│  (see Section 6) │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Offer 5-min or  │
│  10-min demo     │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Run demo        │
│  (follow script) │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Capture contact │
│  info / pilot    │
│  interest        │
└────────┬────────┘
         ▼
┌─────────────────┐
│  Give one-pager  │
│  + business card │
└─────────────────┘
```

---

## 6. Role-Specific Talking Points

### 6.1 For School Owners

**Hook:** "Retention is revenue. Students who pass stay. Students who fail leave."

**Key Points:**
- See which students are at risk before they sit for the exam
- Competitive differentiator for enrollment marketing
- Bulk licensing available
- No IT required — students use their own devices

**Close:** "Join our pilot program and be among the first schools to offer this to your students."

### 6.2 For Instructors

**Hook:** "You can't quiz 30 students individually. This platform does it for you."

**Key Points:**
- Automated progress tracking — no grading workload
- Know exactly who needs help with what topic
- Targeted remediation — not one-size-fits-all
- Flipped classroom potential

**Close:** "Spend less time grading, more time teaching."

### 6.3 For NABBA Officials

**Hook:** "Every quiz question is written with board exam language in mind."

**Key Points:**
- Standardized content across all users
- Progress tracking creates accountability
- Public safety focus — infection control, contraindications
- Data on pass rates and preparation effectiveness

**Close:** "Partner with us to improve board pass rates nationwide."

### 6.4 For State Board Stakeholders

**Hook:** "This covers theory; practical is still shop-based."

**Key Points:**
- Exam integrity — randomized questions, no exam dumps
- Competency verification through measurable readiness
- Public safety — infection control, sanitation, contraindications
- FERPA-aware data handling

**Close:** "Help us prove this improves pass rates and public safety."

---

## 7. Presentation Mode

### 7.1 Full-Screen Demo Mode

**Activation:** Press `F11` or click "Present" button  
**Features:**
- Hides browser chrome
- Increases font sizes 150%
- High-contrast mode
- Large click targets
- Keyboard navigation (arrow keys)

### 7.2 Projector Optimization

| Setting | Value |
|---------|-------|
| Resolution | 1920x1080 |
| Font Scale | 150% |
| Contrast | High |
| Animations | Reduced |
| Auto-scroll | Enabled |

### 7.3 Presentation Controls

| Key | Action |
|-----|--------|
| `→` / `Space` | Next section |
| `←` | Previous section |
| `F` | Toggle fullscreen |
| `H` | Toggle high contrast |
| `R` | Reset demo |
| `Esc` | Exit presentation |

---

## 8. Offline Contingencies

### 8.1 Offline Demo Mode

**Trigger:** No internet detected  
**Behavior:**
- Automatically switches to local data
- Shows "OFFLINE MODE" banner
- All features remain functional
- Data stored in localStorage

### 8.2 Screenshot Backup

**Location:** `demo-assets/screenshots/`  
**Contents:**
- Dashboard view
- Chapter 10 lesson
- Flashcard interaction
- Quiz interface
- Wrong answer explanation
- Progress dashboard
- Instructor portal
- Student detail view

### 8.3 Video Backup

**Location:** `demo-assets/videos/`  
**Contents:**
- `demo-5min.mp4` — 5-minute demo flow
- `demo-10min.mp4` — 10-minute demo flow
- `demo-instructor.mp4` — Instructor portal walkthrough

**Format:** MP4, 1080p, 30fps

### 8.4 PDF Handouts

**Location:** `demo-assets/handouts/`  
**Contents:**
- `ascyn-pro-one-pager.pdf` — Product overview
- `ascyn-pro-pilot-program.pdf` — Pilot details
- `ascyn-pro-pricing.pdf` — Pricing tiers
- `ascyn-pro-faq.pdf` — Common questions

---

## 9. Demo Checklist

### 9.1 Pre-Demo (30 Minutes Before)

- [ ] Verify internet connection
- [ ] Test demo URL (https://ascynpro.com/demo)
- [ ] Start local backup server
- [ ] Open screenshot backup folder
- [ ] Test projector/display
- [ ] Verify audio (if using)
- [ ] Charge all devices
- [ ] Review demo script
- [ ] Prepare business cards
- [ ] Set up lead capture form

### 9.2 During Demo

- [ ] Smile and make eye contact
- [ ] Ask about their role first
- [ ] Tailor pitch to their needs
- [ ] Follow the demo script
- [ ] Point at screen, don't read
- [ ] Handle questions gracefully
- [ ] Capture contact information
- [ ] Offer pilot program
- [ ] Give one-pager and card
- [ ] Thank them for their time

### 9.3 Post-Demo

- [ ] Record lead in CRM
- [ ] Note any feedback
- [ ] Follow up within 24 hours
- [ ] Send promised materials
- [ ] Update demo script if needed
- [ ] Recharge devices
- [ ] Restock materials

---

## 10. Troubleshooting

### 10.1 Common Issues

| Issue | Solution |
|-------|----------|
| Demo won't load | Switch to local backup server |
| Slow internet | Use offline mode or screenshots |
| Projector not working | Use laptop screen, invite close viewing |
| Demo crashes | Restart browser, use backup device |
| Questions you can't answer | "Let me follow up with you after the conference" |

### 10.2 Emergency Contacts

| Role | Contact | Phone |
|------|---------|-------|
| Technical Lead | [Name] | [Phone] |
| Demo Support | [Name] | [Phone] |
| Sales Lead | [Name] | [Phone] |

---

## 11. Files and Resources

| Resource | Location |
|----------|----------|
| Demo Script | `MILADY-NABBA-5-MINUTE-DEMO-SCRIPT.md` |
| Demo Prep | `DEMO-NABBA-MILADY-PREP.md` |
| Master Plan | `NABBA_NIC_CONFERENCE_READINESS_MASTER_PLAN.md` |
| Demo Data | `src/lib/demo-data.ts` |
| Student Demo | `src/app/demo/DemoClient.tsx` |
| Instructor Demo | `src/app/demo/instructor/page.tsx` |
| Screenshots | `demo-assets/screenshots/` |
| Videos | `demo-assets/videos/` |
| Handouts | `demo-assets/handouts/` |

---

*Demo plan created: 2026-08-09*
