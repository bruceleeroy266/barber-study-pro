/**
 * Flashcard Expansion Part 5 - Final Chapters
 * Chapters 18, 19, 20, 21
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Chapter 18: Seeking Employment - 25 flashcards
export const chapter18Flashcards: FlashcardData[] = [
  { chapterNumber: 18, front: "What should a barber resume include?", back: "Contact info, education, licenses, experience, skills, and references", category: "resume", difficulty: "easy" },
  { chapterNumber: 18, front: "What is a portfolio in barbering?", back: "Collection of before/after photos showing your work", category: "portfolio", difficulty: "easy" },
  { chapterNumber: 18, front: "What should you wear to a barber interview?", back: "Professional attire that reflects the shop's style and culture", category: "interview", difficulty: "easy" },
  { chapterNumber: 18, front: "What questions should you ask in an interview?", back: "Commission structure, clientele, schedule, products used, and growth opportunities", category: "interview", difficulty: "medium" },
  { chapterNumber: 18, front: "What is commission pay?", back: "Percentage of service price earned by the barber", category: "compensation", difficulty: "easy" },
  { chapterNumber: 18, front: "What is booth rental?", back: "Paying a set fee to use space in a shop and keeping all earnings", category: "compensation", difficulty: "medium" },
  { chapterNumber: 18, front: "What is the difference between employee and independent contractor?", back: "Employees have taxes withheld; contractors handle their own taxes and benefits", category: "employment", difficulty: "medium" },
  { chapterNumber: 18, front: "What is a non-compete agreement?", back: "Contract preventing you from working for competitors within certain parameters", category: "legal", difficulty: "medium" },
  { chapterNumber: 18, front: "What should you research before an interview?", back: "Shop's style, clientele, reputation, and services offered", category: "interview", difficulty: "easy" },
  { chapterNumber: 18, front: "What is a practical interview?", back: "Demonstrating your skills by cutting hair during the interview process", category: "interview", difficulty: "easy" },
  { chapterNumber: 18, front: "How can you build clientele quickly?", back: "Social media, networking, promotions, excellent service, and asking for referrals", category: "business", difficulty: "easy" },
  { chapterNumber: 18, front: "What is a trial period?", back: "Initial employment period to evaluate fit for both barber and shop", category: "employment", difficulty: "easy" },
  { chapterNumber: 18, front: "What should you bring to an interview?", back: "Resume, portfolio, tools, license, and list of references", category: "interview", difficulty: "easy" },
  { chapterNumber: 18, front: "What is professional networking?", back: "Building relationships with others in the industry for opportunities and growth", category: "career", difficulty: "easy" },
  { chapterNumber: 18, front: "What is a cover letter?", back: "Introduction letter explaining why you're interested in the position", category: "resume", difficulty: "easy" },
  { chapterNumber: 18, front: "How do you follow up after an interview?", back: "Send a thank-you message within 24 hours expressing continued interest", category: "interview", difficulty: "easy" },
  { chapterNumber: 18, front: "What are red flags in a job offer?", back: "No contract, unclear pay structure, no license requirements, or poor shop conditions", category: "employment", difficulty: "medium" },
  { chapterNumber: 18, front: "What is a 1099 form?", back: "Tax form for independent contractors reporting income", category: "taxes", difficulty: "medium" },
  { chapterNumber: 18, front: "What is a W-2 form?", back: "Tax form for employees showing wages and taxes withheld", category: "taxes", difficulty: "medium" },
  { chapterNumber: 18, front: "What is continuing education?", back: "Ongoing training required to maintain license and improve skills", category: "licensing", difficulty: "easy" },
  { chapterNumber: 18, front: "What is a barber's elevator pitch?", back: "Brief introduction highlighting your skills and what makes you unique", category: "networking", difficulty: "medium" },
  { chapterNumber: 18, front: "What is social media's role in job hunting?", back: "Showcases your work, connects with shops, and builds your brand", category: "career", difficulty: "easy" },
  { chapterNumber: 18, front: "What should you negotiate in a job offer?", back: "Pay structure, schedule, product costs, and any benefits", category: "employment", difficulty: "medium" },
  { chapterNumber: 18, front: "What is a clientele base?", back: "Regular customers who consistently return for your services", category: "business", difficulty: "easy" },
  { chapterNumber: 18, front: "What is the most important factor in choosing a shop?", back: "Finding a place where your style and values align with the culture", category: "career", difficulty: "easy" }
]

// Chapter 19: Barbershop Management - 25 flashcards
export const chapter19Flashcards: FlashcardData[] = [
  { chapterNumber: 19, front: "What is inventory management?", back: "Tracking and controlling stock of products and supplies", category: "operations", difficulty: "easy" },
  { chapterNumber: 19, front: "What is a point-of-sale (POS) system?", back: "Software for processing sales and tracking business data", category: "technology", difficulty: "easy" },
  { chapterNumber: 19, front: "What is the purpose of appointment scheduling?", back: "To organize time efficiently and minimize client wait times", category: "operations", difficulty: "easy" },
  { chapterNumber: 19, front: "What is a cancellation policy?", back: "Rules regarding missed or cancelled appointments to protect income", category: "policies", difficulty: "easy" },
  { chapterNumber: 19, front: "What is retail sales in a barbershop?", back: "Selling products for clients to use at home", category: "sales", difficulty: "easy" },
  { chapterNumber: 19, front: "What is the benefit of selling retail products?", back: "Additional revenue and helping clients maintain their look", category: "business", difficulty: "easy" },
  { chapterNumber: 19, front: "What is a business plan?", back: "Document outlining business goals, strategies, and financial projections", category: "planning", difficulty: "easy" },
  { chapterNumber: 19, front: "What is overhead?", back: "Ongoing business expenses like rent, utilities, and supplies", category: "finance", difficulty: "easy" },
  { chapterNumber: 19, front: "What is profit?", back: "Revenue minus expenses - the actual earnings of the business", category: "finance", difficulty: "easy" },
  { chapterNumber: 19, front: "What is a target market?", back: "The specific group of customers a business aims to serve", category: "marketing", difficulty: "easy" },
  { chapterNumber: 19, front: "What is marketing?", back: "Activities to promote services and attract clients", category: "marketing", difficulty: "easy" },
  { chapterNumber: 19, front: "What is social media marketing?", back: "Using platforms like Instagram to showcase work and attract clients", category: "marketing", difficulty: "easy" },
  { chapterNumber: 19, front: "What is customer service?", back: "All interactions that affect client satisfaction and experience", category: "service", difficulty: "easy" },
  { chapterNumber: 19, front: "What is client retention?", back: "Keeping existing clients returning for repeat business", category: "service", difficulty: "easy" },
  { chapterNumber: 19, front: "What is a loyalty program?", back: "Rewards for repeat clients to encourage retention", category: "marketing", difficulty: "easy" },
  { chapterNumber: 19, front: "What is upselling?", back: "Suggesting additional services that benefit the client", category: "sales", difficulty: "medium" },
  { chapterNumber: 19, front: "What is cross-selling?", back: "Recommending complementary products to go with services", category: "sales", difficulty: "medium" },
  { chapterNumber: 19, front: "What is a mission statement?", back: "Brief statement of business purpose and values", category: "planning", difficulty: "easy" },
  { chapterNumber: 19, front: "What is branding?", back: "Creating a unique identity and image for the business", category: "marketing", difficulty: "easy" },
  { chapterNumber: 19, front: "What is bookkeeping?", back: "Recording financial transactions and maintaining records", category: "finance", difficulty: "easy" },
  { chapterNumber: 19, front: "What is cash flow?", back: "The movement of money in and out of the business", category: "finance", difficulty: "easy" },
  { chapterNumber: 19, front: "What is workers' compensation insurance?", back: "Insurance covering employees injured on the job", category: "legal", difficulty: "easy" },
  { chapterNumber: 19, front: "What is liability insurance?", back: "Insurance protecting against claims of injury or damage", category: "legal", difficulty: "easy" },
  { chapterNumber: 19, front: "Why is cleanliness important in a barbershop?", back: "Client safety, professional image, and regulatory compliance", category: "operations", difficulty: "easy" },
  { chapterNumber: 19, front: "What is time management important for?", back: "Maximizing productivity, reducing stress, and serving more clients", category: "operations", difficulty: "easy" }
]

// Chapter 20: History of Barbering (Advanced) - 20 flashcards
export const chapter20Flashcards: FlashcardData[] = [
  { chapterNumber: 20, front: "Where does the word 'barber' originate?", back: "Latin word 'barba' meaning beard", category: "etymology", difficulty: "easy" },
  { chapterNumber: 20, front: "When did barbering begin?", back: "Ancient times - as early as 3500 BC in Egypt", category: "ancient", difficulty: "easy" },
  { chapterNumber: 20, front: "What was the barber's pole originally used for?", back: "Signifying bloodletting services", category: "history", difficulty: "medium" },
  { chapterNumber: 20, front: "What services did barbers provide in medieval times?", back: "Haircuts, shaving, bloodletting, and minor surgery", category: "medieval", difficulty: "easy" },
  { chapterNumber: 20, front: "What were barber-surgeons called?", back: "Barber-surgeons", category: "history", difficulty: "easy" },
  { chapterNumber: 20, front: "When did barbers and surgeons separate?", back: "1745 in England", category: "history", difficulty: "medium" },
  { chapterNumber: 20, front: "What was the first barber organization in America?", back: "The Barber Company of Philadelphia (1758)", category: "history", difficulty: "hard" },
  { chapterNumber: 20, front: "When did barbering become licensed in the US?", back: "Late 1800s and early 1900s", category: "history", difficulty: "medium" },
  { chapterNumber: 20, front: "What was the first state to require barber licensing?", back: "Minnesota (1897)", category: "history", difficulty: "hard" },
  { chapterNumber: 20, front: "What did ancient Egyptian barbers use as razors?", back: "Sharpened stone or bronze", category: "ancient", difficulty: "medium" },
  { chapterNumber: 20, front: "What was a 'barber's basin' used for?", back: "Catching blood during bloodletting", category: "medieval", difficulty: "medium" },
  { chapterNumber: 20, front: "When did the safety razor become popular?", back: "Early 1900s", category: "modern", difficulty: "medium" },
  { chapterNumber: 20, front: "What role did barbershops play in African American communities?", back: "Important social and economic centers", category: "history", difficulty: "easy" },
  { chapterNumber: 20, front: "What is NABBA?", back: "National Association of Barber Boards of America", category: "organizations", difficulty: "hard" },
  { chapterNumber: 20, front: "What did the straight razor symbolize?", back: "The barber's skill and professionalism", category: "history", difficulty: "medium" },
  { chapterNumber: 20, front: "When did electric clippers become common?", back: "1920s-1930s", category: "modern", difficulty: "medium" },
  { chapterNumber: 20, front: "What was the 'weekend shave' tradition?", back: "Men visiting barbers for a shave on weekends", category: "history", difficulty: "medium" },
  { chapterNumber: 20, front: "What is the barber's code of ethics?", back: "Professional standards of conduct and integrity", category: "professional", difficulty: "easy" },
  { chapterNumber: 20, front: "What is the modern barbershop renaissance?", back: "Resurgence of traditional barbershops emphasizing craft", category: "modern", difficulty: "easy" },
  { chapterNumber: 20, front: "What is the significance of the barber's license?", back: "Legal authorization and proof of competency", category: "professional", difficulty: "easy" }
]

// Chapter 21: Working Behind the Chair - 25 flashcards
export const chapter21Flashcards: FlashcardData[] = [
  { chapterNumber: 21, front: "What is the most important aspect of client consultation?", back: "Listening to the client's needs and expectations", category: "consultation", difficulty: "easy" },
  { chapterNumber: 21, front: "What should you do if a client is unhappy?", back: "Listen, apologize, and offer to fix it professionally", category: "service", difficulty: "easy" },
  { chapterNumber: 21, front: "How should you handle a difficult client?", back: "Remain professional, listen, and set clear boundaries", category: "service", difficulty: "medium" },
  { chapterNumber: 21, front: "What is professional distance?", back: "Maintaining appropriate boundaries while being friendly", category: "professional", difficulty: "medium" },
  { chapterNumber: 21, front: "Why is punctuality important?", back: "It shows respect for clients' time and professionalism", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "What should you do if you're running late?", back: "Contact the client as soon as possible", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "How often should you clean your station?", back: "Throughout the day and thoroughly after each client", category: "sanitation", difficulty: "easy" },
  { chapterNumber: 21, front: "What is the proper way to handle tools after use?", back: "Clean, disinfect, and store properly", category: "sanitation", difficulty: "easy" },
  { chapterNumber: 21, front: "Why is continuing education important?", back: "To stay current with trends, techniques, and regulations", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "What should you wear to work?", back: "Clean, professional attire appropriate for the shop", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "How should you handle confidential information?", back: "Keep it private and secure", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "What is the best way to build loyal clientele?", back: "Consistent quality, great service, and genuine relationships", category: "business", difficulty: "easy" },
  { chapterNumber: 21, front: "How should you handle tips?", back: "Accept graciously and thank the client", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "What should you do if you make a mistake?", back: "Acknowledge it, apologize, and fix it professionally", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "Why is it important to know your products?", back: "To make informed recommendations and answer questions", category: "knowledge", difficulty: "easy" },
  { chapterNumber: 21, front: "How should you handle a contagious condition?", back: "Follow Universal Precautions and maintain confidentiality", category: "safety", difficulty: "medium" },
  { chapterNumber: 21, front: "What is the proper way to drape a client?", back: "Completely cover clothing with clean cape, snug at neck", category: "service", difficulty: "easy" },
  { chapterNumber: 21, front: "How often should you sharpen blades?", back: "When they become dull or show wear", category: "maintenance", difficulty: "easy" },
  { chapterNumber: 21, front: "What is the importance of ergonomics?", back: "Preventing injury and ensuring career longevity", category: "health", difficulty: "medium" },
  { chapterNumber: 21, front: "How should you handle a client who talks constantly?", back: "Engage appropriately while maintaining focus on work", category: "service", difficulty: "medium" },
  { chapterNumber: 21, front: "What should you do if you don't know a requested style?", back: "Be honest and suggest alternatives or refer to someone experienced", category: "professional", difficulty: "easy" },
  { chapterNumber: 21, front: "Why is it important to take photos of your work?", back: "For portfolio and to show clients potential styles", category: "marketing", difficulty: "easy" },
  { chapterNumber: 21, front: "How should you handle a no-show client?", back: "Follow shop policy, contact them, and document the incident", category: "business", difficulty: "medium" },
  { chapterNumber: 21, front: "What is the proper way to sanitize a cape?", back: "Wash regularly according to manufacturer instructions", category: "sanitation", difficulty: "easy" },
  { chapterNumber: 21, front: "How can you stay motivated in your career?", back: "Set goals, continue learning, and celebrate achievements", category: "career", difficulty: "easy" }
]

// Export all final chapters
export const expansionPart5 = {
  chapter18: chapter18Flashcards,
  chapter19: chapter19Flashcards,
  chapter20: chapter20Flashcards,
  chapter21: chapter21Flashcards,
  total: chapter18Flashcards.length + chapter19Flashcards.length + chapter20Flashcards.length + chapter21Flashcards.length
}

// Grand total of all expansion flashcards
export const grandTotal = {
  part1: 55,  // Chapters 2, 5
  part2: 60,  // Chapters 6, 9
  part3: 80,  // Chapters 10, 11, 12
  part4: 85,  // Chapters 13, 14, 17
  part5: 95,  // Chapters 18, 19, 20, 21
  total: 375  // Total new flashcards created
}
