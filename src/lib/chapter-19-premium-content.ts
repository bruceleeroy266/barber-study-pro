import type { ChapterTheme, ChapterContent } from './chapter-content'

// Chapter 19: Preparing for Licensure and Employment — Production Chapter Shell
// Theme: Dark charcoal + ASCYN gold
export const chapter19PremiumTheme: ChapterTheme = {
  primary: '#D4AF37',
  primaryLight: '#F4D03F',
  primaryDark: '#AA8A2C',
  secondary: '#FFFFFF',
  background: 'rgba(10, 10, 10, 0.95)',
  backgroundAlt: 'rgba(26, 26, 26, 0.9)',
  surface: '#1A1A1A',
  border: 'rgba(212, 175, 55, 0.25)',
  text: '#FFFFFF',
  textMuted: '#888888',
  highlight: '#F4D03F',
  timeline: { line: 'rgba(212, 175, 55, 0.35)', iconBg: '#1A1A1A', iconBorder: '#D4AF37' },
  quote: { border: 'rgba(212, 175, 55, 0.4)', icon: 'rgba(212, 175, 55, 0.3)', bg: 'rgba(10, 10, 10, 0.7)' },
  tabbed: {
    activeBg: 'rgba(212, 175, 55, 0.15)', activeBorder: 'rgba(212, 175, 55, 0.5)', activeText: '#F4D03F',
    inactiveBg: 'rgba(10, 10, 10, 0.7)', inactiveBorder: 'rgba(212, 175, 55, 0.12)', inactiveText: '#888888',
    panelBg: 'rgba(10, 10, 10, 0.85)', panelBorder: 'rgba(212, 175, 55, 0.18)',
  },
  toolCard: { headerBg: 'rgba(212, 175, 55, 0.1)', headerText: '#F4D03F', dot: 'rgba(212, 175, 55, 0.6)', line: 'rgba(212, 175, 55, 0.25)' },
  featureGrid: { iconBg: 'rgba(212, 175, 55, 0.15)', iconColor: '#D4AF37', cardBorder: 'rgba(212, 175, 55, 0.2)' },
  milestone: { yearColor: '#D4AF37', border: 'rgba(212, 175, 55, 0.22)' },
  checklist: { checkBorder: 'rgba(212, 175, 55, 0.4)', checkColor: '#D4AF37', bg: 'rgba(10, 10, 10, 0.7)' },
  contentBlock: { bg: 'rgba(10, 10, 10, 0.7)', border: 'rgba(212, 175, 55, 0.18)', highlightColor: '#F4D03F' },
  challengeCard: { badgeBg: 'rgba(212, 175, 55, 0.15)', badgeText: '#D4AF37', cardBorder: 'rgba(212, 175, 55, 0.22)', completedBg: 'rgba(34, 197, 94, 0.1)', completedBorder: 'rgba(34, 197, 94, 0.3)' },
  scenarioBlock: { situationBg: 'rgba(212, 175, 55, 0.06)', optionBorder: 'rgba(212, 175, 55, 0.18)', correctBg: 'rgba(34, 197, 94, 0.1)', incorrectBg: 'rgba(239, 68, 68, 0.08)' },
  levelUp: { levelBadgeBg: 'rgba(212, 175, 55, 0.15)', levelBadgeText: '#F4D03F', rewardBg: 'rgba(34, 197, 94, 0.1)', rewardText: '#22C55E' },
  actionPrompt: { cardBorder: 'rgba(212, 175, 55, 0.18)', completedBorder: 'rgba(34, 197, 94, 0.3)', benefitBg: 'rgba(212, 175, 55, 0.08)', benefitBorder: 'rgba(212, 175, 55, 0.25)' },
}

