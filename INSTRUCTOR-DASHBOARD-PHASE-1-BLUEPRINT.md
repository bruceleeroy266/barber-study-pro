# Instructor Dashboard — Phase 1 Blueprint

**Barber Study Pro V2**  
**Branch:** `demo-milady-nabba`  
**Date:** 2026-06-07  
**Status:** Planning-only audit. No code changes.

---

## 1. Executive Summary

The existing Instructor Dashboard (`/instructor` and `/instructor/student/[studentId]`) already has a working foundation: real Supabase queries, role-based access control, student lists, progress tables, and quiz attempt history. However, it is visually bare and analytically shallow. It shows *what happened* but not *what it means* or *what to do next*.

This blueprint designs a **Phase 1 upgrade** that transforms the instructor view from a passive roster into an **active teaching tool** — using only data that already exists or can be calculated from existing tables. No schema changes. No new components. Just better use of what is already wired.

---

## 2. Current State Audit

### 2.1 What Already Works (Real Data, Real Queries)

| Feature | Location | Data Source | Status |
|---------|----------|-------------|--------|
| School-scoped student roster | `/instructor/page.tsx` | `profiles` table, filtered by `school_id` | ✅ Live |
| Role-based access control | `middleware.ts` + page guards | `profiles.role` | ✅ Live |
| Per-student chapter completion count | `/instructor/page.tsx` | `student_progress` | ✅ Live |
| Per-student average quiz score | `/instructor/page.tsx` | `quiz_attempts` | ✅ Live |
| Per-student quiz attempt count | `/instructor/page.tsx` | `quiz_attempts` | ✅ Live |
| Student detail view | `/instructor/student/[studentId]/page.tsx` | `profiles` + `student_progress` + `quiz_attempts` | ✅ Live |
| Chapter-by-chapter breakdown | `/instructor/student/[studentId]/page.tsx` | `student_progress` per chapter | ✅ Live |
| Recent quiz attempts table | `/instructor/student/[studentId]/page.tsx` | `quiz_attempts` | ✅ Live |
| Flashcard/quiz completion flags | `/instructor/student/[studentId]/page.tsx` | `student_progress.flashcards_completed`, `quiz_completed` | ✅ Live |
| Best quiz score per chapter | `/instructor/student/[studentId]/page.tsx` | `student_progress.best_quiz_score` | ✅ Live |

### 2.2 What Is Mock Data (Not Wired to Real Data)

| Feature | Location | Issue |
|---------|----------|-------|
| Weak area detection | `WeakAreaDashboard.tsx` | Hardcoded mock arrays. The `weak-area-mapping.ts` engine (800+ lines) exists but is not connected to Supabase. |
| Concept-level analytics | `WeakAreaDashboard.tsx` | Requires `QuizPerformance` and `FlashcardPerformance` granular data that does not exist in the current schema. |
| Exam readiness score | `WeakAreaDashboard.tsx` | Calculated from mock analytics, not real data. |
| Study streak tracking | `WeakAreaDashboard.tsx` | Mock value (`streakDays: 7`). No `study_sessions` table exists. |
| Total study time | `WeakAreaDashboard.tsx` | Mock value (`totalStudyTime: 480`). Not tracked. |
| Adaptive learning path | `WeakAreaDashboard.tsx` | Mock recommendations. Engine exists but has no real inputs. |

### 2.3 What Can Be Calculated Today (No Schema Changes)

From existing `quiz_attempts` + `student_progress` + `profiles` + `chapters`:

- **Class average quiz score** — average of all `quiz_attempts.percentage` for a school's students
- **Class completion rate** — average of `student_progress.progress_percentage` across all chapters
- **At-risk students** — students with low completion %, low avg quiz scores, or stale `last_studied_at`
- **Chapter difficulty ranking** — which chapters have the lowest average quiz scores across the class
- **Student activity timeline** — when each student last studied (from `last_studied_at`)
- **Quiz score trends** — compare recent attempts vs older attempts for a student
- **Focus areas (coarse)** — which chapters have the most failed quiz attempts across the class

### 2.4 What Requires Schema Changes (Out of Scope for Phase 1)

