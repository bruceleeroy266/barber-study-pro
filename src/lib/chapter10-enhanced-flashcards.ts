/**
 * CHAPTER 10 ENHANCED FLASHCARDS
 * Properties and Disorders of the Hair and Scalp
 * Complete professional hair analysis and consultation training
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Hair Structure (12 cards)
export const chapter10Structure: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What are the three layers of the hair shaft from outside to inside?",
    back: "Cuticle (outermost protective layer of overlapping scales), Cortex (middle layer, 90% of hair weight, contains strength and pigment), Medulla (innermost layer, may be absent in fine/blonde hair). Remember: Cut Corn Carefully.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the cuticle layer and why is it critical for barbers?",
    back: "Outermost layer of overlapping scales (like roof shingles). Protects cortex, controls porosity, creates shine when smooth. Damaged cuticle = high porosity, dull hair, tangling, breakage. Chemical services and heat damage the cuticle. Healthy cuticle = healthy-looking hair.",
    category: "hair-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is the cortex and what does it contain?",
    back: "Middle layer making up 90% of hair weight. Contains: fibrous proteins (keratin) for strength, melanin for color, elasticity structures. Determines hair's strength, texture, and color. Chemical services (perms, relaxers, color) work in the cortex by altering bonds and pigment.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the medulla and when is it present?",
    back: "Innermost layer composed of round cells. Often absent in fine or blonde hair. Present in coarse hair. Has no known function for barbers. Not involved in chemical services. Cannot see it without microscope. Its presence/absence doesn't affect service decisions.",
    category: "hair-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What structures make up the hair root?",
    back: "Hair follicle (tube-like pocket), hair bulb (enlarged base), dermal papilla (blood/nerve supply at base), sebaceous gland (oil production), arrector pili muscle (causes goosebumps). Root is beneath skin surface where growth occurs.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the dermal papilla and why is it important?",
    back: "Small cone-shaped structure at base of hair bulb containing blood vessels and nerves. Supplies nutrients for hair growth. Damage to dermal papilla = permanent hair loss in that follicle. Healthy blood flow = healthy hair growth. Poor circulation affects growth.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What does the arrector pili muscle do?",
    back: "Tiny muscle attached to hair follicle. Contracts when cold or frightened, causing hair to stand up (goosebumps). Explains why hair 'stands on end.' No direct relevance to barbering services, but part of follicle anatomy students must know for exams.",
    category: "hair-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "How do sebaceous glands affect hair?",
    back: "Oil glands attached to follicles that secrete sebum onto hair and scalp. Sebum lubricates hair, prevents dryness, creates shine. Overactive = oily hair/scalp. Underactive = dry hair/scalp. Affects product selection and service frequency.",
    category: "hair-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What determines straight vs curly hair?",
    back: "Follicle shape and cross-section. Straight hair: round follicle, round cross-section. Wavy: slightly oval. Curly: oval to elliptical. Extremely curly: very elliptical (flat). Shape is genetic, cannot be permanently changed without chemicals. Affects cutting techniques and styling.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What are hair streams, whorls, and cowlicks?",
    back: "Growth patterns affecting hair direction. Stream: hair sloping in same direction. Whorl: circular/swirl pattern (crown). Cowlick: tuft standing straight up. Critical for cutting and styling - work with patterns, not against them. Analyze before cutting.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is vellus hair vs terminal hair?",
    back: "Vellus: short, fine, soft, unpigmented body hair (peach fuzz). Terminal: long, coarse, pigmented hair on scalp, face, body. Hormones can convert vellus to terminal (puberty). Barbers work primarily with terminal hair. Vellus doesn't require cutting.",
    category: "hair-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How does hair structure affect chemical service results?",
    back: "Cuticle condition determines chemical penetration (porosity). Cortex contains bonds that chemicals alter. Coarse hair needs more time/product than fine. Damaged cuticle absorbs chemicals too fast (over-processing risk). Always assess structure before chemical services for safety and optimal results.",
    category: "hair-structure",
    difficulty: "hard"
  }
]

// Chemical Composition & Bonds (10 cards)
export const chapter10Chemistry: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What five elements make up hair (COHNS)?",
    back: "Carbon 51%, Oxygen 21%, Hydrogen 6%, Nitrogen 17%, Sulfur 5%. Remember: COHNS. These combine to form keratin protein. Sulfur creates disulfide bonds (strongest). Understanding composition helps explain why chemicals work.",
    category: "hair-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is keratin and why is it important?",
    back: "Fibrous protein making up hair structure. Formed from amino acids linked by peptide bonds into polypeptide chains. Gives hair strength and structure. Keratin treatments aim to restore/add protein. Damaged hair = broken keratin structure.",
    category: "hair-chemistry",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What are the three types of side bonds in hair?",
    back: "Hydrogen bonds (weak, physical, broken by water), Salt bonds (weak, physical, broken by pH changes), Disulfide bonds (strong, chemical, broken by perms/relaxers). Side bonds hold polypeptide chains together, giving hair strength and shape.",
    category: "hair-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What are hydrogen bonds and how do barbers use them?",
    back: "Weak physical bonds broken by water/heat, reformed by drying. Wet setting, blow drying, flat ironing work by breaking and reforming H-bonds. Changes are TEMPORARY - return when hair gets wet. About 1/3 of hair's strength. Easy to manipulate for styling.",
    category: "hair-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What are salt bonds and what affects them?",
    back: "Weak physical bonds affected by pH changes. Broken by strong alkaline or acidic products. Account for about 1/3 of hair's strength. Reform when pH normalizes. Why pH-balanced products are important. Also called ionic bonds.",
    category: "hair-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What are disulfide bonds and why are they critical?",
    back: "Strongest chemical bonds between sulfur atoms in cysteine amino acids. Account for 1/3 of strength. Broken ONLY by strong chemicals (thioglycolate in perms, sodium hydroxide in relaxers). Changes are PERMANENT until new hair grows. Why chemical services are permanent.",
    category: "hair-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the difference between physical and chemical hair changes?",
    back: "Physical: temporary, affect H-bonds and salt bonds, reversed by water (wet setting, blow drying). Chemical: permanent, break disulfide bonds, require new hair growth to remove (perms, relaxers, permanent color). Understanding this prevents client confusion about service longevity.",
    category: "hair-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How do permanent waves work at the molecular level?",
    back: "1. Thio solution breaks disulfide bonds. 2. Hair shaped around rods. 3. Bonds broken and reformed in new positions. 4. Neutralizer oxidizes and reforms disulfide bonds in curled position. PERMANENT until new growth. Must break and reform S-bonds chemically.",
    category: "hair-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What happens to hair bonds during wet setting?",
    back: "Water breaks hydrogen bonds. Hair molded into desired shape (rollers, pin curls). As hair dries, H-bonds reform in new position creating curl/wave. TEMPORARY - returns to natural state when rewetted. No chemical change occurs. Safe, reversible process.",
    category: "hair-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "Why is understanding hair chemistry important for barbers?",
    back: "Determines service selection (temporary vs permanent), explains why services work, prevents damage (choosing appropriate chemicals), sets realistic client expectations, helps troubleshoot problems, ensures safe chemical application, guides product selection. Science behind the services.",
    category: "hair-chemistry",
    difficulty: "easy"
  }
]

// Growth Cycles (8 cards)
export const chapter10Growth: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What are the three phases of hair growth?",
    back: "Anagen (growth phase): new cells manufactured, lasts 2-10 years, 90% of scalp hair. Catagen (transition): follicle shrinks, 2-3 weeks. Telogen (resting/shedding): hair sheds, new growth begins, 3-6 months, 10% of hair. Remember: ACT - Anagen, Catagen, Telogen.",
    category: "growth-cycles",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What happens during the anagen phase?",
    back: "Active growth phase lasting 2-10 years. New cells manufactured in hair bulb. Determines maximum hair length (longer anagen = longer potential length). 90% of scalp hair is in anagen. Hair actively growing 0.5 inch per month on average.",
    category: "growth-cycles",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What happens during the catagen phase?",
    back: "Transition/regression phase lasting 2-3 weeks. Growth stops, follicle shrinks. Hair bulb detaches from dermal papilla. Forms club-shaped end. Brief transitional stage. Less than 1% of hair is in catagen at any time.",
    category: "growth-cycles",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What happens during the telogen phase?",
    back: "Resting/shedding phase lasting 3-6 months. Old hair sheds (normal shedding). Follicle rests. New anagen phase begins, pushing out old hair. 10% of hair is in telogen. Normal to lose 75-100 hairs daily during telogen.",
    category: "growth-cycles",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "How much daily hair shedding is normal?",
    back: "75-100 hairs per day is normal telogen shedding. NOT the same as hair loss (alopecia). Notice more in shower/brushing. Seasonal variations normal. More than 100-150 daily = possible issue, recommend physician consultation.",
    category: "growth-cycles",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is the average hair growth rate?",
    back: "0.5 inch per month (6 inches per year) average for scalp hair. Varies by individual, age, health, genetics. Faster in summer, slower in winter. Growth rate determines how often cuts needed. Cannot significantly accelerate natural growth rate.",
    category: "growth-cycles",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What factors affect hair growth cycles?",
    back: "Age (slows with age), hormones (puberty, pregnancy, menopause), nutrition (protein, vitamins), health conditions, medications, stress, seasonal changes. Factors can shorten anagen or extend telogen. Why some clients experience changes in hair growth/thickness.",
    category: "growth-cycles",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "Does shaving make hair grow back thicker or faster?",
    back: "MYTH - FALSE. Shaving doesn't affect follicle or growth rate. Blunt cut end feels coarser than natural tapered tip. Growth rate unchanged. Important to educate clients. Shaving only affects visible hair shaft, not root where growth occurs.",
    category: "growth-cycles",
    difficulty: "easy"
  }
]

// Hair Properties - Texture & Density (8 cards)
export const chapter10Properties1: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is hair texture and how is it measured?",
    back: "Diameter of individual hair strand. Coarse (largest diameter), Medium (average), Fine (smallest diameter). Test by feeling single strand between fingers. Texture affects: processing time, product amount needed, strength, cutting techniques. Genetic, cannot be changed permanently.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What are the characteristics of coarse hair?",
    back: "Largest diameter, strongest, most resistant to chemicals, requires more processing time/product, holds styles well, can appear thick even with normal density, harder to damage but harder to process. Often confused with thick/dense hair (different concepts).",
    category: "hair-properties",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What are the characteristics of fine hair?",
    back: "Smallest diameter, fragile, processes faster, needs less product, prone to damage, often looks limp, less resistant to chemicals, can appear thin even with normal density. Requires gentle handling and lighter products. Can build up easily with heavy products.",
    category: "hair-properties",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is hair density and how is it different from texture?",
    back: "Number of hairs per square inch. High (many hairs), Medium (average), Low (fewer hairs). Texture = individual strand thickness. Density = how many strands. Can have fine texture with high density or coarse texture with low density. Both affect service approach.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is average hair density?",
    back: "Approximately 2,200 strands per square inch on scalp. Total: Blonde ~140,000 hairs, Brown ~110,000, Black ~108,000, Red ~80,000 (red typically lowest density). Density varies by hair color due to strand thickness differences.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How does texture affect haircutting?",
    back: "Coarse: use sharp shears, may need thinning, holds blunt lines well. Fine: gentler techniques, avoid over-thinning (looks thinner), point cutting adds texture without removing density. Medium: most versatile. Texture determines cutting approach for desired result.",
    category: "hair-properties",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "How does density affect haircutting?",
    back: "High density: may need thinning, longer cutting time, more layers for manageability, uses more product. Low density: avoid thinning, creates illusion of thickness, careful with graduation. Density affects bulk removal and style support.",
    category: "hair-properties",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "How do texture and density affect chemical services?",
    back: "Fine texture + low density: process faster, use weaker formulas, less time. Coarse texture + high density: more processing time, stronger formulas, more product. Must assess both properties for safe, effective chemical services. Combination determines approach.",
    category: "hair-properties",
    difficulty: "hard"
  }
]

// Continued in part 2...
