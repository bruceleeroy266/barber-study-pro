/**
 * CHAPTER 8 ENHANCED FLASHCARDS
 * Deep Educational Review Addition
 * Basics of Electricity - SAFETY CRITICAL
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Electrical Safety - CRITICAL (15 new cards)
export const chapter8SafetyCritical: FlashcardData[] = [
  {
    chapterNumber: 8,
    front: "What is a circuit breaker and why is it important in barbershops?",
    back: "A circuit breaker is a safety device that automatically stops electrical flow when a circuit is overloaded. It prevents fires and equipment damage by cutting power before wires overheat. Know where your shop's breakers are located.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What is grounding and why is it essential for electrical safety?",
    back: "Grounding provides a safe path for electricity to flow into the earth if equipment malfunctions. It prevents electric shock by directing dangerous current away from users. All barbershop equipment must be properly grounded.",
    category: "safety-critical",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What should you do if you receive an electric shock from barbering equipment?",
    back: "Immediately stop using the equipment, unplug it if safe to do so, and report it. Seek medical attention if shock was severe. Never use damaged equipment. Have equipment professionally inspected before using again.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "Why is an overloaded electrical outlet dangerous in a barbershop?",
    back: "Overloaded outlets draw more current than wiring can safely handle, causing wires to overheat. This can melt insulation, create sparks, and start fires. Never plug too many devices into one outlet or power strip.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "Why should you never use electrical equipment with wet hands?",
    back: "Water conducts electricity, dramatically increasing shock risk. Wet skin has much lower resistance, allowing more current to flow through the body. Always dry hands completely before handling electrical equipment.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What are the signs of a damaged electrical cord that requires immediate replacement?",
    back: "Exposed wires, frayed insulation, cracks, burns, discoloration, loose plugs, or kinks. Also replace if cord feels hot during use. Damaged cords can cause shocks, short circuits, and fires.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What is a GFCI outlet and why are they required in barbershops?",
    back: "Ground Fault Circuit Interrupter outlets detect electrical imbalances and shut off power in milliseconds to prevent electrocution. Required near water sources (sinks, wet areas) where shock risk is highest. Test monthly.",
    category: "safety-critical",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "How often should barbershop electrical equipment be professionally inspected?",
    back: "At minimum annually, or per manufacturer recommendations. Inspect visually before each use for damage. Professional inspection catches hidden issues like internal wire damage, failing components, or grounding problems.",
    category: "safety-critical",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "Why are multi-plug adapters (not surge protectors) dangerous in barbershops?",
    back: "They allow multiple devices to draw power through a single outlet not designed for that load, risking overheating and fire. They also bypass circuit breaker protection. Use proper power strips with circuit breakers instead.",
    category: "safety-critical",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What is the proper way to unplug electrical equipment?",
    back: "Pull by the plug, not the cord. Pulling on cords damages internal wiring and can cause short circuits. Never yank or jerk cords. Support the plug with one hand while pulling straight out.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What should you do if you smell burning or see smoke from electrical equipment?",
    back: "Immediately unplug equipment if safe to do so. If you cannot safely unplug it, shut off power at circuit breaker. Evacuate if needed and call fire department. Never use water on electrical fires. Have equipment inspected before reuse.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "Why should extension cords be avoided in permanent barbershop setups?",
    back: "Extension cords are for temporary use only. Permanent use indicates insufficient outlets, creates trip hazards, and increases fire risk from overheating. Install additional outlets instead. If used temporarily, use heavy-duty cords rated for the equipment.",
    category: "safety-critical",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "How many high-wattage devices (like dryers or clippers) should be on one circuit?",
    back: "Check circuit capacity (usually 15-20 amps). Most dryers use 12-15 amps, clippers 2-5 amps. Don't exceed 80% of circuit capacity for continuous use. Spread high-wattage equipment across multiple circuits to prevent overload.",
    category: "safety-critical",
    difficulty: "hard"
  },
  {
    chapterNumber: 8,
    front: "When should you attempt to repair electrical equipment yourself vs. hiring a professional?",
    back: "NEVER attempt internal electrical repairs yourself. Only manufacturers or certified electricians should repair equipment. Barbers can: replace manufacturer-approved blades, clean equipment externally, check cords visually. Improper repairs void warranties and create safety hazards.",
    category: "safety-critical",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What electrical safety measures prevent fires in barbershops?",
    back: "Use equipment properly, don't overload outlets, inspect cords regularly, unplug equipment when not in use, keep flammable materials away from electrical sources, maintain proper ventilation, install smoke detectors, have fire extinguishers rated for electrical fires (Class C).",
    category: "safety-critical",
    difficulty: "medium"
  }
]

// Barbershop Equipment Safety (10 new cards)
export const chapter8EquipmentSafety: FlashcardData[] = [
  {
    chapterNumber: 8,
    front: "What electrical safety precautions should you take when using clippers?",
    back: "Check cord for damage before use, ensure hands are dry, don't wrap cord around clipper while hot, unplug when cleaning/oiling, never use near water, store properly with cord loosely coiled. Replace if clipper shocks you or sparks.",
    category: "equipment-safety",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "Why are hot towel cabinets a potential electrical hazard?",
    back: "They combine heat, moisture, and electricity - creating high shock and fire risk. Water leaks can cause shorts. Heating elements can overheat if malfunctioning. Place on stable surface, check for leaks regularly, don't overfill, keep exterior dry.",
    category: "equipment-safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What electrical hazards are associated with blow dryers in barbershops?",
    back: "High wattage (1200-1875W) strains circuits, motors can overheat with blocked vents, water exposure causes electrocution risk, damaged cords from constant coiling/pulling. Never use near sinks, don't block air intake, unplug immediately if dropped in water.",
    category: "equipment-safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "How should electrical equipment cords be stored to prevent damage?",
    back: "Loosely coiled (not tightly wound), hung on hooks or stored in cord wraps, never wrapped around hot equipment, kept away from sharp objects and heat sources. Inspect before and after each use. Proper storage prevents internal wire damage.",
    category: "equipment-safety",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What is the proper procedure for cleaning electrical barbering equipment?",
    back: "Always unplug first. Use slightly damp (not wet) cloth on exterior only. Never submerge in water or spray with liquid. Let completely dry before plugging in. Follow manufacturer's cleaning instructions exactly. Moisture + electricity = electrocution risk.",
    category: "equipment-safety",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "How can you tell if electrical equipment is drawing too much power?",
    back: "Signs include: equipment feels excessively hot, cord is warm to touch, circuit breaker trips repeatedly, lights dim when turned on, burning smell, buzzing sounds. Stop using immediately if these occur and have equipment inspected.",
    category: "equipment-safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "Why is it important to use professional-grade electrical equipment in barbershops?",
    back: "Professional equipment has: better insulation, heavier-duty cords, thermal protection, proper grounding, UL listing, commercial warranty. Built for continuous daily use. Consumer-grade equipment isn't designed for commercial demands and poses safety risks.",
    category: "equipment-safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What should you check before using any electrical barbering tool for the first time?",
    back: "Verify voltage matches outlet (110V or 220V), inspect cord and plug for damage, ensure grounding pin is present, read all safety warnings, check that equipment is UL listed, test in safe location first, register warranty.",
    category: "equipment-safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "When should electrical equipment be retired and replaced?",
    back: "Replace when: cord damage can't be repaired, equipment shocks users, circuit breaker trips repeatedly, equipment overheats, motor makes unusual sounds, equipment is beyond warranty and needs expensive repair, manufacturer recommends replacement timeline reached.",
    category: "equipment-safety",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "Why should unplugged electrical equipment be stored away from the work area?",
    back: "Prevents accidental damage from chemicals/water, reduces trip hazards, prevents cords from being pulled, keeps work area organized, protects equipment from dust/debris, prevents unauthorized use, reduces fire risk from flammable products.",
    category: "equipment-safety",
    difficulty: "easy"
  }
]

// Electrical Terms & Concepts (12 new cards)
export const chapter8ElectricalConcepts: FlashcardData[] = [
  {
    chapterNumber: 8,
    front: "What is voltage and how does it relate to barbershop equipment?",
    back: "Voltage (V) is electrical pressure or force that pushes current through a circuit. US standard is 110-120V for most barbering tools. Some equipment needs 220-240V (higher power). Using wrong voltage damages equipment or creates hazards. Always check equipment voltage requirements.",
    category: "electrical-concepts",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What is amperage (amps) and why does it matter?",
    back: "Amperage (A) is the amount of electrical current flowing through a circuit. Higher amps = more power draw. Circuits have amp limits (usually 15-20A). Exceeding the limit trips breakers. Check equipment amp draw to avoid overloading circuits.",
    category: "electrical-concepts",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What is wattage and how do you calculate it?",
    back: "Wattage (W) is the rate of energy consumption. Formula: Watts = Volts × Amps. Example: 120V × 10A = 1200W. Higher wattage = more electrical cost and heat generation. Used to determine circuit capacity and operating costs.",
    category: "electrical-concepts",
    difficulty: "hard"
  },
  {
    chapterNumber: 8,
    front: "What is electrical resistance (ohms) and its role in safety?",
    back: "Resistance (Ω - ohms) is opposition to electrical flow. High resistance = less current flow. Insulators have high resistance (rubber, plastic). Conductors have low resistance (metal, water). Dry skin resists electricity; wet skin conducts it - creating shock hazard.",
    category: "electrical-concepts",
    difficulty: "hard"
  },
  {
    chapterNumber: 8,
    front: "What is the difference between AC and DC current?",
    back: "AC (Alternating Current) reverses direction 60 times per second - used in US outlets and most barbering equipment. DC (Direct Current) flows one direction - used in batteries and some rechargeable tools. Most corded equipment is AC.",
    category: "electrical-concepts",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What is a complete electrical circuit and why does it matter?",
    back: "A circuit is a complete path for electricity to flow: from power source, through equipment, back to source. Breaks in circuit stop flow (good for switches). Unintended breaks cause malfunctions. Unintended connections (shorts) cause fires.",
    category: "electrical-concepts",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What is the difference between 110V and 220V equipment?",
    back: "110V (120V) is standard US outlet voltage for most tools. 220V (240V) provides double the voltage for high-power equipment (some dryers, industrial clippers). 220V equipment needs special outlets. Using wrong voltage destroys equipment or creates fire hazard.",
    category: "electrical-concepts",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What are conductors and insulators in electrical systems?",
    back: "Conductors allow electricity to flow easily (copper wire, aluminum, water, human body). Insulators resist electricity flow (rubber, plastic, glass, dry wood). Equipment uses both: metal conducts power, plastic/rubber insulates and protects users from shock.",
    category: "electrical-concepts",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What is a short circuit and what causes it?",
    back: "A short circuit occurs when electricity takes an unintended path of least resistance, bypassing the normal circuit. Caused by damaged insulation, loose wires touching, or moisture. Results in sparks, blown breakers, equipment damage, or fire.",
    category: "electrical-concepts",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What does it mean when equipment is 'UL Listed'?",
    back: "UL (Underwriters Laboratories) Listed means equipment has been independently tested for safety and meets national safety standards. Look for UL mark on all barbering equipment. Non-UL equipment may not be insured and poses safety risks.",
    category: "electrical-concepts",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What is a three-prong plug and why is the third prong important?",
    back: "The third (round) prong is the ground. It provides a safety path for electricity if equipment malfunctions, preventing shock. Never remove the ground prong or use a two-prong adapter on equipment designed with three prongs.",
    category: "electrical-concepts",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "What is the difference between a fuse and a circuit breaker?",
    back: "Both protect against overload. Fuses contain a wire that melts when overheated, must be replaced. Circuit breakers can be reset by flipping a switch. Most modern barbershops use breakers. Both prevent fires by stopping current flow when circuits overload.",
    category: "electrical-concepts",
    difficulty: "medium"
  }
]

// Light Therapy & Specialized Equipment (8 new cards)
export const chapter8LightTherapy: FlashcardData[] = [
  {
    chapterNumber: 8,
    front: "What types of light are used in light therapy treatments?",
    back: "Infrared (heat), visible light (color therapy), and UV light (limited use). Each has different effects: infrared warms and increases circulation, visible light affects mood/skin, UV can be germicidal but requires extreme caution.",
    category: "light-therapy",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What are the electrical safety concerns with light therapy equipment?",
    back: "Heat generation can start fires if too close to flammable materials, bulbs get extremely hot causing burns, equipment uses significant power risking circuit overload, moisture exposure creates shock risk. Maintain safe distance, never leave unattended, ensure proper ventilation.",
    category: "light-therapy",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What are the effects of infrared light in barbering treatments?",
    back: "Infrared produces heat, which increases blood circulation, opens pores, relaxes muscles, and can enhance product penetration during scalp treatments. Helps soften facial hair before shaving. Must control exposure time to prevent burns.",
    category: "light-therapy",
    difficulty: "easy"
  },
  {
    chapterNumber: 8,
    front: "Why is UV light rarely used in modern barbershops?",
    back: "UV light can cause skin damage, eye damage, and increase cancer risk with repeated exposure. Once used for germicidal purposes, now safer alternatives exist. If used, requires special training, protective equipment, and strict safety protocols.",
    category: "light-therapy",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What are contraindications for light therapy treatments?",
    back: "Contraindications include: certain medications causing photosensitivity, recent surgery, cancer, pregnancy, lupus, epilepsy (for some light frequencies), pacemakers near heating lamps. Always get client health history before light therapy.",
    category: "light-therapy",
    difficulty: "hard"
  },
  {
    chapterNumber: 8,
    front: "How should light therapy equipment be positioned for safety?",
    back: "Maintain recommended distance (usually 18-36 inches), ensure stable positioning so it can't tip, angle away from flammable materials, never position where it could fall on client, use timers to prevent over-exposure, have equipment easily accessible to turn off quickly.",
    category: "light-therapy",
    difficulty: "medium"
  },
  {
    chapterNumber: 8,
    front: "What is the difference between thermal and chemical effects of light?",
    back: "Thermal effects produce heat (infrared) - warming skin, increasing circulation, relaxing muscles. Chemical effects cause reactions in skin tissue (UV, some visible light) - can be therapeutic or damaging. Both require proper training and safety protocols.",
    category: "light-therapy",
    difficulty: "hard"
  },
  {
    chapterNumber: 8,
    front: "What electrical load do light therapy devices typically require?",
    back: "Light therapy equipment often draws 200-500 watts, with some professional units using up to 1000 watts. Heat lamps can draw significant amperage. Check wattage, calculate circuit capacity, avoid running multiple high-heat devices on same circuit.",
    category: "light-therapy",
    difficulty: "hard"
  }
]

// Export all enhanced flashcards
export const chapter8AllEnhanced = [
  ...chapter8SafetyCritical,
  ...chapter8EquipmentSafety,
  ...chapter8ElectricalConcepts,
  ...chapter8LightTherapy
]

export const chapter8EnhancedStats = {
  safetyCritical: chapter8SafetyCritical.length,
  equipmentSafety: chapter8EquipmentSafety.length,
  electricalConcepts: chapter8ElectricalConcepts.length,
  lightTherapy: chapter8LightTherapy.length,
  total: chapter8AllEnhanced.length
}

console.log(`Chapter 8 Enhanced Flashcards: ${chapter8EnhancedStats.total} new cards created`)
