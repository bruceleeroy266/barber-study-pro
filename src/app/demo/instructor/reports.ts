// Premium printable Student and Class reports for ASCYN PRO demo
// Pure HTML/CSS strings — no React, no backend, no auth.

export type Note = {
  id: string
  text: string
  type: string
  followUp: string
  date: string
}

export type Student = {
  id: string
  name: string
  program: string
  readiness: number
  lastActive: string
  weakestTopic: string
  riskStatus: string
  recentActivity: string
  quizzesTaken: number
  avgScore: number
  confidenceTrend: number[]
  topicMastery: { topic: string; score: number }[]
  quizHistory: { chapter: string; score: number; date: string }[]
  recommendedAction: string
  riskFactors: string[]
  notes: Note[]
}

export type HeatmapTopic = {
  topic: string
  classAvg: number
  weight: string
}

const LOGO_URL = 'https://ascynpro.com/logo.svg'
const GOLD = '#D4AF37'
const BLACK = '#0a0a0a'
const WHITE = '#ffffff'

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function lastConfidence(student: Student): number {
  return student.confidenceTrend[student.confidenceTrend.length - 1] ?? 0
}

function readinessColor(score: number): string {
  if (score >= 75) return '#22c55e'
  if (score >= 60) return GOLD
  return '#ef4444'
}

function readinessLabel(score: number): string {
  if (score >= 85) return 'Ready'
  if (score >= 75) return 'On Track'
  if (score >= 60) return 'Needs Improvement'
  return 'At Risk'
}

