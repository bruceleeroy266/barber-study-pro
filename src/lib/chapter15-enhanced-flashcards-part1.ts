/**
 * CHAPTER 15 ENHANCED FLASHCARDS - PART 1
 * Consultation Psychology & Sales Professionalism
 * Premium build - original educational content
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  weakAreaTags?: string[]
}

// Consultation Psychology & Sales Ethics (12 cards)
export const chapter15ConsultationPsychology: FlashcardData[] = [
  {
    chapterNumber: 15,
    front: "Why is hair replacement the fastest-growing barber service category?",
    back: "Second only to haircutting in growth. Men seek solutions for hair loss, creating strong market demand. Specialists can increase clientele and income significantly. Understanding solutions positions barbers as problem-solvers.",
    category: "consultation-psychology",
    difficulty: "easy",
    weakAreaTags: ["consultation", "hair-replacement", "sales-psychology"]
  },
  {
    chapterNumber: 15,
    front: "What is the most important principle when consulting about hair replacement?",
    back: "Keep it private and personal. Hair loss is sensitive - never discuss publicly or pressure clients. Build trust through discretion, education, and honest communication. Consultation should feel supportive, not sales-focused.",
    category: "consultation-psychology",
    difficulty: "medium",
    weakAreaTags: ["consultation", "sales-psychology", "client-care"]
  },
  {
    chapterNumber: 15,
    front: "What topics must be covered during a hair replacement consultation?",
    back: "Medical history, lifestyle (active vs sedentary), age considerations, budget constraints, maintenance requirements, realistic expectations. Present ALL options (surgical, nonsurgical, topical) before making recommendations. Education before sale.",
    category: "consultation-psychology",
    difficulty: "hard",
    weakAreaTags: ["consultation", "professional-procedure", "client-care"]
  },
  {
    chapterNumber: 15,
    front: "Why should barbers never use hard-sell tactics for hair replacement?",
    back: "Hair replacement is personal and emotional. Pressure creates buyer's remorse and destroys trust. Clients need time to consider options, costs, and lifestyle impact. Professional education and support sell better than aggressive tactics.",
    category: "consultation-psychology",
    difficulty: "medium",
    weakAreaTags: ["sales-psychology", "consultation", "professional-procedure"]
  },
  {
    chapterNumber: 15,
    front: "When should you ask for the sale during a hair replacement consultation?",
    back: "ONLY after answering all client questions, presenting all options, discussing maintenance requirements, and ensuring client fully understands commitment. Never rush the decision. Education and confidence must come before purchase.",
    category: "consultation-psychology",
    difficulty: "medium",
    weakAreaTags: ["sales-psychology", "consultation", "professional-procedure"]
  },
  {
    chapterNumber: 15,
    front: "What lifestyle factors should influence hair replacement recommendations?",
    back: "Activity level (sports, swimming), occupation (office vs physical), climate exposure, maintenance willingness, styling preferences, budget for upkeep. Active clients may need stronger bonding; sedentary clients have more options. Match system to lifestyle.",
    category: "consultation-psychology",
    difficulty: "hard",
    weakAreaTags: ["consultation", "client-care", "practical-application"]
  },
  {
    chapterNumber: 15,
    front: "How should barbers market hair replacement services?",
    back: "Social media marketing, professional window displays, personal demonstrations, before/after photos (with permission), referral incentive programs. Focus on natural results and lifestyle benefits. Never exploit insecurities - emphasize confidence and choice.",
    category: "consultation-psychology",
    difficulty: "medium",
    weakAreaTags: ["sales-psychology", "hair-replacement", "professional-procedure"]
  },
  {
    chapterNumber: 15,
    front: "Why is privacy essential in hair replacement services?",
    back: "Hair loss is deeply personal and often embarrassing for clients. Private consultations protect dignity, build trust, and allow honest conversation. Public discussions or careless storage of systems damages reputation and loses clients.",
    category: "consultation-psychology",
    difficulty: "easy",
    weakAreaTags: ["consultation", "client-care", "professional-procedure"]
  },
  {
    chapterNumber: 15,
    front: "What should you do if a client asks about medical hair loss treatments?",
    back: "Provide accurate information about FDA-approved options (Minoxidil, Finasteride, laser therapy) but recommend physician consultation for medical advice. Barbers educate and provide cosmetic solutions - physicians diagnose and prescribe treatments.",
    category: "consultation-psychology",
    difficulty: "hard",
    weakAreaTags: ["consultation", "fda-treatments", "professional-procedure", "safety"]
  },
  {
    chapterNumber: 15,
    front: "How do you build long-term client relationships in hair replacement?",
    back: "Quality service, honest expectations, regular maintenance schedules, product support, discretion, follow-up care, addressing concerns promptly. Client satisfaction and natural results generate referrals. Repeat business depends on trust and results.",
    category: "consultation-psychology",
    difficulty: "medium",
    weakAreaTags: ["consultation", "client-care", "sales-psychology"]
  },
  {
    chapterNumber: 15,
    front: "What realistic expectations should clients have about hair replacement?",
    back: "Regular maintenance required (every 3-4 weeks), removal for swimming/showering, periodic cleaning, eventual replacement needed, upfront and ongoing costs, learning curve for daily care. Systems look natural but require commitment.",
    category: "consultation-psychology",
    difficulty: "hard",
    weakAreaTags: ["consultation", "maintenance", "client-care", "professional-procedure"]
  },
  {
    chapterNumber: 15,
    front: "Why is demonstrating hair replacement systems important?",
    back: "Seeing and touching systems reduces fear and builds confidence. Clients understand quality, appearance, and texture. Demonstrations show natural look and styling possibilities. Personal experience converts consultations to sales better than descriptions.",
    category: "consultation-psychology",
    difficulty: "easy",
    weakAreaTags: ["consultation", "sales-psychology", "practical-application"]
  }
]
