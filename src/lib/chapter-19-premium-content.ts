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
  subtitle: 'Licensure exams, résumés, interviews, and employment law',
  theme: chapter19PremiumTheme,
  sections: [
    {
      type: 'htmlContent',
      id: 'chapter-19-lesson',
      title: 'Chapter 19 Lesson',
      html: `<style>.ch19-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch19-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch19-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch19-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch19-legacy-content .section {  margin-bottom: 3rem; }
.ch19-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch19-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch19-legacy-content .section h4 {  font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #e0e0e0; }
.ch19-legacy-content .section h5 {  font-size: 1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #cccccc; }
.ch19-legacy-content .section p, .ch19-legacy-content .section ul, .ch19-legacy-content .section ol {  margin-bottom: 1rem; color: #ccc; }
.ch19-legacy-content .section ul, .ch19-legacy-content .section ol {  margin-left: 1.5rem; }
.ch19-legacy-content .section li {  margin-bottom: 0.35rem; }
.ch19-legacy-content .section table {  width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
.ch19-legacy-content .section th, .ch19-legacy-content .section td {  border: 1px solid var(--medium-gray); padding: 0.6rem 0.75rem; text-align: left; }
.ch19-legacy-content .section th {  background: rgba(212,175,55,0.15); color: var(--gold); font-weight: 600; }
.ch19-legacy-content .section tr:nth-child(even) {  background: rgba(255,255,255,0.03); }
.ch19-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch19-legacy-content .key-point strong {  color: var(--gold); }
.ch19-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch19-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch19-legacy-content hr {  border: 0; border-top: 1px solid var(--medium-gray); margin: 2rem 0; }</style>
<div class="ch19-legacy-content">
<section class="section">
<h1>ASCYN PRO Phase 1 Lesson: Preparing for Licensure and Employment</h1>
</section>

<section class="section">
<h2>Chapter 19 — Milady Standard Barbering</h2>
<hr>
</section>

<section class="section">
<h2>Introduction and Why Study Preparing for Licensure and Employment</h2>
<p><strong>Textbook Pages:</strong> 707–708</p>
<h3>What You Need to Know</h3>
<p>There are plenty of great jobs out there for energetic, hardworking, and talented people. If you look at the top professionals in the barbering field, you will find they were not born successful; they achieved success through self-motivation, energy, and persistence. Like you, these barbers began their careers by enrolling in barbering school, while others may have taken the apprenticeship route. In either case, they were the ones who used their time wisely, planned for the future, went the extra mile, and drew on a reservoir of self-confidence to meet challenges. They owe their success to no one but themselves, because they created it. If you want to enjoy similar success, you must prepare for the opportunities that await you.</p>
<p>No matter what changes occur in the economy, there are often more jobs available for entry-level barbers than there are people to fill them. This is a tremendous advantage for you, but you must still thoroughly research the job market in your geographical area before committing to your first job (Figure 19-1). If you make the right choice, your career will be on the road to success. If you make the wrong choice, your career will not be a tragedy, but there will be unnecessary delay.</p>
<p><strong>Figure 19-1</strong> Many barbering jobs are available. <em>(© iStock.com/Cunaplus)</em></p>
<p>Barbers should study and have a thorough understanding of preparing for licensure and employment because:</p>
<ul>
<li>You must pass your state board exam to be licensed, and you must be licensed to be hired; therefore, preparing for licensure and passing your exam is your first step to employment success.</li>
<li>A successful employment search is a job in itself, and there are many tools that can give you the edge—as well as mistakes that can cost you an interview or a job.</li>
<li>The ability to pinpoint the right barbershop for you and target it as a potential employer is vital for your career success.</li>
<li>Proactively preparing the right materials, such as a great résumé, and practicing for interviewing give you the confidence that is needed to secure a job in a barbershop you love.</li>
</ul>
<h3>Key Points</h3>
<ul>
<li>Success in barbering comes from self-motivation, energy, persistence, and planning.</li>
<li>Research the job market in your area before accepting your first position.</li>
<li>Passing the state board exam and becoming licensed is the first step toward employment.</li>
<li>Targeting the right barbershop and preparing strong materials improves your chances of getting hired.</li>
</ul>
<h3>Important Notes</h3>
<ul>
<li>Your first job choice can speed up or delay your career progress.</li>
<li>Preparing for licensure and employment should begin before graduation.</li>
</ul>
<h3>Learning Objectives for This Chapter</h3>
<p>After completing this chapter, you will be able to:</p>
<ol>
<li>Describe the process of taking and passing state licensing examinations.</li>
<li>Develop a résumé and employment portfolio.</li>
<li>Know how to explore the job market, research potential employers, and operate within the legal aspects of employment.</li>
</ol>
<hr>
</section>

<section class="section">
<h2>Prepare for Licensure</h2>
<p><strong>Textbook Pages:</strong> 708–713</p>
<h3>What You Need to Know</h3>
<p>Before you can obtain the career position you are hoping for, you must pass your state licensing examinations (usually a written and a practical exam) and secure the required credentials from your state's licensing board by filling out an application and paying a fee. For details on fees, testing dates, requirements, and more, visit the website of your state barber board or your state's department of licensing.</p>
<p>Many factors affect how well you perform during that licensing examination and on tests in general. They include your physical and psychological state; your memory; your time management skills; and your academic skills, such as reading, writing, note taking, test taking, and general learning.</p>
<p>Of all the factors that affect your test performance, the most important is your mastery of course content. However, even if you feel that you have truly learned the material, it is still very beneficial to have strong test-taking skills. Being <strong>test-wise</strong> (TEST-wyze) means understanding the strategies for successful test taking.</p>
<h4>Preparing for the Written Exam</h4>
<p>A test-wise student begins to prepare for a test by practicing good study habits and time management. These habits include the following:</p>
<ul>
<li>Have a planned, realistic study schedule (Figure 19-2).</li>
<li>Read content carefully and become an active studier.</li>
<li>Keep well-organized notes.</li>
<li>Develop a detailed vocabulary list.</li>
<li>Take effective notes during class.</li>
<li>Organize and review handouts.</li>
<li>Review past quizzes and tests.</li>
<li>Listen carefully in class for cues and clues about what could be expected on the test.</li>
</ul>
<p><strong>Figure 19-2</strong> Studying for your exam. <em>(© Rawpixel/Shutterstock.com)</em></p>
<p>More holistic hints to keep in mind include the following:</p>
<ul>
<li>Make yourself mentally ready and develop a positive attitude toward taking the test.</li>
<li>Get plenty of rest the night before the test.</li>
<li>Dress comfortably and professionally.</li>
<li>Anticipate some anxiety (feeling concerned about the test results may actually help you do better).</li>
<li>Avoid cramming the night before an examination.</li>
<li>Find out if your state uses computers for the written portion of the test. If so, make certain you are comfortable with computerized test taking.</li>
</ul>
<p><strong>Did You Know?</strong> If you have a physician-documented disability, such as a learning disability, your state may allow you extra time to take the written exam or even provide a special examiner. Ask your instructor and check with your state licensing board. Be certain to make any special arrangements well in advance of the test date.</p>
<h4>On Test Day</h4>
<p>After you have taken all the necessary steps to prepare for your test, you can adopt a number of strategies on the day of the exam that may be helpful.</p>
<ul>
<li>Relax and try to slow down physically.</li>
<li>Review the material lightly on the day of the exam.</li>
<li>If possible, do a "test drive" to the site before test day if you are unsure of the location. Some exams may be administered at your school, and some may be given in alternate locations.</li>
<li>Arrive early with a self-confident attitude; be alert, calm, and ready for the challenge.</li>
<li>Read all written directions and listen carefully to all verbal directions before beginning.</li>
<li>If there are things you do not understand, do not hesitate to ask the examiner questions.</li>
<li>Scan the entire test before beginning.</li>
<li>Budget your time to ensure that you have plenty of opportunity to complete the test; do not spend too much time on any one question.</li>
<li>Wear a watch so that you can monitor the time.</li>
<li>Begin work as soon as possible, and mark the answers in the test carefully but quickly.</li>
<li>Answer the easiest questions first to save time for the more difficult ones. Quickly scanning all the questions first may clue you in to the more difficult questions.</li>
<li>Make a note of the questions you skip so that you can find them again later. If the test is administered online, you may not be given this option. Some software prevents you from moving forward without first answering all the questions on the page. Discuss this with your instructor or the testing facility before taking the exam.</li>
<li>Read each question carefully to make sure that you know exactly what the question is asking and that you understand all parts of the question.</li>
<li>Answer as many questions as possible. For questions that cause uncertainty, guess or estimate.</li>
<li>Look over the test when you are done to ensure that you have read all questions correctly and that you have answered as many as possible.</li>
<li>Make changes to answers only if there is a good reason to do so.</li>
<li>Check the test carefully before turning it in. (For instance, you might have forgotten to put your name on it!)</li>
</ul>
<h4>Deductive Reasoning</h4>
<p><strong>Deductive reasoning</strong> (dee-DUK-tiv REE-zun-ing) is the process of reaching logical conclusions by employing logical reasoning. Deductive reasoning is a technique that students should learn to use for better test results. Some strategies associated with deductive reasoning include the following:</p>
<ul>
<li>Eliminate options that are known to be incorrect. The more incorrect answers you can eliminate, the better your chances of identifying the correct answer.</li>
<li>Watch for key words or terms. Look for any qualifying conditions or statements. Keep an eye out for phrases and words such as <em>usually</em>, <em>commonly</em>, <em>in most instances</em>, <em>never</em>, and <em>always</em>.</li>
<li>Study the <strong>stem</strong> (STEM), which is the basic question or problem. It often provides a clue to the correct answer. Look for a match between the stem and one of the choices.</li>
<li>Watch for grammatical clues. For instance, if the last word in a stem is <em>an</em>, the answer must begin with a vowel sound rather than a consonant.</li>
<li>Look at similar or related questions. They may provide clues.</li>
<li>When answering essay questions, watch for words such as <em>compare</em>, <em>contrast</em>, <em>discuss</em>, <em>evaluate</em>, <em>analyze</em>, <em>define</em>, or <em>describe</em>, and develop your answer accordingly.</li>
<li>When questions include paragraphs to read and questions to answer, read the questions first. This helps you identify the important information as you read the paragraph.</li>
</ul>
<h4>Understanding Test Formats</h4>
<p>There are a few additional tips that all test-wise learners should know, especially with respect to the state licensing examination. Keep in mind, of course, that the most important strategy of test taking is to know your material. Beyond that, consider the following tips on the various types of question formats.</p>
<h5>True/False</h5>
<p>Watch for qualifying words (<em>all, most, some, none, always, usually, sometimes, never, little, no, equal, less, good, bad</em>). Absolutes (<em>all, none, always, never</em>) are generally not true (Figure 19-3).</p>
<p><strong>Figure 19-3</strong> True or false?</p>
<ul>
<li>For a statement to be true, the <em>entire</em> statement must be true.</li>
<li>Long statements are more likely to be true than short statements. It takes more detail to provide truthful, factual information.</li>
</ul>
<h5>Multiple Choice</h5>
<ul>
<li>Read the entire question carefully, including all the choices.</li>
<li>Look for the best answer; more than one choice may be true.</li>
<li>Eliminate incorrect answers by crossing them out (if taking the test on the test form).</li>
<li>When two choices are close or similar, one of them is probably right.</li>
<li>When two choices are identical, both must be wrong.</li>
<li>When two choices are opposites, one is probably wrong and one is probably correct, depending on the number of other choices.</li>
<li>"All of the above" and similar responses are often the correct choice.</li>
<li>Pay special attention to words such as <em>not, except</em>, and <em>but</em>.</li>
<li>Guess if you do not know the answer (provided that there is no penalty).</li>
<li>The answer to one question may be in the stem of another.</li>
</ul>
<h5>Matching</h5>
<ul>
<li>Read all items in each list before beginning.</li>
<li>Check off items from the brief response list to eliminate choices.</li>
</ul>
<h5>Essays</h5>
<ul>
<li>Organize your answer according to the cue words in the question.</li>
<li>Think carefully and outline your answer before you begin writing.</li>
<li>Make sure that what you write is complete, accurate, relevant to the question, well organized, and clear.</li>
</ul>
<p>Remember that understanding test formats and effective test-taking strategies still does not take the place of having a complete understanding of the material on which you are being tested. To be successful at taking tests, you must follow the rules of effective studying and be thoroughly knowledgeable of the exam content for both the written and the practical examination.</p>
<h4>Barber Law</h4>
<p>In addition to testing basic theory concepts, the written exam often contains questions about your state's barber laws and rules. The basic concept and functions of state barber boards remain the same: to protect the health, safety, and welfare of the public as it relates to the practice of barbering. However, when it comes to studying for your exam, it is important to be aware of the specific rules and regulations of your state. For example, there may be a test question that asks, "How many members of the barber board must be licensed barbers?" The answer to this question varies from state to state, so you need to know what the configuration of the barber board is in <em>your state</em>. Other questions relating to barber laws and regulations that may vary from state to state include, but are not limited to, the following:</p>
<ul>
<li>Chapter or administrative code number</li>
<li>Number of board members</li>
<li>Configuration of the board (barbers, public members, etc.)</li>
<li>Terms of office</li>
<li>Definitions</li>
<li>Exemptions and exceptions</li>
<li>Examination prerequisites (school hours, age, service requirements, etc.)</li>
<li>Reexamination requirements</li>
<li>Types of licenses</li>
<li>License display</li>
<li>License renewal dates</li>
<li>Fees and penalties</li>
<li>Minimum square footage for a barbershop</li>
<li>Continuing education requirements</li>
<li>Prohibited acts</li>
<li>Qualifications for endorsement</li>
</ul>
<p>Obtain copies of the barber board rules and regulations and candidate information literature for your state. Review these documents thoroughly and be guided by your instructor when preparing for written exams.</p>
<h4>The Practical Exam</h4>
<p>After completing the barber school curriculum, examination candidates should be competent in their technical skills and ready for state board <strong>practical exams</strong> (PRAK-tih-kul ig-ZAMZ). Although performance criteria for practical examinations vary from state to state, the basic skills or procedures that are usually evaluated are haircutting, shaving, shampooing, infection control, and possibly blowdrying or a chemical service. A fairly standard testing protocol requires candidates to demonstrate competence with the comb, shears, razor, and clippers. Safety precautions, proper draping procedures, and the safe handling of tools are also important performance standards. Review barber board rules and candidate information literature for details about what you will be tested on at the practical exam.</p>
<p>Practical exam preparation requires a different approach than written exams. After all, performing services is what barbering is all about, and practical exams are the best way to evaluate a person's competency in barbering techniques and safety.</p>
<p>Basic preparation for practical exams should always include practice on the model that you will be taking to the examination. To feel confident about your performance, you must be familiar with the model's hair texture and the haircut that you will be performing. For example, many states require a taper haircut—knowing the characteristics of your model's hair and the best techniques for cutting it will help to eliminate some nervousness and stress during the practical exam.</p>
<p>To be better prepared for the practical portion of the examination, follow these tips:</p>
<ul>
<li>Practice the correct skills required for the test as often as you can.</li>
<li>Participate in mock licensing examinations, complete with timed sections.</li>
<li>Familiarize yourself with the content in the examination bulletin.</li>
<li>Make a list of equipment and implements you are expected to bring to the examination.</li>
<li>Make certain that all equipment and implements are clean and in good working order prior to the exam.</li>
<li>If allowed by the regulatory or licensing agency, observe other practical examinations prior to taking yours.</li>
<li>As with any exam, listen carefully to the examiner's instructions, and follow them explicitly.</li>
<li>Focus on your own knowledge and do not allow yourself to be concerned with what other test candidates are doing.</li>
<li>Follow all infection control and safety procedures throughout the entire examination.</li>
<li>Look the part. Every little bit helps; make certain your appearance is neat, clean, and professional.</li>
</ul>
<p><strong>Did You Know?</strong> Although the extent of information made available to exam candidates varies from state to state, many states now maintain candidate information online for easy access, so be sure to review these valuable test-taking tools. In most cases, candidate information booklets or materials contain the following:</p>
<ul>
<li>Introduction to written and practical exams</li>
<li>Examination rules</li>
<li>Location and contact information for exams</li>
<li>Manner of testing (computer-based, paper and pencil, etc.)</li>
<li>Requirements, procedures, and reservation information for computer-based testing, if applicable</li>
<li>Content overview—written (number of questions, subject areas, sample questions, etc.)</li>
<li>Content overview—practical (specific procedures to be tested, possible points, etc.)</li>
<li>Model requirements (practical)</li>
<li>Tool and equipment requirements (practical)</li>
<li>What to bring and what not to bring (written and practical)</li>
<li>References used to write or develop the examinations</li>
<li>Grading and scoring policies (reexamination information, notification of results, etc.)</li>
<li>Administrative policies (late arrivals, cancellations, exam review process, etc.)</li>
</ul>
<h3>Key Points</h3>
<ul>
<li>You must pass written and practical state licensing exams and apply for your license before working as a barber.</li>
<li>Being test-wise means knowing strategies for successful test taking.</li>
<li>Good study habits, time management, rest, and a positive attitude help you prepare for the written exam.</li>
<li>On test day, arrive early, read directions, budget your time, answer easy questions first, and review your work.</li>
<li>Deductive reasoning helps you eliminate wrong answers and identify clues in test questions.</li>
<li>True/false, multiple-choice, matching, and essay questions each have specific strategies.</li>
<li>Barber law questions vary by state; know your state board's rules and regulations.</li>
<li>Practical exams usually test haircutting, shaving, shampooing, infection control, and possibly blowdrying or chemical services.</li>
<li>Practice on your exam model, participate in mock exams, and keep your tools clean and in good working order.</li>
</ul>
<h3>Important Notes</h3>
<ul>
<li>If you have a documented disability, arrange for testing accommodations well in advance.</li>
<li>Barber law details differ from state to state; always study your own state's rules.</li>
<li>Focus on your own work during the practical exam and follow all safety and infection control procedures.</li>
</ul>
<hr>
</section>

<section class="section">
<h2>Prepare for Employment</h2>
<p><strong>Textbook Pages:</strong> 713–720</p>
<h3>What You Need to Know</h3>
<p>When you chose to enter the field of barbering, your primary goal was to find a good job after being licensed. Now you need to reaffirm that goal by reviewing a number of important questions.</p>
<ul>
<li>What do you really want out of a career in barbering?</li>
<li>What particular areas within barbering are most interesting to you?</li>
<li>What are your strongest practical skills? In what ways do you wish to use these skills?</li>
<li>What personal qualities will help you have a successful career?</li>
</ul>
<p>One way that you can answer these questions is to copy and complete the Inventory of Personal Characteristics and Technical Skills (Figure 19-4). After you have completed this inventory and identified the areas that need further attention, you can determine where to focus the remainder of your training. In addition, you should have a better idea of what type of establishment would best suit you for your eventual employment.</p>
<p><strong>Figure 19-4</strong> Inventory of personal characteristics and technical skills.</p>
<h4>Inventory of Personal Characteristics and Technical Skills</h4>
<p>Use the following inventory to rate yourself and plan for improvement.</p>
<p><strong>INVENTORY OF PERSONAL CHARACTERISTICS</strong></p>
<table><thead><tr><th>PERSONAL CHARACTERISTIC</th><th>Exc.</th><th>Good</th><th>Avg.</th><th>Poor</th><th>Plan for improvement</th></tr></thead><tbody><tr><td>Posture, Deportment, Poise</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Grooming, Personal hygiene</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Manners, Courtesy</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Communication skills</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Attitude</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Self-motivation</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Personal habits</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Responsibility</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Self-esteem, Self-confidence</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Honesty, Integrity</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Dependability</td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
<p><strong>INVENTORY OF TECHNICAL SKILLS</strong></p>
<table><thead><tr><th>TECHNICAL SKILL</th><th>Exc.</th><th>Good</th><th>Avg.</th><th>Poor</th><th>Plan for improvement</th></tr></thead><tbody><tr><td>Hair shaping/cutting</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Hairstyling</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Haircoloring</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Texture services, Perming</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Texture services, Relaxing</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Shaving</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Razor cutting</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Hair replacement</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Other:</td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>
<p>After analyzing the above responses, would you hire yourself as an employee in your business? Why or why not?</p>
<p>State the short-term goals that you hope to accomplish in 6 to 12 months:</p>
<p>State the long-term goals that you hope to accomplish in 1 to 5 years:</p>
<p>Ask yourself: Do you want to work in a big city or small town? Would you feel more comfortable in a traditional barbershop or a trendy, upscale shop? Which clientele are you able to communicate with more effectively? Do you want to start out slowly and carefully, or do you want to jump in and throw everything into your career from the starting gate? Will you be in this industry throughout your working career, or is this just a stopover? Will you only work a 30- or 40-hour week, or will you go the extra mile when opportunities are available? How ambitious are you, and how many risks are you willing to take?</p>
<p>During your training, you may have the opportunity to network with various industry professionals who are invited to the school as guest speakers. Be prepared to ask them questions about what they like most and least in their current positions. Ask them for any tips they might have that will assist you in your search for the right barbershop. In addition, be sure to take advantage of your institution's in-house placement assistance program, if available, when you begin your employment search.</p>
<p>Your willingness to work hard is a key ingredient to your success. The commitment you make now in terms of time and effort will pay off later in the workplace, where your energy will be appreciated and rewarded. Having enthusiasm for getting the job done can be contagious, and when everyone works hard, everyone benefits. You can begin to develop this enthusiasm by establishing good work habits as a student.</p>
<h4>How to Get the Job You Want</h4>
<p>There are several key personal characteristics that will not only help you get the position you want, but will also help you keep it. These characteristics include the following points:</p>
<ul>
<li><strong>Motivation.</strong> This means having the drive to take the necessary action to achieve a goal. Although motivation can come from external sources—parental or peer pressure, for instance—the best kind of motivation is internal.</li>
<li><strong>Integrity.</strong> When you have integrity, you are committed to a strong code of moral and artistic values. Integrity is the compass that keeps you on course over the long haul of your career.</li>
<li><strong>Good technical and communication skills.</strong> While you may be better in either technical or communication skills, you must develop both to reach the level of success you desire.</li>
<li><strong>Strong work ethic.</strong> In the barbering business, having a strong <strong>work ethic</strong> (WURK ETH-ik) means taking pride in your work and committing yourself to consistently doing a good job for your clients, employer, and barbershop team.</li>
<li><strong>Enthusiasm.</strong> Try never to lose your eagerness to learn, grow, and expand your skills and knowledge.</li>
</ul>
<p><strong>Activity:</strong> For 1 week, keep a daily record of your performance in the following areas, and ask a few of your fellow students to provide feedback as well.</p>
<ul>
<li>Positive attitude</li>
<li>Punctuality</li>
<li>Diligent practice of newly learned techniques</li>
<li>Teamwork</li>
<li>Professional appearance</li>
<li>Regular class and clinic attendance</li>
<li>Interpersonal skills</li>
<li>Helping others</li>
</ul>
<h4>Where to Work?</h4>
<p>As you research employment opportunities, do not limit yourself to searching for barbershop positions alone. While the vast majority of barbers do work in barbershops, some perform services in either beauty or unisex salons—and increasing numbers find employment in hotels, resorts, and spas. Barbershops can vary significantly, not just in style, culture, and target market, but also in their organization. Many are small, independent shops in close contact with their owners and their personal tastes, while others are part of independent local chains or are regional franchise shops. All of these situations offer different opportunities that may or may not fit your needs and interests as a new barbering professional.</p>
<p>Another form of employment for barbers is renting a booth or chair, often within one of the locations mentioned earlier—indeed, almost half of all barbers and cosmetologists are booth renters. Booth renting is possibly the least expensive way of owning your own business, but this type of business is regulated by complex laws. The following two chapters will discuss booth rental in detail.</p>
<h4>Résumé Development</h4>
<p>A <strong>résumé</strong> (REZ-oo-MAY) is a written summary of a person's education and work experience. It tells potential employers at a glance what your achievements and accomplishments are. If you are a new graduate, you may have little or no work accomplishments, in which case your résumé should focus on skills and accomplishments. Here are some basic guidelines to follow when preparing your professional résumé.</p>
<ul>
<li>Keep it simple; limit it to one page.</li>
<li>Print a hard copy from your electronic version, using good-quality paper.</li>
<li>Include your name, address, phone number, and e-mail address on both the résumé and your cover letter.</li>
<li>List recent, relevant work experience.</li>
<li>List relevant education and the name of the institution from which you graduated, as well as relevant courses attended.</li>
<li>List your professional skills and accomplishments.</li>
<li>Focus on information that is relevant to the position you are seeking.</li>
</ul>
<p>The average time that a potential employer will spend scanning your résumé before deciding whether to grant you an interview is about 20 seconds. That means you must market yourself in such a manner that the reader will want to meet you. If your work experience has been in an unrelated field, show how the position helped you develop transferable skills. Restaurant work, for example, helps employees develop customer-service skills and learn to deal with a wide variety of clientele.</p>
<p>As you list former and current positions on your résumé, focus on achievements instead of detailing duties and responsibilities. Accomplishment statements enlarge your basic duties and responsibilities. The best way to show concrete accomplishment is to include numbers or percentages, whenever possible. As you describe former and current positions on your résumé, ask yourself the following questions:</p>
<ul>
<li>How many regular clients did I serve?</li>
<li>How many clients did I serve weekly?</li>
<li>What was my service ticket average?</li>
<li>What was my client retention rate?</li>
<li>What percentage of my client revenue came from retailing?</li>
<li>What percentage of my client revenue came from color or texture services?</li>
</ul>
<p>If you cannot express your accomplishment numerically, can you address which problems you solved or other results you achieved? For instance, did your office job help you develop excellent organizational skills?</p>
<p>This type of questioning can help you develop accomplishment statements that will interest a potential employer. There is no better time for you to achieve significant accomplishments than while you are in school. Even though your experience may be minimal, you must still present evidence of your skills and accomplishments. This may seem a difficult task at this early stage in your working career, but by closely examining your training and school clinic performance, extracurricular activities, and the full- or part-time jobs you have held, you should be able to create a good, attention-getting résumé.</p>
<p>For example, consider the following questions:</p>
<ul>
<li>Did you receive any honors during your course of training?</li>
<li>Were you ever selected "student of the month"?</li>
<li>Did you receive special recognition for your attendance or academic progress?</li>
<li>Did you win any barbering-related competitions while in school?</li>
<li>What was your attendance average while in school?</li>
<li>Did you work with the student body to organize any fundraisers? What were the results?</li>
</ul>
<p>Answers to these types of questions may indicate your people skills, personal work habits, and personal commitment to success.</p>
<p>Since you have not yet completed your training, you have the opportunity to make some of the examples a reality before you graduate. Positive developments of this nature while you are still in school can do much to improve your résumé.</p>
<h4>The Dos and Don'ts of Résumés</h4>
<p>You will save yourself from many problems and a lot of disappointment right from the beginning of your job search if you keep a clear idea in your mind of what to do and what not to do when it comes to creating a résumé.</p>
<p><strong>Here are some of the dos:</strong></p>
<ul>
<li><strong>Always put your complete contact information on your résumé.</strong> If your cell phone is your primary phone, list its number first, and add a landline if you have one.</li>
<li><strong>Make your résumé easy to read.</strong> Use concise, clear sentences and avoid overwriting or flowery language.</li>
<li><strong>Know your audience.</strong> Use vocabulary and language that will be understood by your potential employer.</li>
<li><strong>Keep your résumé short.</strong> One page is preferable.</li>
<li><strong>Stress accomplishments.</strong> Emphasize past accomplishments and the skills you used to achieve them.</li>
<li><strong>Focus on career goals.</strong> Highlight information that is relevant to your career goals and the position you are seeking.</li>
<li><strong>Emphasize transferable skills.</strong> The skills mastered at other jobs that can be put to use in a new position are <strong>transferable skills</strong> (trans-FUR-uh-bul SKILZ).</li>
<li><strong>Use action verbs.</strong> Begin accomplishment statements with action verbs such as <em>achieved, coordinated, developed, increased, maintained,</em> and <em>strengthened.</em></li>
<li><strong>Make your résumé neat.</strong> A poorly structured, badly typed résumé does not reflect well on you.</li>
<li><strong>Include professional references.</strong> Use only professional references on your résumé, and make sure you give potential employers the person's title, place of employment, and telephone number.</li>
<li><strong>Be realistic.</strong> Remember that you are just starting out in a field that you hope will be a wonderful and fulfilling experience. Be realistic about what employers may offer to beginners.</li>
<li><strong>Include a cover letter.</strong> A cover letter is used to introduce yourself to the employer and to identify the position you are seeking.</li>
<li><strong>Note any skills with new technologies.</strong> Include software programs, web development tools, and computerized barbershop management systems.</li>
</ul>
<p><strong>Here are some of the don'ts for résumé writing:</strong></p>
<ul>
<li><strong>Avoid salary references.</strong> Do not state your salary history.</li>
<li><strong>Avoid information about why you left former positions.</strong></li>
<li><strong>Do not stretch the truth.</strong> Misinformation or untruthful statements usually catch up with you.</li>
</ul>
<p>If you do not feel comfortable writing your own résumé, consider seeking a professional résumé writer or a job coach. There may be employment agencies that can help you as well; many online job search websites offer easy-to-use résumé templates.</p>
<p><strong>Figure 19-5</strong> An achievement-oriented résumé for a recent graduate of a barbering course.</p>
<p><strong>Sample Résumé:</strong></p>
<hr>
<p><strong>John Styles</strong> 143 Fern Circle • Anytown, USA, 12345 • 123.555.1234 • Johnstyles@barberstyles.net • StyledToTheNines.blogspot.com</p>
<p><strong>Objective</strong></p>
<p>My objective is to obtain an apprentice position in an upscale barbershop focusing on straight razor shaving and education so I may become a seasoned hair designer.</p>
<p><strong>Education</strong></p>
<p>ABC Barbering Academy, Chicago, IL, May 2016 Oak Park River Forest High School, Oak Park, IL, May 2012 Overall GPA: 3.0 Clubs: Paint/Sketch Club, Theater Club, Yearbook Committee</p>
<p><strong>Qualifications</strong></p>
<ul>
<li>Creative, energetic, and devoted to the barbering industry</li>
<li>Hold a current Illinois barber license and have a strong knowledge of trends</li>
<li>Proven ability to retain clients and was booked solid with requests during my final 4 months of training</li>
<li>Served as mentor to new students of the ABC Barbering Academy</li>
</ul>
<p><strong>Professional Experience</strong></p>
<p><strong>Creative</strong></p>
<ul>
<li>Won Regional Barber Battle: Best Fade Design</li>
<li>Developed an outstanding digital portfolio of photos showing cuts, color, and beard designs</li>
<li>Received Award for Best Student Fade: IBS 2014</li>
</ul>
<p><strong>Sales and Client Retention</strong></p>
<ul>
<li>Increased chemical services to 30 percent of my clinic volume by graduation</li>
<li>Named Student of the Month for best attendance, best attitude, highest retail, and most services delivered</li>
<li>Developed and retained a school-clinic client base of over 75 individuals, both male and female</li>
</ul>
<p><strong>Team Spirit</strong></p>
<ul>
<li>Peer resource and mentor for new students during their first 3 months of training</li>
<li>Volunteered as the "go-to person" for other students to consult regarding formal hairstyles</li>
<li>Created the official Academy Facebook page, where I regularly shared new industry information</li>
</ul>
<p><strong>Administration</strong></p>
<ul>
<li>Supervised a student "shop team" that developed a business plan for opening a 12-chair, full-service barbershop. This project earned an "A" and was recognized for thoroughness, accuracy, and creativity</li>
<li>Led the reorganization of the school dispensary, allowing for increased inventory control and the streamlining of clinic operations</li>
<li>Internet savvy with abilities in Microsoft Word, Excel, and PowerPoint</li>
</ul>
<p><strong>References</strong></p>
<p>Please see the attached page for references.</p>
<hr>
<p>Remember that you are a total package, not just a résumé. With determination, you will find the right position to begin your barbering career. Utilize all available resources during your résumé development and job search process. For example, there is an abundance of best practice information available on the Internet, or you can communicate with an individual you may already know who has gone through the hiring process and can provide recommendations. Milady also has fantastic resources that can provide you with additional assistance when you begin your job search.</p>
<h4>Employment Portfolio</h4>
<p>As you prepare to work in the field of barbering, an employment portfolio can be extremely useful. An <strong>employment portfolio</strong> (em-PLOY-ment port-FOH-lee-oh) is a collection, usually bound, of photos and documents that reflect your skills, accomplishments, and abilities in your chosen career field. You may choose to have a printed or an online portfolio.</p>
<p>While the actual contents of the portfolio vary from graduate to graduate, there are certain items that have a place in any portfolio. A powerful online or printed portfolio includes the following elements:</p>
<ul>
<li>Diplomas, including high school and barbering school</li>
<li>Awards and achievements received while being a barbering student</li>
<li>Current résumé, focusing on accomplishments</li>
<li>Letters of reference from former employers</li>
<li>Summary of continuing education and/or copies of training certificates</li>
<li>Statement of membership in industry and other professional organizations</li>
<li>Statement of relevant civic affiliations and/or community activities</li>
<li>Before-and-after photographs of services that you have performed on clients or models</li>
<li>Brief statement about why you have chosen a career in barbering</li>
<li>Any other information that you regard as relevant</li>
</ul>
<p>When you write the statement about why you chose a career in barbering, you might include the following elements:</p>
<ul>
<li>A statement that explains what you love about your new career</li>
<li>A description about the importance of teamwork and how you see yourself as a contributing team member</li>
<li>A description of methods and ideas you would use to increase service and retail revenue (Figure 19-6)</li>
</ul>
<p>Once you have assembled your portfolio, ask yourself whether it accurately portrays you and your career skills. If it does not, identify what needs to be changed. If you are not sure, run it by a neutral party for feedback about how to make it more interesting and accurate. This kind of feedback is also useful when creating a résumé. The portfolio, like the résumé, should be prepared in a way that projects professionalism.</p>
<ul>
<li>For ease of use, you may want to separate sections of a printed portfolio with tabs.</li>
<li>A bound portfolio should be easy to carry and show to potential employers and clients.</li>
<li>If you are showing your online portfolio, be sure your electronic device is fully charged and the web page is bookmarked for easy retrieval.</li>
<li>The photos should all have the same dimensions.</li>
</ul>
<p><strong>Did You Know?</strong> Use your creativity and artistic abilities as a barber to create a résumé that represents your style and sets you apart from the competition. Do a search for contemporary résumés on Pinterest, for instance, for ideas to get started on color options, new styles, and formatting to create a unique résumé.</p>
<h4>Online Portfolios</h4>
<p>If you are technologically savvy or can hire someone to assist you, create a digital portfolio or an online showcase of your work. However, do not expect potential employers to take the extra time to visit a website or view a DVD. Bring along a printed copy of everything you want the employer to see.</p>
<p>Make it a habit to take photos of your work for your portfolio. Bring in models and practice the latest haircut, styling, or coloring techniques. Take compelling before-and-after photos to show your ability to transform your clients. For ideas, browse the Internet by doing a Google image search for <em>barbering portfolio</em>. Showcase your versatility by providing photos of various haircuts so your potential employer will gain a sense of your abilities.</p>
<p>There are many options you can use to create an online or electronic version of your portfolio. You can simply save your photos and scanned documents on a DVD, or you can easily create an online portfolio for free by utilizing a blog. Websites such as blogger.com or wordpress.com offer free blog sites that can easily serve as your online portfolio.</p>
<p>Do your homework, research carefully, and think long term. You, your portfolio, and web address want to be around for years to come. If creating a website is currently not in your budget, then create a "Fan Page" on Facebook to showcase your work. Remember: Your fan page is your business page and a representation of your professional image.</p>
<h3>Key Points</h3>
<ul>
<li>Completing an inventory of personal characteristics and technical skills helps you identify strengths and areas for improvement.</li>
<li>Networking with guest speakers and using your school's placement assistance can help you find the right job.</li>
<li>Barbers can work in barbershops, beauty or unisex salons, hotels, resorts, spas, or as booth renters.</li>
<li>A résumé is a written summary of education and work experience that markets you to potential employers.</li>
<li>Focus résumé content on achievements, not just duties, and include numbers when possible.</li>
<li>Do include complete contact information, action verbs, transferable skills, professional references, and a cover letter.</li>
<li>Do not include salary history, reasons for leaving past jobs, or untrue statements.</li>
<li>An employment portfolio contains photos, documents, awards, references, and a statement about why you chose barbering.</li>
<li>Online portfolios are useful, but always bring a printed copy to interviews.</li>
</ul>
<h3>Important Notes</h3>
<ul>
<li>A résumé has about 20 seconds to make a good impression.</li>
<li>Be honest on your résumé; false information can catch up with you.</li>
<li>Your social media and online presence represent your professional image.</li>
</ul>
<hr>
</section>

<section class="section">
<h2>Arrange for a Job Interview</h2>
<p><strong>Textbook Pages:</strong> 720–730</p>
<h3>What You Need to Know</h3>
<p>After you have graduated and completed the first two steps in the process of securing employment—targeting and observing barbershops—you are ready to pursue employment in earnest. The next step is to contact the establishments that you are most interested in by sending them a résumé and requesting an interview. Choosing a barbershop that is the best match to your skills will increase your chances of success.</p>
<p><strong>LO 3</strong> Know how to explore the job market, research potential employers, and operate within the legal aspects of employment.</p>
<h4>Targeting the Establishment</h4>
<p>One of the most important steps in the process of job hunting is narrowing your search. Listed here are some points to keep in mind when targeting potential employers.</p>
<ul>
<li>Accept that your first job will probably not be your dream job. Few people are so fortunate.</li>
<li>Do not wait until graduation to begin your search. If you do, you may be tempted to take the first offer you receive instead of carefully investigating all possibilities before making a decision.</li>
<li>Locate a barbershop that serves the type of clients you wish to serve. Finding a good fit with the clients and staff is critical from the outset of your career (Figure 19-7).</li>
<li>Make a list of your area barbershops. The Internet will be your best source for this. If you are considering relocating to another area, go to anywho.com for a complete listing of businesses in every state, or find top barbershops in any region or city at citysearch.com. You may also want to do a Google search for your area of interest and city, using key words such as <em>barbershop Austin</em>.</li>
<li>Watch for barbershops that advertise locally, to get a feel for the market each barbershop is targeting. Then check the barbershop's website or see if it is part of a social network, such as Facebook.</li>
<li>Check out websites and social networking sites for various types of barbershops. If you contact them, do not waste their time. Get right to the point that you are a student, and ask specific questions about the profession.</li>
<li>Keep the barbershop's culture in mind. Do the barbers dress like you? Are the clients in different age groups or just one? Look for the barbershop that will be best for you and your goals.</li>
</ul>
<p><strong>Figure 19-7</strong> What type of shop do you see yourself working in?</p>
<h4>Field Research</h4>
<p>A great way to find out about potential jobs is to network. Actually get out there; visit barbershops; and talk to shop owners, managers, educators, and barbers. Whether your first contact is online, in person, or on the phone, sooner or later you will want to arrange a face-to-face meeting or an exploratory visit to the barbershop. To set up a shop visit, consider the following:</p>
<ul>
<li>If you call, use your best telephone manner; speak with confidence and self-assurance. If you e-mail, be brief, and check spelling and punctuation. Do not text message barbershop owners or managers, unless they request that you do so.</li>
<li>Explain that you are preparing to graduate from school in barbering, that you are researching the market for potential positions, and that you have a few quick questions.</li>
<li>If the person is receptive, ask whether the barbershop is in need of any new barbers, and how many the barbershop currently employs.</li>
<li>Ask if you can make an appointment to visit the barbershop to observe sometime during the next few weeks. If the shop representative is agreeable, be on time! When timing allows, confirm the appointment the day before, via e-mail.</li>
</ul>
<p>Remember that a rejection is not a negative reflection on you. Many professionals are too busy to make time for this kind of networking. The good news is that you are bound to discover many genuinely kind people who remember what it was like when they started out and who are willing to devote a bit of their time to help others who are beginning their careers.</p>
<p><strong>Web Resources:</strong> To start looking for a barbering job, begin at these websites:</p>
<p><strong>Industry-specific:</strong></p>
<ul>
<li>barber-license.com</li>
</ul>
<p><strong>General:</strong></p>
<ul>
<li>careerbuilder.com</li>
<li>resumedge.com</li>
<li>craigslist.org</li>
<li>jobbank.com</li>
<li>jobs.net</li>
<li>monster.com</li>
<li>snagajob.com</li>
</ul>
<h4>The Barbershop Visit</h4>
<p>When you visit the barbershop, take along a checklist to ensure that you observe all the key areas that might ultimately affect your decision making. The checklist will be similar to the one used for field trips that you probably have taken to area barbershops while in school. Keep the checklist on file for future reference so that you can make informed comparisons among establishments (Figure 19-8).</p>
<p><strong>Figure 19-8</strong> Barbershop visit checklist.</p>
<p><strong>BARBERSHOP VISIT CHECKLIST</strong></p>
<p>When you visit a barbershop, observe the following areas and rate them from 1 to 5, with 5 considered being the best.</p>
<p><strong>BARBERSHOP IMAGE:</strong> Is the barbershop's image consistent and appropriate for your interests? Is the image pleasing and inviting? What is the decor and arrangement? If you are not comfortable or if you find it unattractive, mark the barbershop off your list of employment possibilities.</p>
<p><strong>PROFESSIONALISM:</strong> Do the employees present the appropriate professional appearance and behavior? Do they give their clients the appropriate levels of attention and personal service, or do they act as if work is their time to socialize?</p>
<p><strong>MANAGEMENT:</strong> Does the barbershop show signs of being well managed? Is the phone answered promptly with professional telephone skills? Is the mood of the barbershop positive? Does everyone appear to work as a team?</p>
<p><strong>CLIENT SERVICE:</strong> Are clients greeted promptly and warmly when they enter the barbershop? Are they kept informed of the status of their appointment? Are they offered a magazine or beverage while they wait? Is there a comfortable reception area?</p>
<p><strong>PRICES:</strong> Compare price for value. Are clients getting their money's worth? Do they pay the same price in one barbershop but get better service and attention in another? If possible, take home barbershop brochures and price lists.</p>
<p><strong>RETAIL:</strong> Is there a well-stocked retail display offering clients a variety of product lines and a range of prices? Do the barbers and receptionist (if applicable) promote retail sales?</p>
<p><strong>IN-SHOP MARKETING:</strong> Are there posters or promotions throughout the barbershop? If so, are they professionally made, and do they reflect contemporary styles?</p>
<p><strong>SERVICES:</strong> Make a list of all services offered by each barbershop and the product lines they carry. This will help you decide what earning potential the barbers have in each barbershop.</p>
<p>BARBERSHOP NAME: <em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em>__</p>
<p>BARBERSHOP MANAGER: <em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em>__</p>
<p>After your visit, always remember to follow up with a handwritten note or e-mail, thanking the barbershop representative for his time. Do this even if you did not like the barbershop and would never consider working there.</p>
<p>Never burn your bridges. Instead, build a network of contacts who have a favorable opinion of you.</p>
<p><strong>Figure 19-9</strong> Sample thank-you note.</p>
<hr>
<p>Dear Ms. (or Mr.) <em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em>__</p>
<p>I appreciate having had the opportunity to observe your barbershop in operation last Friday. Thank you for the time you and your staff gave me. I was impressed by the efficient and courteous manner in which your barbers served their clients. The atmosphere was pleasant, and the mood was positive. Should you ever have an opening for a professional with my skills and training, I would welcome the opportunity to apply. You can contact me at the e-mail address and phone number listed below. I hope we will meet again soon.</p>
<p>Sincerely,</p>
<p>(your name, address, telephone, e-mail address)</p>
<hr>
<p><strong>Figure 19-10</strong> Sample thank-you note to a barbershop where you do not expect to seek employment.</p>
<hr>
<p>Dear Ms. (or Mr.) <em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em>__</p>
<p>I appreciate having had the opportunity to observe your barbershop in operation last Friday. I know how busy you and all your staff are, and I want to thank you for the time that you gave me. I hope my presence didn't interfere with the flow of your operations too much. I certainly appreciate the courtesies that were extended to me by you and your staff. I wish you and your barbershop continued success.</p>
<p>Sincerely,</p>
<p>(your name)</p>
<hr>
<p>Many barbershops have websites with special employment areas; others post position openings on barbering- or job-related websites. Follow instructions exactly for filling out forms or sending résumés (some barbershops do not want attachments, such as letters of recommendation or digital portfolios sent with the résumés). In rare instances, you may need to send a résumé and cover letter by traditional snail mail (Figure 19-11). Comply with the barbershop's guidelines.</p>
<p><strong>Figure 19-11</strong> Sample cover letter.</p>
<hr>
<p>Your Name Your Address Your Phone Number</p>
<p>Ms. (or Mr.) <em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em>__ Barbershop Name Barbershop Address</p>
<p>Dear Ms. (or Mr.) <em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em><em>_</em>__</p>
<p>We met in August when you allowed me to observe your barbershop and staff while I was still in training. Since that time, I have graduated and have received my license. I have enclosed my résumé for your review and consideration.</p>
<p>I would appreciate the opportunity to meet with you and discuss either current or future career opportunities at your barbershop. I was extremely impressed with your staff and business, and I would like to share with you how my skills and training might add to your barbershop success.</p>
<p>I look forward to meeting with you again soon.</p>
<p>Sincerely,</p>
<p>(your name)</p>
<hr>
<p>Mark your calendar to remind yourself to make a follow-up contact. A week after submitting your résumé is generally sufficient. When you call or e-mail, try to schedule an interview appointment. Keep in mind that some barbershops may not have openings and may not be granting interviews. When this is the case, send a résumé, if you have not already, and ask the barbershop to keep it on file should an opening arise in the future. Be sure to thank your contacts for their time and consideration.</p>
<h4>Interview Preparation</h4>
<p>When preparing for an interview, make sure that you have all the necessary information and materials in place, including the following items.</p>
<h5>Identification</h5>
<ul>
<li>Social Security number</li>
<li>Driver's license number</li>
<li>Names, mailing addresses, e-mail addresses, and phone numbers of former employers</li>
<li>Name, phone number, and e-mail address of the nearest relative not living with you</li>
</ul>
<h5>Interview Wardrobe</h5>
<p>Your appearance is crucial, especially since you are applying for a position in the barbering industry. It is recommended that you obtain one or two interview outfits. You may be requested to return for a second interview, hence the need for the second outfit. Consider the following points:</p>
<ul>
<li>Is the outfit appropriate for the position?</li>
<li>Is it both fashionable and flattering, and similar to what the barbershop's current barbers wear? (If you have not visited the barbershop, walk by or check out its website to gauge its style culture so that you can dress accordingly.)</li>
<li>Are your accessories both fashionable and functional (e.g., not noisy or so large that they would interfere with performing services)?</li>
<li>Are your nails well groomed?</li>
<li>Is your hairstyle current? Does it flatter your face and your overall style?</li>
<li>Is your makeup current? Does it flatter your face and your overall style?</li>
<li>Are you clean shaven? If not, is your beard properly trimmed?</li>
<li>Is your perfume or cologne subtle (or nonexistent)?</li>
<li>Are you carrying either a handbag or a briefcase, but not both?</li>
</ul>
<p><strong>Here's a Tip:</strong> When you contact a barbershop to make an appointment for an interview, you may be told that they are not currently hiring but would be happy to conduct an interview for future reference. Never think that this would be a waste of time. Take advantage of the opportunity. Not only will it give you valuable interview experience, but it may also provide opportunities that you would otherwise miss.</p>
<h5>Supporting Materials</h5>
<ul>
<li><strong>Résumé.</strong> Even if you have already sent a résumé, take another copy with you.</li>
<li><strong>Facts and figures.</strong> Have ready a list of names and dates of former employment, education, and references.</li>
<li><strong>Employment portfolio.</strong> Even if you have just two photos in your portfolio and they are pictures of haircuts you did for friends, bring them along.</li>
</ul>
<h4>Review and Prepare for Anticipated Interview Questions</h4>
<p>Certain questions are typically asked during an interview. Being familiar with these questions allows you to reflect on your answers ahead of time. You might even consider role-playing an interview situation with friends, family, or fellow students. Typical questions include the following:</p>
<ul>
<li>Why do you want to work here?</li>
<li>What did you like best about your training?</li>
<li>Are you punctual and regular in attendance?</li>
<li>Will your school director or instructor confirm this?</li>
<li>What skills do you feel are your strongest?</li>
<li>In what areas do you consider yourself to be less strong?</li>
<li>Are you a team player? Please explain.</li>
<li>Do you consider yourself flexible? Please explain.</li>
<li>What are your career goals?</li>
<li>What days and hours are you available for work?</li>
<li>Are there any obstacles that would prevent you from keeping your commitment to full-time employment? Please explain.</li>
<li>What assets do you believe that you would bring to this barbershop and this position?</li>
<li>What computer skills do you have?</li>
<li>How would you handle a problem client?</li>
<li>How do you feel about retailing?</li>
<li>Would you be willing to attend our company's training programs?</li>
<li>Would you please describe ways that you provide excellent customer service?</li>
<li>What consultation questions might you ask a client?</li>
<li>Are you prepared to train for a year before you have your own clients?</li>
</ul>
<h4>Be Prepared to Perform a Service</h4>
<p>Some barbershops require applicants to perform a service in their chosen discipline as part of the interview, and many of these barbershops require that you bring your own model. Be sure to confirm whether this is a requirement. If so, make sure that your model is appropriately dressed and properly prepared for the experience and that you bring the necessary supplies, products, and tools to demonstrate your skills.</p>
<h4>The Interview</h4>
<p>On the day of the interview, try to make sure that nothing occurs that will keep you from completing the interview successfully. You should practice the following behaviors in connection with the interview itself:</p>
<ul>
<li>Always be on time; no, better yet, early! If you are unsure of the location, find it the day before, so there will be no reason for delays.</li>
<li>Turn off your cell phone! Do not arrive with earbuds or a hands-free cell phone device in your ear.</li>
<li>Project a warm, friendly smile. Smiling is the universal language.</li>
<li>Walk, sit, and stand with good posture.</li>
<li>Be polite and courteous.</li>
<li>Do not sit until you are asked to do so or until it is obvious that you are expected to do so.</li>
<li>Never smoke or chew gum, even if one or the other is offered to you.</li>
<li>Do not come to an interview with a cup of coffee, a soft drink, snacks, or anything else to eat or drink.</li>
<li>Never lean on or touch the interviewer's desk. Some people do not like their personal space broached without an invitation.</li>
<li>Try to project a positive first impression by appearing as confident and relaxed as you can be.</li>
<li>Speak clearly. The interviewer must be able to hear and understand you.</li>
<li>Answer questions honestly. Think about the question and answer carefully. Do not speak before you are ready, and not for more than 2 minutes at a time.</li>
<li>Never criticize former employers.</li>
<li>Always remember to thank the interviewer at the end of the interview.</li>
</ul>
<p><strong>Did You Know?</strong> If you are not able to afford the best or trendiest accessories to project a polished and professional image when going out into the workplace, think again! Several nonprofit organizations have been formed to address this need. These organizations receive donations of clean clothing in good repair from individuals and manufacturers. The items are then passed along to people who need them. For more information, visit Wardrobe for Opportunity at wardrobe.org and Dress for Success at dressforsuccess.org.</p>
<p>Another critical part of the interview comes when you are invited to ask the interviewer questions of your own. You should think about those questions ahead of time and bring a list if necessary. Doing so will show that you are organized and prepared. Some questions that you might consider include the following:</p>
<ul>
<li>What are you looking for in a barber?</li>
<li>Is there a job description? May I review it?</li>
<li>Is there a shop manual? May I review it?</li>
<li>How does the barbershop promote itself?</li>
<li>How long do barbers typically work here?</li>
<li>Are employees encouraged to grow in skills and responsibility? How so?</li>
<li>Does the barbershop offer continuing education opportunities?</li>
<li>What does your training program involve?</li>
<li>Is there room for advancement? If so, what are the requirements for promotion?</li>
<li>What key benefits does the barbershop offer, such as advanced training and medical insurance?</li>
<li>What outside and community activities is the barbershop involved in?</li>
<li>What is the form of compensation?</li>
<li>When will the position be filled?</li>
<li>May I contact you in a week regarding your decision?</li>
<li>May I have a tour of the barbershop?</li>
</ul>
<p>Do not feel that you have to ask all of your questions. The point is to create as much of a dialogue as possible. Be aware of the interviewer's reactions and make note of when you have asked enough questions. By obtaining the answers to at least some of your questions, you can compare the information you have gathered about other barbershops and choose the one that offers the best package of income and career development.</p>
<p>Remember to follow up the interview with a thank-you note or e-mail. It should simply thank the interviewer for the time she spent with you.</p>
<p><strong>Activity:</strong> Find a partner among your fellow students and role-play the employment interview. Each of you can take turns as the applicant and the employer. After each session, conduct a brief discussion regarding how it went; that is, what worked and what did not work. Discuss how your performance could be improved. Bear in mind that a role-playing activity will never predict exactly what will occur in a real interview. However, the process will help prepare you for the interview and boost your confidence.</p>
<p>Close with a positive statement that you want the job (if you do). If the interviewer's decision comes down to two or three possibilities, the one expressing the most desire may be offered the position. Also, if the interviewer suggests that you call to learn about the employment decision, then by all means do so.</p>
<h4>Legal Aspects of the Employment Interview</h4>
<p>Over the years, a number of legal issues have arisen about questions that may or may not be included in an employment application or interview, including ones that involve race/ethnicity, religion, and national origin; marital status; sexual orientation; and if you have children. Generally, there should be no questions in any of these categories. Additional categories of appropriate and inappropriate questions are listed here.</p>
<ul>
<li><strong>Age or date of birth.</strong> It is permissible to ask the age if the applicant is younger than 18. Otherwise, age should not be relevant in most hiring decisions; therefore, date-of-birth questions prior to employment are improper.</li>
<li><strong>Disabilities or physical traits.</strong> The Americans with Disabilities Act prohibits general inquiries about health problems, disabilities, and medical conditions.</li>
<li><strong>Drug use or smoking.</strong> Questions regarding drug or tobacco use are permitted. In fact, the employer may obtain the applicant's agreement to be bound by the employer's drug and smoking policies and to submit to drug testing.</li>
<li><strong>Citizenship.</strong> Employers are not allowed to discriminate because an applicant is not a U.S. citizen. However, employers can request to see a Green Card or work permit.</li>
</ul>
<p><strong>Did You Know?</strong> These are examples of illegal questions as compared to legal questions.</p>
<p><strong>Illegal Questions</strong></p>
<ul>
<li>How old are you?</li>
<li>Please describe your medical history.</li>
<li>Are you a U.S. citizen?</li>
<li>What is your native language?</li>
</ul>
<p><strong>Legal Questions</strong></p>
<ul>
<li>Are you over the age of 18?</li>
<li>Are you physically able to perform this job?</li>
<li>Are you authorized to work in the United States?</li>
<li>In which languages are you fluent?</li>
</ul>
<p>It is important to recognize that not all potential employers understand that they may be asking improper or illegal questions. If you are asked such questions, you might politely respond that you believe the question is irrelevant to the position you are seeking and that you would like to focus on your qualities and skills that are suited to the job and the mission of the establishment.</p>
<h4>Employee Contracts</h4>
<p>Employers can legally require you to sign contracts as a condition of employment. In the barbering business, the most common ones are noncompete and confidentiality agreements. Barbershop owners often invest a great deal in training, and they do not want you taking all that education to a competing barbershop across the street once your apprenticeship or initial training is complete. Noncompete agreements address this issue, prohibiting you from seeking employment within a given time period and geographic area after you leave employment with them. Often, noncompete agreements also forbid employees from gathering and keeping client records, including client phone numbers. A contract cannot interfere with your right to work, and as a result, these contracts must be very specific and are sometimes controversial. If you are presented with any contract, take it home, read it, and make certain you completely understand it. If you do not completely understand any part of it, consult with a labor-law attorney before signing it.</p>
<h4>The Employment Application</h4>
<p>Any time that you are applying for any position, you will be required to complete an application, even if your résumé already contains much of the requested information. Your résumé and the list you have prepared prior to the interview will assist you in completing the application quickly and accurately.</p>
<h4>Doing It Right</h4>
<p>You are ready to set out on your exciting new career as a professional barber. The right way to proceed is by learning important study and test-taking skills early and applying them consistently.</p>
<p>Think ahead to your employment opportunities and use your time in school to develop a record of interesting, noteworthy activities that will make your résumé more exciting. When you compile a history that shows how you have achieved your goals, your confidence will grow.</p>
<ul>
<li>Always take one step at a time. Be sure to take the helpful preliminary steps that we have discussed when preparing for employment.</li>
<li>Develop a dynamic portfolio. Keep your materials, information, and questions organized to ensure a high-impact interview.</li>
</ul>
<p>Once you are employed, take the necessary steps to learn all that you can about your new position and the establishment you will be serving. Read all you can about the industry. Attend trade shows and take advantage of as much continuing education as you can manage. Become an active participant in efforts to make the barbering industry even better.</p>
<p>As you transition into your new career as a barbering professional, let us at Milady continue the journey with you. Be sure to visit the MiladyPro.com website. In addition to helping you prepare for your State Board Exam, MiladyPro.com offers access to materials designed to help you hit the ground running and grow your skill set, assuring long-term success no matter where you may take your career.</p>
<h3>Key Points</h3>
<ul>
<li>Target potential employers by researching barbershops that fit your goals and client preferences.</li>
<li>Network through field research, shop visits, and online resources.</li>
<li>Use a checklist to evaluate barbershops during visits, and follow up with thank-you notes.</li>
<li>Send a résumé and cover letter, follow up after about a week, and schedule interviews.</li>
<li>Prepare identification, wardrobe, supporting materials, and answers to common questions before the interview.</li>
<li>Arrive early, dress professionally, turn off your phone, and follow good etiquette during the interview.</li>
<li>Be ready to ask your own questions and to perform a service if requested.</li>
<li>Know which interview questions are illegal and how to respond politely.</li>
<li>Read any employment contract carefully and consult an attorney if needed.</li>
<li>Complete applications accurately using your résumé and prepared facts.</li>
</ul>
<h3>Important Notes</h3>
<ul>
<li>Do not wait until graduation to begin your job search.</li>
<li>Never burn bridges; always send thank-you notes after shop visits and interviews.</li>
<li>Some interview questions are illegal; handle them professionally without being confrontational.</li>
<li>Take contracts home and seek legal advice before signing.</li>
</ul>
<hr>
</section>

<section class="section">
<h2>Chapter Review and Glossary</h2>
<p><strong>Textbook Pages:</strong> 730–731</p>
<h3>What You Need to Know</h3>
<p>This section lists the chapter review questions and defines the important terms used in this chapter. Use these items to check your understanding and prepare for examinations.</p>
<h4>Review Questions</h4>
<ol>
<li>What are three habits of test-wise students?</li>
<li>What is deductive reasoning?</li>
<li>What are the four most common testing formats?</li>
<li>What basic skills or procedures are usually evaluated during the practical examination?</li>
<li>Where can a barber expect to work?</li>
<li>What is a résumé?</li>
<li>What are the skills mastered at other jobs that can be put to use in a new position?</li>
<li>What items should be included in an employment portfolio?</li>
<li>What are the three things that you should bring to an interview?</li>
<li>What are the three questions that are illegal to be asked when interviewing for a job?</li>
</ol>
<h4>Glossary Terms</h4>
<p><strong>deductive reasoning</strong> (dee-DUK-tiv REE-zun-ing) p. 710 the process of reaching logical conclusions by employing logical reasoning</p>
<p><strong>employment portfolio</strong> (em-PLOY-ment port-FOH-lee-oh) p. 719 a collection, usually bound, of photos and documents that reflect your skills, accomplishments, and abilities in your chosen career field</p>
<p><strong>practical exams</strong> (PRAK-tih-kul ig-ZAMZ) p. 713 hands-on testing on a live model or mannequin</p>
<p><strong>résumé</strong> (REZ-oo-MAY) p. 716 written summary of a person's education and work experience</p>
<p><strong>stem</strong> (STEM) p. 711 the basic question or problem</p>
<p><strong>test-wise</strong> (TEST-wyze) p. 709 understanding the strategies for successful test taking</p>
<p><strong>transferable skills</strong> (trans-FUR-uh-bul SKILZ) p. 716 skills mastered at other jobs that can be put to use in a new position</p>
<p><strong>work ethic</strong> (WURK ETH-ik) p. 716 taking pride in your work and committing yourself to consistently doing a good job for your clients, employer, and barbershop team</p>
</section>
</div>`,
    },
  ],
}
