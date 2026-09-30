import type { ChapterTheme, ChapterContent } from './chapter-content'

// Chapter 18: Haircoloring and Lightening — Production Chapter Shell
// Theme: Dark charcoal + ASCYN gold
export const chapter18PremiumTheme: ChapterTheme = {
  primary: '#D4AF37',
  primaryLight: '#F4D03F',
  primaryDark: '#AA8A2C',
  secondary: '#FFFFFF',
  background: 'rgba(10, 10, 10, 0.95)',
  backgroundAlt: 'rgba(26, 26, 26, 0.9)',
  surface: '#1A1A1A',
  border: 'rgba(212, 175, 55, 0.25)',
  text: '#FFFFFF',
  textMuted: '#888888',
  highlight: '#F4D03F',
  timeline: { line: 'rgba(212, 175, 55, 0.35)', iconBg: '#1A1A1A', iconBorder: '#D4AF37' },
  quote: { border: 'rgba(212, 175, 55, 0.4)', icon: 'rgba(212, 175, 55, 0.3)', bg: 'rgba(10, 10, 10, 0.7)' },
  tabbed: {
    activeBg: 'rgba(212, 175, 55, 0.15)', activeBorder: 'rgba(212, 175, 55, 0.5)', activeText: '#F4D03F',
    inactiveBg: 'rgba(10, 10, 10, 0.7)', inactiveBorder: 'rgba(212, 175, 55, 0.12)', inactiveText: '#888888',
    panelBg: 'rgba(10, 10, 10, 0.85)', panelBorder: 'rgba(212, 175, 55, 0.18)',
  },
  toolCard: { headerBg: 'rgba(212, 175, 55, 0.1)', headerText: '#F4D03F', dot: 'rgba(212, 175, 55, 0.6)', line: 'rgba(212, 175, 55, 0.25)' },
  featureGrid: { iconBg: 'rgba(212, 175, 55, 0.15)', iconColor: '#D4AF37', cardBorder: 'rgba(212, 175, 55, 0.2)' },
  milestone: { yearColor: '#D4AF37', border: 'rgba(212, 175, 55, 0.22)' },
  checklist: { checkBorder: 'rgba(212, 175, 55, 0.4)', checkColor: '#D4AF37', bg: 'rgba(10, 10, 10, 0.7)' },
  contentBlock: { bg: 'rgba(10, 10, 10, 0.7)', border: 'rgba(212, 175, 55, 0.18)', highlightColor: '#F4D03F' },
  challengeCard: { badgeBg: 'rgba(212, 175, 55, 0.15)', badgeText: '#D4AF37', cardBorder: 'rgba(212, 175, 55, 0.22)', completedBg: 'rgba(34, 197, 94, 0.1)', completedBorder: 'rgba(34, 197, 94, 0.3)' },
  scenarioBlock: { situationBg: 'rgba(212, 175, 55, 0.06)', optionBorder: 'rgba(212, 175, 55, 0.18)', correctBg: 'rgba(34, 197, 94, 0.1)', incorrectBg: 'rgba(239, 68, 68, 0.08)' },
  levelUp: { levelBadgeBg: 'rgba(212, 175, 55, 0.15)', levelBadgeText: '#F4D03F', rewardBg: 'rgba(34, 197, 94, 0.1)', rewardText: '#22C55E' },
  actionPrompt: { cardBorder: 'rgba(212, 175, 55, 0.18)', completedBorder: 'rgba(34, 197, 94, 0.3)', benefitBg: 'rgba(212, 175, 55, 0.08)', benefitBorder: 'rgba(212, 175, 55, 0.25)' },
}