| Feature | Missing Data | Schema Change Needed |
|---------|------------|---------------------|
| True concept-level weak areas | Per-question answer tracking with concept tags | Add `concept_id` to `quiz_questions`; track per-question results |
| Flashcard confidence ratings | Student self-rating per card review | Add `flashcard_reviews` table with `confidence_rating` |
| Study time tracking | Session duration | Add `study_sessions` table |
| Study streaks | Daily activity log | Add `study_sessions` or aggregate from `quiz_attempts` + `student_progress.updated_at` |
| Exam readiness algorithm | Weighted concept mastery | Requires concept-level tracking above |

---

## 3. Phase 1 Feature Designs

### Feature 1: Class Health Overview

**Purpose:** Give the instructor an at-a-glance pulse check of the entire class.

**Data Sources:**
- `profiles` (student count)
- `student_progress` (completion percentages)
- `quiz_attempts` (scores)
- `chapters` (total chapter count)

**Calculations:**
```
class_completion_rate = AVG(all students' AVG(progress_percentage across all chapters))
class_avg_quiz_score = AVG(all quiz_attempts.percentage for school students)
active_this_week = COUNT(students with last_studied_at within 7 days)
at_risk_count = COUNT(students with < 50% class_completion_rate OR avg_quiz_score < 60% OR last_studied_at > 14 days ago)
```

**UI Recommendation:**
- 4 stat cards at top of `/instructor` page (replaces current 3)
  - Total Students
  - Class Completion Rate (progress bar + %)
  - Class Avg Quiz Score (color-coded: green ≥75, yellow 60-74, red <60)
  - At-Risk Students (red badge with count)

**Implementation Complexity:** Low. All data already fetched in the page. Just add computed fields to `studentStats` map.

**Business Value:** High. Instructors need to know if their class is on track without clicking into every student.

---

### Feature 2: At-Risk Students Alert Panel

**Purpose:** Surface students who need intervention before they fall too far behind.

**Data Sources:**
- `student_progress.progress_percentage`
- `student_progress.last_studied_at`
- `quiz_attempts.percentage` (aggregated per student)

**At-Risk Criteria (configurable):**
- Overall progress < 50% OR
- Average quiz score < 60% OR
- No activity in 14+ days (`last_studied_at`)

**UI Recommendation:**
- Collapsible alert panel below the stats cards on `/instructor`
- Shows a compact table: Name | Risk Factors | Last Active | Quick Action
- Risk factors shown as tags: "Low Progress", "Low Quiz Scores", "Inactive"
- Quick Action: "View Detail" link to `/instructor/student/[id]`
- Color: Red border/background for urgency

**Implementation Complexity:** Low. Reuse existing `studentStats` array, add `riskFactors` array to each student.

**Business Value:** Very High. This is the #1 reason schools buy instructor dashboards — early intervention saves failing students.

---

### Feature 3: Class Focus Areas (Coarse)

**Purpose:** Show which chapters the class as a whole is struggling with.

**Data Sources:**
- `quiz_attempts` (all attempts for school students)
- `quizzes` (to map `quiz_id` → `chapter_id`)
- `chapters` (to get chapter titles)

**Calculations:**
```
For each chapter:
  chapter_avg_score = AVG(quiz_attempts.percentage WHERE quiz.chapter_id = chapter.id)
  chapter_attempt_count = COUNT(quiz_attempts WHERE quiz.chapter_id = chapter.id)
  chapter_pass_rate = COUNT(attempts.percentage >= 75) / COUNT(all attempts)
```

**UI Recommendation:**
- New section on `/instructor` page: "Class Focus Areas"
- Horizontal bar chart or ranked list
- Each row: Chapter Title | Avg Score | Pass Rate | Attempts
- Color coding: Red (avg < 60), Yellow (60-74), Green (≥75)
- Sort by lowest avg score first

**Implementation Complexity:** Medium. Requires joining `quiz_attempts` → `quizzes` → `chapters`. The current page only fetches raw attempts; needs a small aggregation pass.

**Business Value:** High. Instructors can re-teach or assign extra work on the chapters where the class is weakest.

---

### Feature 4: Chapter Completion Matrix

**Purpose:** A visual grid showing every student's progress across every chapter.

**Data Sources:**
- `student_progress` (all records for school students)
- `chapters` (all active chapters)
- `profiles` (student names)

