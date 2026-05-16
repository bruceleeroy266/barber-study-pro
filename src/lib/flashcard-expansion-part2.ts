/**
 * Flashcard Expansion Part 2
 * Chapters 6, 9, 10, 11, 12, 13
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Chapter 6: General Anatomy & Physiology - 30 flashcards
export const chapter6Flashcards: FlashcardData[] = [
  { chapterNumber: 6, front: "What are the 11 body systems?", back: "Integumentary, skeletal, muscular, nervous, endocrine, cardiovascular, lymphatic, respiratory, digestive, urinary, and reproductive", category: "body-systems", difficulty: "hard" },
  { chapterNumber: 6, front: "What is the integumentary system?", back: "The skin and its appendages: hair, nails, and glands", category: "body-systems", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the largest organ of the body?", back: "The skin", category: "anatomy", difficulty: "easy" },
  { chapterNumber: 6, front: "What are the two main layers of skin?", back: "Epidermis (outer) and dermis (inner)", category: "skin", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the subcutaneous layer?", back: "The layer beneath the dermis containing fat and connective tissue", category: "skin", difficulty: "easy" },
  { chapterNumber: 6, front: "What are melanocytes?", back: "Cells that produce melanin, which gives skin its color", category: "skin", difficulty: "medium" },
  { chapterNumber: 6, front: "What is keratin?", back: "A tough protein that makes up hair, nails, and the outer layer of skin", category: "skin", difficulty: "easy" },
  { chapterNumber: 6, front: "What are sebaceous glands?", back: "Oil-producing glands that lubricate hair and skin", category: "glands", difficulty: "easy" },
  { chapterNumber: 6, front: "What is sebum?", back: "The oily substance produced by sebaceous glands", category: "glands", difficulty: "easy" },
  { chapterNumber: 6, front: "What are sudoriferous glands?", back: "Sweat glands that regulate body temperature", category: "glands", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the function of blood?", back: "Transports oxygen, nutrients, hormones, and removes waste", category: "cardiovascular", difficulty: "easy" },
  { chapterNumber: 6, front: "What are the five senses?", back: "Sight, hearing, smell, taste, and touch", category: "nervous", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the nervous system divided into?", back: "Central nervous system (brain and spinal cord) and peripheral nervous system", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "What is the function of the skeletal system?", back: "Support, protection, movement, blood cell production, and mineral storage", category: "skeletal", difficulty: "easy" },
  { chapterNumber: 6, front: "How many bones are in the adult human body?", back: "206 bones", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "What are muscles responsible for?", back: "Movement, posture, and heat production", category: "muscular", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the heart's function?", back: "To pump blood throughout the body", category: "cardiovascular", difficulty: "easy" },
  { chapterNumber: 6, front: "What are arteries?", back: "Blood vessels that carry oxygenated blood away from the heart", category: "cardiovascular", difficulty: "easy" },
  { chapterNumber: 6, front: "What are veins?", back: "Blood vessels that carry deoxygenated blood back to the heart", category: "cardiovascular", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the respiratory system's function?", back: "To bring oxygen into the body and remove carbon dioxide", category: "respiratory", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the digestive system's function?", back: "To break down food into nutrients the body can absorb", category: "digestive", difficulty: "easy" },
  { chapterNumber: 6, front: "What is homeostasis?", back: "The body's ability to maintain stable internal conditions", category: "physiology", difficulty: "medium" },
  { chapterNumber: 6, front: "What is metabolism?", back: "All chemical reactions in the body that maintain life", category: "physiology", difficulty: "medium" },
  { chapterNumber: 6, front: "What is the lymphatic system's function?", back: "To fight infection and remove waste from tissues", category: "lymphatic", difficulty: "medium" },
  { chapterNumber: 6, front: "What are hormones?", back: "Chemical messengers produced by endocrine glands", category: "endocrine", difficulty: "medium" },
  { chapterNumber: 6, front: "What is tissue?", back: "A group of similar cells that perform a specific function", category: "anatomy", difficulty: "easy" },
  { chapterNumber: 6, front: "What is a cell?", back: "The basic unit of life and building block of all tissues", category: "anatomy", difficulty: "easy" },
  { chapterNumber: 6, front: "What is the function of the excretory system?", back: "To remove waste products from the body", category: "urinary", difficulty: "easy" },
  { chapterNumber: 6, front: "Why do barbers need to understand anatomy?", back: "To understand skin conditions, hair growth, and provide safe services", category: "professional", difficulty: "easy" },
  { chapterNumber: 6, front: "What is collagen?", back: "A protein that provides structure and elasticity to skin", category: "skin", difficulty: "medium" }
]

// Chapter 9: The Skin - 30 flashcards
export const chapter9Flashcards: FlashcardData[] = [
  { chapterNumber: 9, front: "What is the average adult skin surface area?", back: "About 20 square feet", category: "skin-facts", difficulty: "hard" },
  { chapterNumber: 9, front: "What are the five functions of skin?", back: "Protection, sensation, heat regulation, excretion, and absorption", category: "skin-functions", difficulty: "medium" },
  { chapterNumber: 9, front: "What is the acid mantle?", back: "The protective acidic film on skin's surface that prevents bacterial growth", category: "skin-protection", difficulty: "medium" },
  { chapterNumber: 9, front: "What is the pH of healthy skin?", back: "4.5 to 5.5 - slightly acidic", category: "skin-chemistry", difficulty: "medium" },
  { chapterNumber: 9, front: "What are the layers of the epidermis?", back: "Stratum corneum, lucidum, granulosum, spinosum, and basale", category: "epidermis", difficulty: "hard" },
  { chapterNumber: 9, front: "What is the stratum corneum?", back: "The outermost layer of dead, flattened skin cells", category: "epidermis", difficulty: "medium" },
  { chapterNumber: 9, front: "How long does skin cell turnover take?", back: "Approximately 28 days in young adults", category: "skin-renewal", difficulty: "medium" },
  { chapterNumber: 9, front: "What is collagen?", back: "A protein that gives skin strength and structure", category: "dermis", difficulty: "easy" },
  { chapterNumber: 9, front: "What is elastin?", back: "A protein that allows skin to stretch and return to shape", category: "dermis", difficulty: "easy" },
  { chapterNumber: 9, front: "What are the two types of sweat glands?", back: "Eccrine (all over body) and apocrine (armpits, groin)", category: "glands", difficulty: "medium" },
  { chapterNumber: 9, front: "What causes acne?", back: "Clogged pores, excess oil, bacteria, and inflammation", category: "skin-conditions", difficulty: "easy" },
  { chapterNumber: 9, front: "What is contact dermatitis?", back: "Inflammation of the skin caused by contact with an irritant or allergen", category: "skin-conditions", difficulty: "medium" },
  { chapterNumber: 9, front: "What is psoriasis?", back: "A chronic autoimmune condition causing rapid skin cell buildup", category: "skin-conditions", difficulty: "medium" },
  { chapterNumber: 9, front: "What is eczema?", back: "A condition causing dry, itchy, inflamed skin", category: "skin-conditions", difficulty: "easy" },
  { chapterNumber: 9, front: "What is a lesion?", back: "Any abnormal change in skin tissue", category: "skin-terms", difficulty: "easy" },
  { chapterNumber: 9, front: "What is the difference between a papule and a pustule?", back: "A papule is a solid raised lesion; a pustule contains pus", category: "skin-terms", difficulty: "medium" },
  { chapterNumber: 9, front: "What is hyperpigmentation?", back: "Darkening of the skin due to excess melanin", category: "skin-conditions", difficulty: "easy" },
  { chapterNumber: 9, front: "What is hypopigmentation?", back: "Lightening of the skin due to lack of melanin", category: "skin-conditions", difficulty: "easy" },
  { chapterNumber: 9, front: "What is UV radiation?", back: "Ultraviolet light from the sun that damages skin and causes aging", category: "skin-protection", difficulty: "easy" },
  { chapterNumber: 9, front: "What is SPF?", back: "Sun Protection Factor - measures UVB protection", category: "skin-protection", difficulty: "easy" },
  { chapterNumber: 9, front: "What are free radicals?", back: "Unstable molecules that damage skin cells and accelerate aging", category: "skin-chemistry", difficulty: "medium" },
  { chapterNumber: 9, front: "What is an antioxidant?", back: "A substance that neutralizes free radicals and protects skin", category: "skin-chemistry", difficulty: "medium" },
  { chapterNumber: 9, front: "What is the skin's barrier function?", back: "Protecting the body from environmental damage, bacteria, and moisture loss", category: "skin-functions", difficulty: "medium" },
  { chapterNumber: 9, front: "What is trans-epidermal water loss?", back: "The natural process of water evaporating from skin's surface", category: "skin-physiology", difficulty: "hard" },
  { chapterNumber: 9, front: "What are ceramides?", back: "Lipids that help form the skin's barrier and retain moisture", category: "skin-chemistry", difficulty: "hard" },
  { chapterNumber: 9, front: "What is hyaluronic acid?", back: "A substance that holds 1000x its weight in water, keeping skin hydrated", category: "skin-chemistry", difficulty: "medium" },
  { chapterNumber: 9, front: "What is the difference between dry and dehydrated skin?", back: "Dry skin lacks oil; dehydrated skin lacks water", category: "skin-types", difficulty: "medium" },
  { chapterNumber: 9, front: "What are the four basic skin types?", back: "Normal, dry, oily, and combination", category: "skin-types", difficulty: "easy" },
  { chapterNumber: 9, front: "What is sensitive skin?", back: "Skin that reacts easily to products, weather, or touch with redness or irritation", category: "skin-types", difficulty: "easy" },
  { chapterNumber: 9, front: "Why should barbers recognize skin conditions?", back: "To avoid aggravating conditions, refer clients to dermatologists when needed, and provide appropriate services", category: "professional", difficulty: "easy" }
]

// Export all
export const expansionPart2 = {
  chapter6: chapter6Flashcards,
  chapter9: chapter9Flashcards,
  total: chapter6Flashcards.length + chapter9Flashcards.length
}
