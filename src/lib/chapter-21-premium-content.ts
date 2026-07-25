import type { ChapterTheme, ChapterContent } from './chapter-content'

// Chapter 21: The Business of Barbering — Premium Chapter Theme
// Theme tokens identical to Chapter 20
export const chapter21PremiumTheme: ChapterTheme = {
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
  timeline: {
    line: 'rgba(212, 175, 55, 0.35)',
    iconBg: '#1A1A1A',
    iconBorder: '#D4AF37',
  },
  quote: {
    border: 'rgba(212, 175, 55, 0.4)',
    icon: 'rgba(212, 175, 55, 0.3)',
    bg: 'rgba(10, 10, 10, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(212, 175, 55, 0.15)',
    activeBorder: 'rgba(212, 175, 55, 0.5)',
    activeText: '#F4D03F',
    inactiveBg: 'rgba(10, 10, 10, 0.7)',
    inactiveBorder: 'rgba(212, 175, 55, 0.12)',
    inactiveText: '#888888',
    panelBg: 'rgba(10, 10, 10, 0.85)',
    panelBorder: 'rgba(212, 175, 55, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(212, 175, 55, 0.1)',
    headerText: '#F4D03F',
    dot: 'rgba(212, 175, 55, 0.6)',
    line: 'rgba(212, 175, 55, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(212, 175, 55, 0.15)',
    iconColor: '#D4AF37',
    cardBorder: 'rgba(212, 175, 55, 0.2)',
  },
  milestone: {
    yearColor: '#D4AF37',
    border: 'rgba(212, 175, 55, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(212, 175, 55, 0.4)',
    checkColor: '#D4AF37',
    bg: 'rgba(10, 10, 10, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(10, 10, 10, 0.7)',
    border: 'rgba(212, 175, 55, 0.18)',
    highlightColor: '#F4D03F',
  },
  challengeCard: {
    badgeBg: 'rgba(212, 175, 55, 0.15)',
    badgeText: '#D4AF37',
    cardBorder: 'rgba(212, 175, 55, 0.22)',
    completedBg: 'rgba(34, 197, 94, 0.1)',
    completedBorder: 'rgba(34, 197, 94, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(212, 175, 55, 0.06)',
    optionBorder: 'rgba(212, 175, 55, 0.18)',
    correctBg: 'rgba(34, 197, 94, 0.1)',
    incorrectBg: 'rgba(239, 68, 68, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(212, 175, 55, 0.15)',
    levelBadgeText: '#F4D03F',
    rewardBg: 'rgba(34, 197, 94, 0.1)',
    rewardText: '#22C55E',
  },
  actionPrompt: {
    cardBorder: 'rgba(212, 175, 55, 0.18)',
    completedBorder: 'rgba(34, 197, 94, 0.3)',
    benefitBg: 'rgba(212, 175, 55, 0.08)',
    benefitBorder: 'rgba(212, 175, 55, 0.25)',
  },
}

