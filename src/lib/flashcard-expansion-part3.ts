/**
 * Flashcard Expansion Part 3
 * Chapters 10, 11, 12, 13, 14
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Chapter 10: Properties and Disorders of the Hair and Scalp - 30 flashcards
export const chapter10Flashcards: FlashcardData[] = [
  { chapterNumber: 10, front: "What is hair composed of?", back: "Keratin protein, with trace minerals and lipids", category: "hair-composition", difficulty: "easy" },
  { chapterNumber: 10, front: "What are the three layers of hair?", back: "Cuticle (outer), cortex (middle), and medulla (inner)", category: "hair-structure", difficulty: "easy" },
  { chapterNumber: 10, front: "What is the cuticle?", back: "The outer protective layer of hair made of overlapping scales", category: "hair-structure", difficulty: "easy" },
  { chapterNumber: 10, front: "What is the cortex?", back: "The middle layer containing melanin that gives hair its color and strength", category: "hair-structure", difficulty: "easy" },
  { chapterNumber: 10, front: "What is the medulla?", back: "The inner core of hair, not present in all hair types", category: "hair-structure", difficulty: "medium" },
  { chapterNumber: 10, front: "What gives hair its color?", back: "Melanin produced by melanocytes in the hair follicle", category: "hair-color", difficulty: "easy" },
  { chapterNumber: 10, front: "What are the two types of melanin?", back: "Eumelanin (brown/black) and pheomelanin (red/yellow)", category: "hair-color", difficulty: "medium" },
  { chapterNumber: 10, front: "What is the pH of healthy hair?", back: "4.5 to 5.5 - slightly acidic", category: "hair-chemistry", difficulty: "medium" },
  { chapterNumber: 10, front: "What is hair porosity?", back: "The hair's ability to absorb and retain moisture", category: "hair-properties", difficulty: "easy" },
  { chapterNumber: 10, front: "What are the three porosity types?", back: "Low (resistant), normal, and high (absorbs quickly)", category: "hair-properties", difficulty: "medium" },
  { chapterNumber: 10, front: "What is hair elasticity?", back: "The ability of hair to stretch and return to its original length", category: "hair-properties", difficulty: "easy" },
  { chapterNumber: 10, front: "What is hair density?", back: "The number of hair strands per square inch on the scalp", category: "hair-properties", difficulty: "easy" },
  { chapterNumber: 10, front: "What is hair texture?", back: "The thickness of individual hair strands: fine, medium, or coarse", category: "hair-properties", difficulty: "easy" },
  { chapterNumber: 10, front: "What are the four basic hair types?", back: "Straight (Type 1), wavy (Type 2), curly (Type 3), and coily (Type 4)", category: "hair-types", difficulty: "easy" },
  { chapterNumber: 10, front: "What is the growth phase of hair called?", back: "Anagen - the active growth phase lasting 2-7 years", category: "hair-growth", difficulty: "medium" },
  { chapterNumber: 10, front: "What is the resting phase of hair called?", back: "Telogen - when hair is shed and the follicle rests", category: "hair-growth", difficulty: "medium" },
  { chapterNumber: 10, front: "How much does hair grow per month?", back: "Approximately 1/2 inch or 1.25 cm per month", category: "hair-growth", difficulty: "easy" },
  { chapterNumber: 10, front: "What is dandruff?", back: "Flaking of the scalp caused by excess oil, yeast, or dry skin", category: "scalp-conditions", difficulty: "easy" },
  { chapterNumber: 10, front: "What is alopecia?", back: "Hair loss or baldness from various causes", category: "hair-conditions", difficulty: "easy" },
  { chapterNumber: 10, front: "What is androgenetic alopecia?", back: "Pattern baldness caused by genetics and hormones", category: "hair-conditions", difficulty: "medium" },
  { chapterNumber: 10, front: "What is alopecia areata?", back: "Autoimmune condition causing patchy hair loss", category: "hair-conditions", difficulty: "medium" },
  { chapterNumber: 10, front: "What is traction alopecia?", back: "Hair loss caused by tight hairstyles pulling on hair", category: "hair-conditions", difficulty: "easy" },
  { chapterNumber: 10, front: "What is telogen effluvium?", back: "Temporary hair shedding caused by stress, illness, or hormonal changes", category: "hair-conditions", difficulty: "hard" },
  { chapterNumber: 10, front: "What is seborrheic dermatitis?", back: "Inflammatory scalp condition causing redness, scales, and itching", category: "scalp-conditions", difficulty: "medium" },
  { chapterNumber: 10, front: "What is psoriasis of the scalp?", back: "Autoimmune condition causing thick, scaly patches on the scalp", category: "scalp-conditions", difficulty: "medium" },
  { chapterNumber: 10, front: "What is tinea capitis?", back: "Fungal infection of the scalp, also called ringworm", category: "scalp-conditions", difficulty: "medium" },
  { chapterNumber: 10, front: "What is trichotillomania?", back: "Compulsive hair pulling disorder", category: "hair-conditions", difficulty: "medium" },
  { chapterNumber: 10, front: "What is a split end?", back: "When the cuticle is damaged and the hair fiber splits", category: "hair-damage", difficulty: "easy" },
  { chapterNumber: 10, front: "What causes hair damage?", back: "Heat, chemicals, mechanical stress, environmental factors, and improper care", category: "hair-damage", difficulty: "easy" },
  { chapterNumber: 10, front: "Why is hair analysis important?", back: "It helps determine appropriate services, products, and identify scalp conditions", category: "professional", difficulty: "easy" }
]

// Chapter 11: Treatment of the Hair and Scalp - 25 flashcards
export const chapter11Flashcards: FlashcardData[] = [
  { chapterNumber: 11, front: "What is a hair and scalp analysis?", back: "Examination to determine condition, type, and appropriate treatments", category: "analysis", difficulty: "easy" },
  { chapterNumber: 11, front: "What tools are used for scalp analysis?", back: "Magnifying lamp, wood's lamp, and sometimes a microscope", category: "tools", difficulty: "medium" },
  { chapterNumber: 11, front: "What is a scalp treatment?", back: "A service to improve scalp condition and promote healthy hair growth", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is a hair conditioning treatment?", back: "A product that improves hair's moisture, strength, and manageability", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is a hot oil treatment?", back: "Warm oil applied to hair and scalp to add moisture and nourishment", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is a protein treatment?", back: "Strengthens hair by depositing protein to repair damage", category: "treatments", difficulty: "medium" },
  { chapterNumber: 11, front: "What is deep conditioning?", back: "Intensive moisture treatment left on hair for extended time with heat", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is the purpose of scalp massage?", back: "Stimulates blood circulation, promotes relaxation, and distributes natural oils", category: "massage", difficulty: "easy" },
  { chapterNumber: 11, front: "What are the five basic massage movements?", back: "Effleurage, petrissage, friction, tapotement, and vibration", category: "massage", difficulty: "medium" },
  { chapterNumber: 11, front: "What is effleurage?", back: "Long, smooth, gliding stroke used to begin and end massage", category: "massage", difficulty: "medium" },
  { chapterNumber: 11, front: "What is petrissage?", back: "Kneading movement that compresses and releases tissue", category: "massage", difficulty: "medium" },
  { chapterNumber: 11, front: "What is a hair mask?", back: "Concentrated treatment that addresses specific hair concerns", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is the difference between moisturizing and protein treatments?", back: "Moisturizing adds water/hydration; protein adds strength and repairs", category: "treatments", difficulty: "medium" },
  { chapterNumber: 11, front: "When should you refer a client to a dermatologist?", back: "When you see signs of infection, severe inflammation, or unexplained hair loss", category: "professional", difficulty: "medium" },
  { chapterNumber: 11, front: "What is aromatherapy in scalp treatments?", back: "Using essential oils for therapeutic benefits during services", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is a steamer used for in hair treatments?", back: "To open cuticles and help treatments penetrate deeper into hair", category: "equipment", difficulty: "easy" },
  { chapterNumber: 11, front: "What is a clarifying treatment?", back: "Removes product buildup, minerals, and impurities from hair", category: "treatments", difficulty: "easy" },
  { chapterNumber: 11, front: "What is chelating shampoo?", back: "Removes mineral deposits and chlorine from hair", category: "products", difficulty: "medium" },
  { chapterNumber: 11, front: "What is a keratin treatment?", back: "Smoothing treatment that reduces frizz and adds shine", category: "treatments", difficulty: "medium" },
  { chapterNumber: 11, front: "How often should treatments be done?", back: "Depends on hair condition: weekly for damaged, monthly for maintenance", category: "treatments", difficulty: "medium" },
  { chapterNumber: 11, front: "What is the role of pH in hair treatments?", back: "Proper pH keeps cuticle closed and maintains hair health", category: "chemistry", difficulty: "medium" },
  { chapterNumber: 11, front: "What are humectants?", back: "Ingredients that attract moisture to hair", category: "ingredients", difficulty: "hard" },
  { chapterNumber: 11, front: "What are emollients?", back: "Ingredients that soften and smooth hair", category: "ingredients", difficulty: "hard" },
  { chapterNumber: 11, front: "Why is client consultation important before treatments?", back: "To identify allergies, assess condition, set expectations, and customize service", category: "professional", difficulty: "easy" },
  { chapterNumber: 11, front: "What is a patch test?", back: "Testing product on small skin area to check for allergic reactions", category: "safety", difficulty: "easy" }
]

// Chapter 12: Men's Facial Massage and Treatments - 25 flashcards
export const chapter12Flashcards: FlashcardData[] = [
  { chapterNumber: 12, front: "What are the benefits of facial massage?", back: "Improves circulation, relaxes muscles, promotes product absorption, and enhances skin tone", category: "benefits", difficulty: "easy" },
  { chapterNumber: 12, front: "What are the 13 facial muscles?", back: "Frontalis, occipitalis, orbicularis oculi, corrugator, procerus, orbicularis oris, buccinator, zygomaticus major, zygomaticus minor, levator anguli oris, depressor anguli oris, mentalis, and platysma", category: "anatomy", difficulty: "hard" },
  { chapterNumber: 12, front: "What is the frontalis muscle?", back: "Muscle across the forehead that raises eyebrows and wrinkles forehead", category: "anatomy", difficulty: "medium" },
  { chapterNumber: 12, front: "What is the orbicularis oculi?", back: "Circular muscle around the eye that closes the eyelid", category: "anatomy", difficulty: "medium" },
  { chapterNumber: 12, front: "What is the orbicularis oris?", back: "Muscle around the mouth that controls lip movement", category: "anatomy", difficulty: "medium" },
  { chapterNumber: 12, front: "What is a facial treatment?", back: "A service to cleanse, exfoliate, and improve skin condition", category: "treatments", difficulty: "easy" },
  { chapterNumber: 12, front: "What is exfoliation?", back: "Removal of dead skin cells from the skin's surface", category: "treatments", difficulty: "easy" },
  { chapterNumber: 12, front: "What are the two types of exfoliation?", back: "Mechanical (scrubs) and chemical (acids/enzymes)", category: "treatments", difficulty: "easy" },
  { chapterNumber: 12, front: "What is a facial mask?", back: "Treatment product that addresses specific skin concerns", category: "treatments", difficulty: "easy" },
  { chapterNumber: 12, front: "What is toner used for?", back: "Balances skin pH, removes residue, and prepares skin for moisturizer", category: "products", difficulty: "easy" },
  { chapterNumber: 12, front: "What is moisturizer?", back: "Product that hydrates and protects the skin barrier", category: "products", difficulty: "easy" },
  { chapterNumber: 12, front: "What is the difference between astringent and toner?", back: "Astringent is stronger, often alcohol-based; toner is gentler and balancing", category: "products", difficulty: "medium" },
  { chapterNumber: 12, front: "What is a hot towel treatment?", back: "Warm towel applied to face to soften skin and open pores before shaving", category: "services", difficulty: "easy" },
  { chapterNumber: 12, front: "What is a beard treatment?", back: "Service to cleanse, condition, and groom facial hair and skin beneath", category: "services", difficulty: "easy" },
  { chapterNumber: 12, front: "What is beard oil?", back: "Product that moisturizes facial hair and underlying skin", category: "products", difficulty: "easy" },
  { chapterNumber: 12, front: "What is beard balm?", back: "Leave-in conditioner that provides hold and styling for beards", category: "products", difficulty: "easy" },
  { chapterNumber: 12, front: "What are the contraindications for facial massage?", back: "Skin infections, severe acne, open wounds, recent surgery, or certain medical conditions", category: "safety", difficulty: "medium" },
  { chapterNumber: 12, front: "What is the direction of facial massage?", back: "Upward and outward to avoid dragging skin down", category: "technique", difficulty: "easy" },
  { chapterNumber: 12, front: "What is sinus pressure relief massage?", back: "Gentle pressure on sinus points to relieve congestion", category: "technique", difficulty: "medium" },
  { chapterNumber: 12, front: "What is a facial steamer?", back: "Device that produces warm steam to open pores and soften skin", category: "equipment", difficulty: "easy" },
  { chapterNumber: 12, front: "What is high-frequency treatment?", back: "Uses electrical current to stimulate skin, kill bacteria, and promote healing", category: "treatments", difficulty: "hard" },
  { chapterNumber: 12, front: "What is ultrasonic skin scrubbing?", back: "Uses sound waves to exfoliate and deep clean skin", category: "treatments", difficulty: "hard" },
  { chapterNumber: 12, front: "What is the difference between aftershave lotion and balm?", back: "Lotion is liquid and often alcohol-based; balm is creamier and more moisturizing", category: "products", difficulty: "easy" },
  { chapterNumber: 12, front: "What is ingrown hair?", back: "Hair that grows back into the skin causing inflammation", category: "conditions", difficulty: "easy" },
  { chapterNumber: 12, front: "How can ingrown hairs be prevented?", back: "Proper shaving technique, exfoliation, and using appropriate products", category: "prevention", difficulty: "easy" }
]

// Export
export const expansionPart3 = {
  chapter10: chapter10Flashcards,
  chapter11: chapter11Flashcards,
  chapter12: chapter12Flashcards,
  total: chapter10Flashcards.length + chapter11Flashcards.length + chapter12Flashcards.length
}