**UI Recommendation:**
- New tab or section on `/instructor` page
- Grid: Rows = Students, Columns = Chapters (1-21)
- Cell colors:
  - Green: 100% complete (flashcards + quiz done)
  - Yellow: In progress (>0%, <100%)
  - Gray: Not started (0%)
- Hover tooltip shows exact % and best quiz score
- Click cell → navigate to that student's detail view

**Implementation Complexity:** Medium. Requires reshaping `student_progress` data into a matrix. Performance concern if class is large (>50 students), but fine for typical barber school classes (10-30 students).

**Business Value:** Medium-High. Visual pattern recognition — instructors can spot who is stuck where at a glance.

---

### Feature 5: Enhanced Student Detail View

**Purpose:** Deep dive into a single student's performance with actionable insights.

**Current State:** Already exists at `/instructor/student/[studentId]`. Shows chapter list, progress bars, quiz attempts table.

**Enhancements (using existing data):**

1. **Student Health Score**
   - Single composite score (0-100) calculated from:
     - Completion rate: 40% weight
     - Avg quiz score: 40% weight
     - Recency of activity: 20% weight
   - Color-coded badge: Green (≥80), Yellow (60-79), Red (<60)

2. **Quiz Score Trend**
   - Line chart or sparkline showing quiz attempt percentages over time
   - Data: `quiz_attempts.completed_at` + `percentage`
   - Simple trend: "Improving", "Stable", "Declining" based on linear regression or last 3 vs first 3

3. **Recommended Actions (auto-generated)**
   - Based on simple rules:
     - If completion < 50% → "Encourage daily study schedule"
     - If avg quiz < 60% → "Recommend flashcard review before retaking quizzes"
     - If inactive > 14 days → "Check in with student"
     - If specific chapter best score < 60% → "Re-review Chapter X"

4. **Activity Timeline**
   - Chronological list of study events:
     - Quiz attempts (date, score)
     - Flashcard completions (date)
     - Chapter progress updates (date)
   - Data from `quiz_attempts.completed_at` and `student_progress.updated_at`

**UI Recommendation:**
- Keep existing layout, add new cards above the chapter list
- Row 1: Health Score | Quiz Trend Sparkline | Last Active
- Row 2: Recommended Actions (bullet list with icons)
- Row 3: Activity Timeline (collapsible)

**Implementation Complexity:** Low-Medium. All data already fetched. Just add computed fields and new UI sections.

**Business Value:** Very High. Turns the detail view from a passive report into an active coaching tool.

---

## 4. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INSTRUCTOR DASHBOARD                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Class Health │  │ At-Risk    │  │ Focus Areas │         │
│  │ Overview     │  │ Students   │  │ (Coarse)    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Chapter Completion Matrix                    │   │
│  │  (Students × Chapters grid with color coding)        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Student Roster Table (existing)              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              STUDENT DETAIL VIEW ([studentId])               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Health Score │  │ Quiz Trend  │  │ Last Active │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Recommended Actions (rule-based)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Activity Timeline                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Chapter Progress (existing, enhanced)        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Recent Quiz Attempts (existing)              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Implementation Priority

| Priority | Feature | Complexity | Business Value | Effort Estimate |
|----------|---------|-----------|----------------|-----------------|
| P0 | Class Health Overview | Low | High | 2-3 hours |
| P0 | At-Risk Students Alert | Low | Very High | 2-3 hours |
| P1 | Enhanced Student Detail | Low-Medium | Very High | 4-6 hours |
| P1 | Class Focus Areas | Medium | High | 4-5 hours |
| P2 | Chapter Completion Matrix | Medium | Medium-High | 4-6 hours |

**Total Phase 1 Effort:** ~16-23 hours of focused development.

---

## 6. Technical Notes

### 6.1 Existing Data Structures (Confirmed)

```typescript
// From src/types/index.ts
interface Profile {
  id: string; email: string; full_name: string;
  role: 'student' | 'instructor' | 'apprentice' | 'admin';
  school_id: string | null; created_at: string;
}

interface StudentProgress {
  id: string; user_id: string; chapter_id: string;
  flashcards_completed: boolean; quiz_completed: boolean;
  best_quiz_score: number | null; last_studied_at: string | null;
  progress_percentage: number;
}

interface QuizAttempt {
  id: string; user_id: string; quiz_id: string;
  score: number; total_questions: number;
  percentage: number; answers_json: Record<string, string>;
  completed_at: string;
}

interface Chapter {
  id: string; chapter_number: number; title: string;
  description: string | null; is_active: boolean;
}
```

