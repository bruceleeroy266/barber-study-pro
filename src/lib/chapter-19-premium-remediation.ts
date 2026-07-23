/**
 * ASCYN PRO — Chapter 19 Premium Remediation
 * Milady Standard Barbering: Preparing for Licensure and Employment
 *
 * This module exports a strongly typed remediation bank that links missed quiz
 * questions (qq-19-01 through qq-19-15) and learning objectives (LO-1 through LO-3)
 * to targeted flashcards (fc-ch19-001 through fc-ch19-060) and lesson sections.
 */

export interface RemediationReviewStep {
  order: number
  action: string
  resource: string
}

export interface RemediationItem {
  id: string
  concept: string
  commonMistake: string
  correctUnderstanding: string
  whyItMatters: string
  sourceSection: string
  sourcePages: string
  learningObjective: 'LO-1' | 'LO-2' | 'LO-3'
  quizQuestionId?: string
  flashcardIds: string[]
  recommendedReviewPath: RemediationReviewStep[]
  instructorGuidance?: string
}

export const chapter19PremiumRemediation: RemediationItem[] = [
  {
    id: 'CH19-R-LO1',
    concept: 'Licensure is the gateway to employment',
    commonMistake:
      'Some students think they can apply for barber jobs before they are licensed, or that a one-year apprenticeship replaces passing the state exam.',
    correctUnderstanding:
      'You must pass the state written and practical exams, file an application, and pay the licensing fee before you can legally work as a barber.',
    whyItMatters:
      'Shops hire licensed barbers. Working without a license can lead to fines, loss of work, or damage to your career before it starts.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '707–713',
    learningObjective: 'LO-1',
    flashcardIds: [
      'fc-ch19-001',
      'fc-ch19-004',
      'fc-ch19-005',
      'fc-ch19-006',
      'fc-ch19-007',
      'fc-ch19-008',
      'fc-ch19-011',
      'fc-ch19-012',
      'fc-ch19-013',
      'fc-ch19-014',
      'fc-ch19-018',
      'fc-ch19-022',
      'fc-ch19-023',
      'fc-ch19-025',
    ],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Read the Phase 1 lesson section',
        resource: 'Prepare for Licensure (pp. 707–713)',
      },
      {
        order: 2,
        action: 'Study the flashcards on',
        resource: 'exams, test-wise habits, and practical skills',
      },
      {
        order: 3,
        action: 'Practice a full written and practical exam review checklist',
        resource: 'with a peer or mentor',
      },
    ],
    instructorGuidance: 'Coach students to build a study calendar early. Emphasize that state licensure is a legal requirement, not just a formality, and that hands-on practice matters as much as book study.',
  },
  {
    id: 'CH19-R-LO2',
    concept: 'Employment readiness begins before graduation',
    commonMistake:
      'Students often wait until after graduation to think about jobs, list every duty on a résumé, hide non-barber jobs, or bring a weak portfolio.',
    correctUnderstanding:
      'Start your job search early. Use the self-inventory to find strengths and gaps, build a résumé that highlights accomplishments, frame past jobs as transferable skills, and create a strong printed portfolio.',
    whyItMatters:
      'Employers choose confident, prepared applicants. A scattered job search can force you to take the first offer instead of the right shop.',
    sourceSection: 'Prepare for Employment',
    sourcePages: '714–720',
    learningObjective: 'LO-2',
    flashcardIds: [
      'fc-ch19-026',
      'fc-ch19-027',
      'fc-ch19-028',
      'fc-ch19-029',
      'fc-ch19-030',
      'fc-ch19-031',
      'fc-ch19-032',
      'fc-ch19-033',
      'fc-ch19-034',
      'fc-ch19-035',
      'fc-ch19-036',
      'fc-ch19-037',
      'fc-ch19-038',
      'fc-ch19-039',
    ],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Read the Phase 1 lesson section',
        resource: 'Prepare for Employment (pp. 714–720)',
      },
      {
        order: 2,
        action: 'Study the flashcards on',
        resource: 'the inventory, résumé, transferable skills, and portfolio',
      },
      {
        order: 3,
        action: 'Draft a one-page résumé and collect three portfolio samples',
        resource: 'in class or during a lab session',
      },
    ],
    instructorGuidance: 'Have students complete the Inventory of Personal Characteristics and Technical Skills in class. Then pair them to review each other\'s résumés and portfolios for clear accomplishments and relevant evidence.',
  },
  {
    id: 'CH19-R-LO3',
    concept: 'Professional interviews require preparation, etiquette, and legal awareness',
    commonMistake:
      'Students may arrive late, dress too casually, leave their phone on, skip the thank-you note, or answer illegal questions without knowing their rights.',
    correctUnderstanding:
      'Research the shop, bring a résumé and portfolio, dress professionally, arrive early, turn off your phone, ask thoughtful questions, follow up, and handle illegal questions calmly. Read contracts before signing.',
    whyItMatters:
      'A strong interview shows you are trustworthy and serious. Poor etiquette or signing a bad contract can cost you the job or limit your future work.',
    sourceSection: 'Arrange for a Job Interview',
    sourcePages: '720–730',
    learningObjective: 'LO-3',
    flashcardIds: [
      'fc-ch19-040',
      'fc-ch19-041',
      'fc-ch19-042',
      'fc-ch19-043',
      'fc-ch19-044',
      'fc-ch19-045',
      'fc-ch19-046',
      'fc-ch19-047',
      'fc-ch19-048',
      'fc-ch19-049',
      'fc-ch19-050',
      'fc-ch19-051',
      'fc-ch19-052',
      'fc-ch19-053',
      'fc-ch19-054',
      'fc-ch19-055',
      'fc-ch19-056',
      'fc-ch19-057',
      'fc-ch19-058',
      'fc-ch19-059',
      'fc-ch19-060',
    ],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Read the Phase 1 lesson section',
        resource: 'Arrange for a Job Interview (pp. 720–730)',
      },
      {
        order: 2,
        action: 'Study the flashcards on',
        resource: 'networking, interview materials, etiquette, legal questions, and contracts',
      },
      {
        order: 3,
        action: 'Role-play an interview with a classmate and practice asking your own questions',
        resource: 'using the provided interview question lists',
      },
    ],
    instructorGuidance: 'Run mock interviews in class. Give feedback on body language, answers, and questions. Teach students to redirect illegal questions politely and to take contracts home for review.',
  },
  {
    id: 'CH19-R-qq-19-01',
    concept: 'Passing the state licensing exam is the first milestone before being hired',
    commonMistake:
      'Thinking an apprenticeship, a large online portfolio, or many applications can come before licensure.',
    correctUnderstanding:
      'You must pass the required written and practical exams and receive your barber license before you can legally be hired.',
    whyItMatters:
      'Shops cannot hire unlicensed barbers. Starting the job search before you are licensed wastes time and may break state rules.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '707–708',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-01',
    flashcardIds: ['fc-ch19-001', 'fc-ch19-004', 'fc-ch19-005'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson introduction on',
        resource: 'licensure as the gateway to work (pp. 707–708)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-001, fc-ch19-004, and fc-ch19-005' },
      { order: 3, action: 'Re-take missed question', resource: 'qq-19-01' },
    ],
    instructorGuidance: 'Ask the student to explain the difference between a license and a certificate. Have them list the exact steps their state requires before sitting for the exam.',

  },
  {
    id: 'CH19-R-qq-19-02',
    concept: 'Being test-wise means using smart exam strategies',
    commonMistake:
      'Believing that being test-wise means memorizing every glossary word, finishing first, or guessing by intuition.',
    correctUnderstanding:
      'Test-wise students know how to read questions carefully, manage time, eliminate wrong answers, and use reasoning skills.',
    whyItMatters:
      'Good test strategies help you show what you know, but they only work when paired with real understanding of the material.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '709',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-02',
    flashcardIds: ['fc-ch19-006'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'test-wise study habits (p. 709)',
      },
      { order: 2, action: 'Study flashcard', resource: 'fc-ch19-006' },
      { order: 3, action: 'Practice three test-taking strategies', resource: 'on a sample exam' },
    ],
    instructorGuidance: 'Walk through one sample question together using the process of elimination. Praise the student when they catch qualifier words like \'not\' or \'except.\'',

  },
  {
    id: 'CH19-R-qq-19-03',
    concept: 'Knowing the material matters most on a licensing exam',
    commonMistake:
      'Thinking your outfit, the number of other test takers, or arrival time has the biggest effect on your score.',
    correctUnderstanding:
      'Strong test strategies help, but mastering the course content is the single most important factor in passing.',
    whyItMatters:
      'Tricks cannot replace knowledge. A well-prepared student can answer questions even when the wording is unfamiliar.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '709',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-03',
    flashcardIds: ['fc-ch19-007', 'fc-ch19-008'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'written exam preparation (p. 709)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-007 and fc-ch19-008' },
      {
        order: 3,
        action: 'Make a study schedule',
        resource: 'that spreads review over several days',
      },
    ],
    instructorGuidance: 'Help the student build a spaced study plan. Remind them that tricks help only after the content is memorized.',

  },
  {
    id: 'CH19-R-qq-19-04',
    concept: 'Scan the whole test and plan your time before answering',
    commonMistake:
      'Starting with the hardest questions, asking the proctor to explain every item, or guessing quickly without reading directions.',
    correctUnderstanding:
      'Read the directions, look through the entire test, and budget your time before you begin answering.',
    whyItMatters:
      'A quick scan shows easy questions, hard questions, and how much time you have. This helps you avoid running out of time.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '710',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-04',
    flashcardIds: ['fc-ch19-011', 'fc-ch19-018'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'test-day strategies (p. 710)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-011 and fc-ch19-018' },
      {
        order: 3,
        action: 'Practice scanning a practice test',
        resource: 'and marking easy and hard items',
      },
    ],
    instructorGuidance: 'Give the student a timed practice test and have them skim it first. Review how they budgeted their time.',

  },
  {
    id: 'CH19-R-qq-19-05',
    concept: 'Two identical answer choices can both be eliminated',
    commonMistake:
      'Thinking that if two choices say the same thing, both must be correct, or skipping the question as a trick.',
    correctUnderstanding:
      'If two choices are identical, they cannot both be the single best answer. Cross them out and choose from what remains.',
    whyItMatters:
      'Eliminating duplicate choices narrows your options and raises your chance of picking the right answer.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '710–711',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-05',
    flashcardIds: ['fc-ch19-012', 'fc-ch19-013'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'deductive reasoning (pp. 710–711)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-012 and fc-ch19-013' },
      {
        order: 3,
        action: 'Try five multiple-choice questions',
        resource: 'using the elimination method',
      },
    ],
    instructorGuidance: 'Show two identical answer choices side by side and ask why both cannot be correct. Then practice elimination on three new items.',

  },
  {
    id: 'CH19-R-qq-19-06',
    concept: 'Absolute words in true/false questions are usually false',
    commonMistake:
      'Choosing true because strong words like "always," "never," "all," or "none" sound confident and certain.',
    correctUnderstanding:
      'Words like always, never, all, and none are rarely accurate in real-world barbering. Treat them as warning flags.',
    whyItMatters:
      'Most barbering rules have exceptions. Recognizing absolutes helps you avoid falling for false statements.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '711',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-06',
    flashcardIds: ['fc-ch19-014'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'true/false test tips (p. 711)',
      },
      { order: 2, action: 'Study flashcard', resource: 'fc-ch19-014' },
      {
        order: 3,
        action: 'Practice spotting absolutes',
        resource: 'in ten true/false statements',
      },
    ],
    instructorGuidance: 'Create a quick true/false drill using \'always,\' \'never,\' \'all,\' and \'none.\' Celebrate when the student flags absolutes before answering.',

  },
  {
    id: 'CH19-R-qq-19-07',
    concept: 'Practical exams test hands-on barber skills',
    commonMistake:
      'Thinking practical exams test business, marketing, or law skills instead of hands-on services.',
    correctUnderstanding:
      'Practical exams usually test haircutting, shaving, shampooing, infection control, and related hands-on skills on a model or mannequin.',
    whyItMatters:
      'You need to prove you can perform services safely and correctly. Knowing laws and marketing will not replace showing real technique.',
    sourceSection: 'Prepare for Licensure',
    sourcePages: '713',
    learningObjective: 'LO-1',
    quizQuestionId: 'qq-19-07',
    flashcardIds: ['fc-ch19-022', 'fc-ch19-023', 'fc-ch19-025'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'practical examinations (p. 713)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-022, fc-ch19-023, and fc-ch19-025' },
      {
        order: 3,
        action: 'Practice each practical skill',
        resource: 'on a mannequin while timing yourself',
      },
    ],
    instructorGuidance: 'Observe the student performing one core service and give one specific correction. Repeat until the routine feels automatic.',

  },
  {
    id: 'CH19-R-qq-19-08',
    concept: 'A self-inventory helps you find strengths and gaps before job hunting',
    commonMistake:
      'Thinking the inventory is a state board requirement, a salary guide, or a replacement for a portfolio.',
    correctUnderstanding:
      'The Inventory of Personal Characteristics and Technical Skills is a self-check that shows what you do well and what still needs practice.',
    whyItMatters:
      'Knowing your strengths and gaps helps you focus your training and talk confidently with employers about where you are growing.',
    sourceSection: 'Prepare for Employment',
    sourcePages: '714',
    learningObjective: 'LO-2',
    quizQuestionId: 'qq-19-08',
    flashcardIds: ['fc-ch19-026', 'fc-ch19-028'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'the self-inventory (p. 714)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-026 and fc-ch19-028' },
      {
        order: 3,
        action: 'Complete your own inventory',
        resource: 'and pick one skill to improve this week',
      },
    ],
    instructorGuidance: 'Have the student read their inventory out loud. Pick one strength to feature on their résumé and one gap to practice this week.',

  },
  {
    id: 'CH19-R-qq-19-09',
    concept: 'A résumé is a written summary of education and work experience',
    commonMistake:
      'Confusing a résumé with a bound portfolio, a job contract, or a complete list of every job ever held.',
    correctUnderstanding:
      'A résumé is a short, typed summary of your education, skills, and relevant work experience that markets you to employers.',
    whyItMatters:
      'Employers scan résumés quickly. A clear summary helps them see why you fit the position in about 20 seconds.',
    sourceSection: 'Prepare for Employment',
    sourcePages: '716',
    learningObjective: 'LO-2',
    quizQuestionId: 'qq-19-09',
    flashcardIds: ['fc-ch19-031', 'fc-ch19-035'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'résumés (p. 716)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-031 and fc-ch19-035' },
      {
        order: 3,
        action: 'List your education, skills, and two work experiences',
        resource: 'for a draft résumé',
      },
    ],
    instructorGuidance: 'Ask the student to bring a draft résumé to review. Check that contact information, education, and skills are easy to find in 20 seconds.',

  },
  {
    id: 'CH19-R-qq-19-10',
    concept: 'Résumés should highlight accomplishments with numbers',
    commonMistake:
      'Listing salary history, every daily duty, or using fancy fonts and colors instead of showing results.',
    correctUnderstanding:
      'Emphasize accomplishments, especially when you can add numbers or percentages, so employers see the impact you made.',
    whyItMatters:
      "Employers want proof of results. 'Increased client retention by 20%' is stronger than 'talked to clients every day.'",
    sourceSection: 'Prepare for Employment',
    sourcePages: '716–717',
    learningObjective: 'LO-2',
    quizQuestionId: 'qq-19-10',
    flashcardIds: ['fc-ch19-032', 'fc-ch19-033', 'fc-ch19-036'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'résumé content (pp. 716–717)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-032, fc-ch19-033, and fc-ch19-036' },
      {
        order: 3,
        action: 'Rewrite one past job duty',
        resource: 'as a numbered accomplishment',
      },
    ],
    instructorGuidance: 'Have the student rewrite one past duty as a number-based accomplishment. For example, change \'served customers\' to \'served 40+ customers per shift.\'',

  },
  {
    id: 'CH19-R-qq-19-11',
    concept: 'Past jobs can show transferable skills for barbering',
    commonMistake: 'Hiding non-barber jobs because they do not seem related to cutting hair.',
    correctUnderstanding:
      'Skills from other jobs, such as customer service, communication, and teamwork, can strengthen a barbering résumé when they connect to serving clients.',
    whyItMatters:
      'Employers value people skills. Serving experience, retail sales, or teamwork can show you are ready to work with clients and coworkers.',
    sourceSection: 'Prepare for Employment',
    sourcePages: '716',
    learningObjective: 'LO-2',
    quizQuestionId: 'qq-19-11',
    flashcardIds: ['fc-ch19-034'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'transferable skills (p. 716)',
      },
      { order: 2, action: 'Study flashcard', resource: 'fc-ch19-034' },
      {
        order: 3,
        action: 'List three skills from a past job',
        resource: 'that would help in a barbershop',
      },
    ],
    instructorGuidance: 'Ask the student to name three skills from a non-barber job that help in a shop. Connect each skill to a real client-service moment.',

  },
  {
    id: 'CH19-R-qq-19-12',
    concept: 'A strong portfolio shows proof of your skills',
    commonMistake:
      'Including personal items like favorite shows, old menus, or passwords instead of work samples.',
    correctUnderstanding:
      'A portfolio should include before-and-after photos, awards, certificates, reference letters, your résumé, and a short career statement.',
    whyItMatters:
      'Photos and documents prove what you can do. A weak portfolio makes an employer doubt your experience.',
    sourceSection: 'Prepare for Employment',
    sourcePages: '719–720',
    learningObjective: 'LO-2',
    quizQuestionId: 'qq-19-12',
    flashcardIds: ['fc-ch19-037', 'fc-ch19-038', 'fc-ch19-039'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'employment portfolios (pp. 719–720)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-037, fc-ch19-038, and fc-ch19-039' },
      {
        order: 3,
        action: 'Collect or take three before-and-after photos',
        resource: 'for your portfolio',
      },
    ],
    instructorGuidance: 'Review the student\'s portfolio for clear before-and-after photos. Suggest adding one reference letter or award if available.',

  },
  {
    id: 'CH19-R-qq-19-13',
    concept: 'After a shop visit, send a tailored résumé and cover letter',
    commonMistake:
      'Posting a public review to get noticed, waiting a month to seem relaxed, or asking to skip the interview.',
    correctUnderstanding:
      'After researching a shop and visiting, send a résumé with a cover letter that mentions your visit and why you want to work there.',
    whyItMatters:
      'A tailored cover letter shows you paid attention and are serious. Following up after about a week keeps your name in front of the employer.',
    sourceSection: 'Arrange for a Job Interview',
    sourcePages: '720–722',
    learningObjective: 'LO-3',
    quizQuestionId: 'qq-19-13',
    flashcardIds: ['fc-ch19-041', 'fc-ch19-042', 'fc-ch19-043'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'employer research and networking (pp. 720–722)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-041, fc-ch19-042, and fc-ch19-043' },
      {
        order: 3,
        action: 'Write a sample cover letter',
        resource: 'for a shop you have researched',
      },
    ],
    instructorGuidance: 'Have the student write a cover letter for a real shop they researched. Give feedback on how specifically they mention the visit.',

  },
  {
    id: 'CH19-R-qq-19-14',
    concept: 'Professional image and etiquette affect interview success',
    commonMistake:
      'Chewing gum, keeping the phone on, dressing casually, bringing food, or criticizing a former employer.',
    correctUnderstanding:
      'Arrive early, dress appropriately for the shop, turn off your phone, and send a thank-you note after the interview.',
    whyItMatters:
      'First impressions start before you speak. Polished behavior and follow-up show respect and professionalism.',
    sourceSection: 'Arrange for a Job Interview',
    sourcePages: '724, 726, 727',
    learningObjective: 'LO-3',
    quizQuestionId: 'qq-19-14',
    flashcardIds: ['fc-ch19-045', 'fc-ch19-051', 'fc-ch19-052', 'fc-ch19-054'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topics on',
        resource: 'interview wardrobe, etiquette, and follow-up (pp. 724, 726, 727)',
      },
      {
        order: 2,
        action: 'Study flashcards',
        resource: 'fc-ch19-045, fc-ch19-051, fc-ch19-052, and fc-ch19-054',
      },
      {
        order: 3,
        action: 'Do a mock interview',
        resource: 'and ask for feedback on appearance and manners',
      },
    ],
    instructorGuidance: 'Role-play a full interview, then ask what they would do differently. Focus on punctuality, phone use, and the thank-you note.',

  },
  {
    id: 'CH19-R-qq-19-15',
    concept: 'Some interview questions are illegal because they can lead to discrimination',
    commonMistake:
      'Thinking age is never relevant, that barbers cannot know their own age, or that the question only needs to wait until after hiring.',
    correctUnderstanding:
      'Questions about age, medical history, citizenship, and similar topics are usually improper because they can support illegal discrimination. Respond politely without being confrontational.',
    whyItMatters:
      'You have the right to fair hiring. Handling illegal questions professionally protects you and keeps the interview on track.',
    sourceSection: 'Arrange for a Job Interview',
    sourcePages: '728–730',
    learningObjective: 'LO-3',
    quizQuestionId: 'qq-19-15',
    flashcardIds: ['fc-ch19-056', 'fc-ch19-057', 'fc-ch19-060'],
    recommendedReviewPath: [
      {
        order: 1,
        action: 'Review the lesson topic on',
        resource: 'legal aspects of interviews and contracts (pp. 728–730)',
      },
      { order: 2, action: 'Study flashcards', resource: 'fc-ch19-056, fc-ch19-057, and fc-ch19-060' },
      {
        order: 3,
        action: 'Practice two polite responses',
        resource: 'to illegal interview questions',
      },
    ],
    instructorGuidance: 'Practice two calm, professional responses to illegal questions. Remind the student to stay polite while protecting their rights.',

  },
]

export function getRemediationForQuizQuestion(
  questionId: string
): RemediationItem | undefined {
  return chapter19PremiumRemediation.find((item) => item.quizQuestionId === questionId)
}

export function getRemediationForLearningObjective(
  objective: RemediationItem['learningObjective']
): RemediationItem[] {
  return chapter19PremiumRemediation.filter((item) => item.learningObjective === objective)
}

export default chapter19PremiumRemediation
