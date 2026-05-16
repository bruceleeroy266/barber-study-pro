// Content Migration Utility
// Extracts and structures content from HTML Barber Study Pro for Next.js version

export interface ChapterContent {
  chapterNumber: number
  title: string
  description: string
  content: string
  keyPoints: string[]
  sections: {
    title: string
    content: string
  }[]
}

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizQuestionData {
  chapterNumber: number
  question: string
  answerA: string
  answerB: string
  answerC: string
  answerD: string
  correctAnswer: 'a' | 'b' | 'c' | 'd'
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Chapter 1: History of Barbering
export const chapter1Content: ChapterContent = {
  chapterNumber: 1,
  title: "History of Barbering",
  description: "From Ancient Rituals to Modern Mastery",
  content: ``,
  keyPoints: [
    "Barbering is one of humanity's oldest professions, dating back over 5,000 years",
    "The word 'barber' comes from the Latin word 'barba' meaning beard",
    "Ancient Egyptian barbers used sharpened stone or bronze razors",
    "The barber pole originated from bloodletting services - red and white stripes represent bloody and clean bandages",
    "In medieval times, barbers were also surgeons and dentists (barber-surgeons)",
    "Barbers and surgeons separated into different professions in 1745 in England",
    "Minnesota was the first US state to require barber licensing in 1897",
    "The first barber organization in America was The Barber Company of Philadelphia (1758)"
  ],
  sections: [
    {
      title: "Why Study Barbering History?",
      content: "History reveals how techniques, tools, and styles have transformed over millennia. Knowing you're part of one of humanity's oldest professions connects you to centuries of craftsmen. Understanding why regulations exist helps you appreciate professional standards."
    },
    {
      title: "Ancient Origins",
      content: "The roots of barbering stretch back to the dawn of civilization. Egyptian tombs from around 3500 BC show barbers at work. The practice was essential for hygiene, religious ritual, and social status."
    },
    {
      title: "The Barber-Surgeon Era",
      content: "For centuries, barbers performed bloodletting, tooth extraction, wound treatment, and minor surgery. The barber's pole originated from this medical practice - patients would grip a pole during bloodletting."
    },
    {
      title: "Modern Professional Barbering",
      content: "The 19th and 20th centuries saw barbering evolve into a licensed profession with standardized training, sanitation requirements, and professional organizations."
    }
  ]
}

// Flashcards for Chapter 1
export const chapter1Flashcards: FlashcardData[] = [
  { chapterNumber: 1, front: "Where does the word 'barber' originate?", back: "From the Latin word 'barba' meaning beard.", difficulty: "easy" },
  { chapterNumber: 1, front: "When did barbering begin?", back: "Ancient times - as early as 3500 BC in Egypt.", difficulty: "easy" },
  { chapterNumber: 1, front: "What was the barber's pole originally used for?", back: "Signifying bloodletting services - red and white stripes represent bloody and clean bandages.", difficulty: "medium" },
  { chapterNumber: 1, front: "What services did barbers provide in medieval times?", back: "Haircuts, shaving, bloodletting, and minor surgery.", difficulty: "easy" },
  { chapterNumber: 1, front: "When did barbers and surgeons separate into different professions?", back: "1745 in England.", difficulty: "medium" },
  { chapterNumber: 1, front: "What was the first barber organization in America?", back: "The Barber Company of Philadelphia (1758).", difficulty: "hard" },
  { chapterNumber: 1, front: "When did barbering become a licensed profession in the US?", back: "Late 1800s and early 1900s.", difficulty: "medium" },
  { chapterNumber: 1, front: "What was the first state to require barber licensing?", back: "Minnesota (1897).", difficulty: "hard" },
  { chapterNumber: 1, front: "What did ancient Egyptian barbers use as razors?", back: "Sharpened stone or bronze.", difficulty: "medium" },
  { chapterNumber: 1, front: "What was a 'barber's basin' used for?", back: "Catching blood during bloodletting procedures.", difficulty: "medium" },
  { chapterNumber: 1, front: "What is the tonsure?", back: "A religious practice of shaving part or all of the head, often performed by barbers.", difficulty: "medium" },
  { chapterNumber: 1, front: "What is the National Association of Barber Boards of America (NABBA)?", back: "An organization that helps standardize barber licensing across states.", difficulty: "hard" },
  { chapterNumber: 1, front: "What did the straight razor symbolize historically?", back: "The barber's skill and professionalism.", difficulty: "medium" },
  { chapterNumber: 1, front: "When did electric clippers become common in barbershops?", back: "1920s-1930s.", difficulty: "medium" },
  { chapterNumber: 1, front: "What was the 'weekend shave' tradition?", back: "Men visiting barbers for a professional shave on weekends.", difficulty: "easy" },
  { chapterNumber: 1, front: "What role did barbershops play in African American communities?", back: "Important social and economic centers.", difficulty: "easy" },
  { chapterNumber: 1, front: "What is the barber's code of ethics?", back: "Professional standards of conduct and integrity.", difficulty: "easy" },
  { chapterNumber: 1, front: "What is the modern barbershop renaissance?", back: "The resurgence of traditional barbershops emphasizing craft and experience.", difficulty: "easy" },
  { chapterNumber: 1, front: "What is the significance of the barber's license?", back: "Legal authorization and proof of competency to practice.", difficulty: "easy" },
  { chapterNumber: 1, front: "What is the future of barbering?", back: "Continued growth with emphasis on skill, experience, and personal service.", difficulty: "easy" }
]

// Quiz questions for Chapter 1
export const chapter1QuizQuestions: QuizQuestionData[] = [
  {
    chapterNumber: 1,
    question: "Where does the word 'barber' originate from?",
    answerA: "Greek word for hair",
    answerB: "Latin word 'barba' meaning beard",
    answerC: "French word for cut",
    answerD: "English word for shop",
    correctAnswer: "b",
    explanation: "The word 'barber' comes from the Latin word 'barba' meaning beard. Barbers have been caring for beards throughout history.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "When did barbering begin?",
    answerA: "20th century",
    answerB: "Ancient times - as early as 3500 BC in Egypt",
    answerC: "Middle Ages only",
    answerD: "Renaissance only",
    correctAnswer: "b",
    explanation: "Barbering dates back to ancient times. Egyptian tombs from around 3500 BC show barbers at work.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "What was the barber's pole originally used for?",
    answerA: "Decoration only",
    answerB: "Signifying bloodletting services",
    answerC: "Holding towels",
    answerD: "Supporting the roof",
    correctAnswer: "b",
    explanation: "The barber's pole originated from the practice of bloodletting. The red and white stripes represent bloody and clean bandages.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What services did barbers provide in medieval times?",
    answerA: "Only haircuts",
    answerB: "Haircuts, shaving, bloodletting, and minor surgery",
    answerC: "Only shaving",
    answerD: "Only coloring",
    correctAnswer: "b",
    explanation: "In medieval times, barbers were also surgeons and dentists. They performed bloodletting, tooth extraction, and wound treatment.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "When did barbers and surgeons separate into different professions?",
    answerA: "Ancient times",
    answerB: "1745 in England",
    answerC: "20th century",
    answerD: "They never separated",
    correctAnswer: "b",
    explanation: "In 1745, a bill was passed in England separating barbers from surgeons. The Company of Barbers and Surgeons split.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What was the first barber organization in America?",
    answerA: "Modern Barbers Association",
    answerB: "The Barber Company of Philadelphia (1758)",
    answerC: "American Medical Association",
    answerD: "There was none",
    correctAnswer: "b",
    explanation: "The first barber organization in America was The Barber Company of Philadelphia, formed in 1758.",
    difficulty: "hard"
  },
  {
    chapterNumber: 1,
    question: "When did barbering become a licensed profession in the US?",
    answerA: "1700s",
    answerB: "Late 1800s and early 1900s",
    answerC: "2000s",
    answerD: "It was always licensed",
    correctAnswer: "b",
    explanation: "Barber licensing began in the late 1800s and early 1900s as states recognized the need for standards.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What was the first state to require barber licensing?",
    answerA: "California",
    answerB: "Minnesota (1897)",
    answerC: "New York",
    answerD: "Texas",
    correctAnswer: "b",
    explanation: "Minnesota was the first state to require barber licensing in 1897.",
    difficulty: "hard"
  },
  {
    chapterNumber: 1,
    question: "What did ancient Egyptian barbers use as razors?",
    answerA: "Steel blades",
    answerB: "Sharpened stone or bronze",
    answerC: "Laser beams",
    answerD: "Electric clippers",
    correctAnswer: "b",
    explanation: "Ancient Egyptian barbers used sharpened stone or bronze razors.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What was a 'barber's basin' used for?",
    answerA: "Hair coloring",
    answerB: "Catching blood during bloodletting",
    answerC: "Holding water",
    answerD: "Storing tools",
    correctAnswer: "b",
    explanation: "A barber's basin was used to catch blood during bloodletting procedures.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What is the tonsure?",
    answerA: "A haircut style",
    answerB: "A religious practice of shaving part or all of the head",
    answerC: "A tool",
    answerD: "A shop",
    correctAnswer: "b",
    explanation: "Tonsure is the religious practice of shaving part or all of the head, practiced by monks and clergy.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What is the National Association of Barber Boards of America (NABBA)?",
    answerA: "A haircut style",
    answerB: "An organization that helps standardize barber licensing across states",
    answerC: "A product company",
    answerD: "A union",
    correctAnswer: "b",
    explanation: "NABBA is an organization that helps standardize barber licensing and examinations across states.",
    difficulty: "hard"
  },
  {
    chapterNumber: 1,
    question: "What did the straight razor symbolize historically?",
    answerA: "Danger only",
    answerB: "The barber's skill and professionalism",
    answerC: "Wealth only",
    answerD: "Religion",
    correctAnswer: "b",
    explanation: "The straight razor symbolized the barber's skill and professionalism.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "When did electric clippers become common in barbershops?",
    answerA: "1800s",
    answerB: "1920s-1930s",
    answerC: "1990s",
    answerD: "2000s",
    correctAnswer: "b",
    explanation: "Electric clippers became common in barbershops in the 1920s-1930s.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What was the 'weekend shave' tradition?",
    answerA: "Shaving on Saturdays",
    answerB: "Men visiting barbers for a shave on weekends",
    answerC: "Shaving only on Sundays",
    answerD: "Not shaving on weekends",
    correctAnswer: "b",
    explanation: "The weekend shave was a tradition where men visited barbershops on weekends for a professional shave.",
    difficulty: "medium"
  },
  {
    chapterNumber: 1,
    question: "What role did barbershops play in African American communities?",
    answerA: "Only haircuts",
    answerB: "Important social and economic centers",
    answerC: "Medical services only",
    answerD: "Political offices",
    correctAnswer: "b",
    explanation: "Barbershops were crucial social and economic centers in African American communities.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "What is the barber's code of ethics?",
    answerA: "A haircut style",
    answerB: "Professional standards of conduct and integrity",
    answerC: "A pricing list",
    answerD: "A tool set",
    correctAnswer: "b",
    explanation: "The barber's code of ethics establishes professional standards of conduct and integrity.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "What is the modern barbershop renaissance?",
    answerA: "Closing shops",
    answerB: "The resurgence of traditional barbershops emphasizing craft and experience",
    answerC: "Only online services",
    answerD: "Only women barbers",
    correctAnswer: "b",
    explanation: "The modern barbershop renaissance emphasizes traditional craftsmanship and premium experiences.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "What is the significance of the barber's license?",
    answerA: "Just a piece of paper",
    answerB: "Legal authorization and proof of competency to practice",
    answerC: "Only for taxes",
    answerD: "Only for decoration",
    correctAnswer: "b",
    explanation: "The barber's license is legal authorization to practice and proof of competency.",
    difficulty: "easy"
  },
  {
    chapterNumber: 1,
    question: "What is the future of barbering?",
    answerA: "Disappearing",
    answerB: "Continued growth with emphasis on skill, experience, and personal service",
    answerC: "Fully automated",
    answerD: "Only for celebrities",
    correctAnswer: "b",
    explanation: "Barbering continues to grow with emphasis on skill, client experience, and personal service.",
    difficulty: "easy"
  }
]
