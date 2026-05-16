/**
 * Flashcard Expansion Content
 * Original educational flashcards for chapters missing them
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Chapter 2: Life Skills - 25 original flashcards
export const chapter2Flashcards: FlashcardData[] = [
  { chapterNumber: 2, front: "What is the foundation of success in barbering?", back: "Strong life skills including time management, communication, and professionalism", category: "foundations", difficulty: "easy" },
  { chapterNumber: 2, front: "Why is time management crucial for barbers?", back: "It ensures appointments run smoothly, reduces client wait times, and maximizes daily earning potential", category: "time-management", difficulty: "easy" },
  { chapterNumber: 2, front: "What is the '15-minute rule' in barbering?", back: "Arriving 15 minutes early to prepare your station and mentally prepare for the day", category: "time-management", difficulty: "medium" },
  { chapterNumber: 2, front: "How should you handle a difficult client?", back: "Listen actively, stay professional, offer solutions, and know when to involve management", category: "communication", difficulty: "medium" },
  { chapterNumber: 2, front: "What is active listening?", back: "Fully concentrating on what the client is saying, understanding their needs, and responding appropriately", category: "communication", difficulty: "easy" },
  { chapterNumber: 2, front: "Why is goal setting important for barbers?", back: "It provides direction, motivation, and measurable targets for career growth", category: "goals", difficulty: "easy" },
  { chapterNumber: 2, front: "What are SMART goals?", back: "Specific, Measurable, Achievable, Relevant, Time-bound objectives", category: "goals", difficulty: "medium" },
  { chapterNumber: 2, front: "How do you build client loyalty?", back: "Consistent quality, remembering preferences, genuine conversation, and exceeding expectations", category: "client-relations", difficulty: "medium" },
  { chapterNumber: 2, front: "What is professional image in barbering?", back: "Your appearance, attitude, and behavior that represents your brand and the profession", category: "professionalism", difficulty: "easy" },
  { chapterNumber: 2, front: "Why is personal hygiene essential for barbers?", back: "It protects client health, meets licensing requirements, and builds trust", category: "hygiene", difficulty: "easy" },
  { chapterNumber: 2, front: "How should you handle stress in a busy shop?", back: "Deep breathing, staying organized, taking brief breaks, and maintaining perspective", category: "stress-management", difficulty: "medium" },
  { chapterNumber: 2, front: "What is the importance of continuing education?", back: "It keeps skills current, introduces new techniques, and maintains license requirements", category: "education", difficulty: "easy" },
  { chapterNumber: 2, front: "How do you handle a client complaint?", back: "Listen without interrupting, apologize sincerely, offer to fix it, and learn from the feedback", category: "problem-solving", difficulty: "medium" },
  { chapterNumber: 2, front: "What is emotional intelligence in barbering?", back: "The ability to recognize, understand, and manage your emotions and those of your clients", category: "communication", difficulty: "hard" },
  { chapterNumber: 2, front: "Why is networking important for barbers?", back: "It builds referral relationships, creates learning opportunities, and opens career doors", category: "career", difficulty: "medium" },
  { chapterNumber: 2, front: "How do you balance work and personal life?", back: "Set boundaries, schedule downtime, prioritize health, and make time for family", category: "balance", difficulty: "medium" },
  { chapterNumber: 2, front: "What is the 'mirror talk' technique?", back: "Explaining what you're doing to clients so they feel informed and comfortable", category: "communication", difficulty: "easy" },
  { chapterNumber: 2, front: "How should you handle tips?", back: "Accept graciously, thank the client sincerely, and don't discuss tips with other clients", category: "professionalism", difficulty: "easy" },
  { chapterNumber: 2, front: "What is the importance of punctuality?", back: "It shows respect for clients' time, maintains schedule integrity, and builds professional reputation", category: "time-management", difficulty: "easy" },
  { chapterNumber: 2, front: "How do you maintain a positive attitude?", back: "Focus on solutions, practice gratitude, take care of your health, and remember your purpose", category: "mindset", difficulty: "medium" },
  { chapterNumber: 2, front: "What is professional boundaries in barbering?", back: "Maintaining appropriate relationships with clients while being friendly and personable", category: "professionalism", difficulty: "medium" },
  { chapterNumber: 2, front: "Why is record keeping important?", back: "It helps track client preferences, appointment history, and business performance", category: "business", difficulty: "medium" },
  { chapterNumber: 2, front: "How do you handle confidential client information?", back: "Never share personal details, maintain privacy, and build trust through discretion", category: "ethics", difficulty: "easy" },
  { chapterNumber: 2, front: "What is the key to long-term barbering success?", back: "Consistent quality, continuous learning, strong relationships, and genuine care for clients", category: "success", difficulty: "medium" },
  { chapterNumber: 2, front: "How do you stay motivated during slow periods?", back: "Use time for practice, marketing, organization, and remembering that consistency builds success", category: "mindset", difficulty: "medium" }
]

// Chapter 5: Implements, Tools, and Equipment - 30 original flashcards
export const chapter5Flashcards: FlashcardData[] = [
  { chapterNumber: 5, front: "What are the three main types of shears?", back: "Cutting shears, thinning shears, and texturizing shears", category: "shears", difficulty: "easy" },
  { chapterNumber: 5, front: "What is the difference between a razor and a shear?", back: "A razor cuts with a single blade at the skin level; shears use two blades to cut at a distance from the skin", category: "tools", difficulty: "easy" },
  { chapterNumber: 5, front: "What is the purpose of thinning shears?", back: "To remove bulk and blend sections without changing the overall length significantly", category: "shears", difficulty: "medium" },
  { chapterNumber: 5, front: "How often should shears be sharpened?", back: "Every 3-6 months with regular use, or when they start pushing or folding hair", category: "maintenance", difficulty: "medium" },
  { chapterNumber: 5, front: "What is the proper way to hold shears?", back: "Thumb in one handle, ring finger in the other, with index finger resting on the shank for control", category: "technique", difficulty: "easy" },
  { chapterNumber: 5, front: "What are clipper guards used for?", back: "To control the length of hair being cut and create consistent, even cuts", category: "clippers", difficulty: "easy" },
  { chapterNumber: 5, front: "What is the difference between taper and fade?", back: "Taper gradually changes length; fade blends hair into the skin with no visible line", category: "technique", difficulty: "medium" },
  { chapterNumber: 5, front: "What is a straight razor used for?", back: "Creating clean lines, detailed edging, and traditional straight razor shaves", category: "razors", difficulty: "easy" },
  { chapterNumber: 5, front: "What is clipper-over-comb technique?", back: "Using a comb to hold hair while cutting with clippers for precise length control", category: "technique", difficulty: "medium" },
  { chapterNumber: 5, front: "What is the purpose of a neck duster?", back: "To remove loose hair from the client's neck and face after cutting", category: "tools", difficulty: "easy" },
  { chapterNumber: 5, front: "What are the two main clipper motor types?", back: "Magnetic (vibrating) motors and rotary motors", category: "clippers", difficulty: "medium" },
  { chapterNumber: 5, front: "Which clipper motor is quieter and more powerful?", back: "Rotary motors - they're better for thick or wet hair and run quieter", category: "clippers", difficulty: "medium" },
  { chapterNumber: 5, front: "What is a strop used for?", back: "To polish and maintain the edge of a straight razor between uses", category: "maintenance", difficulty: "medium" },
  { chapterNumber: 5, front: "What is the difference between a trimmer and a clipper?", back: "Trimmers are smaller, designed for detail work and edges; clippers are for bulk cutting", category: "tools", difficulty: "easy" },
  { chapterNumber: 5, front: "What is the purpose of sectioning clips?", back: "To hold sections of hair out of the way while working on other sections", category: "tools", difficulty: "easy" },
  { chapterNumber: 5, front: "What is a razor comb?", back: "A comb with a built-in razor blade for texturizing and removing bulk", category: "tools", difficulty: "medium" },
  { chapterNumber: 5, front: "How should tools be sanitized?", back: "Clean with soap and water, then disinfect with EPA-registered disinfectant according to label instructions", category: "sanitation", difficulty: "medium" },
  { chapterNumber: 5, front: "What is the purpose of a barber pole?", back: "Historical symbol of the profession; originally indicated bloodletting services", category: "history", difficulty: "easy" },
  { chapterNumber: 5, front: "What is shear over comb?", back: "Using shears with a comb to create precise, clean lines and detailed work", category: "technique", difficulty: "medium" },
  { chapterNumber: 5, front: "What are blending shears?", back: "Shears with teeth on one blade that remove weight and create texture", category: "shears", difficulty: "medium" },
  { chapterNumber: 5, front: "What is the pivot point of shears?", back: "The screw or adjustment mechanism that connects the two blades and controls tension", category: "shears", difficulty: "hard" },
  { chapterNumber: 5, front: "How do you test shear sharpness?", back: "Cut a wet tissue or single hair; sharp shears cut cleanly without pushing or folding", category: "maintenance", difficulty: "medium" },
  { chapterNumber: 5, front: "What is a foil shaver used for?", back: "Creating ultra-close shaves and finishing work on the neck and edges", category: "tools", difficulty: "easy" },
  { chapterNumber: 5, front: "What is the difference between guards numbered 0-8?", back: "Each number represents 1/8 inch of hair length; #0 is 1/16 inch, #8 is 1 inch", category: "clippers", difficulty: "medium" },
  { chapterNumber: 5, front: "What is clipper maintenance?", back: "Regular cleaning, oiling blades, checking cord, and replacing worn parts", category: "maintenance", difficulty: "easy" },
  { chapterNumber: 5, front: "What is a neck strip used for?", back: "To protect the client's skin from clipper irritation and catch loose hair", category: "tools", difficulty: "easy" },
  { chapterNumber: 5, front: "What is the purpose of a barber chair?", back: "To position clients comfortably and safely at the correct height for cutting", category: "equipment", difficulty: "easy" },
  { chapterNumber: 5, front: "What is a sanitizer jar used for?", back: "To disinfect combs, brushes, and other tools between clients", category: "sanitation", difficulty: "easy" },
  { chapterNumber: 5, front: "What is proper tool storage?", back: "Clean, dry environment; shears in cases; clippers hung or stored safely; away from moisture", category: "maintenance", difficulty: "medium" },
  { chapterNumber: 5, front: "Why is tool maintenance important?", back: "It extends tool life, ensures clean cuts, prevents injury, and maintains professional standards", category: "maintenance", difficulty: "easy" }
]

// Export all expansion content
export const allExpansionFlashcards = [
  ...chapter2Flashcards,
  ...chapter5Flashcards
]

// Summary statistics
export const expansionStats = {
  chapter2: chapter2Flashcards.length,
  chapter5: chapter5Flashcards.length,
  totalNew: allExpansionFlashcards.length,
  chaptersWithNewContent: [2, 5]
}
