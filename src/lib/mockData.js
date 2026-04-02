// Mock data for prototype

export const mockArticles = [
  { id: 1, title: "Sugar Production Hits Record High in Maharashtra", category: "News", date: "2026-03-28", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", excerpt: "Maharashtra sugar mills reported record production this season, surpassing last year by 12%.", content: "Maharashtra sugar mills have reported record production this season, surpassing last year output by 12%. The state favorable monsoon and improved farming techniques contributed to this milestone.", trending: true, premium: false },
  { id: 2, title: "Ethanol Blending Policy: New Government Directive", category: "Policy", date: "2026-03-27", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600", excerpt: "New directives on ethanol blending targets for 2026-27 raise the mandate to 20%.", content: "The government has issued new directives on ethanol blending targets for 2026-27, raising the mandate to 20%. This move is expected to benefit sugar mills significantly.", trending: true, premium: false },
  { id: 3, title: "Global Sugar Prices Surge Amid Supply Concerns", category: "Markets", date: "2026-03-26", image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600", excerpt: "International sugar prices surged 8% as Brazil faces drought conditions affecting cane output.", content: "International sugar prices have surged 8% this week as Brazil faces drought conditions. Traders are closely watching as India export policy remains under review.", trending: true, premium: true },
  { id: 4, title: "UP Sugar Mills Begin Crushing Season Early", category: "News", date: "2026-03-25", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", excerpt: "UP mills commenced crushing two weeks ahead of schedule due to early cane maturity.", content: "Uttar Pradesh sugar mills have commenced the crushing season two weeks ahead of schedule due to early cane maturity.", trending: false, premium: false },
  { id: 5, title: "Sugarcane Farmers Demand Higher MSP for 2026-27", category: "Agriculture", date: "2026-03-24", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600", excerpt: "Farmer unions demand a 15% hike in the Minimum Support Price for sugarcane.", content: "Farmer unions across major sugar-producing states are demanding a 15% hike in the Minimum Support Price for sugarcane.", trending: false, premium: false },
  { id: 6, title: "ISMA Projects 32 Million Tonnes Sugar Output", category: "News", date: "2026-03-23", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600", excerpt: "ISMA projected total sugar output at 32 million tonnes for the current season.", content: "The Indian Sugar Mills Association has projected total sugar output at 32 million tonnes for the current season.", trending: false, premium: false },
  { id: 7, title: "New Cane Variety Boosts Yield by 20% in Trials", category: "Agriculture", date: "2026-03-22", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600", excerpt: "A new ICAR sugarcane variety showed 20% higher yield in field trials across five states.", content: "A new sugarcane variety developed by ICAR has shown 20% higher yield in field trials across five states. The variety is drought-resistant and matures 30 days earlier.", trending: false, premium: true },
  { id: 8, title: "Sugar Export Ban Lifted: Mills Eye Global Markets", category: "Policy", date: "2026-03-21", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600", excerpt: "Government lifted the sugar export ban, allowing mills to export up to 6 million tonnes.", content: "The government has lifted the sugar export ban, allowing mills to export up to 6 million tonnes this season.", trending: false, premium: true },
  { id: 9, title: "Drip Irrigation Adoption Rising Among Cane Farmers", category: "Agriculture", date: "2026-03-20", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600", excerpt: "Adoption of drip irrigation among sugarcane farmers increased by 35% in two years.", content: "Adoption of drip irrigation among sugarcane farmers has increased by 35% in the last two years.", trending: false, premium: false },
  { id: 10, title: "Sugar Mill Modernization Fund Announced", category: "Policy", date: "2026-03-19", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600", excerpt: "A Rs 5000 crore fund announced to support sugar mill modernization.", content: "A Rs 5000 crore fund has been announced to support sugar mill modernization and capacity expansion.", trending: false, premium: false },
  { id: 11, title: "Monsoon Forecast: Good News for Cane Belt", category: "Agriculture", date: "2026-03-18", image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600", excerpt: "IMD forecast above-normal monsoon for major sugarcane growing regions in 2026.", content: "IMD has forecast above-normal monsoon for major sugarcane growing regions in 2026, raising hopes for a bumper crop next season.", trending: false, premium: false },
  { id: 12, title: "Co-generation Power: Mills Earn Rs 2400 Crore", category: "News", date: "2026-03-17", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600", excerpt: "Sugar mills earned Rs 2400 crore from co-generation power sales this season.", content: "Sugar mills earned Rs 2400 crore from co-generation power sales in the first half of the season, an 18% increase over last year.", trending: false, premium: false },
];
export const mockMarketPrices = [
  { state: "Maharashtra", variety: "M-86032", price: 3450, change: 12, unit: "Rs/quintal" },
  { state: "Uttar Pradesh", variety: "Co-0238", price: 3380, change: -5, unit: "Rs/quintal" },
  { state: "Karnataka", variety: "Co-86032", price: 3520, change: 8, unit: "Rs/quintal" },
  { state: "Tamil Nadu", variety: "Co-C 671", price: 3490, change: 3, unit: "Rs/quintal" },
  { state: "Gujarat", variety: "Co-671", price: 3410, change: -2, unit: "Rs/quintal" },
  { state: "Andhra Pradesh", variety: "Co-86032", price: 3460, change: 6, unit: "Rs/quintal" },
  { state: "Punjab", variety: "Co-0238", price: 3350, change: 0, unit: "Rs/quintal" },
  { state: "Haryana", variety: "Co-0238", price: 3360, change: 1, unit: "Rs/quintal" },
];

export const mockChartData = [
  { month: "Oct", price: 3200 },
  { month: "Nov", price: 3280 },
  { month: "Dec", price: 3350 },
  { month: "Jan", price: 3400 },
  { month: "Feb", price: 3380 },
  { month: "Mar", price: 3450 },
];

export const mockMagazines = [
  { id: 1, title: "Sugartimes Monthly - March 2026", cover: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400", pages: 48, premium: false, date: "2026-03-01" },
  { id: 2, title: "Sugartimes Monthly - February 2026", cover: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400", pages: 52, premium: true, date: "2026-02-01" },
  { id: 3, title: "Sugartimes Monthly - January 2026", cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", pages: 44, premium: true, date: "2026-01-01" },
  { id: 4, title: "Annual Report 2025", cover: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", pages: 120, premium: true, date: "2025-12-01" },
  { id: 5, title: "Sugartimes Monthly - December 2025", cover: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400", pages: 50, premium: true, date: "2025-12-01" },
  { id: 6, title: "Sugartimes Monthly - November 2025", cover: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400", pages: 46, premium: true, date: "2025-11-01" },
];

export const mockAdminStats = {
  totalUsers: 4821,
  activeSubscriptions: 1243,
  revenue: 2847500,
  articlesPublished: 386,
  magazinesUploaded: 24,
  pendingPayments: 17,
};

export const mockUsers = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", plan: "Premium", status: "Active", joined: "2026-01-15" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", plan: "Basic", status: "Active", joined: "2026-02-10" },
  { id: 3, name: "Amit Patel", email: "amit@example.com", plan: "Premium", status: "Expired", joined: "2025-11-20" },
  { id: 4, name: "Sunita Devi", email: "sunita@example.com", plan: "Free", status: "Active", joined: "2026-03-01" },
  { id: 5, name: "Vikram Singh", email: "vikram@example.com", plan: "Premium", status: "Active", joined: "2026-01-28" },
];

export const mockPolicies = [
  { id: 1, title: "National Sugar Policy 2025-26", category: "Central Government", date: "2026-01-10", summary: "Comprehensive policy framework for sugar sector regulation, pricing, and export management.", content: "The National Sugar Policy 2025-26 outlines the government approach to managing the sugar sector, including FRP fixation, export quotas, ethanol blending mandates, and mill modernization support." },
  { id: 2, title: "Ethanol Blending Programme (EBP) Guidelines", category: "Ministry of Petroleum", date: "2026-02-15", summary: "Updated guidelines for ethanol procurement and blending targets under the EBP.", content: "The updated EBP guidelines mandate 20% ethanol blending in petrol by 2026-27. Sugar mills and standalone distilleries are eligible to supply ethanol under the programme." },
  { id: 3, title: "FRP Announcement for 2026-27 Season", category: "CCEA", date: "2026-03-01", summary: "Cabinet Committee on Economic Affairs fixes Fair and Remunerative Price for sugarcane.", content: "The CCEA has fixed the FRP for sugarcane at Rs 340 per quintal for the 2026-27 season, linked to a basic recovery rate of 10.25%." },
  { id: 4, title: "Sugar Export Policy Update", category: "DGFT", date: "2026-03-10", summary: "DGFT issues updated notification on sugar export permissions and OGL status.", content: "The Directorate General of Foreign Trade has issued updated notifications allowing sugar exports under OGL with a cap of 6 million tonnes for the current season." },
  { id: 5, title: "State Advised Price (SAP) - Uttar Pradesh", category: "State Government", date: "2026-02-20", summary: "UP government announces SAP for sugarcane at Rs 375 per quintal for 2025-26.", content: "The Uttar Pradesh government has announced the State Advised Price for sugarcane at Rs 375 per quintal for the 2025-26 season, higher than the central FRP." },
  { id: 6, title: "PMFBY Scheme Extension for Cane Farmers", category: "Ministry of Agriculture", date: "2026-01-25", summary: "Pradhan Mantri Fasal Bima Yojana extended to cover sugarcane crop losses.", content: "The PMFBY scheme has been extended to cover sugarcane crop losses due to natural calamities, benefiting over 2 million cane farmers across India." },
];
