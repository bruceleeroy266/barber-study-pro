/**
 * Flashcard Expansion Part 4
 * Chapters 13, 14, 17, 18, 19, 20, 21
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Chapter 13: Shaving and Facial Hair Design - 30 flashcards
export const chapter13Flashcards: FlashcardData[] = [
  { chapterNumber: 13, front: "What are the two main types of shaving?", back: "Wet shaving (with water/lather) and dry shaving (electric)", category: "shaving-types", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a straight razor?", back: "A single blade that folds into its handle, used for traditional shaving", category: "tools", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a safety razor?", back: "A razor with a protective guard to reduce cuts", category: "tools", difficulty: "easy" },
  { chapterNumber: 13, front: "What is shaving cream used for?", back: "To lubricate skin, soften hair, and protect from irritation", category: "products", difficulty: "easy" },
  { chapterNumber: 13, front: "What is the difference between shaving cream and gel?", back: "Cream is richer and more moisturizing; gel is lighter and transparent", category: "products", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a shaving brush?", back: "Brush used to apply lather and exfoliate skin before shaving", category: "tools", difficulty: "easy" },
  { chapterNumber: 13, front: "What is the proper shaving direction?", back: "With the grain (hair growth direction) to minimize irritation", category: "technique", difficulty: "easy" },
  { chapterNumber: 13, front: "What is shaving against the grain?", back: "Shaving opposite to hair growth for a closer shave but more irritation risk", category: "technique", difficulty: "medium" },
  { chapterNumber: 13, front: "What is the T-bar area?", back: "The mustache and chin area where facial hair is typically densest", category: "anatomy", difficulty: "easy" },
  { chapterNumber: 13, front: "What is beard mapping?", back: "Determining the direction of hair growth on an individual's face", category: "technique", difficulty: "medium" },
  { chapterNumber: 13, front: "What is the purpose of pre-shave oil?", back: "To add extra lubrication and protect sensitive skin", category: "products", difficulty: "easy" },
  { chapterNumber: 13, front: "What causes razor burn?", back: "Friction, dull blades, shaving too close, or sensitive skin", category: "problems", difficulty: "easy" },
  { chapterNumber: 13, front: "What causes razor bumps?", back: "Hairs growing flat against the skin or curling back into the follicle", category: "problems", difficulty: "easy" },
  { chapterNumber: 13, front: "How can razor bumps be prevented?", back: "Proper preparation, sharp blades, with-the-grain shaving, and aftercare", category: "prevention", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a neck shave?", back: "Shaving the hair below the jawline and on the neck area", category: "services", difficulty: "easy" },
  { chapterNumber: 13, front: "What is edging or outlining?", back: "Creating clean lines around beard, mustache, or hairline", category: "technique", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a fade in beard design?", back: "Gradual transition from skin to full beard density", category: "design", difficulty: "medium" },
  { chapterNumber: 13, front: "What are the basic beard styles?", back: "Full beard, goatee, van dyke, chin strap, stubble, and clean shaven", category: "styles", difficulty: "easy" },
  { chapterNumber: 13, front: "What is mustache wax?", back: "Product to shape, style, and hold mustache hair in place", category: "products", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a straight razor strop?", back: "Leather strap used to polish and maintain razor edge", category: "tools", difficulty: "medium" },
  { chapterNumber: 13, front: "How often should a straight razor be honed?", back: "Every 3-6 months with regular use, or when it tugs hair", category: "maintenance", difficulty: "medium" },
  { chapterNumber: 13, front: "What is the 14-stroke honing pattern?", back: "Traditional method of sharpening a straight razor on a whetstone", category: "maintenance", difficulty: "hard" },
  { chapterNumber: 13, front: "What is alum block?", back: "Natural mineral block used to stop bleeding from minor nicks", category: "products", difficulty: "medium" },
  { chapterNumber: 13, front: "What is a styptic pencil?", back: "Stick of alum used to stop bleeding from small cuts", category: "products", difficulty: "easy" },
  { chapterNumber: 13, front: "What is the hot towel preparation?", back: "Warm towel applied to soften beard and open pores before shaving", category: "services", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a cold towel finish?", back: "Cool towel applied after shaving to close pores and soothe skin", category: "services", difficulty: "easy" },
  { chapterNumber: 13, front: "What is facial hair tapering?", back: "Gradually blending facial hair from short to long", category: "technique", difficulty: "medium" },
  { chapterNumber: 13, front: "What is a beard neckline?", back: "The line where beard ends on the neck, typically just above Adam's apple", category: "design", difficulty: "easy" },
  { chapterNumber: 13, front: "What is a cheek line?", back: "The upper boundary of the beard on the cheeks", category: "design", difficulty: "easy" },
  { chapterNumber: 13, front: "Why is stretching the skin important?", back: "It creates a smooth surface for the razor to glide across", category: "technique", difficulty: "easy" }
]

// Chapter 14: Men's Haircutting and Styling - 30 flashcards
export const chapter14Flashcards: FlashcardData[] = [
  { chapterNumber: 14, front: "What are the four basic haircutting tools?", back: "Shears, clippers, trimmers, and razors", category: "tools", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a stationary guide?", back: "Hair that remains at a consistent length to guide cutting", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is a traveling guide?", back: "Guide that moves with each section as you cut", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is elevation in haircutting?", back: "The angle at which hair is held away from the head", category: "technique", difficulty: "easy" },
  { chapterNumber: 14, front: "What is the difference between blunt and layered cuts?", back: "Blunt has uniform length; layered has graduated lengths", category: "technique", difficulty: "easy" },
  { chapterNumber: 14, front: "What is texturizing?", back: "Technique to remove bulk and create movement in hair", category: "technique", difficulty: "easy" },
  { chapterNumber: 14, front: "What is point cutting?", back: "Cutting into hair with shears pointed for soft, textured ends", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is slide cutting?", back: "Sliding shears along hair to remove weight and blend", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is the difference between a fade and taper?", back: "Fade blends to skin; taper leaves some length at the bottom", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What are the clipper guard numbers?", back: "Numbers 0-8 representing lengths from 1/16 inch to 1 inch", category: "tools", difficulty: "easy" },
  { chapterNumber: 14, front: "What is clipper-over-comb?", back: "Using comb to hold hair while cutting with clippers", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is shear-over-comb?", back: "Using comb to hold hair while cutting with shears", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is a hard part?", back: "Shaved line in hair to create defined parting", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a pompadour?", back: "Style with volume on top, swept back from forehead", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a quiff?", back: "Style with front hair swept upward and back", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a crew cut?", back: "Short cut with slightly longer top, tapered sides", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a buzz cut?", back: "Very short uniform cut using one clipper guard", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is an undercut?", back: "Sides and back cut very short with long top", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a side part?", back: "Style parted to one side, classic professional look", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is a Caesar cut?", back: "Short cut with horizontal fringe on forehead", category: "styles", difficulty: "easy" },
  { chapterNumber: 14, front: "What is hair texturizing?", back: "Removing weight to create movement and texture", category: "technique", difficulty: "easy" },
  { chapterNumber: 14, front: "What is thinning hair?", back: "Using thinning shears to reduce bulk without shortening", category: "technique", difficulty: "easy" },
  { chapterNumber: 14, front: "What is razor cutting?", back: "Using razor to create soft, textured, piece-y ends", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is cross-checking?", back: "Checking haircut from multiple angles to ensure evenness", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is palm-to-palm cutting?", back: "Holding hair between palms for even cutting", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is the difference between wet and dry cutting?", back: "Wet gives precision; dry shows natural fall and texture", category: "technique", difficulty: "medium" },
  { chapterNumber: 14, front: "What is pomade?", back: "Oil-based styling product for shine and hold", category: "products", difficulty: "easy" },
  { chapterNumber: 14, front: "What is clay pomade?", back: "Matte-finish product for texture and volume", category: "products", difficulty: "easy" },
  { chapterNumber: 14, front: "What is hair wax?", back: "Flexible hold product for texture and definition", category: "products", difficulty: "easy" },
  { chapterNumber: 14, front: "What is sea salt spray?", back: "Product that adds texture and beachy waves", category: "products", difficulty: "easy" }
]

// Chapter 17: State Board Preparation - 25 flashcards
export const chapter17Flashcards: FlashcardData[] = [
  { chapterNumber: 17, front: "What is the purpose of state barber boards?", back: "To protect public health through licensing and regulation", category: "regulation", difficulty: "easy" },
  { chapterNumber: 17, front: "What are the requirements for barber licensure?", back: "Complete approved training hours, pass written and practical exams", category: "licensing", difficulty: "easy" },
  { chapterNumber: 17, front: "How many training hours are typically required?", back: "Varies by state: usually 1500-2000 hours", category: "licensing", difficulty: "medium" },
  { chapterNumber: 17, front: "What is the written exam?", back: "Multiple-choice test covering theory, safety, and regulations", category: "exams", difficulty: "easy" },
  { chapterNumber: 17, front: "What is the practical exam?", back: "Hands-on demonstration of barbering skills on a model or mannequin", category: "exams", difficulty: "easy" },
  { chapterNumber: 17, front: "What is sanitation?", back: "Practices that reduce pathogens and prevent disease spread", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "What is disinfection?", back: "Killing most microorganisms on non-porous surfaces", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "What is sterilization?", back: "Killing all microorganisms including spores", category: "safety", difficulty: "medium" },
  { chapterNumber: 17, front: "What is Universal Precautions?", back: "Treating all blood and bodily fluids as potentially infectious", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "What is OSHA?", back: "Occupational Safety and Health Administration - sets workplace safety standards", category: "regulation", difficulty: "medium" },
  { chapterNumber: 17, front: "What is MSDS/SDS?", back: "Material Safety Data Sheet/Safety Data Sheet - product safety information", category: "safety", difficulty: "medium" },
  { chapterNumber: 17, front: "What is the difference between cleaning and disinfecting?", back: "Cleaning removes visible debris; disinfecting kills microorganisms", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "How long should tools be disinfected?", back: "Follow manufacturer's instructions, typically 10 minutes", category: "safety", difficulty: "medium" },
  { chapterNumber: 17, front: "What is a blood spill kit?", back: "Supplies for safely cleaning blood and bodily fluids", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "What is the proper way to dispose of sharps?", back: "In a puncture-proof, labeled biohazard container", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "What is continuing education?", back: "Required ongoing learning to maintain license", category: "licensing", difficulty: "easy" },
  { chapterNumber: 17, front: "What is license renewal?", back: "Periodic process to keep license active, usually every 1-2 years", category: "licensing", difficulty: "easy" },
  { chapterNumber: 17, front: "What is reciprocity?", back: "Recognition of license from another state", category: "licensing", difficulty: "medium" },
  { chapterNumber: 17, front: "What can cause license suspension?", back: "Violating regulations, unsanitary practices, or criminal activity", category: "regulation", difficulty: "medium" },
  { chapterNumber: 17, front: "What is scope of practice?", back: "The services a licensed professional is legally allowed to perform", category: "regulation", difficulty: "medium" },
  { chapterNumber: 17, front: "What is professional liability insurance?", back: "Protection against claims of negligence or harm to clients", category: "business", difficulty: "medium" },
  { chapterNumber: 17, front: "What are the signs of skin infection?", back: "Redness, swelling, heat, pus, and pain", category: "health", difficulty: "easy" },
  { chapterNumber: 17, front: "When should you refuse service?", back: "When client has contagious condition, open wounds, or it's unsafe", category: "professional", difficulty: "easy" },
  { chapterNumber: 17, front: "What is proper handwashing technique?", back: "Wet, lather, scrub 20 seconds, rinse, dry with clean towel", category: "safety", difficulty: "easy" },
  { chapterNumber: 17, front: "What is the best way to prepare for state boards?", back: "Study consistently, practice skills, take practice exams, and get rest", category: "preparation", difficulty: "easy" }
]

// Export
export const expansionPart4 = {
  chapter13: chapter13Flashcards,
  chapter14: chapter14Flashcards,
  chapter17: chapter17Flashcards,
  total: chapter13Flashcards.length + chapter14Flashcards.length + chapter17Flashcards.length
}