export const chapter19PremiumContent: ChapterContent = {
  chapterNumber: 19,
  title: 'Preparing for Licensure and Employment',
  subtitle: 'Licensure readiness, professional documents, interviews, and career launch',
  theme: chapter19PremiumTheme,
  sections: [
    {
      type: 'htmlContent',
      id: 'chapter-19-lesson',
      title: 'Chapter 19 Lesson',
      html: `<style>
.ch19-original-content { --gold:#D4AF37; --dark:#0a0a0a; --panel:#1a1a1a; --muted:#b8b8b8; --white:#fff; }
.ch19-original-content { max-width: 820px; margin: 0 auto; padding: 2rem; color: var(--white); line-height: 1.7; }
.ch19-original-content section { margin-bottom: 2.5rem; }
.ch19-original-content h1 { font-size: 2rem; margin-bottom: .5rem; }
.ch19-original-content h2 { color: var(--gold); font-size: 1.45rem; margin: 1.5rem 0 .75rem; }
.ch19-original-content h3 { font-size: 1.1rem; margin: 1.1rem 0 .5rem; }
.ch19-original-content p, .ch19-original-content li { color: var(--muted); }
.ch19-original-content ul, .ch19-original-content ol { margin-left: 1.35rem; margin-bottom: 1rem; }
.ch19-original-content .key-point { border-left: 4px solid var(--gold); background: rgba(212,175,55,.08); padding: 1rem 1.25rem; border-radius: 0 8px 8px 0; margin: 1rem 0; }
.ch19-original-content .key-point strong { color: var(--gold); }
.ch19-original-content .checklist { background: var(--panel); border: 1px solid rgba(212,175,55,.18); padding: 1rem 1.25rem; border-radius: 10px; }
</style>
<div class="ch19-original-content">
<section>
<h1>Preparing for Licensure and Employment</h1>
<p>This ASCYN PRO lesson is an original supplemental review. Licensing requirements, examination formats, application steps, and employment rules vary by jurisdiction and can change. Always confirm current requirements with the official licensing board and authorized examination provider for the student’s jurisdiction.</p>
<div class="key-point"><strong>Learning loop:</strong> verify requirements → prepare deliberately → practice under realistic conditions → review weak areas → re-check readiness.</div>
</section>

<section>
<h2>1. Know Your Licensing Path</h2>
<p>Before applying for or scheduling a licensing examination—and before performing any service that the jurisdiction requires a license to perform—identify the current requirements that apply to the specific license and location. Requirements can differ by jurisdiction and can change. Verify education or training eligibility, required examination component or components, application steps, fees, identification, and documentation through the applicable official licensing agency and authorized examination provider.</p>
<h3>Build a licensing checklist</h3>
<ul>
<li>Confirm the official licensing agency and the exact license type.</li>
<li>Use the current official candidate bulletin, exam guide, or provider instructions when the applicable agency or authorized provider publishes them.</li>
<li>Confirm eligibility requirements before paying for an examination.</li>
<li>Verify required identification, supplies, arrival rules, and testing-site policies.</li>
<li>If testing accommodations are needed, verify the current request process, documentation rules, and deadlines with the authorized provider or licensing agency.</li>
<li>Keep copies of confirmations, receipts, and required documents.</li>
</ul>
<p>Do not rely on an old handout, social-media post, or another student’s experience when an official source is available.</p>
</section>

<section>
<h2>2. Prepare for the Written or Theory Examination</h2>
<p>Strong preparation combines subject knowledge with good testing habits. Test-taking strategy can help a prepared student use time well, but it cannot replace understanding the material.</p>
<div class="checklist">
<h3>Effective preparation habits</h3>
<ul>
<li>Study in shorter, repeated sessions instead of depending on one long cram session.</li>
<li>Use practice questions to reveal topics that need more review.</li>
<li>Review incorrect answers and explain why the correct answer is correct.</li>
<li>Practice reading the full question before choosing an answer.</li>
<li>Build familiarity with the testing format and time limits using official information.</li>
<li>Sleep, hydration, meals, and arrival planning matter on exam day.</li>
</ul>
</div>
<p>When a practice result exposes a weak area, return to the underlying concept instead of memorizing one answer. The goal is transferable understanding.</p>
</section>

<section>
<h2>3. Prepare for Any Practical or Skills Component</h2>
<p>If the jurisdiction requires a practical or skills examination, follow the current instructions published by the applicable licensing agency and authorized examination provider. Do not assume that another jurisdiction’s procedure list, timing, kit, scoring, or sequence applies. When infection-control, client-protection, tool-handling, or other safety steps are required, treat them as part of the procedure rather than optional details.</p>
<ul>
<li>Verify the permitted or required kit, supplies, labeling, and setup rules before practicing a simulated exam.</li>
<li>Use a timed rehearsal after technique is consistent.</li>
<li>Ask an instructor to observe for missed safety steps.</li>
<li>Correct process errors before trying to increase speed.</li>
<li>Do not assume another state’s practical format applies to your jurisdiction.</li>
</ul>
</section>

<section>
<h2>4. Turn School Experience into Employment Evidence</h2>
<p>Employment readiness can begin before graduation. Students should be able to describe their current skills accurately, identify areas still developing, show appropriate evidence of professional growth, and explain how relevant experience from school or prior work may transfer into a barbering environment.</p>
<h3>Résumé</h3>
<ul>
<li>Use accurate contact information and a professional email address.</li>
<li>List relevant education, current licenses or credentials only when actually earned, and work experience honestly.</li>
<li>Describe accomplishments and responsibilities with clear action language.</li>
<li>Include transferable skills such as customer service, scheduling, sales, teamwork, cash handling, or conflict resolution when they are relevant.</li>
<li>Proofread for spelling, dates, and consistency.</li>
</ul>
<h3>Portfolio</h3>
<p>A portfolio can include appropriate photographs of completed work, certificates, awards, documented projects, and other evidence that demonstrates skill and professionalism. Obtain permission before using client images and follow school or shop policies for photography.</p>
</section>

<section>
<h2>5. Research the Shop Before You Apply</h2>
<p>Evaluate a potential position using more than the existence of an opening. Research the shop’s services, public-facing culture, schedule expectations, compensation structure as described by the employer, professional standards, and opportunities to learn. Confirm important terms directly rather than assuming that public information is complete.</p>
<ul>
<li>Visit or observe the business when appropriate.</li>
<li>Review its public-facing information and service menu.</li>
<li>Ask how new barbers are supported and how expectations are communicated.</li>
<li>Ask how the working relationship and compensation arrangement are structured; labels such as employee, commission, or booth rental do not by themselves resolve tax, wage, benefit, or worker-classification questions.</li>
<li>Do not make assumptions about taxes, benefits, or worker classification; those issues can depend on law and the actual working relationship.</li>
</ul>
</section>

<section>
<h2>6. Interview Like a Professional</h2>
<p>An interview is both an evaluation and a conversation. Prepare to explain your training, strengths, areas you are still developing, and why the shop interests you.</p>
<ul>
<li>Confirm the date, time, location, and person you are meeting.</li>
<li>Arrive early enough to handle normal delays without rushing.</li>
<li>Dress and groom yourself in a way that reflects professional standards.</li>
<li>Bring requested documents and a portfolio if appropriate.</li>
<li>Keep your phone silent and give the interviewer your full attention.</li>
<li>Prepare thoughtful questions about expectations, schedule, compensation, clientele, education, and growth.</li>
<li>Follow up professionally after the interview.</li>
</ul>
<div class="key-point"><strong>Legal awareness:</strong> Interview-question rules and protected categories can vary by jurisdiction and situation. Do not treat a generic list of “legal” or “illegal” questions as universal law. If a question raises concern, stay professional, document what occurred when appropriate, and verify the applicable rule through a qualified workforce or legal resource.</div>
</section>

<section>
<h2>7. Read Before You Agree</h2>
<p>Employment agreements, booth-rental agreements, compensation plans, confidentiality or non-solicitation terms, and other documents can create obligations whose meaning and enforceability depend on the wording and applicable law. Read the entire document, ask questions about anything unclear, keep a copy, and do not assume that a provision is valid or invalid everywhere. When the consequences matter, seek qualified legal advice before agreeing.</p>
</section>

<section>
<h2>8. Career Launch Checklist</h2>
<ol>
<li>Verify the current licensing requirements from official sources.</li>
<li>Build a study plan around demonstrated weak areas.</li>
<li>Practice the components that current official instructions require, using those instructions to define the format and boundaries.</li>
<li>Prepare a clean résumé and evidence-based portfolio.</li>
<li>Research shops before applying.</li>
<li>Practice interviews and prepare your own questions.</li>
<li>Review compensation and agreements carefully.</li>
<li>Continue learning after licensure.</li>
</ol>
</section>

<section>
<h2>Review Questions</h2>
<ol>
<li>Why should official licensing sources be checked before scheduling an exam?</li>
<li>Why does test strategy not replace subject-matter mastery?</li>
<li>What should a student do after repeatedly missing questions in the same topic?</li>
<li>What types of evidence can strengthen an employment portfolio?</li>
<li>What should you research before accepting a position in a shop?</li>
<li>Why should agreements be read completely before signing?</li>
</ol>
</section>

<section>
<h2>Source and Independence Note</h2>
<p>ASCYN PRO is an independent supplemental learning platform. This lesson is written in original ASCYN PRO language and is intended to be used alongside a school’s approved curriculum. It does not establish licensing requirements, examination rules, worker classification, contract enforceability, or employment-law rights for any jurisdiction. Verify current licensing and examination information with the applicable official agency and authorized exam provider, and verify legal or employment questions through an appropriate official or qualified professional source.</p>
</section>
</div>`,
    },
  ],
}
