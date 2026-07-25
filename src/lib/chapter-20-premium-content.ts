import type { ChapterTheme, ChapterContent } from './chapter-content'

// Chapter 20: Working Behind the Chair — ASCYN PRO Production Content
// Theme: Dark charcoal + ASCYN gold
export const chapter20PremiumTheme: ChapterTheme = {
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

export const chapter20PremiumContent: ChapterContent = {
  chapterNumber: 20,
  title: 'Working Behind the Chair',
  subtitle: 'Professional expectations, teamwork, compensation, money management, ethical selling, and client retention',
  theme: chapter20PremiumTheme,
  sections: [
{
      type: 'htmlContent',
      id: 'ch20-introduction',
      standardId: 'CH20-LO01',
      title: 'Chapter 20 Lesson',
      subtitle: 'Introduction and Learning Objectives',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>Introduction and Why Study Working Behind the Chair</h2>
<p>Completing barber school and passing your state licensing exam is a major milestone, but it is only the beginning. Your first position behind the chair introduces new responsibilities that go far beyond technical skill. Success now depends on your conduct, reliability, teamwork, financial discipline, and ability to build lasting client relationships.</p>
<p>Barbers should study and have a thorough understanding of working behind the chair because:</p>
<ul>
<li>Every staff member must function as part of a barbershop team; learning how to do this is essential for success.</li>
<li>Barbershops use a variety of compensation systems; understanding them helps you choose a position that fits your goals and lifestyle.</li>
<li>Financial planning is not optional for independent professionals; budgeting early protects your future.</li>
<li>Retailing, ticket upgrading, and client retention strategies directly affect your income and career longevity.</li>
</ul>
<div class="key-point"><strong>Key Point:</strong> The transition from student to professional is a shift in mindset. Put the needs of the shop and client first, manage your money wisely, and never stop learning.</div>
<h3>Chapter Learning Objectives</h3>
<ol>
<li>Describe what is expected of a new employee and what this means in terms of everyday behavior.</li>
<li>List the habits of a good barbershop team player.</li>
<li>Describe three different ways in which barbers are compensated.</li>
<li>Determine the best way to record tips and make additional income.</li>
<li>Explain the principles of selling products and services in the barbershop.</li>
<li>List the most effective ways to build a client base.</li>
</ol>
<hr>
</section>
</div>`,
    },
{
      type: 'htmlContent',
      id: 'ch20-lo1',
      standardId: 'CH20-LO01',
      title: 'LO1 — From Student to Professional',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>LO1 — From Student to Professional</h2>
<p>Barbering school is designed to be a supportive learning environment. You are allowed to repeat procedures, correct mistakes, and adjust your schedule when life gets complicated. The workplace is different. When you accept a paycheck, you accept the duty to put the barbershop and its clients ahead of your personal convenience.</p>
<p>That means arriving on time for every scheduled shift, being prepared to perform any service or task assigned to you, and honoring your appointments even when something tempting comes up. Calling out for a concert or personal event inconveniences clients, burdens coworkers, and can permanently damage your reputation.</p>
<h3>What Employers Expect</h3>
<ul>
<li><strong>Reliability:</strong> Show up on time, every time.</li>
<li><strong>Professional conduct:</strong> Dress, speak, and behave in ways that reflect well on the shop.</li>
<li><strong>Flexibility:</strong> Be willing to perform services or help with tasks that may not be your favorite.</li>
<li><strong>Client focus:</strong> Keep client needs and shop priorities ahead of personal preferences.</li>
<li><strong>Accountability:</strong> Own your mistakes and learn from feedback.</li>
</ul>
<h3>The Job Description</h3>
<p>A job description is a written document that outlines the duties, responsibilities, and expectations of a specific position. If your shop does not use them, consider writing one for yourself and reviewing it with your manager. This prevents misunderstandings and gives you a clear path for evaluation and growth.</p>
<div class="did-you-know"><strong>Did You Know?</strong> A written job description protects both you and the employer by spelling out exactly what success looks like in your role.</div>
<hr>
</section>
</div>`,
    },
{
      type: 'htmlContent',
      id: 'ch20-lo2',
      standardId: 'CH20-LO02',
      title: 'LO2 — Habits of a Good Barbershop Team Player',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>LO2 — Habits of a Good Barbershop Team Player</h2>
<p>Many new graduates expect a high-paying job doing only the services they prefer. The reality is that you will probably start by performing a wide range of tasks, some of which are not glamorous. The good news is that this hands-on experience is where real growth happens.</p>
<h3>Thriving in a Service Profession</h3>
<ul>
<li><strong>Put others first.</strong> Set aside your own feelings and focus on the client and the shop.</li>
<li><strong>Be true to your word.</strong> Honesty and follow-through build trust.</li>
<li><strong>Be punctual.</strong> Respect clients and coworkers by honoring the schedule.</li>
<li><strong>Be a problem solver.</strong> Identify issues early and resolve them constructively.</li>
<li><strong>Be a lifelong learner.</strong> Continue learning technical, business, and people skills throughout your career.</li>
</ul>
<h3>Barbershop Teamwork Principles</h3>
<ul>
<li><strong>Strive to help:</strong> Care about the success of the whole team, not just yourself.</li>
<li><strong>Pitch in:</strong> Fold towels, answer phones, or make appointments when you are not with a client.</li>
<li><strong>Share knowledge:</strong> Teach what you know and learn from others.</li>
<li><strong>Remain positive:</strong> Avoid gossip and malicious talk.</li>
<li><strong>Become a relationship builder:</strong> You do not have to be best friends with everyone to work well together.</li>
<li><strong>Resolve conflicts directly:</strong> Address issues with the person involved, not behind their back.</li>
<li><strong>Be willing to be subordinate:</strong> Beginners rarely start at the top; accept the learning curve.</li>
<li><strong>Be sincerely loyal:</strong> Loyalty to the shop, management, staff, and clients strengthens the whole business.</li>
</ul>
<h3>Employee Evaluation and Role Models</h3>
<p>Most shops schedule a formal evaluation around 90 days after hiring and annually after that. Do not wait for a scheduled review; ask for feedback whenever you need it. Find a role model in the shop who has the kind of success you want, observe their habits, and ask respectful questions. A mentor's guidance can accelerate your progress dramatically.</p>
<div class="key-point"><strong>Key Point:</strong> Good teammates make the whole shop successful. No single barber succeeds alone.</div>
<hr>
</section>
</div>`,
    },
{
      type: 'htmlContent',
      id: 'ch20-lo3',
      standardId: 'CH20-LO03',
      title: 'LO3 — Employment Classifications and Compensation',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>LO3 — Employment Classifications and Compensation</h2>
<p>When you evaluate a job offer, compensation is usually your first concern. Barbers are generally classified as employees, independent contractors, or booth renters. Each status carries different responsibilities, freedoms, and tax obligations.</p>
<h3>Employee Status</h3>
<p>As an employee, the shop sets your hours, controls how work is performed, and may require a uniform. Clients are usually booked for you, and you typically handle only tips. The employer withholds income and Medicare taxes, pays part of your Social Security tax, pays unemployment taxes, and provides a Form W-2. You must still report wages, tips of $20 or more per month, and commissions.</p>
<h3>Independent Contractor Status</h3>
<p>Independent contractors may rent a chair or work for a percentage of service revenue. You must obtain a tax identification number, carry your own business insurance, and handle your own income and self-employment taxes. You should receive Form 1099-MISC when you earn more than $600 in a year. A written contract is required, and quarterly tax payments may be necessary.</p>
<h3>Booth Renter Status</h3>
<p>Booth rental is essentially running a small business within a barbershop. You lease space, set your own hours, book your own appointments, collect all service revenue, and pay your own taxes, licenses, insurance, and supplies. Overhead is usually low, but you need enough clientele to cover rent and still pay yourself.</p>
<h3>Wage Structures</h3>
<ul>
<li><strong>Straight hourly salary:</strong> Common in chains and franchises; provides fixed income while you build clientele.</li>
<li><strong>Commission:</strong> You earn a percentage of gross service sales, often 40–70 percent. Usually offered after you have built a loyal clientele.</li>
<li><strong>Salary plus commission:</strong> A guaranteed base wage plus a percentage of revenue over the base, sometimes called a guarantee.</li>
</ul>
<p>Some commission arrangements take a fee "off the top" for the shop before applying your percentage. Always make sure you understand the math before accepting a position.</p>
<h3>Tips</h3>
<p>Tips are additional income and must be tracked and reported on your tax return. Reporting tips accurately helps when applying for loans, increases your Social Security retirement benefits, and keeps you on the right side of tax law.</p>
<h3>Employment Classification Overview</h3>
<table>
<caption>How employment status affects control, taxes, and daily responsibilities</caption>
<thead>
<tr><th scope="col">Factor</th><th scope="col">Employee</th><th scope="col">Independent Contractor</th><th scope="col">Booth Renter</th></tr>
</thead>
<tbody>
<tr><th scope="row">Who decides how work is done</th><td>The shop provides instruction and evaluates performance</td><td>The worker decides how to perform services</td><td>The worker has full control over methods and services</td></tr>
<tr><th scope="row">Schedule</th><td>Hours set or scheduled by business</td><td>Sets own hours with agreement</td><td>Sets own hours and schedule</td></tr>
<tr><th scope="row">Appointments</th><td>Scheduled by business</td><td>May schedule own appointments</td><td>Schedules own appointments</td></tr>
<tr><th scope="row">Revenue collection</th><td>Collected at front desk</td><td>May be collected at front desk</td><td>Collected by booth renter</td></tr>
<tr><th scope="row">Equipment / facilities</th><td>Provided by shop</td><td>May pay for certain equipment</td><td>Certain equipment included in lease</td></tr>
<tr><th scope="row">Benefits</th><td>May be provided</td><td>No benefits</td><td>No benefits</td></tr>
<tr><th scope="row">Tax responsibility</th><td>Employer withholds taxes</td><td>Responsible for all taxes, licenses, insurance</td><td>Responsible for all taxes, licenses, insurance, advertising</td></tr>
<tr><th scope="row">Forms</th><td>Employer provides W-2</td><td>Owner provides 1099; written contract required</td><td>Lease required; 1099 for rent paid</td></tr>
</tbody>
</table>
<div class="key-point"><strong>Key Point:</strong> State laws vary. Some states restrict or prohibit booth rental arrangements. Always check your current state board rules and consult a licensed attorney or tax professional before signing any agreement.</div>
<hr>
</section>
</div>`,
    },
{
      type: 'htmlContent',
      id: 'ch20-lo4',
      standardId: 'CH20-LO04',
      title: 'LO4 — Manage Your Money',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>LO4 — Manage Your Money</h2>
<p>Barbering offers freedom and creativity, but it also requires financial discipline. Unlike corporate employees who have taxes, insurance, and retirement contributions handled automatically, most barbers must plan these items themselves.</p>
<h3>Reporting Your Income</h3>
<p>Report all cash tips and additional income, even if it does not appear on your paycheck. Income from outside jobs such as weddings, parties, or private residences must also be reported. Failing to report income can lead to fines, legal action, reduced borrowing power, and lower Social Security benefits.</p>
<p>The best practice is to keep a daily tip log. Total your tips weekly, then monthly, and keep a year-end summary on the first page of your log. This makes tax preparation simple and accurate.</p>
<h3>Personal Budget</h3>
<p>A personal budget is not restrictive; it is a tool for freedom. A simple monthly worksheet includes expenses such as rent, car payment, insurance, utilities, groceries, health insurance, entertainment, student loans, retirement savings, and an emergency fund. Compare total expenses to total income, including take-home pay and tips. If the balance is negative, identify expenses you can reduce or income you can increase.</p>
<h3>Repaying Debt</h3>
<p>Responsible adults pay back debts such as car loans, mortgages, and student loans. Defaulting on a loan damages your credit and can lead to legal consequences. Before taking a loan, understand the payment terms, interest rate, and whether the payment fits your budget.</p>
<h3>Giving Yourself a Raise</h3>
<p>There are several ways to increase your net income beyond asking for a raise:</p>
<ul>
<li><strong>Spend less:</strong> Reduce unnecessary spending and redirect the savings.</li>
<li><strong>Work more hours:</strong> Choose busy shifts, come in early, stay late, and maximize Saturdays.</li>
<li><strong>Increase service prices:</strong> Once you have mastered your services and built loyalty, raise prices by a reasonable amount based on market research.</li>
<li><strong>Retail more:</strong> Recommend products you believe in; most shops pay commission on retail sales.</li>
</ul>
<h3>Seek Professional Advice</h3>
<p>Financial planners, accountants, and bankers can help with debt reduction, investments, and retirement options. Be an informed consumer: consider whether advice makes sense for your situation before acting on it.</p>
<h3>Barbershop Technology</h3>
<p>Modern shops use software for cash flow, inventory, payroll, appointments, and performance tracking. If you are comfortable with technology, you can help the shop build a website, manage social media, or set up online booking. Just remember that client records generally belong to the shop.</p>
<div class="did-you-know"><strong>Did You Know?</strong> Keeping accurate income records now can make it much easier to qualify for a car loan, apartment lease, or mortgage later.</div>
<hr>
</section>
</div>`,
    },
{
      type: 'htmlContent',
      id: 'ch20-lo5',
      standardId: 'CH20-LO05',
      title: 'LO5 — Ethical Selling Behind the Chair',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>LO5 — Ethical Selling Behind the Chair</h2>
<p>Selling is not about being pushy. When done ethically, it is a service that helps clients look and feel their best. Two key income-boosting strategies are ticket upgrading and retailing.</p>
<h3>Ticket Upgrading</h3>
<p>Ticket upgrading, also called upselling services, means recommending additional services that benefit the client. For example, after a haircut for a special event, you might suggest a gray-blending treatment. The key is to recommend based on the client's needs, not your own desire for a bigger ticket.</p>
<h3>Retailing</h3>
<p>Retailing is recommending products for at-home use. Clients trust your expertise, so suggesting the right shampoo, styling product, or beard oil adds value to their visit.</p>
<h3>Principles of Selling</h3>
<ul>
<li>Be familiar with the features and benefits of services and products.</li>
<li>Test products yourself before recommending them.</li>
<li>Adapt your approach to each client's personality.</li>
<li>Be self-confident; confidence comes from genuine product knowledge.</li>
<li>Generate interest by asking questions that reveal needs.</li>
<li>Never misrepresent services or products.</li>
<li>Deliver your recommendation in a relaxed, friendly way.</li>
<li>Demonstrate the product when possible.</li>
<li>Recognize the right moment to close the sale, then stop selling.</li>
</ul>
<h3>The Psychology of Selling</h3>
<p>Clients buy for different reasons: vanity (wanting to look better), personal satisfaction (wanting to feel better), or problem solving (wanting easier maintenance). Identify the motive and frame your recommendation around the benefit that matters most to the client.</p>
<h3>Overcoming Objections</h3>
<p>Objections are normal. Restate the objection in a way that addresses the client's need. For example, if a client says he already has color-safe shampoo, you might reply, "I understand, but not all color-safe shampoos add moisture. Since you mentioned wanting more shine, this one will do that while protecting your color." For price objections, offer a sample when possible, or reiterate the long-term value.</p>
<h3>Retail Scenario</h3>
<p>A barber recommends a styling product to a regular client after a haircut. She explains how much to use, how to apply it, and how it will help maintain the style at home. She does not focus on price; she focuses on results. The client leaves satisfied and more likely to return.</p>
<div class="key-point"><strong>Key Point:</strong> Ethical selling always puts the client's needs first. Recommend only what you genuinely believe will help.</div>
<hr>
</section>
</div>`,
    },
{
      type: 'htmlContent',
      id: 'ch20-lo6',
      standardId: 'CH20-LO06',
      title: 'LO6 — Keep Current Clients and Expand Your Client Base',
      html: `<style>.ch20-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch20-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch20-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch20-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch20-legacy-content .section {  margin-bottom: 3rem; }
.ch20-legacy-content .section h1.lesson-title {  font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch20-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch20-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch20-legacy-content .section p, .ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch20-legacy-content .section ul, .ch20-legacy-content .section ol {  margin-left: 1.5rem; }
.ch20-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch20-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch20-legacy-content .section th, .ch20-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch20-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch20-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch20-legacy-content .section caption {  caption-side: top; text-align: left; font-weight: 600; color: var(--gold); padding: 0.5rem 0; }
.ch20-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .key-point strong {  color: var(--gold); }
.ch20-legacy-content .did-you-know {  background: rgba(255,255,255,0.05); border-left: 4px solid #888; padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch20-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch20-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch20-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch20-legacy-content">
<section class="section">
<h2>LO6 — Keep Current Clients and Expand Your Client Base</h2>
<p>Once your service quality is solid, marketing and retention become the engines of growth. Your client base is the group of customers who return to you regularly.</p>
<h3>Marketing Techniques</h3>
<ul>
<li><strong>Birthday cards:</strong> Collect month and day of birth on consultation cards and send a special offer valid during the birthday month.</li>
<li><strong>Consistently good service:</strong> Never rush; quality service must always come first.</li>
<li><strong>Reliability:</strong> Be courteous, professional, and on time.</li>
<li><strong>Respect:</strong> Avoid gossip and negativity.</li>
<li><strong>Positivity:</strong> Clients prefer being around upbeat people.</li>
<li><strong>Professional boundaries:</strong> Keep the relationship appropriate and client-focused.</li>
<li><strong>Email and social media:</strong> Collect email addresses and use Facebook, Yelp, and Instagram to showcase work and build credibility. Always get permission before posting client photos.</li>
<li><strong>Business card referrals:</strong> Give loyal clients cards to hand out; reward them with a discount or complimentary add-on when a referral books.</li>
<li><strong>Local business referrals:</strong> Partner with nearby gyms, tailors, diners, or cigar shops for cross-promotion.</li>
<li><strong>Public speaking:</strong> Offer short grooming presentations to community groups, schools, or organizations.</li>
</ul>
<h3>Rebooking Clients</h3>
<p>The best time to rebook is while the client is still in the chair. Discuss hair condition, styling habits, and maintenance needs. Listen carefully; clients often give clues about upcoming events that create natural reasons to return. Build efficiency so clients wait less and you can serve more people per day.</p>
<h3>On Your Way</h3>
<p>Your first job may feel like a steep learning curve. Be patient with yourself, practice consistently, and stay open to learning from experienced professionals. If you apply the principles in this chapter, you can build a rewarding, sustainable career in barbering.</p>
<div class="key-point"><strong>Key Point:</strong> Retention is cheaper than acquisition. Treat every client like your only client, and they will bring friends.</div>
<hr>
</section>
</div>`,
    },
    {
      type: 'scenarioBlock',
      id: `ch20-kc1`,
      standardId: `CH20-LO01`,
      title: `Knowledge Check: Professional Expectations`,
      subtitle: `Test your understanding before moving on.`,
      scenarios: [
        {
          id: `ch20-scenario-001`,
          situation:
            `You are scheduled to work on Saturday, the shop's busiest day. A friend invites you to an event that afternoon. What should you do?`,
          options: [            { letter: `A`, text: `Call out sick so you can attend the event; your personal life matters too.`, feedback: `Incorrect. Calling out for a non-emergency inconveniences clients, burdens coworkers, and damages your reputation. Reliability is a core professional expectation.` },
            { letter: `B`, text: `Honor your shift and make plans for another time.`, feedback: `Correct. Professionals put the shop and clients first. Honoring your schedule builds trust and shows you are dependable.` },
            { letter: `C`, text: `Show up late and blame traffic.`, feedback: `Incorrect. Punctuality matters. Being late without a valid reason is unprofessional and unfair to clients and teammates.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-002`,
          situation:
            `True or False: A written job description is only useful for the employer.`,
          options: [            { letter: `A`, text: `True`, feedback: `Incorrect. A job description protects both you and the employer by spelling out duties, expectations, and how success is measured.` },
            { letter: `B`, text: `False`, feedback: `Correct. A job description gives you clarity about your role and provides a basis for fair evaluations and growth conversations.` },
          ],
          correctAnswer: `B`,
        },
      ],
    },
    {
      type: 'reflectionBlock',
      id: `ch20-kc2`,
      standardId: `CH20-LO02`,
      title: `Knowledge Check: Teamwork and Loyalty`,
      subtitle: `Reflect on the habits that make barbershop teams succeed.`,
      questions: [
        {
          id: `ch20-reflect-001`,
          question:
            `Think about a time you saw conflict handled poorly in a workplace or school setting. What could have been done differently to resolve it directly and professionally?`,
          placeholder:
            `Describe the situation and one constructive approach...`,
          insight:
            `Strong teammates address conflicts with the person involved rather than gossiping behind their back. Direct, respectful communication preserves trust and keeps the team focused on serving clients.`,
        },
        {
          id: `ch20-reflect-002`,
          question:
            `Which barbershop teamwork habit do you already practice well, and which one do you need to develop further?`,
          placeholder:
            `Identify one strength and one growth area...`,
          insight:
            `Self-awareness accelerates growth. Whether it is pitching in, staying positive, or sharing knowledge, choosing one habit to strengthen each month will make you a more valuable teammate.`,
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: `ch20-kc3`,
      standardId: `CH20-LO03`,
      title: `Knowledge Check: Compensation and Taxes`,
      subtitle: `Apply what you learned about employment status and pay structures.`,
      scenarios: [
        {
          id: `ch20-scenario-003`,
          situation:
            `A barber sets her own hours, collects all service payments, pays monthly rent for a station, and handles her own taxes and insurance. Which employment status best describes her?`,
          options: [            { letter: `A`, text: `Employee`, feedback: `Incorrect. Employees have taxes withheld by the shop and generally do not pay rent for a station.` },
            { letter: `B`, text: `Independent contractor`, feedback: `Incorrect. Independent contractors may work for a percentage or rent a chair, but they typically do not collect all service revenue directly as their own business.` },
            { letter: `C`, text: `Booth renter`, feedback: `Correct. Booth renters lease space, control their schedule and revenue, and are responsible for their own taxes, insurance, and licenses.` },
          ],
          correctAnswer: `C`,
        },
        {
          id: `ch20-scenario-004`,
          situation:
            `A new barber is offered 50% commission on services after the shop takes a 10% fee off the top. On a $100 service, how much does the barber earn?`,
          options: [            { letter: `A`, text: `$50`, feedback: `Incorrect. The 10% fee is taken off the top first, leaving $90. The barber earns 50% of $90, which is $45.` },
            { letter: `B`, text: `$45`, feedback: `Correct. After the 10% shop fee, $90 remains. Fifty percent of $90 equals $45. Always confirm how your commission is calculated before accepting an offer.` },
            { letter: `C`, text: `$40`, feedback: `Incorrect. The fee is 10% off the top, not 10% of the barber's commission. Recalculate from the remaining $90.` },
          ],
          correctAnswer: `B`,
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: `ch20-kc4`,
      standardId: `CH20-LO04`,
      title: `Knowledge Check: Budgeting and Income`,
      subtitle: `Apply what you learned about managing money behind the chair.`,
      scenarios: [
        {
          id: `ch20-scenario-005`,
          situation:
            `At the end of a busy week, you have $200 in cash tips. What is the best practice for tax reporting?`,
          options: [            { letter: `A`, text: `Keep the cash and do not report it because there is no paper trail.`, feedback: `Incorrect. All tips are taxable income. Failing to report them can lead to fines and reduces your Social Security benefits and borrowing power.` },
            { letter: `B`, text: `Record the tips in a daily log and include them in your total income.`, feedback: `Correct. Accurate tip tracking protects you legally and financially. Keep a daily log with weekly and year-end totals.` },
            { letter: `C`, text: `Report only the tips that appear on your paycheck.`, feedback: `Incorrect. Cash tips must also be reported if they total $20 or more in a month. Relying only on paycheck records underreports your income.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-006`,
          situation:
            `Your monthly expenses exceed your take-home pay. Which action is most likely to improve your financial situation long term?`,
          options: [            { letter: `A`, text: `Ignore the problem and hope income increases soon.`, feedback: `Incorrect. Avoiding the issue usually makes it worse. A budget helps you see exactly where adjustments are needed.` },
            { letter: `B`, text: `Review expenses to reduce spending and look for ways to increase income.`, feedback: `Correct. Giving yourself a raise usually means a combination of spending less, working smarter hours, raising prices gradually, and retailing more.` },
            { letter: `C`, text: `Take out a loan to cover the gap without reviewing terms.`, feedback: `Incorrect. Borrowing without understanding the payment, interest rate, and impact on your budget can create bigger problems.` },
          ],
          correctAnswer: `B`,
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: `ch20-kc5`,
      standardId: `CH20-LO05`,
      title: `Knowledge Check: Ethical Selling`,
      subtitle: `Apply what you learned about service-based selling.`,
      scenarios: [
        {
          id: `ch20-scenario-007`,
          situation:
            `A regular client mentions his beard feels dry and itchy. You have a conditioning beard oil you genuinely like. How should you approach the recommendation?`,
          options: [            { letter: `A`, text: `Tell him the product will fix the problem and insist he buy it today.`, feedback: `Incorrect. Pressure sales damage trust. Ethical selling is based on the client's need and your honest belief in the product.` },
            { letter: `B`, text: `Explain how the oil addresses dryness, demonstrate a small amount, and let him decide.`, feedback: `Correct. Focus on the client's problem, share the benefit, demonstrate when possible, and respect the decision. That is service-based selling.` },
            { letter: `C`, text: `Say nothing because you do not want to seem pushy.`, feedback: `Incorrect. Clients rely on your expertise. A thoughtful recommendation delivered without pressure is part of professional service.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-008`,
          situation:
            `A client says, "I can get a similar product cheaper online." What is the best response?`,
          options: [            { letter: `A`, text: `Argue that online products are always fake or low quality.`, feedback: `Incorrect. Making absolute claims you cannot prove is dishonest and can backfire.` },
            { letter: `B`, text: `Acknowledge the concern, explain the specific benefits you observed, and offer a sample if available.`, feedback: `Correct. Address objections with respect, restate the value, and provide a low-risk way to try the product. This keeps the door open without pressure.` },
            { letter: `C`, text: `Apologize and stop recommending products to that client forever.`, feedback: `Incorrect. One objection does not close the conversation. You can still offer value by answering questions and sharing your professional reasoning.` },
          ],
          correctAnswer: `B`,
        },
      ],
    },
    {
      type: 'reflectionBlock',
      id: `ch20-kc6`,
      standardId: `CH20-LO06`,
      title: `Knowledge Check: Client Retention and Growth`,
      subtitle: `Reflect on how you will build and keep your client base.`,
      questions: [
        {
          id: `ch20-reflect-003`,
          question:
            `You just finished a great haircut for a new client. List three specific things you can do before they leave to increase the chance they rebook and refer friends.`,
          placeholder:
            `Write three actionable steps...`,
          insight:
            `Effective strategies include discussing their next visit based on hair growth, suggesting a product that supports the style, giving them a business card or referral card, asking permission to follow up by text or email, and posting their cut on social media only with clear consent.`,
        },
        {
          id: `ch20-reflect-004`,
          question:
            `Which marketing technique from this chapter fits your personality best, and why?`,
          placeholder:
            `Choose one technique and explain your reasoning...`,
          insight:
            `The best marketing is the kind you will actually do consistently. If you love social media, focus there. If you prefer face-to-face connection, build local business partnerships and referral systems. Consistency beats perfection.`,
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: `ch20-real-shop-scenarios`,
      standardId: `CH20-LO06`,
      title: `Real Shop Scenarios`,
      subtitle: `Put everything together with realistic workplace decisions.`,
      scenarios: [
        {
          id: `ch20-scenario-009`,
          situation:
            `It is your first day behind the chair. The shop is short-staffed and the manager asks you to fold towels and answer phones between clients. A senior barber tells you that "new people should not do chores." What should you do?`,
          options: [            { letter: `A`, text: `Refuse the tasks and tell the manager you were hired to cut hair, not clean.`, feedback: `Incorrect. Pitching in with shop tasks is part of being a good team player, especially when you are new.` },
            { letter: `B`, text: `Help willingly while staying positive, and thank the senior barber for the advice without following it.`, feedback: `Correct. Good teammates contribute wherever needed. Stay respectful to coworkers while honoring the manager\\'s request.` },
            { letter: `C`, text: `Complain to other staff members about the senior barber and refuse to speak to him.`, feedback: `Incorrect. Gossip and conflict avoidance damage the team atmosphere and your reputation.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-010`,
          situation:
            `A loyal client comes in for a haircut and mentions he has a wedding in two days. You notice his gray is showing and a color service would help. How do you approach ticket upgrading?`,
          options: [            { letter: `A`, text: `Tell him he needs a color service and that the haircut is not enough.`, feedback: `Incorrect. Pressure makes clients uncomfortable and can damage trust.` },
            { letter: `B`, text: `Recommend gray blending as an add-on, explain the benefit for the wedding, and accept his decision.`, feedback: `Correct. Ethical upselling is need-based, clearly explained, and respectful of the client\\'s choice.` },
            { letter: `C`, text: `Say nothing because you do not want to seem pushy.`, feedback: `Incorrect. Clients rely on your expertise. A thoughtful recommendation is part of good service.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-011`,
          situation:
            `You are an independent contractor and a client pays you $80 cash for a service plus a $20 tip. At the end of the day, you pocket the cash and only plan to report the $80. What is wrong with this plan?`,
          options: [            { letter: `A`, text: `Nothing; cash tips do not need to be reported.`, feedback: `Incorrect. Cash tips are taxable income and must be tracked and reported.` },
            { letter: `B`, text: `Tips should be recorded in a daily log and included in your total income for tax reporting.`, feedback: `Correct. Accurate tip reporting protects your credit, benefits, and legal standing.` },
            { letter: `C`, text: `You should return the tip to the client to avoid tax complications.`, feedback: `Incorrect. Clients expect you to keep tips. The issue is reporting, not refusing them.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-012`,
          situation:
            `A client says your recommended styling product is too expensive and he can buy something similar at a drugstore. How do you respond?`,
          options: [            { letter: `A`, text: `Insist that drugstore products are always inferior and that he should buy yours.`, feedback: `Incorrect. Dismissing the client\\'s concern is pushy and can feel disrespectful.` },
            { letter: `B`, text: `Acknowledge the price concern, reiterate the specific benefits you noticed during the service, and offer a sample if available.`, feedback: `Correct. Address the objection with honesty, benefits, and a low-pressure option.` },
            { letter: `C`, text: `Apologize and stop talking about products for the rest of the visit.`, feedback: `Incorrect. You can still provide value by explaining why the product supports the client\\'s goal.` },
          ],
          correctAnswer: `B`,
        },
        {
          id: `ch20-scenario-013`,
          situation:
            `You are considering two job offers. Shop A pays hourly and provides benefits. Shop B offers booth rental with low overhead but no benefits. What should you do before deciding?`,
          options: [            { letter: `A`, text: `Always choose booth rental because it offers more freedom.`, feedback: `Incorrect. Freedom without enough clientele or savings can create financial stress.` },
            { letter: `B`, text: `Compare your expected income, expenses, benefits, and risk tolerance before signing either agreement.`, feedback: `Correct. The best choice depends on your financial situation, clientele, and career goals.` },
            { letter: `C`, text: `Take the first offer because both jobs are basically the same.`, feedback: `Incorrect. Employment status and compensation structure affect taxes, benefits, and daily responsibilities.` },
          ],
          correctAnswer: `B`,
        },
      ],
    },
{
      type: `contentBlock`,
      id: `ch20-study-summary`,
      standardId: `CH20-LO06`,
      title: `Premium Study Guide`,
      subtitle: `Chapter Summary`,
      content:
        `This chapter covers the transition from barbering student to working professional. You learned what employers expect from new hires, how to be a strong teammate, the differences between employee, independent contractor, and booth renter status, how to manage money and report income, the principles of ethical selling, and proven strategies for building and retaining a loyal client base. Success behind the chair depends on combining technical skill with reliability, communication, financial discipline, and client-centered service.`,
      highlight:
        `Professional barbers treat every client interaction, team moment, and financial decision as part of their reputation.`,
    },
{
      type: `featureGrid`,
      id: `ch20-study-key-concepts`,
      standardId: `CH20-LO06`,
      title: `Key Concepts`,
      subtitle: `The most important ideas to remember`,
      features: [
        {
          icon: `Briefcase`,
          title: `Workplace Expectations`,
          description:
            `Employers value reliability, professional conduct, flexibility, client focus, and accountability above all else.`,
        },
        {
          icon: `Users`,
          title: `Teamwork`,
          description:
            `Good teammates help, pitch in, share knowledge, stay positive, resolve conflicts directly, and remain loyal to the shop.`,
        },
        {
          icon: `Scale`,
          title: `Employment Status`,
          description:
            `Employee, independent contractor, and booth renter each offer different levels of control, tax responsibility, and risk.`,
        },
        {
          icon: `Wallet`,
          title: `Financial Responsibility`,
          description:
            `Track tips, create a budget, manage debt, and look for ethical ways to increase income.`,
        },
        {
          icon: `Handshake`,
          title: `Ethical Selling`,
          description:
            `Recommend services and products based on client needs, not pressure. Handle objections with honesty and grace.`,
        },
        {
          icon: `TrendingUp`,
          title: `Client Growth`,
          description:
            `Retention is cheaper than acquisition. Rebook, refer, post with permission, and partner locally.`,
        },
      ],
    },
{
      type: `checklist`,
      id: `ch20-study-vocabulary`,
      standardId: `CH20-LO06`,
      title: `Vocabulary Review`,
      subtitle: `Important terminology with concise definitions`,
      items: [
        { text: `Booth rental — leasing a station inside a shop and operating as an independent business.` },
        { text: `Client base — the group of customers who return to a particular barber on a regular basis.` },
        { text: `Commission — a percentage of service revenue paid to a barber, often after building clientele.` },
        { text: `Employee — a worker whose schedule, methods, and taxes are controlled or handled by the shop.` },
        { text: `Independent contractor — a self-employed worker who controls how services are performed and handles own taxes and insurance.` },
        { text: `Job description — a written document outlining the duties and expectations of a position.` },
        { text: `Retailing — recommending and selling products for at-home use.` },
        { text: `Ticket upgrading — recommending additional services that benefit the client.` },
        { text: `Tip log — a daily record of gratuities used to report income accurately at tax time.` },
        { text: `Transferable skills — abilities learned in previous jobs that can be applied in a new position.` },
      ],
    },
{
      type: `proTip`,
      id: `ch20-study-professional-tips`,
      standardId: `CH20-LO06`,
      title: `Professional Tips`,
      subtitle: `Advice you can apply immediately behind the chair`,
      items: [
        {
          category: `First Impressions`,
          tips: [
            `Arrive early enough to be set up and calm before your first client.`,
            `Dress and groom to match the shop's standards every single day.`,
            `Greet every client by name when possible.`,
          ],
        },
        {
          category: `Communication`,
          tips: [
            `Listen more than you talk during consultations.`,
            `Use clear, simple language when explaining services or products.`,
            `Confirm the client's desired outcome before picking up your tools.`,
          ],
        },
        {
          category: `Team Conduct`,
          tips: [
            `Avoid gossip, negativity, and complaining in front of clients.`,
            `Help with shop tasks even when they are not in your job description.`,
            `Resolve conflicts directly and respectfully with the person involved.`,
          ],
        },
      ],
    },
{
      type: `proTip`,
      id: `ch20-study-business-tips`,
      standardId: `CH20-LO06`,
      title: `Business Tips`,
      subtitle: `Financial and business concepts for barbering success`,
      items: [
        {
          category: `Income Tracking`,
          tips: [
            `Record every tip the day you receive it.`,
            `Keep personal and business expenses separate.`,
            `Set aside money for taxes if you are an independent contractor or booth renter.`,
          ],
        },
        {
          category: `Budgeting`,
          tips: [
            `List fixed expenses first, then variable spending.`,
            `Build an emergency fund before making large purchases.`,
            `Review your budget monthly and adjust as income changes.`,
          ],
        },
        {
          category: `Income Growth`,
          tips: [
            `Raise prices only after your skills and demand justify it.`,
            `Maximize busy shifts and build retail recommendations into every service.`,
            `Track which services and products generate the most income.`,
          ],
        },
      ],
    },
{
      type: `contentBlock`,
      id: `ch20-study-review-questions`,
      standardId: `CH20-LO06`,
      title: `Review Questions`,
      subtitle: `Study questions covering the entire chapter`,
      content:
        `1. What are five things employers expect from a new barber?n2. List three habits of a good barbershop team player.n3. How does employee status differ from booth renter status in terms of taxes and scheduling?n4. What are three common wage structures used in barbershops?n5. Why is it important to report cash tips even if they do not appear on a paycheck?n6. Name three ways to give yourself a raise without changing your hourly rate.n7. What is the difference between ticket upgrading and retailing?n8. How should you respond when a client objects to a product recommendation?n9. List five techniques for building or retaining a client base.n10. Why is rebooking a client while they are still in the chair more effective than following up days later?`,
      highlight:
        `Use these questions to self-test. If you cannot answer one confidently, return to the related lesson section before moving on.`,
    },
{
      type: `featureGrid`,
      id: `ch20-study-exam-tips`,
      standardId: `CH20-LO06`,
      title: `Exam Tips`,
      subtitle: `Prepare for licensing exams and competency assessments`,
      features: [
        {
          icon: `FileText`,
          title: `Know the Forms`,
          description:
            `Be able to identify when a W-2, 1099, or lease agreement is used and who is responsible for taxes in each employment status.`,
        },
        {
          icon: `Calculator`,
          title: `Practice Commission Math`,
          description:
            `Calculate earnings when a shop takes a fee off the top before applying a commission percentage.`,
        },
        {
          icon: `ShieldCheck`,
          title: `Remember Legal Basics`,
          description:
            `Know that tips are taxable income and that state laws vary regarding booth rental arrangements.`,
        },
        {
          icon: `MessageSquare`,
          title: `Apply Client Communication`,
          description:
            `Expect scenario questions about handling objections, upselling ethically, and rebooking clients.`,
        },
      ],
    },
{
      type: `featureGrid`,
      id: `ch20-study-memory-aids`,
      standardId: `CH20-LO06`,
      title: `Memory Aids`,
      subtitle: `Strategies to help key concepts stick`,
      features: [
        {
          icon: `Brain`,
          title: `EARLY`,
          description:
            `Arrive Early, Act Reliable, Look professional, Take feedback, You serve the team. Five habits of a strong new employee.`,
        },
        {
          icon: `Heart`,
          title: `SERVE`,
          description:
            `Share knowledge, Expect the best, Remain positive, Value loyalty, Earn trust. Five teamwork habits.`,
        },
        {
          icon: `DollarSign`,
          title: `The Money Flow Rule`,
          description:
            `Income comes in → tips get logged → taxes get set aside → budget gets reviewed → growth gets reinvested.`,
        },
      ],
    },
    {
      type: 'checklist',
      id: 'ch20-study-best-practices',
      standardId: 'CH20-LO06',
      title: 'Best Practices',
      subtitle: 'Professional behaviors expected of successful barbers',
      items: [
        { text: `Arrive on time and prepared for every shift.` },
        { text: `Dress and communicate in a way that reflects well on the shop.` },
        { text: `Treat every team member with respect, even during disagreements.` },
        { text: `Track tips and income accurately for tax purposes.` },
        { text: `Create and review a monthly budget.` },
        { text: `Recommend services and products based on client needs.` },
        { text: `Handle objections with honesty, not pressure.` },
        { text: `Rebook clients during their current visit.` },
        { text: `Ask permission before posting client photos.` },
        { text: `Continue learning technical, business, and people skills throughout your career.` },
      ],
    },
    {
      type: 'challengeCard',
      id: 'ch20-workplace-taskings',
      standardId: 'CH20-LO06',
      title: 'Try This: Build Your Professional Practice',
      subtitle: 'Move from knowing to doing with practical workplace exercises.',
      challenges: [
        {
          badge: `Financial Literacy`,
          title: `Build a Monthly Budget`,
          description:
            `Use the personal monthly budget worksheet to list your real or estimated expenses and income.`,
          action:
            `Calculate your balance. If it is negative, identify three expenses you can reduce and three ways to increase income.`,
          difficulty: `medium`,
        },
        {
          badge: `Client Service`,
          title: `Role-Play a Client Consultation`,
          description:
            `Practice a full consultation with a classmate playing a client who has a special event coming up.`,
          action:
            `Identify a need, recommend one add-on service, and explain the benefit without pressure. Receive feedback on tone and clarity.`,
          difficulty: `medium`,
        },
        {
          badge: `Sales Skills`,
          title: `Practice Overcoming a Retail Objection`,
          description:
            `With a partner, role-play a client who objects to a product because of price or because they already own something similar.`,
          action:
            `Respond by acknowledging the concern, restating the benefit, and offering a sample or alternative. Switch roles.`,
          difficulty: `medium`,
        },
        {
          badge: `Business Strategy`,
          title: `Develop a Client Retention Strategy`,
          description:
            `Create a 30-day plan to retain and grow your client base using at least five techniques from this chapter.`,
          action:
            `Include rebooking scripts, a social media posting plan, a referral reward system, and a birthday promotion.`,
          difficulty: `hard`,
        },
        {
          badge: `Career Planning`,
          title: `Evaluate a Compensation Offer`,
          description:
            `Compare two hypothetical job offers: one hourly with benefits and one commission-based booth rental.`,
          action:
            `List the pros, cons, tax implications, and what you would need to earn monthly to make each option viable.`,
          difficulty: `hard`,
        },
      ],
    },
{
      type: 'contentBlock',
      id: 'ch20-instructor-notes',
      standardId: 'CH20-LO06',
      title: 'Instructor Notes',
      content:
        'Invite a local shop owner or experienced barber to discuss the realities of moving from school to work, including common first-year mistakes. Lead a class discussion on workplace principles and have students identify which habits they already practice and which need development. Use the employment classification table to compare real job postings and have students calculate net income under different wage structures. Practice tip logging and budget worksheets with realistic numbers. Run role-play exercises for upselling and overcoming objections, emphasizing client-centered language rather than pushy sales tactics. Review marketing ideas and have students draft one social media post and one referral card, with attention to professionalism and client privacy. Common misconceptions include the belief that tips do not need to be reported, that booth rental is always the most profitable option, and that selling is inherently aggressive. Coach students to see ethical selling as service and financial management as part of professional independence.',
      highlight: 'The most successful new barbers combine technical skill with reliability, teamwork, financial literacy, and client-centered communication.',
    },
  ],
  competencies: [
    {
      id: 'CH20-C01',
      standardId: 'CH20-C01',
      title: 'Transition from School to Work',
      description: 'Describe employer expectations and the behavioral changes required when moving from barbering school to professional employment.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH20-LO01'],
      flashcardIds: ['fc-ch20-001', 'fc-ch20-002', 'fc-ch20-003', 'fc-ch20-004', 'fc-ch20-005', 'fc-ch20-006', 'fc-ch20-007', 'fc-ch20-008', 'fc-ch20-009', 'fc-ch20-010'],
      quizQuestionIds: ['qq-20-01', 'qq-20-02', 'qq-20-03'],
    },
    {
      id: 'CH20-C02',
      standardId: 'CH20-C02',
      title: 'Habits of a Good Barbershop Team Player',
      description: 'Demonstrate the teamwork principles, communication habits, and conflict-resolution skills that create a productive barbershop environment.',
      importance: 'critical',
      difficulty: 'easy',
      learningObjectives: ['CH20-LO02'],
      flashcardIds: ['fc-ch20-011', 'fc-ch20-012', 'fc-ch20-013', 'fc-ch20-014', 'fc-ch20-015', 'fc-ch20-016', 'fc-ch20-017', 'fc-ch20-018', 'fc-ch20-019', 'fc-ch20-020'],
      quizQuestionIds: ['qq-20-04', 'qq-20-05', 'qq-20-06'],
    },
    {
      id: 'CH20-C03',
      standardId: 'CH20-C03',
      title: 'Employment Classifications and Compensation',
      description: 'Compare employee, independent contractor, and booth renter status along with common wage structures and tax responsibilities.',
      importance: 'critical',
      difficulty: 'hard',
      learningObjectives: ['CH20-LO03'],
      flashcardIds: ['fc-ch20-021', 'fc-ch20-022', 'fc-ch20-023', 'fc-ch20-024', 'fc-ch20-025', 'fc-ch20-026', 'fc-ch20-027', 'fc-ch20-028', 'fc-ch20-029', 'fc-ch20-030'],
      quizQuestionIds: ['qq-20-07', 'qq-20-08', 'qq-20-09'],
    },
    {
      id: 'CH20-C04',
      standardId: 'CH20-C04',
      title: 'Financial Responsibility and Budgeting',
      description: 'Record tips and income accurately, build a personal budget, manage debt, and identify ways to increase net income.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH20-LO04'],
      flashcardIds: ['fc-ch20-031', 'fc-ch20-032', 'fc-ch20-033', 'fc-ch20-034', 'fc-ch20-035', 'fc-ch20-036', 'fc-ch20-037', 'fc-ch20-038', 'fc-ch20-039', 'fc-ch20-040'],
      quizQuestionIds: ['qq-20-10', 'qq-20-11', 'qq-20-12'],
    },
    {
      id: 'CH20-C05',
      standardId: 'CH20-C05',
      title: 'Ethical Retailing and Upselling',
      description: 'Apply the principles of selling to recommend services and products ethically while overcoming objections without pressure.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH20-LO05'],
      flashcardIds: ['fc-ch20-041', 'fc-ch20-042', 'fc-ch20-043', 'fc-ch20-044', 'fc-ch20-045', 'fc-ch20-046', 'fc-ch20-047', 'fc-ch20-048', 'fc-ch20-049', 'fc-ch20-050'],
      quizQuestionIds: ['qq-20-13', 'qq-20-14'],
    },
    {
      id: 'CH20-C06',
      standardId: 'CH20-C06',
      title: 'Building and Retaining a Client Base',
      description: 'Use marketing, rebooking, social media, and referral strategies to attract new clients and keep current clients returning.',
      importance: 'critical',
      difficulty: 'easy',
      learningObjectives: ['CH20-LO06'],
      flashcardIds: ['fc-ch20-051', 'fc-ch20-052', 'fc-ch20-053', 'fc-ch20-054', 'fc-ch20-055', 'fc-ch20-056', 'fc-ch20-057', 'fc-ch20-058', 'fc-ch20-059', 'fc-ch20-060'],
      quizQuestionIds: ['qq-20-15', 'qq-20-16', 'qq-20-17'],
    },
  ],
  learningObjectives: [
    {
      id: 'CH20-LO01',
      standardId: 'CH20-LO01',
      description: 'Describe what is expected of a new employee and what this means in terms of everyday behavior.',
      competencyIds: ['CH20-C01'],
      lessonIds: ['ch20-lo1'],
      flashcardIds: ['fc-ch20-001', 'fc-ch20-002', 'fc-ch20-003', 'fc-ch20-004', 'fc-ch20-005', 'fc-ch20-006', 'fc-ch20-007', 'fc-ch20-008', 'fc-ch20-009', 'fc-ch20-010'],
      quizQuestionIds: ['qq-20-01', 'qq-20-02', 'qq-20-03'],
    },
    {
      id: 'CH20-LO02',
      standardId: 'CH20-LO02',
      description: 'List the habits of a good barbershop team player.',
      competencyIds: ['CH20-C02'],
      lessonIds: ['ch20-lo2'],
      flashcardIds: ['fc-ch20-011', 'fc-ch20-012', 'fc-ch20-013', 'fc-ch20-014', 'fc-ch20-015', 'fc-ch20-016', 'fc-ch20-017', 'fc-ch20-018', 'fc-ch20-019', 'fc-ch20-020'],
      quizQuestionIds: ['qq-20-04', 'qq-20-05', 'qq-20-06'],
    },
    {
      id: 'CH20-LO03',
      standardId: 'CH20-LO03',
      description: 'Describe three different ways in which barbers are compensated.',
      competencyIds: ['CH20-C03'],
      lessonIds: ['ch20-lo3'],
      flashcardIds: ['fc-ch20-021', 'fc-ch20-022', 'fc-ch20-023', 'fc-ch20-024', 'fc-ch20-025', 'fc-ch20-026', 'fc-ch20-027', 'fc-ch20-028', 'fc-ch20-029', 'fc-ch20-030'],
      quizQuestionIds: ['qq-20-07', 'qq-20-08', 'qq-20-09'],
    },
    {
      id: 'CH20-LO04',
      standardId: 'CH20-LO04',
      description: 'Determine the best way to record tips and make additional income.',
      competencyIds: ['CH20-C04'],
      lessonIds: ['ch20-lo4'],
      flashcardIds: ['fc-ch20-031', 'fc-ch20-032', 'fc-ch20-033', 'fc-ch20-034', 'fc-ch20-035', 'fc-ch20-036', 'fc-ch20-037', 'fc-ch20-038', 'fc-ch20-039', 'fc-ch20-040'],
      quizQuestionIds: ['qq-20-10', 'qq-20-11', 'qq-20-12'],
    },
    {
      id: 'CH20-LO05',
      standardId: 'CH20-LO05',
      description: 'Explain the principles of selling products and services in the barbershop.',
      competencyIds: ['CH20-C05'],
      lessonIds: ['ch20-lo5'],
      flashcardIds: ['fc-ch20-041', 'fc-ch20-042', 'fc-ch20-043', 'fc-ch20-044', 'fc-ch20-045', 'fc-ch20-046', 'fc-ch20-047', 'fc-ch20-048', 'fc-ch20-049', 'fc-ch20-050'],
      quizQuestionIds: ['qq-20-13', 'qq-20-14'],
    },
    {
      id: 'CH20-LO06',
      standardId: 'CH20-LO06',
      description: 'List the most effective ways to build a client base.',
      competencyIds: ['CH20-C06'],
      lessonIds: ['ch20-lo6'],
      flashcardIds: ['fc-ch20-051', 'fc-ch20-052', 'fc-ch20-053', 'fc-ch20-054', 'fc-ch20-055', 'fc-ch20-056', 'fc-ch20-057', 'fc-ch20-058', 'fc-ch20-059', 'fc-ch20-060'],
      quizQuestionIds: ['qq-20-15', 'qq-20-16', 'qq-20-17'],
    },
  ],
  remediation: [
    {
      id: 'CH20-R01',
      standardId: 'CH20-R01',
      competencyId: 'CH20-C01',
      lessonIds: ['ch20-lo1'],
      flashcardIds: ['fc-ch20-001', 'fc-ch20-002', 'fc-ch20-003', 'fc-ch20-004', 'fc-ch20-005', 'fc-ch20-006', 'fc-ch20-007', 'fc-ch20-008', 'fc-ch20-009', 'fc-ch20-010'],
      vocabularyIds: ['job-description', 'professional-conduct', 'workplace-expectations'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-20-01', 'qq-20-02', 'qq-20-03'],
      instructorNote: 'Review the differences between school culture and workplace culture. Have the student draft a personal job description and list five behaviors that demonstrate reliability.',
      retakeCount: 3,
    },
    {
      id: 'CH20-R02',
      standardId: 'CH20-R02',
      competencyId: 'CH20-C02',
      lessonIds: ['ch20-lo2'],
      flashcardIds: ['fc-ch20-011', 'fc-ch20-012', 'fc-ch20-013', 'fc-ch20-014', 'fc-ch20-015', 'fc-ch20-016', 'fc-ch20-017', 'fc-ch20-018', 'fc-ch20-019', 'fc-ch20-020'],
      vocabularyIds: ['teamwork', 'conflict-resolution', 'loyalty', 'lifelong-learning'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-20-04', 'qq-20-05', 'qq-20-06'],
      instructorNote: 'Discuss real teamwork scenarios and have the student identify positive and negative teammate behaviors. Role-play a constructive conflict-resolution conversation.',
      retakeCount: 3,
    },
    {
      id: 'CH20-R03',
      standardId: 'CH20-R03',
      competencyId: 'CH20-C03',
      lessonIds: ['ch20-lo3'],
      flashcardIds: ['fc-ch20-021', 'fc-ch20-022', 'fc-ch20-023', 'fc-ch20-024', 'fc-ch20-025', 'fc-ch20-026', 'fc-ch20-027', 'fc-ch20-028', 'fc-ch20-029', 'fc-ch20-030'],
      vocabularyIds: ['employee', 'independent-contractor', 'booth-rental', 'commission', 'salary-plus-commission'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-20-07', 'qq-20-08', 'qq-20-09'],
      instructorNote: 'Use the employment classification table to compare two job offers. Have the student explain tax forms, contracts, and the risks of each status.',
      retakeCount: 3,
    },
    {
      id: 'CH20-R04',
      standardId: 'CH20-R04',
      competencyId: 'CH20-C04',
      lessonIds: ['ch20-lo4'],
      flashcardIds: ['fc-ch20-031', 'fc-ch20-032', 'fc-ch20-033', 'fc-ch20-034', 'fc-ch20-035', 'fc-ch20-036', 'fc-ch20-037', 'fc-ch20-038', 'fc-ch20-039', 'fc-ch20-040'],
      vocabularyIds: ['tip-log', 'budget', 'debt', 'income-reporting'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-20-10', 'qq-20-11', 'qq-20-12'],
      instructorNote: 'Have the student complete a realistic monthly budget worksheet and explain how to record tips daily. Discuss consequences of underreporting income.',
      retakeCount: 3,
    },
    {
      id: 'CH20-R05',
      standardId: 'CH20-R05',
      competencyId: 'CH20-C05',
      lessonIds: ['ch20-lo5'],
      flashcardIds: ['fc-ch20-041', 'fc-ch20-042', 'fc-ch20-043', 'fc-ch20-044', 'fc-ch20-045', 'fc-ch20-046', 'fc-ch20-047', 'fc-ch20-048', 'fc-ch20-049', 'fc-ch20-050'],
      vocabularyIds: ['ticket-upgrading', 'retailing', 'objections', 'closing-the-sale'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-20-13', 'qq-20-14'],
      instructorNote: 'Role-play an upsell and a retail recommendation. Focus on client needs, benefits, and graceful handling of objections.',
      retakeCount: 3,
    },
    {
      id: 'CH20-R06',
      standardId: 'CH20-R06',
      competencyId: 'CH20-C06',
      lessonIds: ['ch20-lo6'],
      flashcardIds: ['fc-ch20-051', 'fc-ch20-052', 'fc-ch20-053', 'fc-ch20-054', 'fc-ch20-055', 'fc-ch20-056', 'fc-ch20-057', 'fc-ch20-058', 'fc-ch20-059', 'fc-ch20-060'],
      vocabularyIds: ['client-base', 'rebooking', 'referrals', 'social-media-marketing'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-20-15', 'qq-20-16', 'qq-20-17'],
      instructorNote: 'Have the student create a one-month client retention plan that includes rebooking, a referral program, and two social media posts.',
      retakeCount: 3,
    },
  ],
  mastery: {
    passingScore: 80,
    confidenceCheck: true,
    remediationRequiredBelow: 80,
  },
}
