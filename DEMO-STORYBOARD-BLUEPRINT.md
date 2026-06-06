# Barber Study Pro V2 — Demo Storyboard Blueprint

**Document Status:** Planning Only — No Implementation  
**Date:** June 5, 2026  
**Prepared For:** Milady, NABBA, School Owners, Instructors  
**Chapter 13 Status:** PAUSED — All migration work suspended  
**Current Demo Status:** `/demo` built but does not communicate the student journey  

---

## Executive Summary

The current `/demo` dashboard shows metrics. Metrics confuse first-time viewers because they lack context. A Milady executive seeing "78% Board Readiness" without understanding the journey that produced it will ask "What does that mean?" instead of "How do I get this for my schools?"

The demo must be rebuilt as a **guided presentation experience** — a story that walks the audience through the student journey step by step. Each step answers a question before the audience asks it.

**The story:** A barber student sits down to study. They see their progress. They open a lesson. They reinforce with flashcards. They test themselves. They learn from mistakes. Their instructor sees the improvement. This is how board readiness is built — one interaction at a time.

**Recommendation:** Rebuild `/demo` as a single-page scrollable storyboard with anchored sections. The presenter scrolls or clicks section links. Each section shows the actual app screen (Dashboard, Chapter 10, Flashcards, Quiz, etc.) embedded within an explanatory frame that tells the audience what they're seeing and why it matters.

---

## 1. Overall Demo Structure

### The Seven-Step Story

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 0 — LANDING                                           │
│  "This is how barber students prepare for the board exam."  │
├─────────────────────────────────────────────────────────────┤
│  STEP 1 — STUDENT DASHBOARD                                 │
│  "Every student sees their progress at a glance."           │
├─────────────────────────────────────────────────────────────┤
│  STEP 2 — CHAPTER 10 LESSON                                 │
│  "Students don't just read. They interact with structured    │
│   content built for retention."                             │
├─────────────────────────────────────────────────────────────┤
│  STEP 3 — FLASHCARDS                                        │
│  "Active recall locks in what they just learned."           │
├─────────────────────────────────────────────────────────────┤
│  STEP 4 — QUIZ                                              │
│  "They test themselves with board-style questions."         │
├─────────────────────────────────────────────────────────────┤
│  STEP 5 — LEARN FROM MISTAKES                               │
│  "Wrong answers become teaching moments."                   │
├─────────────────────────────────────────────────────────────┤
│  STEP 6 — PROGRESS TRACKING                                 │
│  "Every interaction feeds into measurable improvement."     │
├─────────────────────────────────────────────────────────────┤
│  STEP 7 — FUTURE VISION                                     │
│  "This is where barber education is going."                 │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Model

**Single page, vertical scroll.** Each step is a full-viewport section.

- **Presenter clicks** the step name in a sticky top navigation bar
- **Or scrolls** naturally through the story
- **Or uses arrow keys** to advance step by step

No page loads. No route changes. One continuous story.

---

## 2. What the Landing Page Should Look Like

### Step 0: The Opening Screen

**Purpose:** Set the stage. Tell the audience what they're about to see. Create anticipation.

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│              BARBER STUDY PRO                               │
│                                                             │
│     This is how barber students prepare for the             │
│     state board exam.                                       │
│                                                             │
│     Not by reading alone.                                   │
│     By learning, reinforcing, testing, and improving.       │
│                                                             │
│     [ Begin the Journey ]                                   │
│                                                             │
│                                                             │
│     Scroll to explore each step ↓                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Design:**
- Full viewport height (100vh)
- Deep charcoal background (`#0a0a0a`)
- Centered text, large and clean
- Gold accent on "Begin the Journey" button
- No metrics. No cards. Just the promise.

**Wording:**
> "This is how barber students prepare for the state board exam.
>
> Not by reading alone.
> By learning, reinforcing, testing, and improving.
>
> Every step measured. Every gap identified. Every student becoming board-ready."

**What NOT to show:**
- No Board Readiness Score
- No chapter progress
- No data of any kind
- No screenshots yet
- No navigation menu (just the scroll prompt)

---

## 3. What Sections/Cards Should Exist

