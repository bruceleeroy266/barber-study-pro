/**
 * CHAPTER 7 ENHANCED FLASHCARDS
 * Deep Educational Review Addition
 * Basics of Chemistry - Barber-Specific Applications
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Barber-Specific Chemistry Applications (15 new cards)
export const chapter7BarberApplications: FlashcardData[] = [
  {
    chapterNumber: 7,
    front: "Why is understanding chemistry important for barbers?",
    back: "Chemistry knowledge helps barbers use products safely and effectively, understand how chemical services work, prevent unwanted reactions, and explain product benefits to clients.",
    category: "barbering-applications",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "How does pH affect hair color results?",
    back: "Alkaline pH (high pH) opens the hair cuticle to allow color molecules to enter. Acidic pH (low pH) closes the cuticle to seal in color and add shine. Using the wrong pH can result in poor color penetration or excessive damage.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What chemical reaction occurs during permanent waving?",
    back: "Permanent waving uses reduction (breaking disulfide bonds in the hair) followed by oxidation (reforming bonds in a new shape). The reducing solution breaks bonds, hair is shaped, then neutralizer (oxidizer) reforms bonds.",
    category: "barbering-applications",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What role do surfactants play in shampoos?",
    back: "Surfactants are cleansing agents that allow oil and water to mix. One end attracts oil (dirt and sebum) while the other attracts water, allowing dirt to be rinsed away. They create lather and remove buildup.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "Why is mixing bleach and ammonia dangerous in a barbershop?",
    back: "Mixing bleach (sodium hypochlorite) with ammonia creates toxic chloramine gas, which can cause respiratory damage, eye irritation, and even death. Never mix cleaning chemicals or use them together.",
    category: "safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is the difference between temporary, semi-permanent, and permanent hair color chemically?",
    back: "Temporary color coats the hair surface (physical change). Semi-permanent partially penetrates with small molecules (minimal chemical change). Permanent color uses oxidation to create large molecules inside the hair shaft (chemical change).",
    category: "barbering-applications",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "How do chemical relaxers work on hair?",
    back: "Relaxers use strong alkalis (high pH 10-14) to break disulfide bonds in the hair's cortex, allowing the hair to be straightened. The bonds are then reformed in the new straightened position, permanently altering the hair structure.",
    category: "barbering-applications",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What chemical reaction causes developer (hydrogen peroxide) to lighten hair?",
    back: "Hydrogen peroxide undergoes oxidation, releasing oxygen that breaks down melanin pigment in the hair cortex. This chemical reaction permanently lightens natural hair color by removing pigment.",
    category: "barbering-applications",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "Why must hair be clean before chemical services?",
    back: "Product buildup, oil, and dirt can create a barrier that prevents even chemical penetration, leading to uneven results. Clean hair ensures chemicals can access the hair shaft uniformly for consistent results.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is a pH-balanced shampoo and why does it matter?",
    back: "A pH-balanced shampoo has a pH close to hair's natural pH (4.5-5.5). It cleans without excessively opening the cuticle, preventing damage and frizz. Unbalanced pH can leave hair dry, tangled, or damaged.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "How do conditioners work chemically?",
    back: "Conditioners contain cationic (positively charged) molecules that are attracted to the negatively charged damaged areas of hair. They coat the hair shaft, smooth the cuticle, add moisture, and improve manageability.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What causes product buildup on hair and how does clarifying shampoo remove it?",
    back: "Buildup occurs when oils, silicones, and styling products accumulate on the hair shaft. Clarifying shampoos use stronger surfactants and sometimes chelating agents to break down and remove these deposits more effectively than regular shampoo.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "Why can't you perm and color hair on the same day?",
    back: "Both services use strong chemicals that stress the hair. Perming breaks and reforms disulfide bonds while coloring opens the cuticle and deposits pigment. Doing both causes excessive damage and unpredictable results. Wait 1-2 weeks between services.",
    category: "barbering-applications",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is the 'strand test' and why is it important before chemical services?",
    back: "A strand test applies the chemical product to a small section of hair to check reaction, processing time, and final result before treating all hair. It prevents unexpected damage, over-processing, or poor results.",
    category: "barbering-applications",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "How do styling products like gel and pomade work chemically?",
    back: "These products contain polymers (long-chain molecules) that form a film on hair when dry, holding hair in place. Water-based products can be reactivated with water; oil-based products require shampooing to remove.",
    category: "barbering-applications",
    difficulty: "medium"
  }
]

// Chemical Safety & Regulations (10 new cards)
export const chapter7SafetyCards: FlashcardData[] = [
  {
    chapterNumber: 7,
    front: "What is an MSDS/SDS and why is it important?",
    back: "Material Safety Data Sheet (now called Safety Data Sheet) provides critical information about chemical products: hazards, safe handling, storage, first aid, and emergency procedures. OSHA requires shops to have SDS for all chemicals.",
    category: "safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What are the main sections of an SDS sheet?",
    back: "Key sections include: product identification, hazard identification, composition/ingredients, first aid measures, fire-fighting measures, storage and handling, and exposure controls/PPE requirements.",
    category: "safety",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What is the proper way to store chemical products in a barbershop?",
    back: "Store in original containers with labels intact, in a cool dry place away from heat/sunlight, separate incompatible chemicals, keep out of client reach, and ensure proper ventilation. Never transfer to unmarked containers.",
    category: "safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What should you do if a client gets chemical solution in their eyes?",
    back: "Immediately flush eyes with lukewarm water for at least 15-20 minutes, holding eyelids open. Remove contact lenses if present. Do not let client rub eyes. Seek medical attention immediately and bring product SDS.",
    category: "safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is proper ventilation and why does it matter for chemical services?",
    back: "Proper ventilation means adequate airflow to remove chemical fumes and vapors. It prevents inhalation of toxic fumes, reduces respiratory irritation, and minimizes fire hazards from flammable vapors. Open windows and use exhaust fans.",
    category: "safety",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "What personal protective equipment (PPE) should barbers use during chemical services?",
    back: "Wear gloves (nitrile or vinyl) to protect hands, apron or cape to protect clothing, and in some cases safety glasses to protect eyes. Always follow product SDS recommendations for specific PPE.",
    category: "safety",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "How should chemical waste be disposed of in a barbershop?",
    back: "Follow local regulations and SDS disposal instructions. Never pour strong chemicals down drains without proper neutralization. Use designated chemical waste containers. Some products require special hazardous waste disposal.",
    category: "safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What are chemical burns and how are they different from heat burns?",
    back: "Chemical burns occur when acids or alkalis damage skin tissue through chemical reaction, not heat. They can continue causing damage until the chemical is completely removed. Flush with water immediately for 15-20 minutes.",
    category: "safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "Why should chemicals never be measured or mixed near clients?",
    back: "Mixing chemicals near clients risks splashing product on them, exposing them to fumes, and appearing unprofessional. Always mix chemicals in a well-ventilated back room or designated area away from client services.",
    category: "safety",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "What is shelf life and why does it matter for barbering chemicals?",
    back: "Shelf life is how long a product remains effective and safe to use. Expired chemicals can lose effectiveness, become unstable, or even dangerous. Always check expiration dates and discard old products properly.",
    category: "safety",
    difficulty: "easy"
  }
]

// Advanced Chemistry Concepts (15 new cards)
export const chapter7AdvancedConcepts: FlashcardData[] = [
  {
    chapterNumber: 7,
    front: "What are ions and why are they important in hair chemistry?",
    back: "Ions are atoms with an electric charge (positive or negative). In hair chemistry, cationic (positive) ingredients are attracted to damaged (negative) hair areas, while anionic (negative) ingredients repel. This affects how products work.",
    category: "advanced-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What are hydrogen bonds in hair and why do they matter?",
    back: "Hydrogen bonds are weak temporary bonds in hair that are easily broken by water and reformed by drying. They're responsible for temporary styling - hair can be set when wet and holds the shape when dry. Broken by water, heat, or humidity.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What are disulfide bonds and why are they called 'permanent' bonds?",
    back: "Disulfide bonds are strong chemical bonds between sulfur atoms in the hair's cortex. They can only be broken by chemical processes (perms, relaxers) not water or heat. They determine hair's permanent shape and strength.",
    category: "advanced-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What is the difference between volatile and non-volatile substances?",
    back: "Volatile substances evaporate quickly at room temperature (like alcohol in hairspray). Non-volatile substances do not evaporate easily (like oils in pomade). Volatility affects how products dry and last on hair.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What are polymers and how are they used in hair products?",
    back: "Polymers are large molecules made of repeating units. In hair products, they form films that provide hold (gels), add shine (serums), or protect hair (heat protectants). Different polymers provide different benefits.",
    category: "advanced-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What is viscosity and why does it matter for barbering products?",
    back: "Viscosity is a liquid's thickness or resistance to flow. Low viscosity = thin/watery (toners), high viscosity = thick (gels, creams). Viscosity affects application ease and how products spread through hair.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is concentration and how does it affect product strength?",
    back: "Concentration is the amount of active ingredient in a solution. Higher concentration = stronger product. For example, 20-volume developer has more peroxide than 10-volume, making it stronger for lightening hair.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is chemical incompatibility and give an example?",
    back: "Chemical incompatibility occurs when two substances react dangerously when mixed. Example: mixing metallic dyes with oxidative color can cause heat, smoking, or hair breakage. Always check product compatibility before mixing.",
    category: "advanced-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What are chelating agents and when are they used?",
    back: "Chelating agents bind to mineral deposits (like calcium, iron, chlorine) and remove them from hair. Used to remove hard water buildup, chlorine damage, or mineral discoloration before chemical services.",
    category: "advanced-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What is the pH of water and why is it considered neutral?",
    back: "Pure water has a pH of 7.0, which is exactly in the middle of the pH scale (0-14). It's neither acidic (below 7) nor alkaline (above 7), so it's called neutral. Most drinking water is slightly alkaline (pH 7-8).",
    category: "advanced-chemistry",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "What happens to the hair cuticle at different pH levels?",
    back: "Low pH (acidic): cuticle lays flat, smooth, shiny. pH 4.5-5.5 is ideal. High pH (alkaline): cuticle swells and opens, allowing chemical penetration but risking damage. Extreme pH can permanently damage hair structure.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is the difference between porosity and elasticity in hair?",
    back: "Porosity is hair's ability to absorb moisture (affected by cuticle condition). Elasticity is hair's ability to stretch and return without breaking (affected by protein bonds). Both indicate hair health and affect chemical service results.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is hard water and how does it affect hair services?",
    back: "Hard water contains high mineral content (calcium, magnesium). It can prevent shampoo from lathering, leave residue on hair, cause color to appear dull, and interfere with chemical processes. Use chelating shampoos to remove buildup.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is the difference between an acid and an alkali in barbering products?",
    back: "Acids (pH below 7) close the cuticle, add shine, neutralize chemicals, and condition. Alkalis (pH above 7) open the cuticle, allow chemical penetration, and can be harsh. Most styling products are slightly acidic for better results.",
    category: "advanced-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "Why is understanding chemical reactions important for preventing color correction problems?",
    back: "Chemical reactions can create unexpected results when services overlap. Previous color, metals in hair, medication in the client's system, or incompatible products can all cause reactions. Understanding chemistry helps predict and prevent disasters.",
    category: "advanced-chemistry",
    difficulty: "hard"
  }
]

// Product Chemistry & Ingredients (10 new cards)
export const chapter7ProductChemistry: FlashcardData[] = [
  {
    chapterNumber: 7,
    front: "What are the main ingredients in most shampoos?",
    back: "Water (solvent), surfactants/detergents (cleansing agents), conditioning agents, fragrance, preservatives, and pH adjusters. Professional shampoos may include proteins, oils, or specialty ingredients for specific hair types.",
    category: "product-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is the difference between silicone-based and water-based pomades?",
    back: "Silicone-based pomades provide high shine and strong hold but can cause buildup requiring clarifying shampoo. Water-based pomades are easier to wash out, reactivate with water, but may provide less shine. Each has different hold and finish.",
    category: "product-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What do proteins in hair products do?",
    back: "Proteins (keratin, wheat protein, silk protein) temporarily fill in damaged areas of the hair shaft, strengthen hair, add body, and reduce breakage. Overuse can make hair stiff; balance with moisture treatments.",
    category: "product-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What are parabens and why do some products avoid them?",
    back: "Parabens are preservatives that prevent bacterial growth in products. Some manufacturers avoid them due to consumer preference and potential hormone disruption concerns. Paraben-free products use alternative preservatives like phenoxyethanol.",
    category: "product-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What is the purpose of alcohol in hair products?",
    back: "Alcohol serves different purposes: Ethanol helps products dry quickly and provides hold. Cetyl/stearyl alcohols (fatty alcohols) actually condition and moisturize hair. Not all alcohols are drying - check the type.",
    category: "product-chemistry",
    difficulty: "medium"
  },
  {
    chapterNumber: 7,
    front: "What are essential oils and how do they differ from fragrance oils?",
    back: "Essential oils are natural concentrated plant extracts with therapeutic properties and natural scents. Fragrance oils are synthetic scents created in labs. Essential oils may provide benefits beyond scent but can cause allergies.",
    category: "product-chemistry",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "What is the difference between clarifying, moisturizing, and volumizing shampoos chemically?",
    back: "Clarifying: stronger surfactants to remove buildup. Moisturizing: milder cleansers with added oils/conditioners. Volumizing: lighter formula without heavy conditioning agents, may contain proteins to add body.",
    category: "product-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "Why do some hair products need to be shaken before use?",
    back: "Products with suspensions (solid particles in liquid) or emulsions that separate over time need shaking to redistribute ingredients evenly. If ingredients don't mix properly, the product won't work as designed.",
    category: "product-chemistry",
    difficulty: "easy"
  },
  {
    chapterNumber: 7,
    front: "What is the 'curl pattern' affected by chemically and physically?",
    back: "Chemically: Disulfide bonds determine permanent curl pattern (changed by relaxers/perms). Physically: Hydrogen bonds create temporary shape (changed by water, heat styling). Understanding both helps predict styling results.",
    category: "product-chemistry",
    difficulty: "hard"
  },
  {
    chapterNumber: 7,
    front: "What makes professional barbering products different from store-bought products chemically?",
    back: "Professional products often have higher concentration of active ingredients, better quality ingredients, more specific pH formulation, and are designed for use with professional techniques. They provide more predictable, longer-lasting results.",
    category: "product-chemistry",
    difficulty: "medium"
  }
]

// Export all enhanced flashcards
export const chapter7AllEnhanced = [
  ...chapter7BarberApplications,
  ...chapter7SafetyCards,
  ...chapter7AdvancedConcepts,
  ...chapter7ProductChemistry
]

export const chapter7EnhancedStats = {
  barberApplications: chapter7BarberApplications.length,
  safety: chapter7SafetyCards.length,
  advancedConcepts: chapter7AdvancedConcepts.length,
  productChemistry: chapter7ProductChemistry.length,
  total: chapter7AllEnhanced.length
}

console.log(`Chapter 7 Enhanced Flashcards: ${chapter7EnhancedStats.total} new cards created`)
