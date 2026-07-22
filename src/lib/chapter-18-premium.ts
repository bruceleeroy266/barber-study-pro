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
                <li><strong>Normal:</strong> wet hair stretches up to 50% and returns</li>
                <li><strong>Low elasticity:</strong> hair does not spring back — signs of damage</li>
            </ul>
            <h3>Texture</h3>
            <ul>
                <li>Diameter of a single strand: <strong>fine, medium, or coarse</strong></li>
                <li>Fine hair takes color faster and may look darker</li>
                <li>Coarse hair has larger diameter and may process slower</li>
            </ul>
            <h3>Density</h3>
            <ul>
                <li>Number of hairs per square inch</li>
                <li>Thick hair needs smaller subsections (as thin as ⅛ inch) for full coverage</li>
            </ul>
            <h3>Porosity</h3>
            <ul>
                <li>Hair's ability to absorb moisture and product</li>
                <li><strong>High porosity:</strong> absorbs fast, fades fast, feels rough or dry</li>
                <li><strong>Low porosity:</strong> tight cuticle resists color, needs more time or stronger developer</li>
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
            <div class="key-point">Hair with <strong>low elasticity</strong> or <strong>high porosity</strong> is more easily damaged. Analyze before every service.</div>
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
                <li><strong>Level:</strong> lightness/darkness on a 1–10 scale (1 = black, 10 = lightest blond)</li>
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
                <li>Washes out with one shampoo</li>
                <li>Rinses, color shampoos, sprays, mousses, crayons</li>
            </ul>
            <h3>Semipermanent Color</h3>
            <ul>
                <li><strong>No-lift, deposit-only</strong>; stains cuticle and slightly penetrates cortex</li>
                <li>Lasts about 6–8 shampoos</li>
                <li>Good for blending up to 25% gray or enhancing tone</li>
            </ul>
            <h3>Demipermanent Color</h3>
            <ul>
                <li><strong>Deposit-only</strong> oxidation color</li>
                <li>Mixed with low-volume developer; lasts longer than semipermanent</li>
                <li>Blends gray, refreshes faded color, tones pre-lightened hair</li>
            </ul>
            <h3>Permanent Color (Tint)</h3>
            <ul>
                <li>Mixed with developer; lifts and deposits color</li>
                <li>Stays until hair grows out; requires retouch</li>
                <li>Best for covering gray and dramatic color changes</li>
            </ul>
            <div class="key-point"><strong>Aniline derivative</strong> is found in most oxidative colors. The FDA requires a <strong>patch test 24–48 hours</strong> before each application.</div>
        </section>

        <section class="section">
            <h2>⚗️ Developers, Lighteners & Toners</h2>
            <h3>Hydrogen Peroxide Developers</h3>
            <ul>
                <li><strong>Developer</strong> supplies oxygen to develop oxidative color</li>
                <li>Volume measures strength: lower volume = less lift; higher volume = more lift</li>
                <li><strong>10-volume:</strong> deposit color, minimal lift</li>
                <li><strong>20-volume:</strong> standard for permanent color, covers gray, 1–2 levels lift</li>
                <li><strong>30-volume:</strong> up to 3 levels lift</li>
                <li><strong>40-volume:</strong> up to 4 levels lift</li>
            </ul>
            <h3>Lighteners</h3>
            <ul>
                <li>Remove or decolorize melanin using bleach + hydrogen peroxide</li>
                <li><strong>Cream:</strong> most popular on-the-scalp; conditioning and controllable</li>
                <li><strong>Powder:</strong> stronger, usually off-the-scalp</li>
                <li><strong>Oil:</strong> mildest; used for 1–2 levels of lift</li>
            </ul>
            <h3>Toners</h3>
            <ul>
                <li>Permanent color applied to <strong>pre-lightened</strong> hair</li>
                <li>Deposit-only on lightened hair; neutralize unwanted undertones</li>
                <li>Used in <strong>double-process</strong> coloring</li>
            </ul>
            <div class="key-point"><strong>Do not overlap</strong> lightener on previously lightened hair — it causes breakage and damage. Warn clients that lightening dark hair to pale blond can be very damaging.</div>
        </section>

        <section class="section">
            <h2>📝 Application Terms</h2>
            <ul>
                <li><strong>Patch test:</strong> allergy test for aniline derivative; required 24–48 hours before service</li>
                <li><strong>Strand test:</strong> predicts reaction, processing time, and final color</li>
                <li><strong>Virgin application:</strong> first-time color on unchemically treated hair</li>
                <li><strong>Retouch:</strong> applying color only to new growth to blend the line of demarcation</li>
                <li><strong>Single-process:</strong> lightens or deposits in one application</li>
                <li><strong>Double-process:</strong> lightens first, then deposits toner/tint</li>
                <li><strong>Pre-softening:</strong> opens resistant gray hair so color can penetrate</li>
                <li><strong>Soap cap:</strong> equal parts tint, developer, and shampoo</li>
                <li><strong>Highlighting/lowlighting:</strong> lightening or darkening selected strands</li>
            </ul>
            <div class="key-point">A positive patch test means <strong>do not perform the service</strong>. A release statement does not remove liability.</div>
        </section>

        <section class="section">
            <h2>⚠️ Safety & Special Problems</h2>
            <h3>Gray Hair</h3>
            <ul>
                <li>Has little melanin; may be resistant or yellowish</li>
                <li>Violet-based products reduce yellow cast</li>
                <li>Lighter shades often flatter clients with 80–100% gray</li>
            </ul>
            <h3>Damaged Hair</h3>
            <ul>
                <li>Signs: overporous, brittle, little elasticity, rough feel</li>
                <li>Recondition with protein or lanolin treatments before coloring</li>
            </ul>
            <h3>Metallic & Compound Dyes</h3>
            <ul>
                <li>Not professional products; advertised as "progressive colors"</li>
                <li>Can coat hair, cause dullness, and react dangerously with peroxide</li>
                <li>Always test for metallic salts before professional chemical services</li>
            </ul>
            <h3>General Safety</h3>
            <ul>
                <li>Read manufacturer's directions before every service</li>
                <li>Wear gloves; use clean plastic or glass tools</li>
                <li>Do not apply color to abraded or irritated scalps</li>
                <li>Keep caps tightly closed to maintain developer strength</li>
                <li>Discard bulging hydrogen peroxide bottles</li>
            </ul>
            <div class="key-point"><strong>Never apply hydrogen peroxide over metallic dyes.</strong> The hair can break or completely disintegrate.</div>
        </section>

        <section class="section">
            <h2>🧔 Facial Hair Coloring</h2>
            <ul>
                <li><strong>Never use aniline derivative tints</strong> on mustaches or beards — serious irritation risk</li>
                <li><strong>Never use metallic or progressive dyes</strong> on facial hair — severe allergic reactions</li>
                <li>Safe options: color crayons, pomades, or liquid tints made for facial hair</li>
                <li>Apply petroleum jelly around the facial hairline to protect skin</li>
                <li>Keep product off skin as much as possible</li>
            </ul>
            <div class="key-point"><strong>Facial hair rule:</strong> only products specifically formulated for mustaches and beards. Avoid aniline derivative and metallic dyes completely.</div>
        </section>

        <section class="section">
            <h2>💡 Consultation & Record Keeping</h2>
            <ul>
                <li>Drape the client and have them complete a <strong>client record card</strong></li>
                <li>Perform hair and scalp analysis in good natural or incandescent light</li>
                <li>Ask leading questions about desired color, product type, and maintenance</li>
                <li>Show color examples and discuss cost and upkeep</li>
                <li>Perform required patch test 24–48 hours before service</li>
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
                    <li><strong>Patch tests</strong> are required for aniline derivative products; <strong>strand tests</strong> predict results</li>
                    <li><strong>Never</strong> use aniline derivative or metallic dyes on facial hair</li>
                    <li>Keep detailed <strong>client records</strong> and always follow manufacturer directions</li>
                </ul>
            </div>
        </section>

        

        
    </div>`,
    },
  ],
}