export const chapter21PremiumContent: ChapterContent = {
  chapterNumber: 21,
  title: 'The Business of Barbering',
  subtitle: 'Ownership, planning, and profitable shop operations',
  theme: chapter21PremiumTheme,
  sections: [
    // ───────────────────────────────────────────────
    // Introduction + Learning Objectives
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'chapter-21-introduction',
      title: 'Chapter 21: The Business of Barbering',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            Every great barber eventually faces the same question: <strong>Do I build someone else's dream, or do I build my own?</strong>
            The business side of barbering is not separate from the craft—it is the engine that turns skill into a sustainable career.
          </p>
          <p class="mb-4 text-gray-300">
            This chapter is your roadmap. You will compare the main paths into business ownership, identify what it actually takes to open a barbershop,
            distinguish the most common ownership structures, and recognize the components of a real business plan. You will also learn why record keeping protects your income,
            what booth renters must handle on their own, how successful shops operate day-to-day, and why advertising is non-negotiable in a crowded market.
          </p>
          <h3 class="text-xl font-bold text-ascyn-gold mt-6 mb-3">Learning Objectives</h3>
          <ol class="list-decimal list-inside space-y-2 text-gray-300">
            <li>Identify two options for going into business for yourself.</li>
            <li>List the basic factors to be considered when opening a barbershop.</li>
            <li>Compare types of barbershop ownership.</li>
            <li>Recognize the information that should be included in a business plan.</li>
            <li>Explain the importance of record keeping.</li>
            <li>Examine the responsibilities of a booth renter.</li>
            <li>Distinguish the elements of successful barbershop operations.</li>
            <li>Validate why advertising is a vital aspect of a barbershop's success.</li>
          </ol>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO1: Options for Going Into Business
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo1',
      standardId: 'CH21-LO01',
      title: 'LO1: Your Two Main Paths Into Business',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            There are two broad ways to work for yourself as a barber: <strong>open or acquire your own barbershop</strong>, or <strong>rent a booth or chair inside an existing shop</strong>.
            Both give you more independence than a traditional employee position, but they carry very different levels of risk, control, and responsibility.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Path 1: Open or Buy a Barbershop</h4>
          <p class="mb-3 text-gray-300">
            This is full business ownership. You choose the name, location, culture, pricing, branding, and staff. You also carry the risk: lease, build-out,
            equipment, insurance, licenses, taxes, and payroll. This path is best when you have capital, experience, a loyal client base, and tolerance for long-term planning.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Path 2: Booth or Chair Rental</h4>
          <p class="mb-3 text-gray-300">
            Booth rental lets you operate your own mini-business inside someone else's shop. You pay a flat weekly or monthly rent for your station,
            set your own schedule, keep your own client records, and handle your own taxes and supplies. The risk is lower than owning a shop, but so is the control over environment and brand.
          </p>

          <div class="bg-ascyn-gold/10 border-l-4 border-ascyn-gold p-4 my-5 rounded-r">
            <p class="text-gray-200"><strong>ASCYN PRO Insight:</strong> Many successful barbers move from employee → booth renter → shop owner over time. There is no single "right" path—only the path that matches your current resources, risk tolerance, and client base.</p>
          </div>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO2: Factors When Opening a Barbershop
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo2',
      standardId: 'CH21-LO02',
      title: 'LO2: What to Consider Before Opening a Shop',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            Opening a barbershop is exciting, but excitement does not replace preparation. Before you sign a lease or buy chairs, work through these practical factors.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Location and Visibility</h4>
          <p class="mb-3 text-gray-300">
            Your location should match your target client. High foot traffic, accessible parking, visible signage, and proximity to complementary businesses (coffee shops, gyms, tailors)
            all help drive walk-ins. Rent must be low enough that slow months do not sink you.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Capital and Startup Costs</h4>
          <p class="mb-3 text-gray-300">
            Startup costs include the lease deposit, renovations, barber chairs, stations, mirrors, sinks, waiting-area furniture, point-of-sale systems, initial inventory,
            licenses, insurance, and enough operating cash to cover 3–6 months of expenses before the shop turns profitable.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Legal Structure and Licensing</h4>
          <p class="mb-3 text-gray-300">
            Choose a legal structure—sole proprietorship, partnership, limited liability company (LLC), or corporation. Register the business, obtain an Employer Identification Number (EIN),
            and secure all required state and local barbershop licenses, health permits, and occupancy permits.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Staffing Model</h4>
          <p class="mb-3 text-gray-300">
            Decide whether you will hire employees, rent booths to independent barbers, or use a hybrid model. Each choice changes your payroll responsibilities,
            tax obligations, and day-to-day management load.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Culture and Client Experience</h4>
          <p class="mb-3 text-gray-300">
            Define the atmosphere you want. Music, décor, service menu, pricing, appointment style, and staff dress code all communicate what kind of shop you are running.
            A clear identity attracts the right clients and repels the wrong ones.
          </p>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO3: Types of Barbershop Ownership
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo3',
      standardId: 'CH21-LO03',
      title: 'LO3: Types of Barbershop Ownership',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            The legal structure you choose affects taxes, liability, decision-making, and how you raise money. Here are the most common ownership forms for barbershops.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Sole Proprietorship</h4>
          <p class="mb-3 text-gray-300">
            One person owns the business. It is the simplest and cheapest to start, but the owner is personally liable for all business debts and legal claims.
            Income and expenses are reported on the owner's personal tax return.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Partnership</h4>
          <p class="mb-3 text-gray-300">
            Two or more people share ownership, profits, and responsibilities. A partnership can bring more capital and skills, but it also requires a clear agreement that outlines
            each partner's role, contribution, profit split, and exit plan. Without one, disputes can destroy the business.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Limited Liability Company (LLC)</h4>
          <p class="mb-3 text-gray-300">
            An LLC separates personal and business liability. If the shop is sued or goes into debt, your personal assets usually receive protection.
            LLCs also offer flexible tax treatment and are the most common choice for independent shop owners.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Corporation</h4>
          <p class="mb-3 text-gray-300">
            A corporation is a separate legal entity owned by shareholders. It offers the strongest liability protection but involves more paperwork,
            stricter record-keeping requirements, and double taxation unless structured as an S corporation. This form is more common for multi-location or franchise operations.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Franchise</h4>
          <p class="mb-3 text-gray-300">
            A franchise lets you operate under an established brand name using a proven system. You pay an upfront franchise fee and ongoing royalties.
            The benefit is brand recognition and operational support; the downside is less creative control and ongoing payments.
          </p>

          <div class="bg-ascyn-gold/10 border-l-4 border-ascyn-gold p-4 my-5 rounded-r">
            <p class="text-gray-200"><strong>ASCYN PRO Insight:</strong> Most first-time shop owners choose an LLC because it balances liability protection with manageable paperwork. Consult an accountant and attorney before making a final decision.</p>
          </div>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO4: Business Plan Components
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo4',
      standardId: 'CH21-LO04',
      title: 'LO4: What Belongs in a Business Plan',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            A business plan is not just paperwork for a lender—it is your thinking made visible. It forces you to answer hard questions before you spend real money.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Executive Summary</h4>
          <p class="mb-3 text-gray-300">
            A one-page overview of the business: name, location, concept, target market, ownership structure, and key financial goals. Write this section last, even though it appears first.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Business Description</h4>
          <p class="mb-3 text-gray-300">
            Explain what the shop will offer, what makes it different, and why the community needs it. Include your mission, vision, and the values that will guide decisions.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Market Analysis</h4>
          <p class="mb-3 text-gray-300">
            Research your local market. Who are your competitors? What do they charge? Who is your ideal client? What gaps can you fill?
            Data here keeps your pricing and marketing grounded in reality.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Organization and Management</h4>
          <p class="mb-3 text-gray-300">
            List the ownership structure and the key people who will run the shop. Include their roles, experience, and responsibilities. If you plan to hire managers or barbers, outline the staffing plan.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Services and Pricing</h4>
          <p class="mb-3 text-gray-300">
            Define your menu of services, prices, and how those prices compare to competitors. Explain your pricing strategy: value-based, cost-plus, or market-based.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Marketing and Sales Strategy</h4>
          <p class="mb-3 text-gray-300">
            Describe how you will attract and retain clients. Include your brand identity, advertising channels, referral programs, social media plan, and grand-opening strategy.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Financial Projections</h4>
          <p class="mb-3 text-gray-300">
            Include a startup budget, projected income statement, cash-flow forecast, and break-even analysis. Lenders and investors will focus heavily on this section.
            Be realistic—overly optimistic projections lead to undercapitalized shops.
          </p>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO5: Importance of Record Keeping
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo5',
      standardId: 'CH21-LO05',
      title: 'LO5: Why Record Keeping Is Essential',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            Record keeping is one of the least glamorous parts of barbering—and one of the most important. Good records protect your income, your license, and your peace of mind.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Financial Records</h4>
          <p class="mb-3 text-gray-300">
            Track every dollar that comes in and goes out: service revenue, tips, product sales, rent, supplies, utilities, insurance, and taxes.
            Accurate records make tax filing easier, reveal your true profit, and help you qualify for loans or leases.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Client Records</h4>
          <p class="mb-3 text-gray-300">
            Keep contact information, service history, product preferences, allergies, formulas, and appointment notes. Client records personalize service,
            support rebooking, and protect you if a dispute or reaction ever occurs.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Tax and Legal Compliance</h4>
          <p class="mb-3 text-gray-300">
            The IRS and state tax agencies do not accept "I think I made about..." as documentation. Whether you are an employee, booth renter, or shop owner,
            you must report income accurately and keep records for the required number of years.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Business Performance</h4>
          <p class="mb-3 text-gray-300">
            Records let you measure what matters: average ticket, client retention, retail sales per service, no-show rate, and monthly profit margin.
            Without numbers, you are guessing. With numbers, you can make smart adjustments.
          </p>

          <div class="bg-ascyn-gold/10 border-l-4 border-ascyn-gold p-4 my-5 rounded-r">
            <p class="text-gray-200"><strong>ASCYN PRO Insight:</strong> Set a weekly 30-minute "money date" with your records. Review revenue, expenses, and appointments. Small, consistent attention prevents year-end panic.</p>
          </div>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO6: Booth Renter Responsibilities
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo6',
      standardId: 'CH21-LO06',
      title: 'LO6: The Responsibilities of a Booth Renter',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            Booth rental looks like employment from the outside, but legally and financially it is much closer to running a small business. You are responsible for far more than just showing up and cutting hair.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Paying Rent on Time</h4>
          <p class="mb-3 text-gray-300">
            Rent is usually a flat weekly or monthly fee. It must be paid regardless of how busy you were. Treat it like a non-negotiable overhead expense.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Collecting Payment and Managing Books</h4>
          <p class="mb-3 text-gray-300">
            You collect your own service fees, tips, and product sales. You track them. You issue receipts if required. You reconcile your cash and digital payments daily.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Taxes and Self-Employment Obligations</h4>
          <p class="mb-3 text-gray-300">
            The shop owner does not withhold taxes for you. You must report all income, pay self-employment tax, and usually make quarterly estimated tax payments.
            Set aside 25–30% of every dollar you earn so tax season does not become a crisis.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Insurance and Supplies</h4>
          <p class="mb-3 text-gray-300">
            Many booth renters carry their own liability insurance. You also buy your own tools, products, capes, towels, and sanitation supplies.
            Read your rental agreement carefully to know what the shop provides and what you must bring.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Building and Serving Your Clientele</h4>
          <p class="mb-3 text-gray-300">
            Unlike an employee who may receive walk-ins from the shop, a booth renter usually depends heavily on a personal client base.
            Marketing, rebooking, and relationship building are your job.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Following Shop Rules</h4>
          <p class="mb-3 text-gray-300">
            Even though you are independent, you still operate inside someone else's business. Honor the shop's hours, cleanliness standards, conflict-resolution expectations, and culture.
          </p>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO7: Elements of Successful Operations
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo7',
      standardId: 'CH21-LO07',
      title: 'LO7: What Makes a Barbershop Successful',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            A successful barbershop is more than a group of talented barbers under one roof. Success comes from systems, culture, and consistency.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Reliable Scheduling and Appointment Flow</h4>
          <p class="mb-3 text-gray-300">
            Use a booking system clients can access online or by phone. Confirm appointments, manage waitlists, and minimize no-shows through reminders.
            A smooth schedule protects barber income and client satisfaction.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Cleanliness and Professional Environment</h4>
          <p class="mb-3 text-gray-300">
            Clients judge your shop the moment they walk in. Clean floors, sanitized stations, fresh towels, pleasant lighting, and organized tools signal professionalism and safety.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Strong Customer Service</h4>
          <p class="mb-3 text-gray-300">
            Greet clients promptly, offer beverages, respect time, listen during consultations, and follow up after visits. Great service turns one-time clients into regulars.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Clear Roles and Accountability</h4>
          <p class="mb-3 text-gray-300">
            Whether you have employees or booth renters, everyone should know who handles opening, closing, cleaning, inventory, deposits, and client complaints.
            Ambiguity creates conflict and missed tasks.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Retail and Add-On Services</h4>
          <p class="mb-3 text-gray-300">
            Retail products, beard treatments, facials, and color services increase revenue per client. Successful shops train barbers to recommend add-ons without being pushy.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Financial Discipline</h4>
          <p class="mb-3 text-gray-300">
            Successful shops watch numbers closely: rent-to-revenue ratio, labor costs, retail margins, and cash flow. They do not spend money just because the shop looks busy.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Positive Shop Culture</h4>
          <p class="mb-3 text-gray-300">
            The energy inside the shop is felt by every client. Drama, gossip, and negativity drive people away. Respect, mentorship, and shared standards keep talent and clients in the building.
          </p>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // LO8: Advertising and Building the Business
    // ───────────────────────────────────────────────
    {
      type: 'htmlContent',
      id: 'ch21-lo8',
      standardId: 'CH21-LO08',
      title: 'LO8: Why Advertising Is Vital',
      html: `
        <div class="p-6 max-w-4xl mx-auto">
          <p class="mb-4 text-gray-300">
            The best haircut in town means nothing if no one knows you exist. Advertising is how you attract new clients, remind current clients to return, and differentiate your shop from competitors.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Building Awareness</h4>
          <p class="mb-3 text-gray-300">
            New shops and new barbers must overcome obscurity. Signs, social media, local listings, and word-of-mouth all introduce your name to people who have not yet sat in your chair.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Attracting the Right Clients</h4>
          <p class="mb-3 text-gray-300">
            Good advertising does not appeal to everyone—it appeals to the clients you actually want. Your visuals, messaging, and offers should match your target audience's style, budget, and values.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Creating Consistency</h4>
          <p class="mb-3 text-gray-300">
            Advertising is not a one-time grand-opening event. It is an ongoing habit. Consistent posting, referral programs, and promotions keep your appointment book full during slow weeks.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Common Advertising Channels</h4>
          <p class="mb-3 text-gray-300">
            Social media (Instagram, TikTok, Facebook), Google Business Profile, local flyers, referral cards, email or text reminders, partnerships with nearby businesses,
            and community sponsorships are all cost-effective ways to market a barbershop.
          </p>

          <h4 class="text-lg font-bold text-ascyn-gold mt-5 mb-2">Reputation as Advertising</h4>
          <p class="mb-3 text-gray-300">
            Every satisfied client is a walking advertisement. Reviews, tagged photos, and personal referrals carry more weight than paid ads because they come from trust.
          </p>

          <div class="bg-ascyn-gold/10 border-l-4 border-ascyn-gold p-4 my-5 rounded-r">
            <p class="text-gray-200"><strong>ASCYN PRO Insight:</strong> Start with one platform and one message. Post consistently, show your work, and always get client consent before sharing photos. A small, active presence beats a scattered, inactive one.</p>
          </div>
        </div>
      `,
    },

    // ───────────────────────────────────────────────
    // Knowledge Check 1: LO1 / LO2
    // ───────────────────────────────────────────────
    {
      type: 'scenarioBlock',
      id: 'ch21-kc1',
      standardId: 'CH21-LO01',
      title: 'Knowledge Check 1: Choosing Your Path',
      subtitle: 'Apply the first two learning objectives to realistic decisions.',
      scenarios: [
        {
          id: 'ch21-scenario-001',
          situation:
            `A barber has built a strong client base, saved $25,000, and wants more control over pricing and scheduling. She does not yet want to manage a full shop with employees. Which option best fits her current situation?`,
          options: [
            { letter: 'A', text: `Open a corporation with multiple shareholders immediately.`, feedback: `Incorrect. This is excessive capital, complexity, and risk for someone not ready to manage a full shop.` },
            { letter: 'B', text: `Become a booth renter inside an established shop to operate her own mini-business with lower overhead.`, feedback: `Correct. Booth rental offers independence, control, and lower risk than opening a full shop.` },
            { letter: 'C', text: `Remain an employee and wait until she has enough clients to buy a franchise.`, feedback: `Incorrect. She already has a strong client base and wants more control; waiting is not necessary if booth rental is available.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-002',
          situation:
            `A barber is evaluating two locations for a new shop. Location A has low rent but poor visibility and no parking. Location B has higher rent, heavy foot traffic, and a parking lot. Which factor should weigh most heavily?`,
          options: [
            { letter: 'A', text: `Always choose the cheapest rent to keep overhead low.`, feedback: `Incorrect. Low rent does not help if clients cannot find or access the shop.` },
            { letter: 'B', text: `Choose the location that best matches the target client and supports consistent walk-in traffic.`, feedback: `Correct. Visibility, accessibility, and traffic usually produce more revenue than the rent savings of a hidden location.` },
            { letter: 'C', text: `Pick the location with the newest flooring regardless of rent or traffic.`, feedback: `Incorrect. Décor can be updated; location fundamentals like traffic and parking are much harder to change.` },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Knowledge Check 2: LO3
    // ───────────────────────────────────────────────
    {
      type: 'scenarioBlock',
      id: 'ch21-kc2',
      standardId: 'CH21-LO03',
      title: 'Knowledge Check 2: Ownership Types',
      subtitle: 'Compare ownership structures in practical situations.',
      scenarios: [
        {
          id: 'ch21-scenario-003',
          situation:
            `Two barbers want to open a shop together. One will contribute most of the capital; the other will manage daily operations. They need a structure that defines roles, profit splits, and what happens if one leaves. Which step is most important?`,
          options: [
            { letter: 'A', text: `Start as a sole proprietorship because it is the cheapest option.`, feedback: `Incorrect. A sole proprietorship only has one owner and offers no structure for a partnership.` },
            { letter: 'B', text: `Form a partnership or LLC and create a written operating agreement that addresses contributions, roles, profit splits, and exit plans.`, feedback: `Correct. A clear agreement protects both partners and prevents disputes from destroying the business.` },
            { letter: 'C', text: `Rely on verbal promises because they trust each other.`, feedback: `Incorrect. Verbal agreements are hard to enforce and fail when money or stress enters the picture.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-004',
          situation:
            `A barber wants to open a single-owner shop and protect personal assets from business lawsuits or debts. Which ownership structure is most appropriate?`,
          options: [
            { letter: 'A', text: `Sole proprietorship, because it separates personal and business liability.`, feedback: `Incorrect. A sole proprietorship does not separate personal liability from business liability.` },
            { letter: 'B', text: `Limited liability company (LLC), because it generally protects personal assets while keeping paperwork manageable.`, feedback: `Correct. An LLC is the most common choice for independent shop owners seeking liability protection.` },
            { letter: 'C', text: `Corporation, because every new shop needs the strongest possible structure.`, feedback: `Incorrect. A corporation offers strong protection but is often unnecessarily complex and costly for a single small shop.` },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Knowledge Check 3: LO4
    // ───────────────────────────────────────────────
    {
      type: 'scenarioBlock',
      id: 'ch21-kc3',
      standardId: 'CH21-LO04',
      title: 'Knowledge Check 3: Business Plan Components',
      subtitle: 'Recognize what belongs in a complete business plan.',
      scenarios: [
        {
          id: 'ch21-scenario-005',
          situation:
            `A lender asks a barber for documentation showing projected revenue, expenses, and when the shop will break even. Which business plan section addresses this?`,
          options: [
            { letter: 'A', text: `Executive summary`, feedback: `Incorrect. The executive summary is an overview, not the detailed financial forecast.` },
            { letter: 'B', text: `Financial projections`, feedback: `Correct. Financial projections include budgets, income statements, cash-flow forecasts, and break-even analysis.` },
            { letter: 'C', text: `Market analysis`, feedback: `Incorrect. Market analysis covers competitors and target clients, not the shop's specific financial forecasts.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-006',
          situation:
            `A barber is writing the section that explains what services the shop will offer, how much they will cost, and how prices compare to competitors. Which section is this?`,
          options: [
            { letter: 'A', text: `Services and pricing`, feedback: `Correct. This section defines the menu, prices, and pricing strategy.` },
            { letter: 'B', text: `Organization and management`, feedback: `Incorrect. That section covers people and ownership structure, not service menus.` },
            { letter: 'C', text: `Marketing and sales strategy`, feedback: `Incorrect. That section explains how services will be promoted, not what they cost.` },
          ],
          correctAnswer: 'A',
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Knowledge Check 4: LO5 / LO6
    // ───────────────────────────────────────────────
    {
      type: 'scenarioBlock',
      id: 'ch21-kc4',
      standardId: 'CH21-LO05',
      title: 'Knowledge Check 4: Records and Booth Rental',
      subtitle: 'Apply record-keeping and booth-renter responsibilities.',
      scenarios: [
        {
          id: 'ch21-scenario-007',
          situation:
            `A booth renter accepts $400 in cash tips over a month and plans not to report them because the shop owner does not track them. What is wrong with this plan?`,
          options: [
            { letter: 'A', text: `Nothing; the shop owner is responsible for all taxes in a rental arrangement.`, feedback: `Incorrect. Booth renters are independent and responsible for reporting their own income, including tips.` },
            { letter: 'B', text: `Tips are taxable income that must be tracked and reported; failing to report can trigger penalties and reduce future benefits.`, feedback: `Correct. Accurate reporting protects the barber legally and makes true income visible for loans and benefits.` },
            { letter: 'C', text: `She should return the tips to clients to avoid the issue.`, feedback: `Incorrect. Clients expect her to keep tips. The correct action is reporting them, not refusing them.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-008',
          situation:
            `A booth renter's rental agreement says she must carry her own liability insurance and provide her own tools and sanitation supplies. Which responsibility is this describing?`,
          options: [
            { letter: 'A', text: `Employee benefits provided by the shop owner`, feedback: `Incorrect. Employees receive benefits from the employer; booth renters typically provide their own insurance and supplies.` },
            { letter: 'B', text: `Independent business expenses that belong to the booth renter`, feedback: `Correct. Booth renters operate their own small business and cover their own insurance, tools, and supplies.` },
            { letter: 'C', text: `Optional extras she can ignore if money is tight`, feedback: `Incorrect. These are contractual obligations, not optional luxuries. Ignoring them can lead to eviction or liability exposure.` },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Knowledge Check 5: LO7 (Reflection)
    // ───────────────────────────────────────────────
    {
      type: 'reflectionBlock',
      id: 'ch21-kc5',
      standardId: 'CH21-LO07',
      title: 'Knowledge Check 5: Successful Operations',
      subtitle: 'Reflect on what separates thriving shops from struggling ones.',
      questions: [
        {
          id: 'ch21-reflect-001',
          question:
            `List three operational systems a successful barbershop needs, and explain why one of them matters most to you.`,
          placeholder:
            `Scheduling, cleanliness, financial tracking, customer service...`,
          insight:
            `Strong operations depend on scheduling flow, sanitation standards, financial discipline, clear roles, and customer service. The system that matters most depends on your strengths and weaknesses—if you dislike numbers, financial tracking may be the one you need to systematize first.`,
        },
        {
          id: 'ch21-reflect-002',
          question:
            `Describe one way a barbershop can increase revenue per client without raising base haircut prices.`,
          placeholder:
            `Retail, add-on services, rebooking, referral programs...`,
          insight:
            `Add-on services like beard detailing, facials, or color blending, plus retail recommendations and rebooking, increase average ticket size while serving the client better.`,
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Knowledge Check 6: LO8 (Reflection)
    // ───────────────────────────────────────────────
    {
      type: 'reflectionBlock',
      id: 'ch21-kc6',
      standardId: 'CH21-LO08',
      title: 'Knowledge Check 6: Advertising',
      subtitle: 'Reflect on how you will attract and keep clients.',
      questions: [
        {
          id: 'ch21-reflect-003',
          question:
            `Which advertising channel fits your personality and your target client best, and why?`,
          placeholder:
            `Instagram, TikTok, Google Business, referrals, local partnerships...`,
          insight:
            `The best marketing is the kind you will actually do consistently. Visual platforms work well for showing haircuts; referral systems work well for relationship-focused barbers.`,
        },
        {
          id: 'ch21-reflect-004',
          question:
            `How can a satisfied client become an ongoing source of advertising?`,
          placeholder:
            `Reviews, referrals, tagged photos, word-of-mouth...`,
          insight:
            `Reviews, personal referrals, and consensual social-media tags are high-trust advertising. Make it easy for happy clients to recommend you and share their experience.`,
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Real Shop Scenarios
    // ───────────────────────────────────────────────
    {
      type: 'scenarioBlock',
      id: 'ch21-real-shop-scenarios',
      standardId: 'CH21-LO08',
      title: 'Real Shop Scenarios',
      subtitle: 'Put the whole chapter together with realistic business decisions.',
      scenarios: [
        {
          id: 'ch21-scenario-009',
          situation:
            `You have saved $15,000 and are deciding between booth rental at $250/week or opening a small shop with $3,500/month rent plus build-out costs. What should you do first?`,
          options: [
            { letter: 'A', text: `Open the shop immediately because ownership is always better than rental.`, feedback: `Incorrect. Ownership is not always better; it depends on capital, clientele, and risk tolerance.` },
            { letter: 'B', text: `Create a detailed budget and cash-flow projection comparing both options over six months.`, feedback: `Correct. Numbers reveal whether your savings can survive the ramp-up period of a new shop.` },
            { letter: 'C', text: `Choose whichever option your friends recommend.`, feedback: `Incorrect. Your friends do not pay your bills or manage your risk.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-010',
          situation:
            `Your shop is busy on Saturdays but nearly empty on Tuesdays and Wednesdays. Which response best uses advertising and operations principles?`,
          options: [
            { letter: 'A', text: `Lower all prices permanently to attract more clients.`, feedback: `Incorrect. Across-the-board discounting cuts profit and trains clients to wait for sales.` },
            { letter: 'B', text: `Run targeted weekday promotions, send rebooking reminders, and create a loyalty program for off-peak visits.`, feedback: `Correct. Targeted advertising plus operational incentives smooth demand without destroying margins.` },
            { letter: 'C', text: `Do nothing; slow days are normal for every shop.`, feedback: `Incorrect. Accepting slow days leaves money on the table and wastes chair capacity.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-011',
          situation:
            `You hire your first employee. Six months later, you realize you have no written records of wages paid, tips reported, or hours worked. What is the biggest risk?`,
          options: [
            { letter: 'A', text: `The employee might ask for a raise.`, feedback: `Incorrect. Raises are a normal conversation; missing records create legal and tax exposure.` },
            { letter: 'B', text: `You cannot prove compliance with wage, tax, and labor laws if audited or disputed.`, feedback: `Correct. Accurate records protect both employer and employee and are required by law.` },
            { letter: 'C', text: `Clients will notice and stop coming.`, feedback: `Incorrect. Clients rarely see payroll records, but regulators and employees do.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-012',
          situation:
            `A new barber wants to join your shop as a booth renter. She asks if you will handle her taxes and provide her with a W-2. How should you respond?`,
          options: [
            { letter: 'A', text: `Agree to handle her taxes to make the arrangement easier.`, feedback: `Incorrect. Treating a booth renter like an employee creates tax misclassification risk.` },
            { letter: 'B', text: `Explain that booth renters are independent, receive a 1099 if applicable, and are responsible for their own taxes and records.`, feedback: `Correct. Clear classification protects both parties and follows IRS guidelines.` },
            { letter: 'C', text: `Refuse to let her rent because she does not understand taxes.`, feedback: `Incorrect. Lack of knowledge is an opportunity to educate, not a reason to reject a qualified renter.` },
          ],
          correctAnswer: 'B',
        },
        {
          id: 'ch21-scenario-013',
          situation:
            `You are writing the marketing section of your business plan. Which element is most critical to include?`,
          options: [
            { letter: 'A', text: `A list of every possible social media platform you might use someday.`, feedback: `Incorrect. Vague lists do not impress lenders or guide action.` },
            { letter: 'B', text: `A clear description of your target client, brand identity, channels, budget, and how you will measure success.`, feedback: `Correct. A focused marketing plan shows you understand who you are trying to reach and how you will reach them.` },
            { letter: `C`, text: `A promise to spend as little as possible on advertising.`, feedback: `Incorrect. Underfunded marketing usually produces underwhelming results.` },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ───────────────────────────────────────────────
    // Premium Study Guide
    // ───────────────────────────────────────────────
    {
      type: 'contentBlock',
      id: 'ch21-study-summary',
      standardId: 'CH21-LO08',
      title: 'Premium Study Guide',
      subtitle: 'Chapter Summary',
      content:
        `This chapter covered the business side of barbering. You learned the two main paths into business for yourself—opening a shop and booth rental—and the factors that matter when opening a barbershop. You compared ownership structures, identified business plan components, explored the importance of record keeping, examined booth-renter responsibilities, distinguished elements of successful operations, and validated why advertising is essential. Whether you plan to be an employee, booth renter, or shop owner, business literacy determines how far your technical skills can take you.`,
      highlight:
        `Great barbers understand that the chair is only one part of a profitable, sustainable career.`,
    },
    {
      type: 'featureGrid',
      id: 'ch21-study-key-concepts',
      standardId: 'CH21-LO08',
      title: 'Key Concepts',
      subtitle: 'The most important ideas to remember',
      features: [
        {
          icon: 'Map',
          title: 'Paths Into Business',
          description:
            `Open or acquire a shop for full ownership and control; rent a booth for lower-risk independence inside an existing shop.`,
        },
        {
          icon: 'Building',
          title: 'Opening Considerations',
          description:
            `Location, capital, legal structure, licensing, staffing model, and shop culture all shape success before the first client arrives.`,
        },
        {
          icon: 'Scale',
          title: 'Ownership Structures',
          description:
            `Sole proprietorship, partnership, LLC, corporation, and franchise each offer different liability, tax, and control trade-offs.`,
        },
        {
          icon: 'FileText',
          title: 'Business Plan',
          description:
            `A complete plan includes executive summary, business description, market analysis, organization, services and pricing, marketing, and financial projections.`,
        },
        {
          icon: 'BookOpen',
          title: 'Record Keeping',
          description:
            `Financial, client, tax, and performance records protect income, support compliance, and guide business decisions.`,
        },
        {
          icon: 'Users',
          title: 'Booth Renter Responsibilities',
          description:
            `Rent, payment collection, taxes, insurance, supplies, marketing, and adherence to shop rules belong to the booth renter.`,
        },
        {
          icon: 'Settings',
          title: 'Successful Operations',
          description:
            `Scheduling, cleanliness, customer service, clear roles, retail, financial discipline, and culture keep a shop thriving.`,
        },
        {
          icon: 'Megaphone',
          title: 'Advertising',
          description:
            `Consistent marketing builds awareness, attracts ideal clients, fills slow days, and turns satisfied clients into promoters.`,
        },
      ],
    },
    {
      type: 'checklist',
      id: 'ch21-study-vocabulary',
      standardId: 'CH21-LO08',
      title: 'Vocabulary Review',
      subtitle: 'Important terminology with concise definitions',
      items: [
        { text: `Booth rental — leasing a station in an existing shop and operating as an independent business.` },
        { text: `Break-even analysis — calculation of when revenue equals total costs.` },
        { text: `Business plan — written document describing the business, market, operations, and financial projections.` },
        { text: `Corporation — legal entity separate from its owners, offering strong liability protection.` },
        { text: `Cash flow — movement of money into and out of the business over time.` },
        { text: `Franchise — licensed operation using an established brand and business system.` },
        { text: `Limited liability company (LLC) — business structure that protects personal assets from business liabilities.` },
        { text: `Partnership — business owned by two or more people who share profits and responsibilities.` },
        { text: `Record keeping — systematic tracking of financial, client, and operational information.` },
        { text: `Sole proprietorship — business owned by one person with no legal separation from the owner.` },
        { text: `Target market — the specific group of clients the business aims to serve.` },
        { text: `1099 — tax form reporting income paid to independent contractors.` },
      ],
    },
    {
      type: 'proTip',
      id: 'ch21-study-professional-tips',
      standardId: 'CH21-LO08',
      title: 'Professional Tips',
      subtitle: 'Advice you can apply immediately',
      items: [
        {
          category: 'Before Opening',
          tips: [
            `Write a full business plan before signing any lease or spending startup capital.`,
            `Talk to at least three shop owners about what they wish they had known before opening.`,
            `Keep personal and business finances separate from day one.`,
          ],
        },
        {
          category: 'As a Booth Renter',
          tips: [
            `Read the rental agreement completely before signing.`,
            `Set aside tax money every week, not just at year-end.`,
            `Track every expense; many are tax-deductible.`,
          ],
        },
        {
          category: 'Running a Shop',
          tips: [
            `Hire for attitude and train for skill.`,
            `Protect the shop culture; one toxic person can poison the entire environment.`,
            `Review financial numbers weekly, not just at tax time.`,
          ],
        },
      ],
    },
    {
      type: 'proTip',
      id: 'ch21-study-business-tips',
      standardId: 'CH21-LO08',
      title: 'Business Tips',
      subtitle: 'Financial and operational concepts for barbering success',
      items: [
        {
          category: 'Financial Health',
          tips: [
            `Know your break-even number: how much revenue you need to cover fixed costs.`,
            `Build an emergency fund before taking on business debt.`,
            `Review profit margins on services and retail separately.`,
          ],
        },
        {
          category: 'Marketing',
          tips: [
            `Post consistently rather than perfectly.`,
            `Ask every happy client for a review before they leave.`,
            `Track which advertising channels actually bring clients, then double down.`,
          ],
        },
        {
          category: 'Growth',
          tips: [
            `Increase average ticket before increasing client count.`,
            `Train barbers to rebook every client during the current visit.`,
            `Use slow days for education, maintenance, and relationship building.`,
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'ch21-study-review-questions',
      standardId: 'CH21-LO08',
      title: 'Review Questions',
      subtitle: 'Study questions covering the entire chapter',
      content:
        `1. What are the two main options for going into business for yourself as a barber?\n2. List five factors to consider when opening a barbershop.\n3. How does a sole proprietorship differ from an LLC in terms of liability?\n4. Name at least five sections that belong in a business plan.\n5. Why is record keeping important for taxes, loans, and business decisions?\n6. List four responsibilities of a booth renter.\n7. What are five elements of successful barbershop operations?\n8. Why is advertising vital even if you are a highly skilled barber?\n9. How can a satisfied client become a form of advertising?\n10. What is the relationship between business literacy and long-term barbering success?`,
      highlight:
        `Use these questions to self-test. If you cannot answer one confidently, return to the related lesson section before moving on.`,
    },
    {
      type: 'featureGrid',
      id: 'ch21-study-exam-tips',
      standardId: 'CH21-LO08',
      title: 'Exam Tips',
      subtitle: 'Prepare for licensing exams and competency assessments',
      features: [
        {
          icon: 'Scale',
          title: 'Know Ownership Types',
          description:
            `Be able to match sole proprietorship, partnership, LLC, corporation, and franchise to their liability and tax characteristics.`,
        },
        {
          icon: 'FileText',
          title: 'Business Plan Sections',
          description:
            `Memorize the main sections: executive summary, description, market analysis, organization, services/pricing, marketing, and financial projections.`,
        },
        {
          icon: 'BookOpen',
          title: 'Record Keeping',
          description:
            `Expect questions on why financial, client, and tax records matter and what can happen if records are missing or inaccurate.`,
        },
        {
          icon: 'Megaphone',
          title: 'Advertising Principles',
          description:
            `Know why consistent advertising matters and which channels are common for barbershops.`,
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'ch21-study-memory-aids',
      standardId: 'CH21-LO08',
      title: 'Memory Aids',
      subtitle: 'Strategies to help key concepts stick',
      features: [
        {
          icon: 'Map',
          title: 'The Two Paths',
          description:
            `Own the shop (big risk, big control) or rent the booth (lower risk, less control).`,
        },
        {
          icon: 'FileText',
          title: 'PLAN-IT',
          description:
            `Plan, Location, Assets, Numbers, Insurance, Taxes. Six essentials for opening a shop.`,
        },
        {
          icon: 'Megaphone',
          title: 'The Advertising Rule',
          description:
            `Be seen → be chosen → be remembered → be recommended.`,
        },
      ],
    },
    {
      type: 'checklist',
      id: 'ch21-study-best-practices',
      standardId: 'CH21-LO08',
      title: 'Best Practices',
      subtitle: 'Professional behaviors expected of successful barbers',
      items: [
        { text: `Choose a business path that matches your capital, experience, and risk tolerance.` },
        { text: `Write a complete business plan before investing significant money.` },
        { text: `Select a legal structure that protects personal assets when appropriate.` },
        { text: `Keep accurate financial and client records from day one.` },
        { text: `Set aside tax money regularly if you are self-employed or a booth renter.` },
        { text: `Read and honor rental agreements and shop policies.` },
        { text: `Maintain cleanliness, professionalism, and strong customer service.` },
        { text: `Advertise consistently and measure results.` },
        { text: `Protect shop culture by addressing negativity quickly.` },
        { text: `Treat business education as part of your professional development.` },
      ],
    },
    {
      type: 'challengeCard',
      id: 'ch21-workplace-taskings',
      standardId: 'CH21-LO08',
      title: 'Try This: Build Your Business Practice',
      subtitle: 'Move from knowing to doing with practical business exercises.',
      challenges: [
        {
          badge: `Business Planning`,
          title: `Draft a One-Page Business Plan`,
          description:
            `Create a simplified business plan for a barbershop or booth-rental business you might operate.`,
          action:
            `Include concept, target client, services/pricing, marketing channel, monthly expenses estimate, and break-even revenue target.`,
          difficulty: `medium`,
        },
        {
          badge: `Financial Literacy`,
          title: `Build a Barber Budget`,
          description:
            `Create a realistic monthly budget for a booth renter or small shop owner.`,
          action:
            `List income, rent, supplies, insurance, taxes, and personal expenses. Identify how many service tickets are needed to break even.`,
          difficulty: `medium`,
        },
        {
          badge: `Legal Literacy`,
          title: `Compare Ownership Structures`,
          description:
            `Research sole proprietorship, LLC, and partnership in your state.`,
          action:
            `List formation cost, annual fees, liability protection, and tax filing requirements. Recommend the best fit for a first-time shop owner.`,
          difficulty: `hard`,
        },
        {
          badge: `Marketing`,
          title: `Create a 30-Day Advertising Plan`,
          description:
            `Design a simple month-long marketing plan for a new barber or shop.`,
          action:
            `Choose two channels, set posting frequency, define one promotion, and create a script for asking clients for reviews.`,
          difficulty: `medium`,
        },
        {
          badge: `Operations`,
          title: `Design an Opening/Closing Checklist`,
          description:
            `Create a daily checklist for opening and closing a barbershop.`,
          action:
            `Include sanitation, supply check, cash/card reconciliation, appointment review, and security steps.`,
          difficulty: `easy`,
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'ch21-instructor-notes',
      standardId: 'CH21-LO08',
      title: 'Instructor Notes',
      content:
        `Invite a local shop owner or franchisee to discuss the realities of opening and operating a barbershop. Have students compare the liability profiles of sole proprietorship, partnership, LLC, and corporation using a simple chart. Ask students to draft a one-page business plan and present it for peer feedback. Practice record-keeping exercises with sample income and expense logs, and have students calculate break-even revenue. Use role-play to simulate a booth-rental agreement review and a tax-conversation with a new booth renter. Discuss advertising case studies and have students create one social media post and one referral request script. Common misconceptions include the belief that booth renters are employees, that a business plan is only for lenders, and that advertising is unnecessary if the barber is skilled. Emphasize that business literacy is as important as technical skill for long-term success.`,
      highlight: `The most successful barbers treat business knowledge as a craft to be studied, not a burden to be avoided.`,
    },
  ],

  // ───────────────────────────────────────────────
  // Competencies (6 competencies mapped to 8 LOs)
  // ───────────────────────────────────────────────
  competencies: [
    {
      id: 'CH21-C01',
      standardId: 'CH21-C01',
      title: 'Paths Into Business and Opening Considerations',
      description: 'Identify options for going into business for yourself and list the basic factors to consider when opening a barbershop.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH21-LO01', 'CH21-LO02'],
      flashcardIds: ['fc-ch21-001', 'fc-ch21-002', 'fc-ch21-003', 'fc-ch21-004', 'fc-ch21-005', 'fc-ch21-006', 'fc-ch21-007', 'fc-ch21-008', 'fc-ch21-009', 'fc-ch21-010'],
      quizQuestionIds: ['qq-21-01', 'qq-21-02', 'qq-21-03', 'qq-21-17'],
    },
    {
      id: 'CH21-C02',
      standardId: 'CH21-C02',
      title: 'Types of Barbershop Ownership',
      description: 'Compare sole proprietorship, partnership, LLC, corporation, and franchise ownership structures.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH21-LO03'],
      flashcardIds: ['fc-ch21-011', 'fc-ch21-012', 'fc-ch21-013', 'fc-ch21-014', 'fc-ch21-015', 'fc-ch21-016', 'fc-ch21-017', 'fc-ch21-018', 'fc-ch21-019', 'fc-ch21-020'],
      quizQuestionIds: ['qq-21-04', 'qq-21-05'],
    },
    {
      id: 'CH21-C03',
      standardId: 'CH21-C03',
      title: 'Business Plan Components',
      description: 'Recognize the information that should be included in a barbershop business plan.',
      importance: 'critical',
      difficulty: 'easy',
      learningObjectives: ['CH21-LO04'],
      flashcardIds: ['fc-ch21-021', 'fc-ch21-022', 'fc-ch21-023', 'fc-ch21-024', 'fc-ch21-025', 'fc-ch21-026', 'fc-ch21-027', 'fc-ch21-028', 'fc-ch21-029', 'fc-ch21-030'],
      quizQuestionIds: ['qq-21-07', 'qq-21-08'],
    },
    {
      id: 'CH21-C04',
      standardId: 'CH21-C04',
      title: 'Record Keeping and Booth Renter Responsibilities',
      description: 'Explain the importance of record keeping and examine the responsibilities of a booth renter.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH21-LO05', 'CH21-LO06'],
      flashcardIds: ['fc-ch21-031', 'fc-ch21-032', 'fc-ch21-033', 'fc-ch21-034', 'fc-ch21-035', 'fc-ch21-036', 'fc-ch21-037', 'fc-ch21-038', 'fc-ch21-039', 'fc-ch21-040'],
      quizQuestionIds: ['qq-21-09', 'qq-21-10', 'qq-21-11', 'qq-21-06'],
    },
    {
      id: 'CH21-C05',
      standardId: 'CH21-C05',
      title: 'Successful Barbershop Operations',
      description: 'Distinguish the elements of successful barbershop operations.',
      importance: 'critical',
      difficulty: 'easy',
      learningObjectives: ['CH21-LO07'],
      flashcardIds: ['fc-ch21-041', 'fc-ch21-042', 'fc-ch21-043', 'fc-ch21-044', 'fc-ch21-045', 'fc-ch21-046', 'fc-ch21-047', 'fc-ch21-048', 'fc-ch21-049', 'fc-ch21-050'],
      quizQuestionIds: ['qq-21-12', 'qq-21-13'],
    },
    {
      id: 'CH21-C06',
      standardId: 'CH21-C06',
      title: 'Advertising and Business Growth',
      description: 'Validate why advertising is a vital aspect of a barbershop\'s success and apply growth strategies.',
      importance: 'critical',
      difficulty: 'easy',
      learningObjectives: ['CH21-LO08'],
      flashcardIds: ['fc-ch21-051', 'fc-ch21-052', 'fc-ch21-053', 'fc-ch21-054', 'fc-ch21-055', 'fc-ch21-056', 'fc-ch21-057', 'fc-ch21-058', 'fc-ch21-059', 'fc-ch21-060'],
      quizQuestionIds: ['qq-21-14', 'qq-21-15', 'qq-21-16'],
    },
  ],

  // ───────────────────────────────────────────────
  // Learning Objectives
  // ───────────────────────────────────────────────
  learningObjectives: [
    {
      id: 'CH21-LO01',
      standardId: 'CH21-LO01',
      description: 'Identify two options for going into business for yourself.',
      competencyIds: ['CH21-C01'],
      lessonIds: ['ch21-lo1'],
      flashcardIds: ['fc-ch21-001', 'fc-ch21-002', 'fc-ch21-003', 'fc-ch21-004', 'fc-ch21-005'],
      quizQuestionIds: ['qq-21-01', 'qq-21-02'],
    },
    {
      id: 'CH21-LO02',
      standardId: 'CH21-LO02',
      description: 'List the basic factors to be considered when opening a barbershop.',
      competencyIds: ['CH21-C01'],
      lessonIds: ['ch21-lo2'],
      flashcardIds: ['fc-ch21-006', 'fc-ch21-007', 'fc-ch21-008', 'fc-ch21-009', 'fc-ch21-010'],
      quizQuestionIds: ['qq-21-03'],
    },
    {
      id: 'CH21-LO03',
      standardId: 'CH21-LO03',
      description: 'Compare types of barbershop ownership.',
      competencyIds: ['CH21-C02'],
      lessonIds: ['ch21-lo3'],
      flashcardIds: ['fc-ch21-011', 'fc-ch21-012', 'fc-ch21-013', 'fc-ch21-014', 'fc-ch21-015', 'fc-ch21-016', 'fc-ch21-017', 'fc-ch21-018', 'fc-ch21-019', 'fc-ch21-020'],
      quizQuestionIds: ['qq-21-04', 'qq-21-05', 'qq-21-06'],
    },
    {
      id: 'CH21-LO04',
      standardId: 'CH21-LO04',
      description: 'Recognize the information that should be included in a business plan.',
      competencyIds: ['CH21-C03'],
      lessonIds: ['ch21-lo4'],
      flashcardIds: ['fc-ch21-021', 'fc-ch21-022', 'fc-ch21-023', 'fc-ch21-024', 'fc-ch21-025', 'fc-ch21-026', 'fc-ch21-027', 'fc-ch21-028', 'fc-ch21-029', 'fc-ch21-030'],
      quizQuestionIds: ['qq-21-07', 'qq-21-08'],
    },
    {
      id: 'CH21-LO05',
      standardId: 'CH21-LO05',
      description: 'Explain the importance of record keeping.',
      competencyIds: ['CH21-C04'],
      lessonIds: ['ch21-lo5'],
      flashcardIds: ['fc-ch21-031', 'fc-ch21-032', 'fc-ch21-033', 'fc-ch21-034', 'fc-ch21-035'],
      quizQuestionIds: ['qq-21-09', 'qq-21-10'],
    },
    {
      id: 'CH21-LO06',
      standardId: 'CH21-LO06',
      description: 'Examine the responsibilities of a booth renter.',
      competencyIds: ['CH21-C04'],
      lessonIds: ['ch21-lo6'],
      flashcardIds: ['fc-ch21-036', 'fc-ch21-037', 'fc-ch21-038', 'fc-ch21-039', 'fc-ch21-040'],
      quizQuestionIds: ['qq-21-11'],
    },
    {
      id: 'CH21-LO07',
      standardId: 'CH21-LO07',
      description: 'Distinguish the elements of successful barbershop operations.',
      competencyIds: ['CH21-C05'],
      lessonIds: ['ch21-lo7'],
      flashcardIds: ['fc-ch21-041', 'fc-ch21-042', 'fc-ch21-043', 'fc-ch21-044', 'fc-ch21-045', 'fc-ch21-046', 'fc-ch21-047', 'fc-ch21-048', 'fc-ch21-049', 'fc-ch21-050'],
      quizQuestionIds: ['qq-21-12', 'qq-21-13'],
    },
    {
      id: 'CH21-LO08',
      standardId: 'CH21-LO08',
      description: 'Validate why advertising is a vital aspect of a barbershop\'s success.',
      competencyIds: ['CH21-C06'],
      lessonIds: ['ch21-lo8'],
      flashcardIds: ['fc-ch21-051', 'fc-ch21-052', 'fc-ch21-053', 'fc-ch21-054', 'fc-ch21-055', 'fc-ch21-056', 'fc-ch21-057', 'fc-ch21-058', 'fc-ch21-059', 'fc-ch21-060'],
      quizQuestionIds: ['qq-21-14', 'qq-21-15', 'qq-21-16'],
    },
  ],

  // ───────────────────────────────────────────────
  // Remediation Paths
  // ───────────────────────────────────────────────
  remediation: [
    {
      id: 'CH21-R01',
      standardId: 'CH21-R01',
      competencyId: 'CH21-C01',
      lessonIds: ['ch21-lo1', 'ch21-lo2'],
      flashcardIds: ['fc-ch21-001', 'fc-ch21-002', 'fc-ch21-003', 'fc-ch21-004', 'fc-ch21-005', 'fc-ch21-006', 'fc-ch21-007', 'fc-ch21-008', 'fc-ch21-009', 'fc-ch21-010'],
      vocabularyIds: ['booth-rental', 'business-ownership', 'startup-costs', 'location'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-21-01', 'qq-21-02', 'qq-21-03', 'qq-21-17'],
      instructorNote: 'Review the two paths into business and the factors involved in opening a shop. Have the student create a simple comparison chart and list three personal readiness factors.',
      retakeCount: 3,
    },
    {
      id: 'CH21-R02',
      standardId: 'CH21-R02',
      competencyId: 'CH21-C02',
      lessonIds: ['ch21-lo3'],
      flashcardIds: ['fc-ch21-011', 'fc-ch21-012', 'fc-ch21-013', 'fc-ch21-014', 'fc-ch21-015', 'fc-ch21-016', 'fc-ch21-017', 'fc-ch21-018', 'fc-ch21-019', 'fc-ch21-020'],
      vocabularyIds: ['sole-proprietorship', 'partnership', 'llc', 'corporation', 'franchise'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-21-04', 'qq-21-05'],
      instructorNote: 'Use a comparison chart to review ownership structures. Ask the student to recommend a structure for three hypothetical scenarios and justify each choice.',
      retakeCount: 3,
    },
    {
      id: 'CH21-R03',
      standardId: 'CH21-R03',
      competencyId: 'CH21-C03',
      lessonIds: ['ch21-lo4'],
      flashcardIds: ['fc-ch21-021', 'fc-ch21-022', 'fc-ch21-023', 'fc-ch21-024', 'fc-ch21-025', 'fc-ch21-026', 'fc-ch21-027', 'fc-ch21-028', 'fc-ch21-029', 'fc-ch21-030'],
      vocabularyIds: ['business-plan', 'executive-summary', 'market-analysis', 'financial-projections'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-21-07', 'qq-21-08'],
      instructorNote: 'Have the student outline a one-page business plan and explain what each section communicates to a lender or partner.',
      retakeCount: 3,
    },
    {
      id: 'CH21-R04',
      standardId: 'CH21-R04',
      competencyId: 'CH21-C04',
      lessonIds: ['ch21-lo5', 'ch21-lo6'],
      flashcardIds: ['fc-ch21-031', 'fc-ch21-032', 'fc-ch21-033', 'fc-ch21-034', 'fc-ch21-035', 'fc-ch21-036', 'fc-ch21-037', 'fc-ch21-038', 'fc-ch21-039', 'fc-ch21-040'],
      vocabularyIds: ['record-keeping', 'client-records', 'cash-flow', 'booth-rental', '1099'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-21-09', 'qq-21-10', 'qq-21-11', 'qq-21-06'],
      instructorNote: 'Practice logging sample income and expenses. Review a booth rental agreement and have the student identify every renter responsibility listed.',
      retakeCount: 3,
    },
    {
      id: 'CH21-R05',
      standardId: 'CH21-R05',
      competencyId: 'CH21-C05',
      lessonIds: ['ch21-lo7'],
      flashcardIds: ['fc-ch21-041', 'fc-ch21-042', 'fc-ch21-043', 'fc-ch21-044', 'fc-ch21-045', 'fc-ch21-046', 'fc-ch21-047', 'fc-ch21-048', 'fc-ch21-049', 'fc-ch21-050'],
      vocabularyIds: ['customer-service', 'scheduling', 'retail', 'shop-culture'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-21-12', 'qq-21-13'],
      instructorNote: 'Have the student design an opening/closing checklist and explain how each operational element supports client retention and profit.',
      retakeCount: 3,
    },
    {
      id: 'CH21-R06',
      standardId: 'CH21-R06',
      competencyId: 'CH21-C06',
      lessonIds: ['ch21-lo8'],
      flashcardIds: ['fc-ch21-051', 'fc-ch21-052', 'fc-ch21-053', 'fc-ch21-054', 'fc-ch21-055', 'fc-ch21-056', 'fc-ch21-057', 'fc-ch21-058', 'fc-ch21-059', 'fc-ch21-060'],
      vocabularyIds: ['advertising', 'target-market', 'referrals', 'reviews'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-21-14', 'qq-21-15', 'qq-21-16'],
      instructorNote: 'Have the student create one social media post and one referral-request script. Discuss why consistency matters more than perfection in advertising.',
      retakeCount: 3,
    },
  ],

  // ───────────────────────────────────────────────
  // Mastery Configuration
  // ───────────────────────────────────────────────
  mastery: {
    passingScore: 80,
    confidenceCheck: true,
    remediationRequiredBelow: 80,
  },
}
