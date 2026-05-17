/**
 * CHAPTER 12 ENHANCED FLASHCARDS - PART 1
 * Facial Anatomy: Muscles
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

// Facial Muscles - Expression & Movement (15 cards)
export const chapter12FacialMuscles: FlashcardData[] = [
  {
    chapterNumber: 12,
    front: "Which muscle raises the eyebrows and creates horizontal forehead wrinkles?",
    back: "Frontalis muscle. Located across the forehead, it elevates eyebrows and creates expressions of surprise or concern. Essential for reading facial expressions during consultation.",
    category: "facial-anatomy-muscles",
    difficulty: "easy",
    weakAreaTags: ["anatomy", "muscle-identification", "commonly-missed"]
  },
  {
    chapterNumber: 12,
    front: "Which muscle creates vertical frown lines between the eyebrows?",
    back: "Corrugator muscle. Draws eyebrows together and downward, creating vertical lines. Important for understanding tension areas during facial massage.",
    category: "facial-anatomy-muscles",
    difficulty: "easy",
    weakAreaTags: ["anatomy", "muscle-identification"]
  },
  {
    chapterNumber: 12,
    front: "What does the orbicularis oculi muscle do?",
    back: "Surrounds the eye and closes the eyelid. Ring-shaped muscle responsible for blinking and squinting. Critical area requiring gentle pressure during facial treatments.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification", "safety-critical"]
  },
  {
    chapterNumber: 12,
    front: "Which two muscles are responsible for smiling?",
    back: "Zygomaticus major and zygomaticus minor. Both extend from cheekbone to mouth corner, elevating the lips during smiling. Also assisted by risorius for wider grins.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification"]
  },
  {
    chapterNumber: 12,
    front: "What is the function of the orbicularis oris muscle?",
    back: "Surrounds the mouth and closes the lips. Ring muscle that controls lip movement for speech, kissing, and facial expressions. Massage improves circulation to lip area.",
    category: "facial-anatomy-muscles",
    difficulty: "easy",
    weakAreaTags: ["anatomy", "muscle-identification"]
  },
  {
    chapterNumber: 12,
    front: "Which muscle is responsible for chewing and closing the jaw?",
    back: "Masseter muscle (along with temporalis). Located at the jaw angle, it's one of the strongest muscles in the body. Often holds tension requiring focused massage work.",
    category: "facial-anatomy-muscles",
    difficulty: "easy",
    weakAreaTags: ["anatomy", "muscle-identification", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "Where is the temporalis muscle located and what does it do?",
    back: "Located on the temple and side of head, extends down to jaw. Closes the jaw and assists in chewing. Common tension area - massage relieves headaches and TMJ discomfort.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "What is the buccinator muscle and why is it important in facial massage?",
    back: "Cheek wall muscle that compresses cheeks (used when blowing). Massage of this area improves circulation, reduces puffiness, and enhances facial contour. Helps with facial slimming appearance.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "Which muscle wrinkles the nose and what is its location?",
    back: "Nasalis muscle. Covers the nasal area and flares the nostrils. Massage helps relieve sinus pressure and improve breathing comfort during treatments.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification"]
  },
  {
    chapterNumber: 12,
    front: "What does the mentalis muscle do?",
    back: "Raises and wrinkles the chin, creates 'dimpled chin' appearance. Located at center of chin. Massage helps reduce tension and improve lower face contour.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification"]
  },
  {
    chapterNumber: 12,
    front: "Which muscle lowers the corner of the mouth?",
    back: "Triangularis (also called depressor anguli oris). Pulls mouth corners downward in expressions of sadness or disapproval. Massage can help lift and firm this area.",
    category: "facial-anatomy-muscles",
    difficulty: "hard",
    weakAreaTags: ["anatomy", "muscle-identification", "advanced-terminology"]
  },
  {
    chapterNumber: 12,
    front: "What is unique about the platysma muscle?",
    back: "It's a broad neck muscle extending from chest to chin and jawline. Lowers jaw and lip, creates neck tension lines. One of the most important anti-aging massage areas.",
    category: "facial-anatomy-muscles",
    difficulty: "medium",
    weakAreaTags: ["anatomy", "muscle-identification", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "Which muscle elevates the upper lip and nostril?",
    back: "Levator labii superioris. Extends from upper jaw to upper lip. Creates expressions of disdain or disgust. Massage improves upper lip circulation and reduces tension.",
    category: "facial-anatomy-muscles",
    difficulty: "hard",
    weakAreaTags: ["anatomy", "muscle-identification", "advanced-terminology"]
  },
  {
    chapterNumber: 12,
    front: "What is the procerus muscle and where is it located?",
    back: "Located at the bridge of the nose, between the eyebrows. Wrinkles the nose and creates horizontal lines across nose bridge. Massage reduces tension from prolonged concentration or squinting.",
    category: "facial-anatomy-muscles",
    difficulty: "hard",
    weakAreaTags: ["anatomy", "muscle-identification", "advanced-terminology"]
  },
  {
    chapterNumber: 12,
    front: "Why is understanding facial muscle direction important during massage?",
    back: "Muscle fiber direction determines effective massage strokes. Following muscle direction improves circulation, prevents sagging, and enhances toning effects. Always work toward muscle insertion points.",
    category: "facial-anatomy-muscles",
    difficulty: "hard",
    weakAreaTags: ["anatomy", "massage-techniques", "professional-procedure", "state-board-critical"]
  }
]