### Section Navigation (Sticky Top Bar)

A thin bar at the top that persists as the presenter scrolls:

```
┌─────────────────────────────────────────────────────────────┐
│  Barber Study Pro  │  Dashboard  │  Lesson  │  Flashcards  │
│                    │  Quiz  │  Progress  │  Future         │
└─────────────────────────────────────────────────────────────┘
```

- Each item scrolls to that section when clicked
- Active section is highlighted in gold
- Small, unobtrusive — the content is the star

### Step 1: Student Dashboard

**Purpose:** Show that students have visibility into their own progress.

**Layout:** Two columns
```
┌─────────────────────────────┬───────────────────────────────┐
│  WHY THIS EXISTS            │  [DASHBOARD SCREENSHOT]       │
│                             │                               │
│  Students need to know      │  Board Readiness: 78%         │
│  where they stand.          │  13 of 23 chapters            │
│                             │  Focus Areas listed           │
│  This dashboard answers     │                               │
│  one question:              │                               │
│                             │                               │
│  "Am I ready?"              │                               │
│                             │                               │
│  The answer is measurable.  │                               │
│  Not vague. Not guessed.    │                               │
│  Data-driven.               │                               │
├─────────────────────────────┴───────────────────────────────┤
│  WHAT PROBLEM IT SOLVES                                     │
│  Students who don't know their gaps can't fix them.         │
│  This dashboard makes gaps visible — instantly.             │
└─────────────────────────────────────────────────────────────┘
```

**The embedded dashboard:** The actual `/demo` dashboard we already built, but framed within this explanatory context.

### Step 2: Chapter 10 Lesson

**Purpose:** Show that content is structured, board-aligned, and interactive.