function topicStatus(score: number): { label: string; color: string } {
  if (score >= 85) return { label: 'Excellent', color: '#22c55e' }
  if (score >= 75) return { label: 'Good', color: '#16a34a' }
  if (score >= 60) return { label: 'Needs Improvement', color: GOLD }
  return { label: 'Critical', color: '#ef4444' }
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function reportBase(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      @page { size: auto; margin: 18mm 16mm 22mm 16mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: ${BLACK};
        background: ${WHITE};
        line-height: 1.55;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page { max-width: 900px; margin: 0 auto; }
      .report-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 3px solid ${GOLD};
        padding-bottom: 18px;
        margin-bottom: 28px;
      }
      .brand { display: flex; align-items: center; gap: 14px; }
      .brand img { height: 38px; width: auto; }
      .brand-title { font-size: 22px; font-weight: 800; color: ${BLACK}; letter-spacing: -0.5px; }
      .brand-subtitle { font-size: 12px; color: #666; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.08em; }
      .report-type { text-align: right; }
      .report-type .type-title { font-size: 18px; font-weight: 700; color: ${BLACK}; }
      .report-type .type-subtitle { font-size: 12px; color: #666; margin-top: 2px; }

      .meta-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-bottom: 28px;
      }
      .meta-item { background: #f9f9f9; border-left: 4px solid ${GOLD}; padding: 10px 14px; border-radius: 0 6px 6px 0; }
      .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin-bottom: 2px; }
      .meta-value { font-size: 14px; font-weight: 600; color: ${BLACK}; }

      .section { margin-bottom: 28px; }
      .section-title {
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: ${BLACK};
        border-bottom: 2px solid ${GOLD};
        padding-bottom: 8px;
        margin-bottom: 16px;
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 14px;
      }
      .card {
        background: #fafafa;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
        padding: 16px;
        break-inside: avoid;
      }
      .card-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin-bottom: 6px; }
      .card-value { font-size: 26px; font-weight: 800; color: ${BLACK}; }
      .card-sub { font-size: 12px; color: #666; margin-top: 4px; }

      .score-block {
        display: flex;
        align-items: center;
        gap: 28px;
        background: linear-gradient(135deg, #fafafa 0%, #f3f3f3 100%);
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        padding: 24px;
        break-inside: avoid;
      }
      .score-ring {
        position: relative;
        width: 110px;
        height: 110px;
        flex-shrink: 0;
      }
      .score-ring svg { transform: rotate(-90deg); }
      .score-ring .score-text {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .score-text .pct { font-size: 28px; font-weight: 800; line-height: 1; }
      .score-text .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-top: 4px; }
      .score-body { flex: 1; }
      .score-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin-bottom: 6px; }
      .score-status { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
      .score-summary { font-size: 14px; color: #444; }

      .progress-bar { height: 8px; background: #e5e5e5; border-radius: 4px; overflow: hidden; margin-top: 6px; }
      .progress-fill { height: 100%; border-radius: 4px; }

      .topic-table { width: 100%; border-collapse: collapse; }
      .topic-table th, .topic-table td { padding: 10px 8px; text-align: left; border-bottom: 1px solid #e5e5e5; }
      .topic-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; }
      .topic-table td { font-size: 13px; }
      .topic-table .score { font-weight: 700; width: 60px; }
      .topic-table .status { width: 120px; }
      .status-badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }

      .checklist { list-style: none; padding: 0; margin: 0; }
      .checklist li { padding: 8px 0; font-size: 14px; color: #1a1a1a; border-bottom: 1px solid #f0f0f0; display: flex; align-items: flex-start; gap: 10px; }
      .checklist .icon { font-weight: 800; }
      .checklist.strengths .icon { color: #22c55e; }
      .checklist.concerns .icon { color: #ef4444; }

      .recommendation {
        background: ${BLACK};
        color: ${WHITE};
        border-radius: 12px;
        padding: 20px 24px;
        break-inside: avoid;
      }
      .recommendation-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: ${GOLD}; margin-bottom: 8px; font-weight: 700; }
      .recommendation-text { font-size: 16px; font-weight: 600; line-height: 1.5; }

      .notes-empty { color: #888; font-size: 13px; font-style: italic; }
      .note-item { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; break-inside: avoid; }
      .note-meta { display: flex; gap: 12px; font-size: 11px; color: #666; margin-bottom: 4px; }
      .note-type { color: ${GOLD}; font-weight: 700; }

      .data-table { width: 100%; border-collapse: collapse; }
      .data-table th, .data-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e5e5; font-size: 13px; }
      .data-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; }
      .data-table .risk-high { color: #ef4444; font-weight: 700; }
      .data-table .risk-medium { color: #d97706; font-weight: 700; }
      .data-table .risk-low { color: #16a34a; font-weight: 700; }

      .trend-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; }
      .trend-card { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 10px; padding: 16px; break-inside: avoid; }
      .trend-card h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin: 0 0 8px; }
      .trend-card p { font-size: 14px; color: ${BLACK}; margin: 0; }
      .trend-card ul { margin: 8px 0 0; padding-left: 18px; }
      .trend-card li { font-size: 13px; color: #333; margin-bottom: 4px; }

      .report-footer {
        margin-top: 36px;
        padding-top: 18px;
        border-top: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: #888;
      }
      .report-footer .brand-small { display: flex; align-items: center; gap: 8px; font-weight: 700; color: ${BLACK}; }
      .report-footer img { height: 20px; }
      .page-number::after { content: counter(page); }

      @media print {
        .page { page-break-before: auto; }
        .section, .card, .score-block, .recommendation, .trend-card, .note-item { break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      ${body}
      <div class="report-footer">
        <div class="brand-small"><img src="${LOGO_URL}" alt="ASCYN PRO" /> ASCYN PRO — Professional Licensing Education Platform</div>
        <div>Generated ${formatDate()} &nbsp;|&nbsp; Page <span class="page-number"></span></div>
      </div>
    </div>
  </body>
</html>`
}

export function generateStudentReportHtml(student: Student): string {
  const confidence = lastConfidence(student)
  const scoreColor = readinessColor(student.readiness)
  const scoreLabel = readinessLabel(student.readiness)

  const strengths = student.topicMastery
    .filter((t) => t.score >= 75)
    .sort((a, b) => b.score - a.score)
  const concerns = student.topicMastery
    .filter((t) => t.score < 70)
    .sort((a, b) => a.score - b.score)

  const summaryText =
    student.readiness >= 75
      ? `This student is progressing well but should strengthen <strong>${escapeHtml(student.weakestTopic)}</strong> before attempting the licensing examination.`
      : student.readiness >= 60
        ? `This student is approaching readiness but needs targeted support in <strong>${escapeHtml(student.weakestTopic)}</strong> to pass the licensing examination.`
        : `This student is currently at risk and requires immediate intervention in <strong>${escapeHtml(student.weakestTopic)}</strong> before the licensing examination.`

  const body = `
    <div class="report-header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="ASCYN PRO" />
        <div>
          <div class="brand-title">ASCYN PRO</div>
          <div class="brand-subtitle">Professional Licensing Education Platform</div>
        </div>
      </div>
      <div class="report-type">
        <div class="type-title">Student Readiness Report</div>
        <div class="type-subtitle">Board Exam Preparation</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><div class="meta-label">Student Name</div><div class="meta-value">${escapeHtml(student.name)}</div></div>
      <div class="meta-item"><div class="meta-label">Program</div><div class="meta-value">${escapeHtml(student.program)}</div></div>
      <div class="meta-item"><div class="meta-label">Instructor</div><div class="meta-value">Demo Instructor</div></div>
      <div class="meta-item"><div class="meta-label">Date Generated</div><div class="meta-value">${formatDate()}</div></div>
    </div>

    <div class="section">
      <div class="score-block">
        <div class="score-ring">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="48" fill="none" stroke="#e5e5e5" stroke-width="10" />
            <circle cx="55" cy="55" r="48" fill="none" stroke="${scoreColor}" stroke-width="10"
              stroke-dasharray="${Math.round((student.readiness / 100) * 301.59)} 301.59"
              stroke-linecap="round" />
          </svg>
          <div class="score-text">
            <div class="pct" style="color:${scoreColor}">${student.readiness}%</div>
            <div class="label">Readiness</div>
          </div>
        </div>
        <div class="score-body">
          <div class="score-title">Board Readiness</div>
          <div class="score-status" style="color:${scoreColor}">${scoreLabel}</div>
          <div class="score-summary">${summaryText}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Student Summary</div>
      <div class="card-grid">
        <div class="card">
          <div class="card-label">Readiness Score</div>
          <div class="card-value" style="color:${scoreColor}">${student.readiness}%</div>
          <div class="card-sub">${scoreLabel}</div>
        </div>
        <div class="card">
          <div class="card-label">Confidence Level</div>
          <div class="card-value" style="color:${readinessColor(confidence)}">${confidence}%</div>
          <div class="card-sub">Latest trend reading</div>
        </div>
        <div class="card">
          <div class="card-label">Average Quiz Score</div>
          <div class="card-value" style="color:${readinessColor(student.avgScore)}">${student.avgScore}%</div>
          <div class="card-sub">Across ${student.quizzesTaken} quizzes</div>
        </div>
        <div class="card">
          <div class="card-label">Last Activity</div>
          <div class="card-value" style="font-size:18px">${escapeHtml(student.lastActive)}</div>
          <div class="card-sub">${escapeHtml(student.recentActivity)}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Topic Performance</div>
      <table class="topic-table">
        <thead>
          <tr><th>Competency</th><th>Mastery</th><th>Progress</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${student.topicMastery
            .map((t) => {
              const status = topicStatus(t.score)
              return `
                <tr>
                  <td>${escapeHtml(t.topic)}</td>
                  <td class="score">${t.score}%</td>
                  <td>
                    <div class="progress-bar"><div class="progress-fill" style="width:${t.score}%; background:${status.color}"></div></div>
                  </td>
                  <td class="status"><span class="status-badge" style="background:${status.color}15; color:${status.color}">${status.label}</span></td>
                </tr>
              `
            })
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:24px;">
        <div>
          <div class="section-title">Student Strengths</div>
          ${strengths.length === 0 ? '<p class="notes-empty">No strengths recorded above 75%.</p>' : `
            <ul class="checklist strengths">
              ${strengths
                .map(
                  (t) => `
                <li><span class="icon">✓</span> Strong ${escapeHtml(t.topic)} comprehension (${t.score}%)</li>
              `
                )
                .join('')}
            </ul>
          `}
        </div>
        <div>
          <div class="section-title">Areas Requiring Attention</div>
          ${concerns.length === 0 ? '<p class="notes-empty">No critical areas identified.</p>' : `
            <ul class="checklist concerns">
              ${concerns
                .map(
                  (t) => `
                <li><span class="icon">⚠</span> ${escapeHtml(t.topic)} (${t.score}%)</li>
              `
                )
                .join('')}
            </ul>
          `}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Recommended Instructor Action</div>
      <div class="recommendation">
        <div class="recommendation-label">Recommended Instructor Action</div>
        <div class="recommendation-text">${escapeHtml(student.recommendedAction)}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Instructor Notes</div>
      ${student.notes.length === 0
        ? '<p class="notes-empty">No intervention notes recorded for this student.</p>'
        : student.notes
            .map(
              (note) => `
          <div class="note-item">
            <div class="note-meta">
              <span class="note-type">${escapeHtml(note.type)}</span>
              <span>Follow-up: ${escapeHtml(note.followUp)}</span>
              <span>${escapeHtml(note.date)}</span>
            </div>
            <div style="font-size:14px; color:#1a1a1a;">${escapeHtml(note.text)}</div>
          </div>
        `
            )
            .join('')}
    </div>
  `

  return reportBase(`ASCYN PRO — ${student.name} Readiness Report`, body)
}

export function generateClassReportHtml(
  students: Student[],
  heatmapTopics: HeatmapTopic[]
): string {
  const classAverage = Math.round(students.reduce((acc, s) => acc + s.readiness, 0) / students.length)
  const onTrack = students.filter((s) => s.riskStatus === 'low').length
  const needsAttention = students.filter((s) => s.riskStatus !== 'low').length
  const inactive = students.filter((s) => {
    if (s.lastActive.toLowerCase().includes('inactive')) return true
    const match = s.lastActive.match(/(\d+)\s*(day|days)/i)
    return match ? parseInt(match[1], 10) >= 7 : false
  }).length
  const avgConfidence = Math.round(
    students.reduce((acc, s) => acc + (s.confidenceTrend[s.confidenceTrend.length - 1] ?? 0), 0) / students.length
  )
  const avgQuiz = Math.round(students.reduce((acc, s) => acc + s.avgScore, 0) / students.length)

  const sortedTopics = [...heatmapTopics].sort((a, b) => a.classAvg - b.classAvg)
  const weakestTopics = sortedTopics.slice(0, 3)
  const strongestTopics = [...heatmapTopics]
    .filter((t) => t.classAvg >= 75)
    .sort((a, b) => b.classAvg - a.classAvg)
  const mostMissed = weakestTopics[0]

  const priorityStudents = [...students]
    .filter((s) => s.riskStatus !== 'low')
    .sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 }
      return riskOrder[a.riskStatus as keyof typeof riskOrder] - riskOrder[b.riskStatus as keyof typeof riskOrder]
    })

  const recommendations = Array.from(
    new Set(
      students
        .filter((s) => s.riskStatus !== 'low')
        .map((s) => s.recommendedAction)
    )
  ).slice(0, 4)

  const body = `
    <div class="report-header">
      <div class="brand">
        <img src="${LOGO_URL}" alt="ASCYN PRO" />
        <div>
          <div class="brand-title">ASCYN PRO</div>
          <div class="brand-subtitle">Professional Licensing Education Platform</div>
        </div>
      </div>
      <div class="report-type">
        <div class="type-title">Class Readiness Report</div>
        <div class="type-subtitle">Cohort Performance Summary</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item"><div class="meta-label">Instructor</div><div class="meta-value">Demo Instructor</div></div>
      <div class="meta-item"><div class="meta-label">Program</div><div class="meta-value">Barbering / Cosmetology Cohort</div></div>
      <div class="meta-item"><div class="meta-label">Cohort</div><div class="meta-value">Summer 2026</div></div>
      <div class="meta-item"><div class="meta-label">Date Generated</div><div class="meta-value">${formatDate()}</div></div>
    </div>

    <div class="section">
      <div class="section-title">Class Summary</div>
      <div class="card-grid" style="grid-template-columns:repeat(auto-fit, minmax(120px, 1fr));">
        <div class="card"><div class="card-label">Total Students</div><div class="card-value">${students.length}</div></div>
        <div class="card"><div class="card-label">Students On Track</div><div class="card-value" style="color:#16a34a">${onTrack}</div></div>
        <div class="card"><div class="card-label">Needs Attention</div><div class="card-value" style="color:${needsAttention > 0 ? '#ef4444' : '#16a34a'}">${needsAttention}</div></div>
        <div class="card"><div class="card-label">Average Readiness</div><div class="card-value" style="color:${readinessColor(classAverage)}">${classAverage}%</div></div>
        <div class="card"><div class="card-label">Average Confidence</div><div class="card-value" style="color:${readinessColor(avgConfidence)}">${avgConfidence}%</div></div>
        <div class="card"><div class="card-label">Average Quiz Score</div><div class="card-value" style="color:${readinessColor(avgQuiz)}">${avgQuiz}%</div></div>
        <div class="card"><div class="card-label">Inactive Students</div><div class="card-value" style="color:${inactive > 0 ? '#ef4444' : '#16a34a'}">${inactive}</div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Class Performance by Competency</div>
      <table class="topic-table">
        <thead>
          <tr><th>Competency</th><th>Average Mastery</th><th>Progress</th><th>Exam Weight</th><th>Suggested Class Action</th></tr>
        </thead>
        <tbody>
          ${heatmapTopics
            .map((t) => {
              const status = topicStatus(t.classAvg)
              return `
                <tr>
                  <td>${escapeHtml(t.topic)}</td>
                  <td class="score">${t.classAvg}%</td>
                  <td>
                    <div class="progress-bar"><div class="progress-fill" style="width:${t.classAvg}%; background:${status.color}"></div></div>
                  </td>
                  <td class="status"><span class="status-badge" style="background:${status.color}15; color:${status.color}">${t.weight}</span></td>
                  <td style="font-size:12px; color:#444; max-width:280px">${escapeHtml(classActionForTopic(t.topic))}</td>
                </tr>
              `
            })
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Highest Priority Students</div>
      <table class="data-table">
        <thead>
          <tr><th>Student</th><th>Program</th><th>Readiness</th><th>Risk</th><th>Weak Area</th><th>Recommended Action</th></tr>
        </thead>
        <tbody>
          ${priorityStudents
            .map(
              (s) => `
            <tr>
              <td>${escapeHtml(s.name)}</td>
              <td>${escapeHtml(s.program)}</td>
              <td>${s.readiness}%</td>
              <td class="risk-${s.riskStatus}">${s.riskStatus.toUpperCase()}</td>
              <td>${escapeHtml(s.weakestTopic)}</td>
              <td style="font-size:12px">${escapeHtml(s.recommendedAction)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Class Trends</div>
      <div class="trend-grid">
        <div class="trend-card">
          <h4>Top Strengths</h4>
          ${strongestTopics.length === 0 ? '<p>No competencies above 75% average.</p>' : `
            <ul>
              ${strongestTopics.map((t) => `<li>${escapeHtml(t.topic)} — ${t.classAvg}% average</li>`).join('')}
            </ul>
          `}
        </div>
        <div class="trend-card">
          <h4>Largest Weak Areas</h4>
          <ul>
            ${weakestTopics.map((t) => `<li>${escapeHtml(t.topic)} — ${t.classAvg}% average</li>`).join('')}
          </ul>
        </div>
        <div class="trend-card">
          <h4>Most Missed Topic</h4>
          <p>${mostMissed ? `${escapeHtml(mostMissed.topic)} — ${mostMissed.classAvg}% class average` : 'No data available.'}</p>
        </div>
        <div class="trend-card">
          <h4>Overall Recommendation</h4>
          <p>Focus the next week on ${mostMissed ? escapeHtml(mostMissed.topic) : 'weakest competencies'} to raise class readiness before the board exam.</p>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Instructor Recommendations</div>
      ${recommendations.length === 0
        ? '<p class="notes-empty">No additional recommendations — cohort is on track.</p>'
        : `
          <ul class="checklist concerns">
            ${recommendations
              .map(
                (r) => `
              <li><span class="icon">➤</span> ${escapeHtml(r)}</li>
            `
              )
              .join('')}
          </ul>
        `}
    </div>
  `

  return reportBase('ASCYN PRO — Class Readiness Report', body)
}

function classActionForTopic(topic: string): string {
  const actions: Record<string, string> = {
    'Chemical Services': 'Schedule a group review of chemical processing steps, timing, and safety protocols; assign targeted practice quizzes.',
    'Nail Care': 'Run a hands-on nail anatomy and disorder identification workshop; reinforce with flashcards.',
    'Hair & Scalp': 'Host a case-study session on contagious scalp conditions and treatment contraindications.',
    'Infection Control': 'Mandate an infection-control refresher and sanitation walkthrough; retest within 48 hours.',
    'Anatomy & Physiology': 'Review body systems with visual aids and peer-teaching rounds.',
    'Skin Care': 'Clarify skin disorders and product ingredients with demo videos and comprehension checks.',
  }
  return actions[topic] || `Provide targeted review and practice for ${topic}.`
}