export const chapter18PremiumContent: ChapterContent = {
  chapterNumber: 18,
  title: 'Haircoloring and Lightening',
  subtitle: 'Color theory, product selection, application, and safety',
  theme: chapter18PremiumTheme,
  sections: [
    {
      type: 'htmlContent',
      id: 'chapter-18-lesson',
      title: 'Chapter 18 Lesson',
      html: `<style>.ch18-legacy-content {  --gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff; }
.ch18-legacy-content * {  margin: 0; padding: 0; box-sizing: border-box; }
.ch18-legacy-content body {  font-family: 'Inter', sans-serif; background: var(--dark); color: var(--white); line-height: 1.7; }
.ch18-legacy-content nav {  position: fixed; top: 0; left: 0; right: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); z-index: 1000; border-bottom: 1px solid var(--medium-gray); }
.ch18-legacy-content .nav-container {  max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
.ch18-legacy-content .logo {  font-size: 1.25rem; font-weight: 800; color: var(--gold); text-decoration: none; }
.ch18-legacy-content .back-link {  color: var(--light-gray); text-decoration: none; }
.ch18-legacy-content .back-link:hover {  color: var(--gold); }
.ch18-legacy-content .nav-actions {  display: flex; align-items: center; gap: 1rem; }
.ch18-legacy-content .tts-btn {  background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s; }
.ch18-legacy-content .tts-btn:hover {  background: var(--gold); color: var(--dark); }
.ch18-legacy-content .tts-btn.playing {  background: var(--gold); color: var(--dark); }
.ch18-legacy-content .chapter-header {  padding: 8rem 2rem 4rem; background: linear-gradient(135deg, var(--dark-gray) 0%, var(--dark) 100%); text-align: center; }
.ch18-legacy-content .chapter-number {  display: inline-block; background: var(--gold); color: var(--dark); padding: 0.5rem 1rem; border-radius: 20px; font-weight: 700; margin-bottom: 1rem; }
.ch18-legacy-content .chapter-header h1 {  font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; margin-bottom: 1rem; }
.ch18-legacy-content .content {  max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.ch18-legacy-content .section {  margin-bottom: 3rem; }
.ch18-legacy-content .section h2 {  font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; color: var(--gold); }
.ch18-legacy-content .section h3 {  font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
.ch18-legacy-content .section p, .ch18-legacy-content .section ul {  margin-bottom: 1rem; color: #ccc; }
.ch18-legacy-content .section ul {  margin-left: 1.5rem; }
.ch18-legacy-content .key-point {  background: rgba(212,175,55,0.1); border-left: 4px solid var(--gold); padding: 1rem 1.5rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; }
.ch18-legacy-content .key-point strong {  color: var(--gold); }
.ch18-legacy-content .study-tools {  position: fixed; bottom: 2rem; right: 2rem; display: flex; gap: 1rem; }
.ch18-legacy-content .tool-btn {  background: var(--gold); color: var(--dark); border: none; padding: 1rem 1.5rem; border-radius: 50px; font-weight: 600; cursor: pointer; text-decoration: none; }
.ch18-legacy-content .progress-bar {  position: fixed; top: 65px; left: 0; right: 0; height: 3px; background: var(--medium-gray); z-index: 999; }
.ch18-legacy-content .progress-fill {  height: 100%; background: var(--gold); width: 0%; }
.ch18-legacy-content .nav-chapters {  display: flex; justify-content: space-between; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--medium-gray); }
.ch18-legacy-content .nav-chapters a {  color: var(--gold); text-decoration: none; font-weight: 600; }
.ch18-legacy-content .quiz-section {  background: var(--medium-gray); border-radius: 12px; padding: 2rem; margin: 3rem 0; border: 1px solid var(--gold); }
.ch18-legacy-content .quiz-section h2 {  color: var(--gold); margin-bottom: 1.5rem; }
.ch18-legacy-content .quiz-question {  margin-bottom: 1.5rem; }
.ch18-legacy-content .quiz-question p {  font-weight: 600; margin-bottom: 0.75rem; color: var(--white); }
.ch18-legacy-content .quiz-options label {  display: block; padding: 0.75rem 1rem; margin-bottom: 0.5rem; background: var(--dark-gray); border-radius: 8px; cursor: pointer; transition: all 0.3s; }
.ch18-legacy-content .quiz-options label:hover {  background: rgba(212, 175, 55, 0.1); }
.ch18-legacy-content .quiz-options input[type="radio"] {  margin-right: 0.75rem; }
.ch18-legacy-content .quiz-submit {  background: var(--gold); color: var(--dark); border: none; padding: 1rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 1rem; }
.ch18-legacy-content .quiz-result {  margin-top: 1.5rem; padding: 1rem; border-radius: 8px; display: none; }
.ch18-legacy-content .quiz-result.correct {  background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; }
.ch18-legacy-content .quiz-result.incorrect {  background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; }</style>
<div class="ch18-legacy-content">
        <section class="section">
            <h2>🎯 Why Study Haircoloring?</h2>
            <ul>
                <li>Builds a reliable, profitable clientele in the barbershop</li>
                <li>More clients now want beard and mustache coloring</li>
                <li>Requires knowledge of hair structure, color laws, and safe chemical use</li>
                <li>Done wrong, chemicals can damage hair, irritate skin, or harm the barber</li>
            </ul>
            <div class="key-point"><strong>Haircoloring</strong> changes hair color. <strong>Hair lightening</strong> removes natural or artificial pigment.</div>
        </section>

        <section class="section">
            <h2>🔬 Hair Analysis: 6 Characteristics</h2>
            <p>Always analyze hair and scalp before choosing a product or method.</p>
            <h3>Elasticity</h3>
            <ul>
                <li>Measures cortex strength</li>
                <li>Elasticity describes how well hair stretches and returns without breaking.</li>
                <li>Reduced elasticity can indicate compromised hair and should change how cautiously a chemical service is planned.</li>
            </ul>
            <h3>Texture</h3>
            <ul>
                <li>Diameter of a single strand: <strong>fine, medium, or coarse</strong></li>
                <li>Texture can affect product saturation and processing behavior.</li>
                <li>Do not choose developer strength or processing time from texture alone; use the product instructions and a strand test when appropriate.</li>
            </ul>
            <h3>Density</h3>
            <ul>
                <li>Density describes how much hair is present in a given area.</li>
                <li>Use subsection size that allows complete, even saturation; the exact section size depends on the technique and product instructions.</li>
            </ul>
            <h3>Porosity</h3>
            <ul>
                <li>Hair's ability to absorb moisture and product</li>
                <li><strong>High porosity:</strong> can take up color unevenly and may lose color faster.</li>
                <li><strong>Low porosity:</strong> can resist product penetration; do not automatically compensate with stronger developer—follow the color system and use strand testing.</li>
            </ul>
            <h3>Natural Hair Color</h3>
            <ul>
                <li><strong>Eumelanin</strong> = black and brown pigment</li>
                <li><strong>Pheomelanin</strong> = blond, yellow, and red pigment</li>
                <li><strong>Gray hair</strong> makes less melanin; <strong>white hair</strong> has none</li>
            </ul>
            <h3>Contributing Pigment (Undertone)</h3>
            <ul>
                <li>The color hidden underneath the natural hair color</li>
                <li>Revealed when hair is lightened</li>
                <li>Darker natural levels have stronger contributing pigment</li>
            </ul>
            <div class="key-point">Hair with reduced elasticity, high porosity, or other signs of damage may be more vulnerable during chemical services. Analyze the hair and scalp before the service and use the product manufacturer's precautions.</div>
        </section>

        <section class="section">
            <h2>🎨 Color Theory</h2>
            <h3>Primary Colors</h3>
            <ul>
                <li><strong>Red, yellow, blue</strong> — cannot be made by mixing others</li>
                <li>Blue is the strongest and only cool primary; yellow is the weakest</li>
            </ul>
            <h3>Secondary & Tertiary Colors</h3>
            <ul>
                <li><strong>Secondary:</strong> green, violet, orange (mix two primaries)</li>
                <li><strong>Tertiary:</strong> blue-green, blue-violet, red-violet, red-orange, yellow-green, yellow-orange</li>
            </ul>
            <h3>Complementary Colors</h3>
            <ul>
                <li>Opposite each other on the color wheel: <strong>blue ↔ orange, red ↔ green, yellow ↔ violet</strong></li>
                <li>Mix complementary colors to <strong>neutralize</strong> unwanted tones</li>
            </ul>
            <h3>Level, Tone & Saturation</h3>
            <ul>
                <li><strong>Level:</strong> a system for describing lightness and darkness. Many professional lines use a numbered scale, but exact numbering and shade names can vary by manufacturer.</li>
                <li><strong>Tone:</strong> warmth or coolness of a color</li>
                <li><strong>Saturation:</strong> strength or concentration of pigment</li>
            </ul>
            <h3>Base Color</h3>
            <ul>
                <li>The main tone of a haircolor product</li>
                <li><strong>Violet base</strong> reduces yellow; <strong>blue base</strong> reduces orange</li>
            </ul>
            <div class="key-point">Judge natural level with <strong>color swatches</strong> in good lighting. Fluorescent light can mislead your color match.</div>
        </section>

        <section class="section">
            <h2>🧴 Haircolor Products</h2>
            <h3>Temporary Color</h3>
            <ul>
                <li>Large molecules coat the cuticle</li>
                <li>Designed for short-term color effects; how quickly it shampoos out varies by formula, hair condition, and use.</li>
                <li>Rinses, color shampoos, sprays, mousses, crayons</li>
            </ul>
            <h3>Semipermanent Color</h3>
            <ul>
                <li><strong>No-lift, deposit-only</strong>; stains cuticle and slightly penetrates cortex</li>
                <li>Fades gradually with shampooing; expected longevity varies by product and hair condition.</li>
                <li>Can enhance or shift tone; gray-blending claims vary by product line, so use the manufacturer's coverage guidance.</li>
            </ul>
            <h3>Demipermanent Color</h3>
            <ul>
                <li>Often uses oxidative dye chemistry with a dedicated low-strength developer or activator.</li>
                <li>Usually provides longer-lasting deposit than a semipermanent formula, but product systems differ.</li>
                <li>May be used for tone refresh, blending, or toning when the manufacturer lists those uses.</li>
            </ul>
            <h3>Permanent Color (Tint)</h3>
            <ul>
                <li>Oxidative permanent color is mixed with its specified developer and can provide lift, deposit, or both depending on the formula.</li>
                <li>Its artificial pigment is intended to be durable; new growth creates a visible retouch area over time.</li>
                <li>Gray-coverage and lift capabilities are product-specific and should be taken from the manufacturer's technical guidance.</li>
            </ul>
            <div class="key-point"><strong>Allergy-alert testing:</strong> Follow the exact label and manufacturer instructions for the product being used. FDA guidance tells consumers and salons to perform the skin test before each use of hair dye; coal-tar hair dyes have specific federal caution-label and preliminary-test requirements.</div>
        </section>

        <section class="section">
            <h2>⚗️ Developers, Lighteners & Toners</h2>
            <h3>Hydrogen Peroxide Developers</h3>
            <ul>
                <li><strong>Developer</strong> supplies oxygen to develop oxidative color</li>
                <li>Developer strength is commonly expressed as volume or hydrogen-peroxide percentage.</li>
                <li>Higher-volume developer can provide greater lightening potential in compatible systems, but lift is not determined by volume alone.</li>
                <li>Exact lift, gray-coverage use, mixing ratio, on-scalp limits, and processing time depend on the specific color or lightener system.</li>
                <li>Use only the developer types and strengths allowed by the product manufacturer.</li>
            </ul>
            <h3>Lighteners</h3>
            <ul>
                <li>Lighteners reduce natural or artificial pigment through an oxidizing lightening system.</li>
                <li>Lighteners come in different formats, including creams, powders, clays, and other manufacturer-specific systems.</li>
                <li>Do not assume a format is automatically safe for on-scalp use or that one format is always stronger than another.</li>
                <li>Follow the manufacturer's allowed developer, mixing ratio, application area, processing time, heat, and overlap instructions.</li>
            </ul>
            <h3>Toners</h3>
            <ul>
                <li>Toners are color products used to refine or adjust tone, often after lightening.</li>
                <li>They can help neutralize unwanted warmth or create a desired tonal result when selected by level and color relationship.</li>
                <li>Toner chemistry varies by product; some systems are oxidative and others are not, so follow that product's directions.</li>
            </ul>
            <div class="key-point"><strong>Avoid unapproved overlap.</strong> Reapplying lightener onto previously lightened or sensitized hair can increase damage and breakage risk. Follow the specific lightener's overlap, hair-integrity, scalp, developer, and processing restrictions.</div>
        </section>

        <section class="section">
            <h2>📝 Application Terms</h2>
            <ul>
                <li><strong>Allergy-alert / skin test:</strong> perform exactly as required by the product label and manufacturer before use; FDA safety guidance recommends a skin test before each use of hair dye.</li>
                <li><strong>Strand test:</strong> checks how a small section of hair responds before committing to the full service; use it when directed or when hair history/integrity makes the result uncertain.</li>
                <li><strong>Virgin application:</strong> first-time color on unchemically treated hair</li>
                <li><strong>Retouch:</strong> applying color only to new growth to blend the line of demarcation</li>
                <li><strong>Single-process:</strong> lightens or deposits in one application</li>
                <li><strong>Double-process:</strong> lightens first, then deposits toner/tint</li>
                <li><strong>Pre-softening:</strong> a technique used in some color systems for resistant gray; only use it when the product manufacturer supports the method.</li>
                <li><strong>Color-wash / soap-cap terminology:</strong> formulas and permitted uses vary by product system; do not create an improvised mixture outside manufacturer directions.</li>
                <li><strong>Highlighting/lowlighting:</strong> lightening or darkening selected strands</li>
            </ul>
            <div class="key-point">If the product's allergy-alert or skin test shows a reaction, <strong>do not use that haircolor product</strong>. A waiver is not a substitute for following product warnings, state scope-of-practice rules, or safety instructions.</div>
        </section>

        <section class="section">
            <h2>⚠️ Safety & Special Problems</h2>
            <h3>Gray Hair</h3>
            <ul>
                <li>Gray or white hair has reduced natural pigment and can vary in texture, porosity, and resistance.</li>
                <li>Violet can neutralize yellow according to complementary-color theory when the level and product are appropriate.</li>
                <li>Coverage strategy and shade selection should be based on the client's goal, hair analysis, and the product line's gray-coverage guidance—not a fixed percentage rule.</li>
            </ul>
            <h3>Damaged Hair</h3>
            <ul>
                <li>Warning signs include excessive porosity, brittleness, reduced elasticity, or other evidence of sensitized hair.</li>
                <li>Do not assume a conditioning treatment makes damaged hair suitable for color or lightener. Reassess hair integrity and follow the chemical product's contraindications and strand-test guidance.</li>
            </ul>
            <h3>Metallic & Compound Dyes</h3>
            <ul>
                <li>Some progressive or metallic-salt color products can create compatibility concerns with later oxidative chemical services.</li>
                <li>Obtain the client's chemical/color history and follow the planned product's compatibility warnings before proceeding.</li>
                <li>If compatibility is uncertain, do not guess; use the manufacturer's prescribed test or decline/postpone the chemical service.</li>
            </ul>
            <h3>General Safety</h3>
            <ul>
                <li>Read and follow the complete manufacturer instructions, warnings, mixing ratios, and processing limits for every chemical service.</li>
                <li>Wear suitable gloves and use only tools/containers permitted by the product instructions.</li>
                <li>Do not perform haircolor on an irritated, sunburned, or damaged scalp; FDA specifically warns against coloring in those conditions.</li>
                <li>Store developer and color products as directed, keep containers secured, and do not use damaged or compromised packaging.</li>
                <li>Do not mix different hair-dye products unless the manufacturer specifically directs that combination.</li>
            </ul>
            <div class="key-point"><strong>Chemical compatibility matters.</strong> Do not combine an oxidative color/lightener service with an unknown or incompatible prior color system. Confirm the client's history and follow the product manufacturer's compatibility instructions before proceeding.</div>
        </section>

        <section class="section">
            <h2>🧔 Facial Hair Coloring</h2>
            <ul>
                <li>Use a color product on mustaches or beards only when its label or professional instructions specifically allow facial-hair use.</li>
                <li>Do not transfer scalp-hair directions to facial hair by assumption; facial-hair products can have different warnings and application steps.</li>
                <li>Follow the product's allergy-alert testing, skin-protection, timing, and rinsing directions.</li>
                <li>Keep color away from the eyes and other areas prohibited by the label.</li>
                <li>Document the exact facial-hair product and formula used.</li>
            </ul>
            <div class="key-point"><strong>Facial-hair rule:</strong> use only a product whose manufacturer expressly permits the intended beard or mustache application, and follow that product's warnings exactly. Do not infer safety from the ingredient class alone.</div>
        </section>

        <section class="section">
            <h2>💡 Consultation & Record Keeping</h2>
            <ul>
                <li>Drape the client and have them complete a <strong>client record card</strong></li>
                <li>Perform hair and scalp analysis under lighting that allows an accurate view of level, tone, condition, and scalp integrity.</li>
                <li>Ask clear consultation questions about desired color, prior chemical services, allergies/reactions, home color, maintenance, and expectations.</li>
                <li>Use the color system's swatches or technical chart to discuss achievable results, maintenance, and cost.</li>
                <li>Complete the product-specific allergy-alert or skin test when required by the label/manufacturer and follow its timing exactly.</li>
                <li>Record formula, processing time, and results for future visits</li>
            </ul>
            <div class="key-point">A complete <strong>client record card</strong> is your roadmap for consistent, safe color results every visit.</div>
        </section>

        <section class="section">
            <h2>📝 Chapter 18 Key Takeaways</h2>
            <div class="key-point">
                <ul style="margin-left: 1rem;">
                    <li>Analyze <strong>elasticity, texture, density, porosity, natural color, and contributing pigment</strong> before coloring</li>
                    <li>Primary colors are <strong>red, yellow, blue</strong>; complementary colors <strong>neutralize</strong> each other</li>
                    <li>Products range from <strong>temporary → semipermanent → demipermanent → permanent</strong></li>
                    <li><strong>Developers</strong> control lift; <strong>lighteners</strong> remove pigment; <strong>toners</strong> refine pre-lightened hair</li>
                    <li><strong>Allergy-alert testing</strong> follows the product label; <strong>strand testing</strong> helps evaluate uncertain hair response and results.</li>
                    <li>Use facial-hair color only when the manufacturer specifically permits that beard or mustache application.</li>
                    <li>Keep detailed <strong>client records</strong> and treat manufacturer directions, warnings, and compatibility limits as service requirements.</li>
                </ul>
            </div>
        </section>

        

        
    </div>`,
    },
  ],
}
