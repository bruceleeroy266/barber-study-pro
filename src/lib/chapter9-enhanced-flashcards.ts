/**
 * CHAPTER 9 ENHANCED FLASHCARDS
 * The Skin: Structure, Disorders, and Diseases
 * Deep Educational Review Addition
 * SAFETY & INFECTION CONTROL CRITICAL
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Skin Structure - Epidermis (10 cards)
export const chapter9Epidermis: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What are the five layers of the epidermis from outermost to innermost?",
    back: "1. Stratum corneum (horny layer), 2. Stratum lucidum (clear layer), 3. Stratum granulosum (granular layer), 4. Stratum spinosum (spiny layer), 5. Stratum germinativum/basal layer (growth layer). Remember: Come Let's Get Sun Burned.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is the stratum corneum and why is it important for barbering services?",
    back: "The outermost layer of dead, flattened cells that creates a protective barrier. It's the layer barbers work on during shaves and facials. Healthy stratum corneum is smooth and properly hydrated. Damaged barrier increases infection risk.",
    category: "skin-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is the stratum germinativum and why is it critical?",
    back: "The deepest layer of the epidermis where new skin cells are produced through mitosis. Also called the basal layer or growth layer. Contains melanocytes that produce melanin. Damage to this layer affects skin regeneration and pigmentation.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How long does it take for a skin cell to travel from the stratum germinativum to the stratum corneum?",
    back: "Approximately 28 days in healthy young adults, longer as we age. This cell turnover rate is why exfoliation helps remove dead skin buildup. Understanding this helps barbers recommend appropriate facial treatment timing.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is the stratum lucidum and where is it found?",
    back: "A clear, transparent layer found only in thick skin (palms and soles). Not present in facial skin. Provides additional protection in high-friction areas. Barbers typically don't encounter this layer in their work.",
    category: "skin-structure",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What happens in the stratum granulosum?",
    back: "Skin cells begin to die and flatten, releasing lipids that help waterproof the skin. Cells appear granular under microscope. This layer creates the moisture barrier that protects against dehydration and prevents pathogen entry.",
    category: "skin-structure",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What are melanocytes and where are they located?",
    back: "Specialized cells in the stratum germinativum that produce melanin (skin pigment). They protect skin from UV damage by producing more melanin when exposed to sun. Melanin production determines skin, hair, and eye color.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "Why is the epidermis called avascular?",
    back: "The epidermis contains no blood vessels. It receives nutrients through diffusion from blood vessels in the dermis below. This is why superficial cuts to epidermis don't bleed, but deeper cuts into dermis do.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How does the epidermis protect against infection?",
    back: "Multiple ways: dead cell barrier (stratum corneum), acidic pH (acid mantle around 5.5), constant cell renewal pushing pathogens outward, lipid barrier preventing penetration, and immune cells (Langerhans cells) detecting threats.",
    category: "skin-structure",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What is keratin and why is it important in the epidermis?",
    back: "A tough, fibrous protein that makes up skin, hair, and nails. As epidermal cells move upward, they fill with keratin (keratinization), die, and create a protective waterproof barrier. Strong keratin = healthy skin barrier.",
    category: "skin-structure",
    difficulty: "easy"
  }
]

// Skin Structure - Dermis & Subcutaneous (8 cards)
export const chapter9DermisSubcutaneous: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What are the two layers of the dermis and their main characteristics?",
    back: "Papillary layer (upper): thin, with capillaries, nerve endings, and touch receptors. Reticular layer (lower): thick, dense, contains collagen, elastin, oil glands, sweat glands, hair follicles, and blood vessels. Dermis is 25x thicker than epidermis.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What gives skin its strength and elasticity?",
    back: "Collagen provides strength and structure. Elastin provides elasticity (ability to stretch and return). Both are proteins in the dermis. As we age, collagen and elastin degrade, causing wrinkles and sagging. UV exposure accelerates this damage.",
    category: "skin-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is the subcutaneous tissue and its main functions?",
    back: "The deepest layer beneath the dermis, made of adipose (fat) tissue. Functions: insulation (body temperature), shock absorption (protects organs and bones), energy storage, and connects skin to underlying muscles and bones.",
    category: "skin-structure",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "Why is blood supply in the dermis important for barbering services?",
    back: "Dermis contains extensive blood vessels that nourish skin, regulate temperature, and enable healing. Shaving cuts that reach dermis bleed. Good blood flow ensures: faster healing, better product absorption during facials, and healthy skin color.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What types of sensory nerve endings are found in the dermis?",
    back: "Touch receptors (light pressure), pressure receptors (deep pressure), pain receptors (nociceptors), heat receptors (thermoreceptors - warmth), and cold receptors (thermoreceptors - cold). These allow skin to sense environment and detect potential harm.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What are dermal papillae and why do they matter?",
    back: "Small, finger-like projections of the papillary dermis that extend into the epidermis. They increase surface area for nutrient exchange, anchor epidermis to dermis, and contain capillaries and nerve endings. Create fingerprint patterns on palms/soles.",
    category: "skin-structure",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "How does skin thickness vary across the body?",
    back: "Thinnest: eyelids (0.5mm). Thickest: palms and soles (4mm+). Facial skin is relatively thin, making it sensitive and vulnerable to damage. Continuous pressure creates calluses (thickened stratum corneum). Understanding thickness helps determine appropriate service pressure.",
    category: "skin-structure",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What causes a scar to form in the dermis?",
    back: "Deep injury to dermis triggers collagen production to repair damage. Excessive or disorganized collagen creates raised scars (keloids, hypertrophic). Insufficient collagen creates depressed scars (atrophic). Scar tissue lacks hair follicles, sweat glands, and normal elasticity.",
    category: "skin-structure",
    difficulty: "medium"
  }
]

// Skin Functions (6 cards)
export const chapter9Functions: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What are the six main functions of the skin?",
    back: "1. Protection (barrier against pathogens, injury, UV), 2. Sensation (touch, pain, temperature), 3. Heat regulation (sweating, blood vessel dilation), 4. Excretion (sweat removes waste), 5. Secretion (sebum from oil glands), 6. Absorption (limited, mainly lipid-soluble substances).",
    category: "skin-functions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How does skin regulate body temperature?",
    back: "When hot: blood vessels dilate (more blood flow to surface), sweat glands produce sweat (evaporation cools), skin flushes. When cold: blood vessels constrict (less heat loss), goosebumps (try to trap air), reduced sweating. Critical for survival in temperature extremes.",
    category: "skin-functions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "How does skin protect against pathogens and infection?",
    back: "Physical barrier (stratum corneum), acidic pH (acid mantle inhibits bacteria), constant cell turnover, sebum (antimicrobial properties), immune cells (Langerhans cells), and inflammatory response. Damaged skin = increased infection risk for both client and barber.",
    category: "skin-functions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What substances can skin absorb and why does this matter for barbers?",
    back: "Skin absorbs lipid-soluble (fat-soluble) substances, some gases, and tiny molecules. Water-soluble substances absorb poorly. Matters because: facial products can penetrate skin, chemicals can absorb during services, and intact skin barrier provides better protection than damaged skin.",
    category: "skin-functions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is the acid mantle and why is it important?",
    back: "A slightly acidic protective film (pH 4.5-6.5, ideally 5.5) on skin's surface created by sebum and sweat. Inhibits bacterial and fungal growth, helps maintain moisture barrier. Alkaline products (harsh soaps) disrupt it, increasing infection risk. Preserve with pH-balanced products.",
    category: "skin-functions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How does skin sense touch, pain, and temperature?",
    back: "Specialized nerve endings in dermis: Meissner's corpuscles (light touch), Pacinian corpuscles (deep pressure/vibration), free nerve endings (pain, itch), thermoreceptors (heat and cold). This sensory feedback protects us from injury and allows environmental awareness.",
    category: "skin-functions",
    difficulty: "hard"
  }
]

// Skin Glands (4 cards)
export const chapter9Glands: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What are the two types of sudoriferous (sweat) glands?",
    back: "Eccrine glands: all over body, open directly to skin surface, produce watery sweat for cooling. Apocrine glands: armpits, groin, scalp, open into hair follicles, produce thicker sweat, activated by stress/hormones, cause body odor when bacteria break down secretions.",
    category: "skin-glands",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What are sebaceous glands and what do they produce?",
    back: "Oil glands attached to hair follicles throughout body (except palms/soles). Produce sebum: oily substance that lubricates skin and hair, maintains acid mantle, provides antimicrobial protection. Overactive = oily skin/acne. Underactive = dry skin.",
    category: "skin-glands",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What causes body odor and how can barbers address it professionally?",
    back: "Apocrine sweat (armpits, groin) is odorless until bacteria break it down. Body odor = bacterial metabolism of apocrine secretions. Professional approach: maintain equipment sanitation, use clean capes/towels, ensure good ventilation. Never shame clients.",
    category: "skin-glands",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "Why do teenagers often develop oily skin and acne?",
    back: "Hormonal changes during puberty (androgens) trigger sebaceous glands to produce excess sebum. Combination of excess oil, dead skin cells, bacteria (P. acnes), and inflammation causes acne. Usually improves after puberty as hormones stabilize.",
    category: "skin-glands",
    difficulty: "easy"
  }
]

// Primary Lesions (9 cards) - STATE BOARD CRITICAL
export const chapter9PrimaryLesions: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What is a macule? Give an example.",
    back: "A flat, discolored spot on skin (not raised or depressed), less than 1cm. Examples: freckles, flat moles, vitiligo patches. No texture change, only color change. Safe to work on unless part of contagious condition.",
    category: "primary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a papule? Give an example.",
    back: "Small, solid, raised bump less than 1cm, may be skin-colored or pigmented. Examples: elevated moles, warts, acne (early stage). Feel firm to touch. Avoid if suspected contagious (warts). Never lance or squeeze.",
    category: "primary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a pustule? Give an example.",
    back: "Raised, inflamed lesion containing pus (white/yellow center). Examples: acne pimples, impetigo, folliculitis. Indicates infection. DO NOT lance or squeeze - increases scarring and infection spread risk. Refer if widespread or severe.",
    category: "primary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a vesicle vs. a bulla?",
    back: "Both are fluid-filled blisters. Vesicle: less than 1cm (chickenpox, herpes, poison ivy). Bulla: larger than 1cm (friction blisters, severe burns, bullous impetigo). Never pop or shave over blisters - contamination and infection risk.",
    category: "primary-lesions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a wheal? Give an example.",
    back: "Temporary, itchy, raised swelling (often red/white). Examples: hives, insect bites, allergic reactions. Usually disappears within hours. If client develops wheals during service, stop immediately - possible allergic reaction to products used.",
    category: "primary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a nodule? Give an example.",
    back: "Solid, raised bump larger than 1cm, extends deep into dermis. Examples: cysts, deep acne (nodular acne), lipomas. Feels firm or hard. Some may be painful. Refer to dermatologist if new, changing, or painful.",
    category: "primary-lesions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a cyst? Is it safe to work over?",
    back: "Closed sac containing fluid, semi-solid, or solid material, in or under skin. Examples: sebaceous cyst, acne cyst. Avoid working directly over cysts - risk of rupture, infection, pain. If inflamed or infected (red, warm, painful), refuse service over area.",
    category: "primary-lesions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a tumor in dermatology terms?",
    back: "Abnormal mass of tissue, larger than 2cm, benign or malignant. May be raised or deep. Not all tumors are cancerous. Examples: lipoma (benign fat tumor), skin cancer. Always refer unusual or changing lesions to physician.",
    category: "primary-lesions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "Why is it critical for barbers to recognize different primary lesions?",
    back: "Safety and liability: Identify contagious conditions (refuse service), avoid rupturing lesions (infection spread), recognize when to refer (possible skin cancer), protect client and barber from cross-contamination, demonstrate professionalism and client care.",
    category: "primary-lesions",
    difficulty: "medium"
  }
]

// Secondary Lesions (7 cards) - STATE BOARD CRITICAL
export const chapter9SecondaryLesions: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What is a crust (scab)? When should barbers avoid working over one?",
    back: "Dried serum, blood, or pus on skin surface. Forms after lesion breaks. Examples: scabs from cuts, impetigo crusts, eczema. Avoid working over crusts - may contain pathogens, bleeding risk if removed, poor healing if disturbed. Let heal completely first.",
    category: "secondary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is an excoriation?",
    back: "Skin worn away by scratching, scraping, or chemical injury, exposing dermis. Linear in shape. Examples: scratch marks, skin picking damage. Increased infection risk, may bleed. Avoid service over excoriated areas until healed.",
    category: "secondary-lesions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a fissure? Give an example.",
    back: "Crack or linear break in skin extending into dermis. Examples: chapped lips, cracked heels, athlete's foot cracks. Painful, may bleed, infection risk. Avoid shaving over fissures on face - will cause pain and bleeding.",
    category: "secondary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a scale? Give an example.",
    back: "Flakes of dead skin cells that shed from stratum corneum. Examples: dandruff, psoriasis, dry skin, eczema. Usually not contagious, but may indicate underlying condition. Excessive scaling may require medical referral.",
    category: "secondary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a scar and what causes it?",
    back: "Permanent mark left after healing of deep dermis injury. Collagen replaces normal tissue. Types: hypertrophic (raised), atrophic (depressed), keloid (overgrown). Scars lack normal skin features (no hair follicles, sweat glands, flexibility). Can work over healed scars.",
    category: "secondary-lesions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is a keloid and how does it affect barbering services?",
    back: "Overgrown, raised scar extending beyond original injury boundaries. More common in darker skin. Caused by excess collagen. Avoid unnecessary trauma (aggressive shaving) near keloids. Some clients keloid easily - note in consultation for future caution.",
    category: "secondary-lesions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is an ulcer?",
    back: "Open sore with loss of skin depth, exposing dermis or deeper. May weep or bleed. Examples: diabetic ulcers, pressure sores, advanced skin infections. REFUSE SERVICE - high infection risk, medical condition requiring treatment, potential for serious complications.",
    category: "secondary-lesions",
    difficulty: "medium"
  }
]

// Continue in next section due to length...