**Layout:** Two columns (reversed — image left, text right)
```
┌─────────────────────────────┬───────────────────────────────┐
│  [CHAPTER 10 SCREENSHOT]    │  WHY THIS EXISTS              │
│                             │                               │
│  Tabbed sections            │  Textbooks are reference.     │
│  Board Exam Alerts          │  This is a learning system.   │
│  Barber Relevance bullets   │                               │
│                             │  Students don't retain what   │
│                             │  they passively read. They    │
│                             │  retain what they interact    │
│                             │  with.                        │
│                             │                               │
│                             │  Chapter 10 covers hair and   │
│                             │  scalp disorders — one of the │
│                             │  most-tested topics on state  │
│                             │  boards.                      │
├─────────────────────────────┴───────────────────────────────┤
│  WHAT PROBLEM IT SOLVES                                     │
│  Students read the textbook and forget 70% within 24 hours. │
│  Structured, interactive lessons with board-exam callouts   │
│  transform passive reading into active learning.            │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Flashcards

**Purpose:** Show active recall reinforcement.

**Layout:** Two columns
```
┌─────────────────────────────┬───────────────────────────────┐
│  WHY THIS EXISTS            │  [FLASHCARD SCREENSHOT]       │
│                             │                               │
│  Reading creates familiarity.│  Front: What is alopecia    │
│  Recall creates memory.     │  areata?                     │
│                             │                               │
│  Flashcards force students  │  Back: Autoimmune disorder   │
│  to retrieve information    │  causing round patches...    │
│  from memory — the single   │                               │
│  most effective study       │                               │
│  technique proven by        │                               │
│  cognitive science.         │                               │
├─────────────────────────────┴───────────────────────────────┤
│  WHAT PROBLEM IT SOLVES                                     │
│  Students re-read and highlight. They think they know it.   │
│  Flashcards reveal what they actually remember — and what   │
│  they don't.                                                │
└─────────────────────────────────────────────────────────────┘
```

### Step 4: Quiz

**Purpose:** Show board-style assessment.

**Layout:** Two columns (reversed)
```
┌─────────────────────────────┬───────────────────────────────┐
│  [QUIZ SCREENSHOT]          │  WHY THIS EXISTS              │
│                             │                               │
│  Question with 4 options    │  The board exam asks questions│
│  Board-exam phrasing        │  in a specific way. Students  │
│  Difficulty selector        │  must practice answering in   │
│                             │  that way.                    │
│                             │                               │
│                             │  These quizzes mirror state   │
│                             │  board language, structure,   │
│                             │  and difficulty.              │
├─────────────────────────────┴───────────────────────────────┤
│  WHAT PROBLEM IT SOLVES                                     │
│  Students who've never seen board-style questions panic on  │
│  exam day. Familiarity breeds confidence.                   │
└─────────────────────────────────────────────────────────────┘
```

### Step 5: Learn From Mistakes

**Purpose:** Show that wrong answers are teaching moments, not failures.

**Layout:** Two columns
```
┌─────────────────────────────┬───────────────────────────────┐
│  WHY THIS EXISTS            │  [WRONG ANSWER SCREENSHOT]    │
│                             │                               │
│  Getting a question wrong   │  "Incorrect. A furuncle is    │
│  is not failure. It is      │  an acute bacterial infection │
│  discovery.                 │  of a single hair follicle... │
│                             │                               │
│  The platform doesn't just  │  [Review This Topic]          │
│  mark answers wrong. It     │                               │
│  explains why. It teaches   │                               │
│  the concept. It closes     │                               │
│  the gap.                   │                               │
├─────────────────────────────┴───────────────────────────────┤
│  WHAT PROBLEM IT SOLVES                                     │
│  Students who miss a question and only see "Wrong" remember │
│  their mistake, not the correct answer. Explanations turn   │
│  errors into learning.                                      │
└─────────────────────────────────────────────────────────────┘
```

### Step 6: Progress Tracking

**Purpose:** Show that every interaction feeds into measurable improvement.

**Layout:** Two columns (reversed)
```
┌─────────────────────────────┬───────────────────────────────┐
│  [PROGRESS SCREENSHOT]      │  WHY THIS EXISTS              │
│                             │                               │
│  Updated Board Readiness    │  Students need to see         │
│  Updated Focus Areas        │  improvement. Instructors     │
│  Recent quiz trend line     │  need to see gaps. Schools    │
│                             │  need to prove outcomes.      │
│                             │                               │
│                             │  This dashboard serves all    │
│                             │  three.                       │
├─────────────────────────────┴───────────────────────────────┤
│  WHAT PROBLEM IT SOLVES                                     │
│  Without measurement, there is no accountability. Without   │
│  accountability, there is no improvement.                   │
└─────────────────────────────────────────────────────────────┘
```

### Step 7: Future Vision

**Purpose:** Show where the product is going.

**Layout:** Centered, no screenshot
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  WHERE WE'RE GOING                                          │
│                                                             │
│  Listen Mode — Audio summaries for hands-free study         │
│  while commuting, working, or practicing on mannequins.     │
│                                                             │
│  Instructor Dashboard — Class-wide visibility into every    │
│  student's progress, weaknesses, and recommended actions.   │
│                                                             │
│  State-Specific Modules — Content tailored to each state's  │
│  board exam requirements and practical examination.         │
│                                                             │
│  This is where barber education is going.                   │
│  Measurable. Accessible. Effective.                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. What Each Card Should Say

### Step 0 — Landing

**Headline:** Barber Study Pro
**Subheadline:** This is how barber students prepare for the state board exam.
**Body:**
> Not by reading alone.
> By learning, reinforcing, testing, and improving.
>
> Every step measured. Every gap identified. Every student becoming board-ready.

**CTA:** [ Begin the Journey ]
**Secondary:** Scroll to explore each step ↓

### Step 1 — Dashboard

**Headline:** Step 1 — Student Dashboard
**Why It Exists:**
> Students need to know where they stand. This dashboard answers one question: "Am I ready?" The answer is measurable. Not vague. Not guessed. Data-driven.

**What Problem It Solves:**
> Students who don't know their gaps can't fix them. This dashboard makes gaps visible — instantly.

### Step 2 — Chapter 10 Lesson

**Headline:** Step 2 — Interactive Lesson
**Why It Exists:**
> Textbooks are reference. This is a learning system. Students don't retain what they passively read. They retain what they interact with.

**What Problem It Solves:**
> Students read the textbook and forget 70% within 24 hours. Structured, interactive lessons with board-exam callouts transform passive reading into active learning.

**Why Chapter 10:**
> Chapter 10 covers hair and scalp disorders — one of the most-tested topics on state boards. Every barber needs to recognize contagious conditions, understand contraindications, and know when to refer.

### Step 3 — Flashcards

**Headline:** Step 3 — Active Recall
**Why It Exists:**
> Reading creates familiarity. Recall creates memory. Flashcards force students to retrieve information from memory — the single most effective study technique proven by cognitive science.

**What Problem It Solves:**
> Students re-read and highlight. They think they know it. Flashcards reveal what they actually remember — and what they don't.

### Step 4 — Quiz

**Headline:** Step 4 — Board-Style Assessment
**Why It Exists:**
> The board exam asks questions in a specific way. Students must practice answering in that way. These quizzes mirror state board language, structure, and difficulty.

**What Problem It Solves:**
> Students who've never seen board-style questions panic on exam day. Familiarity breeds confidence.

### Step 5 — Learn From Mistakes

**Headline:** Step 5 — Learn From Mistakes
**Why It Exists:**
> Getting a question wrong is not failure. It is discovery. The platform doesn't just mark answers wrong. It explains why. It teaches the concept. It closes the gap.

**What Problem It Solves:**
> Students who miss a question and only see "Wrong" remember their mistake, not the correct answer. Explanations turn errors into learning.

### Step 6 — Progress Tracking

**Headline:** Step 6 — Measurable Improvement
**Why It Exists:**
> Students need to see improvement. Instructors need to see gaps. Schools need to prove outcomes. This dashboard serves all three.

**What Problem It Solves:**
> Without measurement, there is no accountability. Without accountability, there is no improvement.

### Step 7 — Future Vision

**Headline:** Where We're Going
**Body:**
> Listen Mode — Audio summaries for hands-free study while commuting, working, or practicing on mannequins.
>
> Instructor Dashboard — Class-wide visibility into every student's progress, weaknesses, and recommended actions.
>
> State-Specific Modules — Content tailored to each state's board exam requirements and practical examination.
>
> This is where barber education is going. Measurable. Accessible. Effective.

---

## 5. Recommended Order

The order is fixed and sequential. The presenter does not skip steps.

| Order | Step | Duration | Presenter Action |
|-------|------|----------|------------------|
| 0 | Landing | 15 sec | Read headline, click "Begin" |
| 1 | Dashboard | 45 sec | Scroll to Step 1, point at Board Readiness Score |
| 2 | Chapter 10 | 45 sec | Scroll to Step 2, point at Board Exam Alerts |
| 3 | Flashcards | 30 sec | Scroll to Step 3, mention active recall |
| 4 | Quiz | 30 sec | Scroll to Step 4, note board-style phrasing |
| 5 | Wrong Answer | 45 sec | Scroll to Step 5, emphasize teaching moment |
| 6 | Progress | 30 sec | Scroll to Step 6, show updated metrics |
| 7 | Future | 30 sec | Scroll to Step 7, close with vision |
| **Total** | | **4:30** | |

This leaves 30 seconds for questions or buffer, keeping the demo under 5 minutes.

---

## 6. What the Presenter Clicks First

**First click:** The "Begin the Journey" button on the landing screen.

**What happens:** Smooth scroll to Step 1 (Student Dashboard).

**Why:** The landing screen sets context. Without it, the dashboard is just numbers. With it, the dashboard is the answer to "How do students know if they're ready?"

---

## 7. What the Presenter Clicks Second

**Second click:** The "Step 2 — Lesson" navigation item (or scroll down).

**What happens:** Smooth scroll to Step 2 (Chapter 10 Lesson).

**Why:** After showing that students know their progress, the next question is "How do they improve?" The lesson is the answer.

---

## 8. What the Presenter Clicks Third

**Third click:** The "Step 5 — Learn From Mistakes" navigation item.

**What happens:** Smooth scroll to Step 5 (Wrong Answer Explanation).

**Why:** This is the most powerful teaching moment in the entire demo. The presenter can say: "Let me show you the most important screen in the platform." It demonstrates that the platform educates, not just tests. This is where skepticism converts to belief.

**Note:** The presenter may choose to click Steps 3 and 4 first (natural scroll order), but Step 5 is the emotional peak. If time is short, skip 3 and 4 and jump to 5.

---

## 9. Exact Wording Recommendations

### Words to Use

| Word | Why |
|------|-----|
| "Board-ready" | Outcome-focused, universally understood |
| "Measurable" | Data-driven, accountable |
| "Active recall" | Scientifically grounded |
| "Board-style" | Aligns with exam preparation |
| "Teaching moment" | Positives wrong answers as learning |
| "Structured" | Implies curriculum alignment |
| "Retention" | Addresses the forgetting curve |
| "Visibility" | Instructor and school owner value |
| "Companion" | Positions as additive, not replacement |
| "Accountability" | School owner and NABBA value |

### Words to Avoid

| Word | Why |
|------|-----|
| "Gamified" | Undermines educational credibility |
| "Level up" | Video game language |
| "Unlock" | Entertainment framing |
| "XP" | Arbitrary scoring |
| "Boss battle" | Trivializes assessment |
| "Hair Lab" | Themed framing, not professional |
| "Disrupt" | Aggressive, alienating |
| "Revolutionary" | Invites skepticism |
| "AI-powered" | Misleading if not true |
| "Algorithm" | Technical, not educational |

---

## 10. What Should NOT Appear

### Never Show on the Demo Landing Experience

| Element | Why |
|---------|-----|
| Raw metrics without context | Confuses first-time viewers |
| Navigation to real app features | Keeps audience in the story |
| Login / auth screens | Breaks demo flow |
| Payment or pricing | Commercial, not educational |
| Settings or preferences | Operational noise |
| Social features | Irrelevant to outcomes |
| Leaderboards | Competition undermines standardization |
| Badges, trophies, achievements | Gamification |
| Empty states | Makes platform look unused |
| Technical jargon | Alienates non-technical stakeholders |
| "Beta" or "Coming Soon" labels | Undermines confidence |
| Developer credits or build info | Unprofessional |

---

## 11. What Milady Will Care About

### Milady's Priorities in This Demo

1. **Curriculum Alignment**
   - Does Chapter 10 map to their Chapter 10?
   - Is terminology consistent?
   - Is the sequence logical?
   - *Address in Step 2:* "Chapter 10 covers hair and scalp disorders — the same topics, same terminology, same sequence students see in their textbook."

2. **Pedagogical Soundness**
   - Is the learning sequence evidence-based?
   - Does it follow established instructional design?
   - *Address in Steps 3-5:* "Lesson → Flashcards → Quiz → Explanation. This is the active recall loop proven by cognitive science."

3. **Professional Tone**
   - Is the language appropriate for professional education?
   - Does it respect the seriousness of licensure?
   - *Address throughout:* No gamification, no hype, just outcomes.

4. **Complement, Not Replace**
   - Does this drive deeper engagement with Milady content?
   - *Address in Step 2:* "Textbooks are reference. This is reinforcement. Students read Milady, then lock it in here."

5. **Data and Outcomes**
   - Can Milady point to measurable results?
   - *Address in Step 6:* "Every interaction is measured. Schools can prove student readiness."

---

## 12. What NABBA Will Care About

### NABBA's Priorities in This Demo

1. **Board Exam Alignment**
   - Do quiz questions match board exam style?
   - Is content current and accurate?
   - *Address in Step 4:* "Every question is written with board exam language in mind."

2. **Standardization**
   - Will all students get the same preparation?
   - *Address in Step 1:* "Every student sees the same content, same assessment, same standards."

3. **Public Safety**
   - Does content emphasize safety and scope of practice?
   - *Address in Step 2:* "Chapter 10 covers contagious conditions, contraindications, and when to refer."

4. **No Exam Compromise**
   - Could this be used to cheat?
   - *Address in Step 4:* "We teach concepts, not exam dumps. Randomized questions prevent pattern memorization."

5. **Accountability**
   - Can schools prove preparation?
   - *Address in Step 6:* "Board Readiness Score is a standardized metric. Schools can show accreditors exactly where students stand."

---

## 13. What Instructors Will Care About

### Instructor Priorities in This Demo

1. **Time Savings**
   - Will this reduce my workload?
   - *Address in Step 6:* "Instructors see every student's gaps without creating quizzes or grading papers."

2. **Visibility**
   - Can I see who needs help?
   - *Address in Step 1 and 6:* "Focus Areas show exactly who is struggling with what."

3. **Remediation**
   - Can I assign targeted review?
   - *Address in Step 6:* "The platform recommends specific flashcards and quizzes for each student."

4. **Accuracy**
   - Is the content correct?
   - *Address in Step 2:* "Built around standard curriculum. Welcomes expert review."

5. **Classroom Integration**
   - Does this fit how I teach?
   - *Address in Step 2:* "Students study theory here. You teach application in the shop."

---

## 14. What School Owners Will Care About

### School Owner Priorities in This Demo

1. **Retention**
   - Will this keep students enrolled?
   - *Address in Step 1:* "Students who pass stay. Students who fail leave. This measures readiness before the exam."

2. **Differentiation**
   - Can I use this in marketing?
   - *Address in Step 0:* "Includes digital board prep platform" — enrollment competitive advantage."

3. **ROI**
   - What's the cost vs. benefit?
   - *Address in Step 6:* "If this improves pass rates by 10%, it pays for itself with the first student who passes instead of fails."

4. **Implementation**
   - How hard is this to roll out?
   - *Address implicitly:* Web-based, no IT required, students use their own devices.

5. **Proof**
   - How do I know it works?
   - *Address in Step 6:* "Pilot programs track board pass rates. Measure, then decide."

---

## 15. What Creates the Strongest First Impression

### The Opening Line

The first 10 seconds determine whether the audience leans in or checks out.

**Strong opening:**
> "This is how barber students prepare for the state board exam. Not by reading alone. By learning, reinforcing, testing, and improving."

**Why it works:**
- It promises a story, not a product demo
- It addresses the audience's core concern (board exam)
- It sets up the seven-step structure
- It sounds confident without being arrogant

### The Visual First Impression

The landing screen should be:
- **Clean** — no clutter, no competing elements
- **Confident** — large type, centered, unapologetic
- **Professional** — dark background, gold accent, no decoration
- **Inviting** — one clear action: "Begin the Journey"

### The Emotional Peak

Step 5 (Learn From Mistakes) is where skepticism converts to belief.

The presenter says:
> "Let me show you the most important screen in the entire platform."

This creates anticipation. The wrong answer explanation delivers on it. The audience sees that this platform teaches, not just tests.

---

## 16. Recommended Visual Hierarchy

### Z-Order of Importance

1. **The story text** (why this exists, what problem it solves)
2. **The app screenshot** (proof that the product exists and works)
3. **The step number** (progress through the story)
4. **The navigation bar** (wayfinding, not primary content)
5. **The brand name** (present but not dominant)

### Typography Hierarchy

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Landing headline | 48px | Bold | White |
| Landing subheadline | 20px | Regular | Gray-300 |
| Step headline | 32px | Semibold | White |
| "Why It Exists" | 16px | Regular | Gray-300 |
| "What Problem It Solves" | 14px | Regular | Gray-400 |
| App screenshot content | As-is | — | — |
| Navigation | 14px | Medium | Gray-400 (active: Gold) |

### Spacing

- Each step is full viewport height (100vh) minimum
- Generous padding (64px+) around content
- Clear separation between text column and screenshot column
- Screenshot is framed (border, subtle shadow) to distinguish from background

---

## 17. Recommended Call-to-Action Wording

### Step 0 — Landing CTA

**Primary:** "Begin the Journey"
**Secondary:** "Scroll to explore each step ↓"

**Why:** "Begin the Journey" is active and inviting. "Explore" is low-pressure. Neither commits the audience to anything.

### Step 7 — Closing CTA

**Text:**
> "Better retention. Better preparation. Measurable results.
>
> Thank you. I'm happy to answer any questions."

**No button.** The demo ends with an invitation for dialogue, not a sales pitch.

### What NOT to Use as CTA

| Avoid | Why |
|-------|-----|
| "Buy Now" | Too aggressive for educational demo |
| "Sign Up" | Commits audience before they're convinced |
| "Get Started" | Implies work for the audience |
| "Revolutionize Your School" | Hype, not substance |
| "Limited Time Offer" | Creates pressure, not value |

---

## 18. How the Dashboard Fits Into the Story

### Current Problem

The existing `/demo` dashboard shows metrics without context. A first-time viewer sees "78% Board Readiness" and thinks:
- "Is that good?"
- "What does that mean?"
- "How is that calculated?"

### Solution

The dashboard becomes **Step 1 of 7**, not the entire demo.

**Before showing the dashboard, the presenter says:**
> "Students need to know where they stand. This dashboard answers one question: 'Am I ready?'"

**After showing the dashboard, the presenter says:**
> "But knowing where you stand isn't enough. Students need to improve. Let me show you how."

**Then scrolls to Step 2 (Lesson).**

### The Dashboard's Role

The dashboard is the **hook** — it creates the question "How did the student get to 78%?"

The rest of the story answers that question.

Without the story, the dashboard is just numbers. With the story, the dashboard is proof of a system that works.

---

## 19. How Chapter 10 Fits Into the Story

### Why Chapter 10 Is the Example

Chapter 10 (Properties and Disorders of the Hair and Scalp) is the demonstration chapter because it:

1. **Has the highest board-exam weight** — Hair disorders, scalp conditions, and contagious disease recognition appear on every state board
2. **Has the strongest safety story** — Public health depends on barbers recognizing contagious conditions
3. **Is completely implemented** — Premium lesson, 118 flashcards, 70 quiz questions, all production-ready
4. **Appeals to all audiences** — Milady (curriculum alignment), NABBA (public safety), instructors (safety content), school owners (pass rates)

### Chapter 10's Role in the Story

**Step 2:** The lesson shows that content is structured, interactive, and board-aligned.

**Step 3:** The flashcards show active recall reinforcement of Chapter 10 concepts.

**Step 4:** The quiz shows board-style assessment of Chapter 10 material.

**Step 5:** The wrong answer explanation shows how Chapter 10 misconceptions are corrected.

**Step 6:** The updated dashboard shows that Chapter 10 study improved the Board Readiness Score.

Chapter 10 is the **thread that ties the story together.** Every step references it. The audience follows one student's journey through one chapter — and understands how the platform works for all 23.

---

## 20. Executive Summary

### The Problem

The current `/demo` dashboard shows metrics without context. First-time viewers are confused because they don't understand the journey that produced the numbers.

### The Solution

Rebuild `/demo` as a **single-page guided presentation experience** with seven sequential steps:

1. **Landing** — Set the stage
2. **Dashboard** — Show progress visibility
3. **Lesson** — Show structured content
4. **Flashcards** — Show active recall
5. **Quiz** — Show board-style assessment
6. **Learn From Mistakes** — Show teaching moments
7. **Future Vision** — Show where we're going

### Key Principles

- **Story first, metrics second.** Every metric is framed by "why it exists" and "what problem it solves."
- **One continuous flow.** No page loads. No route changes. Scroll or click navigation.
- **Professional tone.** No gamification. No hype. Just outcomes.
- **Chapter 10 as the thread.** Every step references the same chapter, creating coherence.

### Recommended Implementation

- **One file:** `src/app/demo/page.tsx` (replace current content)
- **No new components needed** — use inline sections with scroll-to anchors
- **No database, no auth, no API** — static demo data, same as current
- **Sticky navigation bar** with step links
- **Smooth scroll** between sections
- **Full-viewport sections** (100vh minimum per step)

### Biggest Improvement Over Current `/demo`

The current dashboard answers "What is the student's status?" The storyboard answers "How did the student get here, and how do they improve?" The second question is what converts stakeholders.

### Recommendation

**Yes, rebuild `/demo`.** The current dashboard is not wrong — it is incomplete. It belongs inside Step 1 of a larger story. Rebuild it as the seven-step storyboard described above. Keep the existing dashboard design as the embedded screenshot within Step 1.

---

*End of Storyboard Blueprint*