### 6.2 Query Patterns Needed

All queries already exist in the codebase. Phase 1 only needs:
- Additional aggregation logic in the server component (no new API routes)
- Reshaping existing query results into new computed fields
- New UI sections using existing Tailwind patterns

### 6.3 Performance Considerations

- Current pages fetch ALL student data server-side. For large schools (>100 students), consider:
  - Pagination on the student roster
  - Lazy-loading the completion matrix
  - Caching class-level aggregates
- For typical barber schools (10-30 students), current approach is fine.

### 6.4 Reusable Components

The existing codebase has these components that can be reused:
- `ChapterHeader` — for consistent card styling
- `ChapterContent` section wrappers — for themed containers
- Progress bars (used throughout dashboard)
- Color-coded badges (green/yellow/red patterns exist)

---

## 7. What NOT to Build in Phase 1

| Feature | Reason |
|---------|--------|
| True adaptive learning paths | Requires `QuizPerformance`/`FlashcardPerformance` data not in schema |
| Concept-level weak area detection | Requires per-question concept tagging and answer tracking |
| Study time analytics | No `study_sessions` table; `totalStudyTime` is mock |
| Exam readiness score | Requires concept mastery weights; currently mock |
| Study streak tracking | No daily activity log; streak is mock |
| Real-time notifications | Out of scope; requires WebSocket or polling infrastructure |
| Gradebook/CSV export | Nice-to-have; can be Phase 2 |
| Assignment creation | Requires new schema for instructor-created tasks |

---

## 8. Success Metrics

After Phase 1 deployment, measure:

1. **Instructor engagement:** % of instructors who visit dashboard weekly
2. **At-risk identification:** # of students flagged → # who received intervention
3. **Time to insight:** How quickly an instructor can identify a struggling student (target: < 30 seconds)
4. **Student outcome correlation:** Do students of active instructors (who use dashboard) have higher completion rates?

---

## 9. Appendix: Content Inventory

For reference, the content available to students (and thus trackable by instructors):

| Chapter | Title | Flashcards | Quiz Qs | Themed Content |
|---------|-------|-----------|---------|----------------|
| 1 | History of Barbering | 45 | 30 | ✅ Ancient Legacy |
| 2 | Life Skills | 50 | 30 | ✅ Success Game Plan |
| 3 | Professional Image | 40 | 31 | ✅ Luxury Academy |
| 4 | Infection Control | 50 | 31 | ✅ Sterile Gold |
| 5 | Implements, Tools, Equipment | 70 | 50 | ✅ Workshop |
| 6 | General Anatomy & Physiology | 0 | 51 | ✅ (partial) |
| 7 | Basics of Chemistry | 80 | 50 | ✅ Lab |
| 8 | Basics of Electricity | 50 | 30 | ✅ Electric |
| 9 | The Skin | 50 | 30 | ✅ Derma |
| 10 | Hair & Scalp Properties | 118 | 75 | ✅ Trichology |
| 11 | Hair & Scalp Treatment | 80 | 50 | ✅ Treatment |
| 12 | Men's Facial Massage | 115 | 45 | ✅ Spa |
| 13 | Shaving & Facial Hair Design | 90 | 45 | ✅ Blade |
| 14-21 | Various | Partial | Partial | ❌ Incomplete |

**Total:** 868 flashcards, 517 quiz questions, 10 themed chapters (Ch 1-5, 7-13).

---

## 10. Conclusion

The Instructor Dashboard is not broken — it is **underutilized**. The foundation is solid: real data, real queries, real RBAC. Phase 1 does not require rebuilding; it requires **revealing** — surfacing the insights that are already latent in the data.

The highest-value, lowest-effort wins are:
1. **At-Risk Students Alert** — immediate intervention capability
2. **Class Health Overview** — at-a-glance class pulse
3. **Enhanced Student Detail** — actionable coaching insights

These three features transform the dashboard from a "nice to have" into a "must use" tool for instructors — which is exactly what sells school licenses.

---

*End of Blueprint. No code was harmed (or written) in the making of this document.*
