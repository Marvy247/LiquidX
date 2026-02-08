# Product Requirements Document (PRD)
## LiquidX on SUI: Incentivized Cross-Chain Liquidity Protocol

---

**PRD Title:** LiquidX on SUI - MVP Product Requirements  
**Author:** Product Team  
**Version:** 1.0  
**Date:** January 22, 2026  
**Status:** Draft for SUI Foundation Grant Application

---

## Team

| Role | Name | Responsibility |
|------|------|---------------|
| **Product Manager** | [TBD] | Product strategy, roadmap, stakeholder management |
| **Engineering Lead** | [TBD] | Technical architecture, Move smart contracts, backend services |
| **Frontend Developer** | [TBD] | React/TypeScript UI, wallet integration, user experience |
| **Designer** | [TBD] | UI/UX design, branding, user flows |
| **Approvers/Sign-Off** | SUI Foundation Grant Committee | Final approval for grant funding |

---

## Objective

**Mission:** Transform cross-chain liquidity movement into SUI by creating the first incentivized bridge aggregator that rewards users for bringing assets from Ethereum and other chains into the SUI DeFi ecosystem.

**Primary Goals:**
1. Drive $10M+ in cross-chain liquidity to SUI within 6 months of launch
2. Increase Total Value Locked (TVL) in SUI DeFi protocols by routing capital to top protocols
3. Create sticky user engagement through gamification and rewards system
4. Establish a sustainable revenue model (target: $300K ARR within year 1)

**Target Audience:**
- DeFi power users with capital on Ethereum, Polygon, Arbitrum, Base
- Yield farmers seeking optimal returns across chains
- Early SUI ecosystem adopters looking for new opportunities
- Liquidity providers interested in earning additional rewards

**Value Proposition:**
Unlike traditional bridges that offer no incentive, LiquidX pays users in $LQX tokens (0.75%+ of bridged amount) while automatically deploying their capital to the highest-yield opportunities on SUI. This creates a compelling economic reason to move liquidity to SUI.

---

## Overview

### Background
The SUI blockchain offers superior performance (sub-second finality, high throughput) and innovative DeFi protocols, but suffers from limited liquidity compared to mature chains like Ethereum. Current bridging solutions are purely utilitarian—users bridge and are left wondering "now what?"

### The Problem We're Solving
**Why don't users bring liquidity to SUI?**
- ❌ No incentive to bridge beyond speculative opportunity
- ❌ No guidance on where to deploy capital after bridging  
- ❌ Fragmented DeFi landscape makes yield comparison difficult
- ❌ No rewards for taking the risk of using a newer ecosystem

**Market Evidence (Voice of Customer):**
- "I have $50K in Aave on Ethereum earning 5%. Why would I move it to SUI?" - DeFi Farmer, Discord
- "Bridging is scary. I need a reason beyond just 'try SUI'." - Crypto Twitter
- "After bridging, I spent 2 hours researching SUI protocols. Confusing." - Beta Tester

### Our Solution: LiquidX on SUI
An all-in-one platform that:
1. **Scans** real-time yields across chains and identifies SUI opportunities
2. **Rewards** users with $LQX tokens for bridging to SUI (0.75%+ of amount)
3. **Auto-deploys** bridged assets to highest-yield SUI protocols in one transaction
4. **Gamifies** the experience with leaderboards, multipliers, and referral rewards
5. **Retains** liquidity through vesting schedules and ongoing engagement

### Why SUI?
- **Technical Fit:** SUI's Move language provides superior security for financial smart contracts
- **Performance:** Sub-second finality enables seamless UX for auto-deploy features
- **Ecosystem Growth:** Early mover advantage in rapidly growing SUI DeFi ecosystem
- **Parallel Execution:** SUI's architecture allows efficient handling of multiple simultaneous bridges
- **Native Assets:** SUI's asset model simplifies yield optimization across protocols

---

## Scope

### In Scope
✅ **Core Bridge Functionality**
- Integration with Wormhole bridge for Ethereum → SUI
- Support for USDC, USDT, ETH bridging
- Transaction tracking and status updates
- Wallet integrations (MetaMask, SUI Wallet, Suiet)

✅ **Rewards System**
- $LQX token smart contract (Move)
- Reward calculation engine (base 0.75% + bonuses)
- Multiplier tiers based on volume
- 90-day linear vesting mechanism
- Referral tracking and bonus distribution

✅ **DeFi Integration (MVP: 3 protocols)**
- Auto-deploy to top 3 SUI DeFi protocols
- Real-time APY fetching
- Yield comparison dashboard
- Single-transaction bridge + deploy

✅ **User Engagement**
- Leaderboard (top 100 users by volume)
- Rewards dashboard (earned, claimable, vested)
- Referral link generation
- Transaction history

✅ **Frontend Application**
- Web application (React + TypeScript)
- Mobile-responsive design
- Real-time updates (APY, leaderboard, rewards)

### Out of Scope (Post-MVP)
❌ Mobile native apps (iOS/Android) - Phase 2
❌ Support for 10+ DeFi protocols - Phase 2
❌ Cross-chain from non-EVM chains (Solana, Bitcoin) - Phase 2
❌ Governance DAO functionality - Phase 3
❌ Insurance pool for bridge risks - Phase 3
❌ Advanced analytics dashboard - Phase 2
❌ API for third-party integrations - Phase 3
❌ AI-powered yield optimization - Phase 3

### Technical Constraints
- Must use SUI Move for smart contracts
- Bridge integration limited to Wormhole (most mature)
- Frontend hosted on Vercel (existing infrastructure)
- Initial deployment on SUI Testnet, then Mainnet
- Budget: $50K grant requested from SUI Foundation

---

## Problem

### Problem Statement
**Current Situation:**  
The SUI blockchain ecosystem has high-quality DeFi protocols offering competitive yields (10-20% APY), but lacks sufficient liquidity to reach its full potential. Traditional bridges provide a technical solution to move assets cross-chain, but offer no economic incentive or user guidance, resulting in low adoption and minimal liquidity flow.

**Customer Pain Points:**
1. **No Incentive:** "Why bridge to SUI when I'm already earning on Ethereum?"
2. **Post-Bridge Confusion:** "I bridged my USDC to SUI... now what do I do with it?"
3. **Information Overload:** "Too many protocols, too much research needed"
4. **Risk Perception:** "SUI is newer, feels risky to move significant capital"
5. **Friction:** "Bridging then deploying requires multiple transactions and gas fees"

**Business Impact:**
- SUI DeFi protocols operate at 20-30% capacity due to liquidity constraints
- Users miss arbitrage opportunities (SUI yields often 5-10% higher than Ethereum)
- Ecosystem growth limited by chicken-and-egg problem (no liquidity = no users = no liquidity)

**Competitive Landscape:**
- **Wormhole/Celer/Stargate:** Pure bridges, no incentives, no DeFi integration
- **SUI LiquidX (original):** Proven model on another chain, validates approach
- **No direct competitor on SUI:** First-mover advantage opportunity

**Why This Matters:**
Solving cross-chain liquidity is critical for SUI's success as a major blockchain. Without liquidity, even the best DeFi protocols can't attract users or demonstrate their value. LiquidX creates the incentive layer that bridges this gap.

---

## Constraints

### Constraint 1: Timeline
**Reality:** MVP must launch within 3 months to capture Q2 2026 bull market momentum
**Impact:** Limits scope to 3 DeFi protocol integrations initially
**Mitigation:** Modular architecture allows rapid addition of new protocols post-launch

### Constraint 2: Budget
**Reality:** $50K grant budget limits team size and marketing spend
**Impact:** Bootstrap with 2-3 core developers, minimal paid marketing
**Mitigation:** 
- Use open-source tooling where possible
- Community-driven growth through referral system
- Leverage SUI Foundation's marketing channels

### Constraint 3: Technical Maturity
**Reality:** SUI ecosystem is newer; some DeFi protocols in beta, limited infrastructure
**Impact:** Integration complexity, potential protocol bugs, limited historical data
**Mitigation:**
- Focus on most established protocols (Cetus, Turbos, Scallop)
- Implement conservative risk scoring
- Close partnerships with protocol teams for technical support

### Constraint 4: Bridge Dependencies
**Reality:** Reliant on Wormhole bridge uptime and security
**Impact:** Single point of failure, no control over bridge performance
**Mitigation:**
- Clear user communication about bridge provider
- Monitor Wormhole status and display real-time
- Plan Phase 2 multi-bridge support

### Constraint 5: Regulatory Uncertainty
**Reality:** Crypto regulations evolving; token rewards may face scrutiny
**Impact:** Potential need to restrict access in certain jurisdictions
**Mitigation:**
- Implement geofencing for restricted regions
- Consult with crypto-friendly legal counsel
- Structure $LQX as utility token with clear use cases

---

## Personas

### Key Persona: **"DeFi Derek" - The Yield Optimizer**

**Demographics:**
- Age: 28-45
- Occupation: Tech professional, trader, or crypto-native entrepreneur
- Crypto experience: 3+ years, holds $50K-$500K in DeFi positions
- Location: Global (US, Europe, Asia)

**Behaviors:**
- Actively manages portfolio across multiple chains
- Uses DeFi aggregators like Zapper, DeBank
- Member of DeFi Discord/Telegram communities
- Checks positions daily, rebalances weekly
- Early adopter of new protocols with high APY

**Goals:**
- Maximize yield on stablecoin holdings
- Diversify across chains to reduce risk
- Discover new high-quality opportunities early
- Minimize tax complexity and gas fees

**Pain Points:**
- Time-consuming to research new chains
- Uncertain about security of newer ecosystems
- Hates bridging friction (approve, wait, deploy)
- Misses opportunities due to information overload

**Motivations:**
- Financial gain (primary)
- Status in DeFi communities
- Intellectual curiosity about new tech
- FOMO on early mover advantages

**LiquidX Value for Derek:**
- **Earn while bridging:** 0.75%+ rewards reduce switching cost
- **One-click deployment:** Save time and gas
- **Leaderboard status:** Compete with peers
- **Curated opportunities:** No research paralysis

---

### Persona 2: **"Cautious Carla" - The Risk-Averse Investor**

**Demographics:**
- Age: 35-55
- Occupation: Professional, small business owner
- Crypto experience: 1-2 years, holds $10K-$100K conservatively
- Location: US, Europe

**Behaviors:**
- Prefers established protocols (Aave, Compound)
- Reads extensively before making moves
- Values security over maximum returns
- Uses hardware wallets
- Invests for long-term, not day trading

**Goals:**
- Earn passive income on savings
- Preserve capital (6-8% APY acceptable)
- Learn about emerging ecosystems safely
- Diversify beyond Ethereum

**Pain Points:**
- Fear of smart contract exploits
- Overwhelmed by technical jargon
- Needs reassurance and social proof
- Uncomfortable with "too good to be true" yields

**Motivations:**
- Financial security
- Continuous learning
- Peer recommendations
- Track record and transparency

**LiquidX Value for Carla:**
- **Risk scoring:** Clear 1-10 ratings for each protocol
- **Vesting schedule:** Aligns incentives for long-term security
- **Social proof:** Leaderboard shows real users with real money
- **Guided experience:** No need to become SUI expert overnight

---

### Persona 3: **"Newbie Nathan" - The Crypto Curious**

**Demographics:**
- Age: 22-35
- Occupation: Student, entry-level professional
- Crypto experience: <1 year, holds $1K-$10K
- Location: Global

**Behaviors:**
- Follows crypto influencers on Twitter/YouTube
- Uses centralized exchanges primarily (Coinbase, Binance)
- Intimidated by DeFi but curious
- Motivated by learning and moderate gains
- Prefers simple, gamified experiences

**Goals:**
- Learn DeFi without losing money
- Grow small portfolio
- Understand what the hype is about
- Earn bragging rights with friends

**Pain Points:**
- Confusing terminology and UX
- Afraid to make costly mistakes
- Can't justify high gas fees on small amounts
- Doesn't know which protocols to trust

**Motivations:**
- Learning and growth
- Fun and gamification
- Community belonging
- Achieve small wins

**LiquidX Value for Nathan:**
- **Referral rewards:** Easy way to earn by sharing
- **Leaderboard gamification:** Fun, competitive element
- **Low minimums:** Can start with $100-$500
- **Educational content:** Learn while earning

---

## Use Cases

### Scenario 1: **DeFi Derek Discovers SUI Opportunity**

**Context:** Derek has $100K USDC in Aave on Ethereum earning 5.2% APY. He hears about SUI's high yields but hasn't bothered to explore because bridging is annoying.

**Flow:**
1. Derek sees LiquidX sponsored post on Twitter: "Earn 15% APY on SUI + Get Paid 0.75% to Bridge"
2. Visits LiquidX.io, sees Opportunity Scanner showing:
   - Ethereum Aave: 5.2% APY
   - SUI Scallop: 14.5% APY
   - **Spread: 9.3% + 0.75% bridge reward = 10.05% higher**
3. Calculates: $100K × 10.05% = $10,050 additional annual earnings
4. Clicks "Bridge & Auto-Deploy to Scallop"
5. Connects MetaMask + SUI Wallet
6. Reviews transaction:
   - Bridge: $100K USDC
   - Earn: 750 $LQX tokens immediately (~$750)
   - Auto-Deploy: To Scallop lending pool (14.5% APY)
   - Multiplier: 2.0x (he's bridging $100K)
   - **Total $LQX: 1,500 tokens (~$1,500)**
7. Approves transaction, waits 5 minutes for bridge
8. Receives confirmation: Assets deployed on SUI, earning 14.5% APY
9. Checks dashboard: Sees $1,500 $LQX vesting over 90 days, leaderboard rank #23

**Outcome:** Derek successfully moved liquidity to SUI, increased yield by 9.3%, earned $1,500 in bridge rewards, and is now engaged with SUI ecosystem.

---

### Scenario 2: **Cautious Carla Tests Waters with Small Bridge**

**Context:** Carla has $50K in stablecoins but is nervous about SUI. She wants to test with a small amount first.

**Flow:**
1. Carla hears about LiquidX from a trusted crypto educator's YouTube review
2. Visits site, reads "How It Works" documentation
3. Sees risk scores: Scallop = 7/10 (Medium-Low Risk)
4. Decides to start small: $2,000 USDC bridge
5. Selects "Auto-Deploy to Scallop" (most conservative option)
6. Sees rewards preview: 15 $LQX tokens (~$15) with 1.0x multiplier
7. Completes bridge, monitors dashboard daily
8. After 1 week: No issues, earning 14.5% APY, sees $2 earned
9. Gains confidence, bridges another $10,000 (now 1.5x multiplier)
10. Joins LiquidX Discord, asks questions, gets helpful responses
11. After 1 month: Bridges remaining $38,000, reaches 2.0x multiplier tier

**Outcome:** Carla overcame initial hesitation through small test, risk scoring, and community support. Total bridge: $50K to SUI. Earned 450 $LQX tokens (~$450).

---

### Scenario 3: **Newbie Nathan Learns DeFi Through Referrals**

**Context:** Nathan heard about crypto from a friend but finds it confusing. He has $1,500 to experiment with.

**Flow:**
1. Nathan's friend (already a LiquidX user) sends him a referral link
2. Nathan clicks link, sees: "Your friend invited you! You both earn +10% bonus $LQX"
3. Sees simplified explanation: "Bridge your crypto to SUI and earn rewards"
4. Watches 2-minute explainer video on homepage
5. Decides to try with $500 USDC
6. Creates SUI Wallet (guided by LiquidX onboarding flow)
7. Selects "Auto-Deploy to Cetus" (highest APY shown)
8. Sees rewards: 3.75 $LQX + 10% referral bonus = 4.13 $LQX (~$4)
9. Completes bridge successfully, feels accomplished
10. Checks leaderboard: Ranked #892, wants to climb higher
11. Generates his own referral link, shares with 2 friends
12. Both friends bridge $500 each → Nathan earns 0.83 $LQX per friend (~$1.66)
13. Nathan bridges another $1,000 to climb leaderboard

**Outcome:** Nathan learned DeFi basics, earned $8 in rewards, referred 2 friends, and is now actively engaged. Total bridge: $1,500 to SUI.

---

### Scenario 4: **Whale Wendy Moves $1M for Maximum Rewards**

**Context:** Wendy is a crypto whale with $5M spread across chains. She hears LiquidX offers 3x multiplier for $50K+ bridges.

**Flow:**
1. Wendy sees LiquidX announcement on SUI Foundation blog
2. Checks Opportunity Scanner: Cetus USDC-SUI pool = 18% APY
3. Calculates potential: $1M × 18% = $180K annual + bridge rewards
4. Bridges $1M USDC in single transaction
5. Rewards calculation:
   - Base: $1M × 0.75% = $7,500 $LQX
   - Auto-Deploy bonus: +30% = $2,250 $LQX
   - Multiplier: 3.0x = **$29,250 total $LQX (~$29,250)**
6. Becomes #1 on leaderboard immediately
7. Receives "Whale" trophy badge and exclusive Discord role
8. Gets interviewed by LiquidX for case study (free marketing for her)
9. Her position encourages others to bridge to compete for #2 spot

**Outcome:** Wendy moves $1M to SUI (10% of LiquidX's TVL goal in one user), earns $29K in rewards, creates FOMO effect driving more users.

---

## Features In (MVP)

### Feature 1: **Real-Time Opportunity Scanner**

**Priority:** HIGH (Core Value Proposition)

**Description:**  
A dashboard that displays live APY rates across Ethereum DeFi protocols vs. SUI DeFi protocols, highlighting arbitrage opportunities and total potential earnings (DeFi yield + bridge rewards).

**Scope:**
- Monitor 5 Ethereum protocols: Aave, Compound, Curve, Uniswap V3, Balancer
- Monitor 3 SUI protocols: Cetus, Turbos, Scallop (MVP)
- Display: Protocol name, APY, risk score (1-10), TVL, 24h volume
- Refresh rate: Every 30 seconds
- Earnings calculator: Input amount → See daily/monthly/yearly projections
- Filters: Sort by APY, risk, protocol type

**Use Case:**  
Derek opens LiquidX and immediately sees "Cetus USDC-SUI: 18% APY vs Uniswap V3: 6% APY = 12% spread + 0.75% bridge bonus = 12.75% opportunity." He can make informed decision in seconds.

**Acceptance Criteria:**
- [ ] APY data updates within 30 seconds
- [ ] All 8 protocols display correctly (5 Ethereum + 3 SUI)
- [ ] Calculator shows accurate projections for amounts $100 - $1M
- [ ] Risk scores visible for each protocol
- [ ] Mobile responsive layout
- [ ] Error handling if API fails (show last known data + warning)

**Technical Considerations:**
- Use Defillama API for Ethereum protocols
- Direct RPC calls to SUI protocols for live data
- Cache data with 30s TTL to reduce API calls
- Fallback to manual data if APIs unavailable

---

### Feature 2: **One-Click Bridge with Auto-Deploy**

**Priority:** CRITICAL (Core Product Flow)

**Description:**  
Seamless bridging experience that allows users to bridge assets from Ethereum to SUI and automatically deploy into selected DeFi protocol in a single transaction flow.

**Scope:**
- Support assets: USDC, USDT (MVP)
- Bridge provider: Wormhole integration
- Wallet integrations: MetaMask (source), SUI Wallet/Suiet (destination)
- Options:
  1. **Auto-Deploy (Recommended):** Bridge + Deploy in one flow (+30% $LQX bonus)
  2. **Manual Deploy:** Bridge only, user deploys later (base $LQX reward)
- Transaction status tracking: Pending → Bridging → Confirming → Deployed → Complete
- Estimated time display: "~5-8 minutes"
- Gas fee estimation for both chains

**Use Case:**  
Carla selects $10K USDC to bridge, chooses "Auto-Deploy to Scallop," connects both wallets, approves transaction, and receives confirmation when assets are earning on SUI—all without needing to understand technical details.

**Acceptance Criteria:**
- [ ] Bridge completes successfully for amounts $100 - $1M
- [ ] Auto-deploy executes within 10 minutes of bridge completion
- [ ] Transaction status updates in real-time
- [ ] Users receive confirmation with links to both chain explorers
- [ ] Error handling with clear messages (insufficient balance, network error, etc.)
- [ ] Wallet connection flow works for MetaMask, SUI Wallet, Suiet
- [ ] Rewards preview shows accurate $LQX calculation before confirmation

**Technical Considerations:**
- Wormhole SDK integration for bridge
- Move smart contract for receiving and auto-deploying on SUI
- Event listeners for transaction status updates
- Store transaction hash mapping in backend database

---

### Feature 3: **$LQX Rewards Token System**

**Priority:** CRITICAL (Incentive Mechanism)

**Description:**  
Native rewards token with multiple earning mechanisms (base, bonuses, multipliers, referrals) and vesting schedule to retain liquidity on SUI long-term.

**Scope:**
- **Reward Calculation:**
  - Base: 0.75% of bridged amount
  - Auto-Deploy Bonus: +30%
  - Referral Bonus: +10% for both referrer and referee
  - Volume Multipliers: 1.0x → 1.5x → 2.0x → 3.0x (based on total bridged)
- **Vesting:** 90-day linear vesting (1/90th unlocks daily)
- **Utility:**
  - Fee discounts: Hold 1,000 $LQX = 20% off auto-deploy fees
  - Governance: Vote on protocol integrations (post-MVP)
  - Staking: Earn additional yield (post-MVP)
- **Supply:** 100M total $LQX tokens
  - 40% rewards pool (40M tokens)
  - 30% team + advisors (4-year vest)
  - 20% treasury
  - 10% initial liquidity

**Use Case:**  
Nathan bridges $1,000 USDC using a referral link and auto-deploying. He earns: $1,000 × 0.75% × 1.3 (auto bonus) × 1.1 (referral) = 10.73 $LQX tokens (~$10.73). These vest over 90 days. After 30 days, he can claim 3.58 $LQX. He uses this to reduce fees on his next bridge.

**Acceptance Criteria:**
- [ ] Move smart contract deployed with correct tokenomics
- [ ] Rewards calculated accurately based on all variables
- [ ] Vesting schedule enforced on-chain (cannot claim unvested tokens)
- [ ] Claim function works correctly
- [ ] Referral tracking persists across sessions
- [ ] Dashboard displays: Total earned, claimable, vesting schedule
- [ ] Fee discount applies automatically when holding 1,000+ $LQX

**Technical Considerations:**
- Move smart contract for $LQX token with vesting logic
- Off-chain indexer to track referrals
- Price oracle integration for $LQX/USD display
- Merkle tree for efficient reward distribution

---

### Feature 4: **Gamified Leaderboard**

**Priority:** MEDIUM (Engagement Driver)

**Description:**  
Public rankings of top liquidity providers by total volume bridged, creating competition and social proof.

**Scope:**
- Display: Top 100 users (wallet addresses or ENS names)
- Metrics: Total bridged, $LQX earned, multiplier tier
- Trophy badges: 🥇 Gold (#1), 🥈 Silver (#2), 🥉 Bronze (#3)
- User highlight: "You are ranked #47" (if in top 100)
- Update frequency: Real-time after each bridge transaction
- Timeframe filters: 24h, 7d, 30d, All-Time

**Use Case:**  
Derek bridges $100K and sees he's ranked #23. He notices #22 is only $5K ahead. He bridges another $10K to overtake them and earn the status. This competitive dynamic drives additional volume.

**Acceptance Criteria:**
- [ ] Leaderboard displays correctly with accurate data
- [ ] Updates within 10 seconds of new bridge transaction
- [ ] Trophy badges render for top 3
- [ ] User can find their own ranking easily
- [ ] Wallet addresses truncated for privacy (0x1234...5678)
- [ ] Optional: ENS name resolution for Ethereum addresses

**Technical Considerations:**
- Real-time database (Supabase/Firebase) for leaderboard data
- WebSocket connection for live updates
- Indexed database queries for performance
- Caching layer for top 100 to reduce DB load

---

### Feature 5: **Rewards Dashboard**

**Priority:** HIGH (User Retention)

**Description:**  
Comprehensive dashboard showing all user rewards data: earned, claimable, vesting schedule, referrals, and multiplier progress.

**Scope:**
- **Display Panels:**
  - 💰 Claimable Rewards: Amount ready to claim + "Claim" button
  - 📈 Total Earned: Lifetime $LQX earnings
  - 🏆 Leaderboard Rank: Current position + change arrow
  - ⚡ Active Multiplier: Current tier + progress bar to next tier
  - 👥 Referral Stats: Friends referred, earnings from referrals, shareable link
  - 📊 Vesting Schedule: Timeline visualization showing unlock dates
  - 📜 Transaction History: Past bridges with dates, amounts, rewards
- **Actions:**
  - Claim vested rewards (triggers transaction)
  - Copy referral link
  - View transaction details (links to explorers)

**Use Case:**  
Carla checks her dashboard daily. She sees $45 claimable (30 days into vesting). She claims it to her wallet. She also sees she's earned $150 total, and is 60% toward next multiplier tier. This transparency builds trust and encourages more bridging to reach next tier.

**Acceptance Criteria:**
- [ ] All data displays accurately from smart contract
- [ ] Claim function works and updates dashboard immediately
- [ ] Referral link generation unique per user
- [ ] Vesting timeline visualization clear and accurate
- [ ] Transaction history shows last 20 transactions minimum
- [ ] Real-time updates without page refresh
- [ ] Mobile responsive layout

**Technical Considerations:**
- Direct queries to Move smart contract for on-chain data
- Backend API for referral tracking
- WebSocket for real-time updates
- Chart.js or similar for vesting timeline visualization

---

### Feature 6: **SUI DeFi Protocol Integrations (3 protocols MVP)**

**Priority:** CRITICAL (Core Value)

**Description:**  
Direct integrations with top 3 SUI DeFi protocols to enable auto-deploy functionality.

**Protocols:**
1. **Cetus DEX:** Concentrated liquidity pools (USDC-SUI, USDC-USDT)
2. **Turbos Finance:** Leveraged yield farming
3. **Scallop:** Lending and borrowing platform

**Scope:**
- Automated deposit functions for each protocol
- APY fetching from protocol APIs/contracts
- Display protocol details: TVL, 24h volume, risk score
- Withdrawal instructions (manual for MVP)

**Use Case:**  
Derek selects "Auto-Deploy to Cetus USDC-SUI pool." His bridged USDC is automatically deposited into the pool and he starts earning 18% APY immediately.

**Acceptance Criteria:**
- [ ] Auto-deposit works for all 3 protocols
- [ ] APY data accurate and updates regularly
- [ ] Transaction completes successfully
- [ ] User receives LP tokens or receipt in SUI wallet
- [ ] Error handling if protocol deposit fails (refund to wallet)

**Technical Considerations:**
- Protocol SDK integrations
- Move smart contract calls to protocol contracts
- Handle different token types (LP tokens, receipt tokens)
- Gas estimation for deployment transactions

---

## Features Out (Post-MVP)

### Feature 1: **Mobile Native Apps**
**Reason:** Web app covers 80% of use cases initially. Native apps require significant additional development time (3-4 months) and are not essential for MVP validation. Responsive web design sufficient for mobile users in Phase 1.

**Timeline:** Phase 2 (Months 4-6)

---

### Feature 2: **10+ DeFi Protocol Integrations**
**Reason:** Integrating many protocols requires extensive testing and maintenance. MVP focuses on top 3 established protocols. Additional protocols can be added based on user demand post-launch.

**Timeline:** Phase 2 (add 2-3 protocols per month)

---

### Feature 3: **Cross-Chain from Non-EVM Chains (Solana, Bitcoin)**
**Reason:** Technical complexity significantly higher. Wormhole bridge primarily focuses on EVM chains initially. Solana/Bitcoin integration requires different bridge providers and smart contract architecture.

**Timeline:** Phase 3 (Months 9-12)

---

### Feature 4: **Governance DAO**
**Reason:** DAO requires token distribution, legal structure, voting mechanisms, and community maturity. MVP should focus on product-market fit first, then decentralize governance.

**Timeline:** Phase 3 (Month 10)

---

### Feature 5: **Insurance Pool for Bridge Risks**
**Reason:** Insurance requires significant capital allocation ($500K+), actuarial modeling, and legal considerations. Not feasible with MVP budget.

**Timeline:** Phase 4 (Post-funding raise)

---

### Feature 6: **Advanced Analytics Dashboard**
**Reason:** While valuable for power users, advanced analytics (portfolio tracking, tax reports, PnL charts) are not core to bridge value proposition. Basic dashboard sufficient for MVP.

**Timeline:** Phase 2 (premium feature, $19/mo)

---

### Feature 7: **AI-Powered Yield Optimization**
**Reason:** AI features require machine learning infrastructure, historical data, and extensive testing. Manual curation of top 3 protocols sufficient for MVP.

**Timeline:** Phase 3 (Month 11)

---

## Design

### Design Philosophy
**Brand Positioning:** Premium financial platform—professional, trustworthy, sophisticated

**Visual Style:**
- **Color Scheme:** Black & white minimalist base with SUI blue (#4DA2FF) accents
- **Typography:** Inter (headings), Roboto Mono (numbers/data)
- **Aesthetic:** Clean, modern, data-driven

### Key Design Elements

#### 1. Homepage
- **Hero Section:**
  - Headline: "Earn While Bridging to SUI"
  - Subheadline: "Get paid 0.75%+ in $LQX tokens to bring liquidity from Ethereum to SUI's top DeFi protocols"
  - CTA Button: "Start Bridging" (large, prominent)
  - Social Proof: "Join 1,203 users who've bridged $2.5M to SUI"

- **Opportunity Scanner Cards:**
  - Grid layout (3-4 cards visible)
  - Each card shows: Protocol logo, APY (large), TVL, Risk Score, "Hot Deal" badge
  - Hover effect: Expand to show more details
  - Click: Auto-fills bridge form

- **How It Works (3 Steps):**
  - Step 1: Select opportunity → Icon + brief text
  - Step 2: Bridge & auto-deploy → Icon + brief text
  - Step 3: Earn rewards → Icon + brief text

#### 2. Bridge Interface
- **Left Panel:** Amount input, asset selector, destination protocol
- **Right Panel:** Rewards preview
  - Base: X $LQX
  - Auto-Deploy Bonus: +Y $LQX
  - Multiplier: Z.Zx
  - Total: XX $LQX
- **Bottom:** "Connect Wallets" or "Confirm Bridge" button (state-based)

#### 3. Dashboard
- **Top Row:** 4 Stat Cards (Claimable, Total Earned, Rank, Multiplier)
- **Middle Row:** Vesting Timeline (horizontal bar chart)
- **Bottom Row:** Referral section (link + stats) + Transaction history (table)

#### 4. Leaderboard
- **Header:** Title + timeframe filters (tabs)
- **Table:** Rank, User (wallet/ENS), Total Bridged, $LQX Earned, Multiplier
- **User Row:** Highlighted in blue if user is in top 100

### Wireframes
*[Link to Figma designs]*

**Key Screens:**
- Homepage with opportunity scanner
- Bridge + Auto-Deploy flow (3-step wizard)
- Rewards dashboard
- Leaderboard
- Transaction confirmation modal

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratios >4.5:1

### Responsiveness
- Desktop: 1920px, 1440px, 1280px
- Tablet: 768px
- Mobile: 375px (iPhone SE minimum)

---

## Technical Considerations

### Smart Contracts (Move on SUI)

**Core Contracts:**

1. **`lqx_token.move`** - $LQX Token Module
   - Fungible token implementation
   - Vesting logic with daily unlock
   - Transfer restrictions for vested tokens
   - Admin functions for minting rewards

2. **`bridge_registry.move`** - Bridge Position Tracking
   - Records all bridge transactions
   - Calculates rewards (base + bonuses + multipliers)
   - Tracks user statistics (total bridged, multiplier tier)
   - Emits events for indexing

3. **`rewards_distributor.move`** - Reward Claims & Distribution
   - Claim vested rewards
   - Referral tracking and bonus calculation
   - Fee discount enforcement
   - Leaderboard data source

4. **`auto_deploy.move`** - Protocol Integration Module
   - Functions to deposit into Cetus, Turbos, Scallop
   - Gas optimization for multi-step transactions
   - Error handling and refunds

**Data Structures:**
```move
struct BridgePosition has key {
    id: UID,
    user: address,
    total_bridged: u64,
    multiplier_tier: u8,
    unclaimed_rewards: u64,
    vested_rewards: u64,
    vesting_start_ms: u64,
    referrer: Option<address>,
}

struct GlobalStats has key {
    total_tvl: u64,
    total_users: u64,
    total_rewards_distributed: u64,
}
```

### Backend Services

**Tech Stack:**
- **Framework:** Node.js + Express
- **Database:** PostgreSQL (user data, referrals, transaction history)
- **Caching:** Redis (APY data, leaderboard)
- **Real-time:** Socket.io (live updates)
- **Hosting:** Railway or Render

**Services:**

1. **APY Scanner Service**
   - Cron job every 30s
   - Fetches Ethereum DeFi rates (Defillama API)
   - Queries SUI protocols directly via RPC
   - Calculates spreads and opportunities
   - Stores in Redis cache

2. **Transaction Indexer**
   - Listens to SUI blockchain events
   - Indexes bridge transactions
   - Updates leaderboard in real-time
   - Stores history in PostgreSQL

3. **Referral Tracker**
   - Generates unique referral codes
   - Tracks referrer-referee relationships
   - Calculates bonus rewards
   - Provides dashboard API

4. **Price Oracle**
   - Fetches $LQX/USD price from DEX
   - Updates every 60s
   - Used for USD display conversions

### Frontend Application

**Tech Stack:**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Styling:** TailwindCSS
- **Wallet:** SUI Wallet Adapter, Ethers.js
- **Charts:** Chart.js
- **Routing:** React Router
- **Hosting:** Vercel

**Key Libraries:**
- `@mysten/sui.js` - SUI blockchain interaction
- `@wormhole-foundation/sdk` - Bridge integration
- `ethers` - Ethereum wallet interaction
- `socket.io-client` - Real-time updates
- `react-query` - Data fetching and caching

### Bridge Integration

**Provider:** Wormhole

**Flow:**
1. User approves USDC on Ethereum
2. Call Wormhole bridge contract to lock assets
3. Wait for guardian signatures (VAA)
4. Relay VAA to SUI
5. Wormhole contract on SUI mints wrapped USDC
6. Auto-deploy function called with minted USDC
7. Update user position and distribute $LQX rewards

**Challenges:**
- VAA relay requires off-chain service (use Wormhole's automatic relay)
- Must handle bridge failures gracefully
- Gas fees on both chains

### Security Considerations

- **Smart Contract Audits:** Budget $15K for audit by OtterSec or MoveBit
- **Multisig:** Admin functions require 3-of-5 multisig
- **Rate Limiting:** Max 10 bridges per user per day (prevent spam)
- **Reentrancy Protection:** Move's design prevents reentrancy, but careful review needed
- **Oracle Manipulation:** Use TWAP for $LQX price, not spot
- **Bridge Security:** Inherit Wormhole's security model, monitor bridge contract events

---

## Success Metrics

### Primary Metrics (OKRs - 6 Months Post-Launch)

**Objective 1: Drive Significant Liquidity to SUI**
- **Key Result 1.1:** $10M+ total value bridged to SUI
- **Key Result 1.2:** $5M+ currently deployed in SUI DeFi protocols (50% retention)
- **Key Result 1.3:** Top 3 position in SUI bridge volume rankings

**Objective 2: Build Active User Base**
- **Key Result 2.1:** 5,000+ unique wallet addresses bridged
- **Key Result 2.2:** 30% month-over-month user growth
- **Key Result 2.3:** 25% of users complete 2+ bridge transactions (repeat rate)

**Objective 3: Create Engagement & Retention**
- **Key Result 3.1:** Average 3.5 bridges per active user (engagement depth)
- **Key Result 3.2:** 60% of rewards claimed within 90-day vesting period (retention signal)
- **Key Result 3.3:** 20% referral rate (users who referred at least 1 friend)

**Objective 4: Demonstrate Protocol Value**
- **Key Result 4.1:** Increase TVL in integrated SUI protocols by 15%+
- **Key Result 4.2:** 2M+ $LQX tokens distributed (rewards flowing)
- **Key Result 4.3:** $LQX trading on 2+ SUI DEXs with $100K+ liquidity

### Secondary Metrics (KPIs)

**User Acquisition:**
- Website visitors: 50K+ monthly
- Bridge conversion rate: 5%+ (visitors → bridge completions)
- Average bridge amount: $8,000
- Customer acquisition cost (CAC): <$50

**Product Engagement:**
- Daily active users (DAU): 300+
- Weekly active users (WAU): 1,200+
- Average session duration: 6+ minutes
- Bounce rate: <40%

**Financial:**
- Revenue (0.5% auto-deploy fees): $25K+ monthly by month 6
- $LQX market cap: $5M+ (50M tokens × $0.10)
- Auto-deploy adoption: 70%+ of bridges use auto-deploy

**Technical:**
- Bridge success rate: 98%+
- Average bridge completion time: <8 minutes
- Website uptime: 99.9%
- Smart contract zero critical vulnerabilities

### Testing & Validation

**Alpha Testing (Week 1-2):**
- 20 internal testers
- Focus: Critical bug identification, flow completion
- Success: 100% successful bridge completions, <5 critical bugs

**Beta Testing (Week 3-6):**
- 200 community testers
- Focus: Real-world usage, feedback collection
- Success: 95%+ positive feedback, NPS >50

**Mainnet Launch (Month 3):**
- Soft launch to 1,000 users (waitlist)
- Monitor smart contract interactions
- Success: Zero exploits, 90%+ completion rate

**Post-Launch (Months 4-6):**
- Weekly surveys (NPS, feature requests)
- User interviews (5 per week)
- Analytics monitoring (Google Analytics, Mixpanel)

---

## GTM Approach

### Product Messaging

**Tagline:** "Earn While Bridging to SUI"

**Value Propositions:**
1. **For Yield Farmers:** "Unlock 10-20% APY on SUI + Earn 0.75% Bridge Rewards"
2. **For Risk-Averse:** "Guided DeFi Experience with Risk Scores & Social Proof"
3. **For Newcomers:** "Easiest Way to Start Earning on SUI - No Crypto Degree Required"

**Key Messages:**
- "Stop losing money to idle bridges. Get paid to move liquidity."
- "One click. Two chains. Infinite opportunities."
- "Join 5,000+ smart users earning on SUI"

### Launch Strategy

**Phase 1: Pre-Launch (Month 1-2)**

1. **Build Anticipation:**
   - Create waitlist landing page with countdown
   - Goal: 2,000 email signups
   - Offer: Early bird 2x rewards multiplier

2. **Community Building:**
   - Launch Discord server (target: 500 members)
   - Host weekly AMAs with SUI DeFi protocol teams
   - Create Twitter account, post daily SUI DeFi insights

3. **Partnership Outreach:**
   - Secure partnerships with Cetus, Turbos, Scallop
   - Co-marketing agreements (cross-promotion, joint announcements)
   - Technical integration support

4. **Influencer Seeding:**
   - Identify 10 crypto influencers (10K-100K followers)
   - Offer early access + bonus $LQX allocation
   - Goal: 3 review videos pre-launch

**Phase 2: Launch (Month 3)**

1. **Soft Launch (Week 1):**
   - Invite top 1,000 waitlist users
   - Monitor closely for bugs
   - Collect feedback daily

2. **Public Launch (Week 2):**
   - Press release to crypto media (CoinDesk, The Block, Decrypt)
   - SUI Foundation blog post announcement
   - Twitter Spaces with SUI core team
   - Launch celebration: 2x rewards for first 48 hours

3. **Launch Day Tactics:**
   - Paid Twitter ads ($2K budget)
   - Reddit r/SUI, r/DeFi posts
   - Discord community celebration event
   - Real-time leaderboard competition with prizes

**Phase 3: Growth (Months 4-6)**

1. **Content Marketing:**
   - Weekly blog posts (DeFi education, SUI ecosystem updates)
   - YouTube tutorials (bridge guides, yield optimization)
   - Twitter threads (success stories, APY opportunities)

2. **Referral Program Push:**
   - Referral contests (top referrer wins $1K in $LQX)
   - Auto-generated referral tweets
   - Leaderboard tracking for referrals

3. **Community Engagement:**
   - Weekly AMA sessions
   - Monthly community calls with roadmap updates
   - User-generated content campaigns (#LiquidXStory)

4. **Protocol Partnerships:**
   - Co-host liquidity mining campaigns
   - Joint Twitter Spaces
   - Protocol-specific landing pages

### Marketing Channels

**Owned:**
- Website (SEO optimized for "SUI bridge", "SUI DeFi yields")
- Email list (2K+ subscribers)
- Twitter (@LiquidX_SUI)
- Discord (500+ members)
- YouTube channel

**Earned:**
- Press coverage (3+ major crypto publications)
- Influencer reviews (10+ videos)
- SUI Foundation featured project
- Protocol partnerships (co-marketing)

**Paid:**
- Twitter ads ($5K budget over 3 months)
- Google search ads ("SUI bridge", "bridge to SUI")
- Crypto Discord communities (sponsored posts)
- Banner ads on DeFi aggregators (Zapper, DeBank)

### Sales Strategy

**B2C (Primary):**
- Self-service product (no sales team needed)
- Automated onboarding
- In-app education

**B2B (Secondary - Future):**
- Institutional users (hedge funds, DAOs)
- Custom contracts with tailored rewards
- White-glove onboarding
- Dedicated support

**Pricing:**
- Free to use
- Revenue from 0.5% auto-deploy fees (built into product)
- Premium features (analytics dashboard) = $19/mo (Phase 2)

---

## Open Issues

### Issue 1: **Wormhole Bridge Reliability**
**Question:** What happens if Wormhole bridge experiences downtime during our launch?

**Current Thinking:**
- Wormhole has 99.9% uptime historically, but not 100%
- Need real-time status monitoring on our site
- Communicate clearly to users when bridge is unavailable

**Action Items:**
- Integrate Wormhole status API
- Display prominent warning if bridge down
- Build waitlist system to notify users when operational
- Phase 2: Add Celer bridge as backup option

**Owner:** Engineering Lead  
**Deadline:** Week 4 of development

---

### Issue 2: **$LQX Token Liquidity**
**Question:** How do we ensure $LQX token has sufficient liquidity on SUI DEXs for users to trade?

**Current Thinking:**
- Need $100K+ liquidity in $LQX/SUI pool
- Bootstrap with treasury allocation (10M $LQX + $50K SUI)
- Incentivize liquidity provision with bonus APY

**Action Items:**
- Allocate 10M $LQX + $50K SUI for initial liquidity
- Launch liquidity mining program (5% APY in $LQX for LP providers)
- Partner with Cetus for featured pool
- Monitor liquidity depth weekly

**Owner:** Product Manager  
**Deadline:** Month 2 (pre-launch)

---

### Issue 3: **Regulatory Compliance**
**Question:** Are there jurisdictions where we need to block access due to securities laws?

**Current Thinking:**
- $LQX could be considered a security in some jurisdictions (US SEC)
- Need legal opinion on token structure
- Likely need to block US IP addresses initially

**Action Items:**
- Consult with crypto-focused law firm ($5K budget)
- Implement geofencing for restricted countries
- Display clear disclaimers ("Not available to US persons")
- Structure $LQX as utility token with clear use cases

**Owner:** Product Manager + Legal Counsel  
**Deadline:** Month 2 (before token distribution)

---

### Issue 4: **Smart Contract Security**
**Question:** How do we ensure smart contracts are secure before mainnet launch?

**Current Thinking:**
- Move is safer than Solidity, but not foolproof
- Budget $15K for professional audit
- Need internal code review first

**Action Items:**
- Complete internal security review (2 developers, 1 week)
- Hire OtterSec or MoveBit for audit ($15K)
- Address all critical and high-severity findings
- Implement bug bounty program ($50K pool)

**Owner:** Engineering Lead  
**Deadline:** Month 2.5 (before mainnet deploy)

---

### Issue 5: **Competitor Response**
**Question:** What if existing bridges (Wormhole, Celer) add reward programs after seeing our success?

**Current Thinking:**
- We have first-mover advantage and brand
- Our DeFi integration is defensible (they'd need months to copy)
- Switching costs: Users have vesting rewards with us

**Action Items:**
- Monitor competitor launches closely
- Double down on community building (harder to copy)
- Accelerate roadmap (add features faster)
- Lock in protocol partnerships (exclusivity where possible)

**Owner:** Product Manager  
**Deadline:** Ongoing monitoring

---

### Issue 6: **User Education**
**Question:** How do we onboard users who've never used SUI or DeFi before?

**Current Thinking:**
- Newcomer persona (Nathan) needs significant hand-holding
- In-app tutorials insufficient; need video content

**Action Items:**
- Create 5-minute onboarding video (YouTube)
- In-app tooltips for every step
- Live chat support (Discord integration)
- FAQ page covering common issues
- Weekly beginner-friendly Twitter Spaces

**Owner:** Product Manager + Designer  
**Deadline:** Week 8 of development

---

## Q&A

| Asked By | Question | Answer |
|----------|----------|--------|
| **Engineering** | Why SUI Move instead of Solidity? | Move's asset-centric design and built-in security features (no reentrancy, explicit resource handling) make it superior for financial smart contracts. SUI's parallel execution also enables better performance for simultaneous bridge transactions. |
| **Design** | Why black & white color scheme? | We want LiquidX to feel like a premium financial platform (think Robinhood, Stripe) rather than a flashy crypto project. Black & white conveys professionalism and trust, which is critical for users moving large amounts of capital. |
| **Community** | Why only 0.75% base rewards? | Benchmarked against liquidity mining programs (typically 0.5-1%). Higher rewards would drain treasury too quickly and create unsustainable tokenomics. With bonuses and multipliers, effective rate is 1-3%, which is competitive. |
| **Investor** | What's the long-term business model? | Short-term: Auto-deploy fees (0.5%) + performance fees (10% of rewards) = $300K ARR projected. Long-term: Premium features ($19/mo), institutional contracts, API access ($99/mo), and protocol partnership revenue shares. Target: $3M ARR by Year 2. |
| **Grant Committee** | How does this benefit SUI ecosystem? | Three ways: (1) Drives $10M+ liquidity to SUI, increasing network activity. (2) Boosts TVL in top DeFi protocols, making them more competitive. (3) Establishes USDCx as preferred stablecoin, critical for DeFi growth. |
| **User** | Is my money safe using LiquidX? | LiquidX itself doesn't custody funds. Bridging security depends on Wormhole (battle-tested, $1B+ bridged). Smart contracts will be audited by OtterSec. Once on SUI, funds are in established DeFi protocols (Cetus, Scallop). Risk scores help users assess each protocol. |
| **Engineering** | What if SUI RPC goes down? | We use multiple RPC providers (Mysten Labs official + third-party like Allnodes) with automatic failover. Frontend caches last-known data for 5 minutes. Users see warning banner if RPC unavailable. Critical functions queue and retry. |
| **Marketing** | How do we compete with free bridges? | "Free" bridges aren't free—they cost time (multiple transactions), uncertainty (where to deploy?), and opportunity cost (delayed yield). LiquidX provides value through guidance, automation, and actual rewards that offset any fees. We're selling convenience + intelligence. |
| **Designer** | Why 90-day vesting instead of shorter? | Balances user desire for liquidity with platform need for retention. Too short (30 days) allows dump-and-exit. Too long (1 year) feels punitive. 90 days is industry standard and aligns with typical DeFi farming campaign durations. |
| **Community** | Will there be a token airdrop? | Not for MVP. Airdrop culture creates mercenary users who leave immediately. We prefer to reward actual usage (bridging) rather than historical wallet activity. Future airdrops possible for governance launch. |

---

## Feature Timeline and Phasing

| Feature | Status | MVP (Month 1-3) | Phase 2 (Month 4-6) | Phase 3 (Month 7-12) |
|---------|--------|------------------|---------------------|----------------------|
| **Opportunity Scanner** | Planned | ✅ 5 ETH + 3 SUI protocols | 5 ETH + 8 SUI protocols | Multi-chain (10+ chains) |
| **Wormhole Bridge** | Planned | ✅ USDC, USDT | Add ETH, wBTC | Add Solana bridge |
| **Auto-Deploy** | Planned | ✅ 3 protocols | 8 protocols | 15+ protocols |
| **$LQX Rewards** | Planned | ✅ Base + bonuses + vesting | Add staking | Governance voting |
| **Leaderboard** | Planned | ✅ Top 100, 4 timeframes | Add achievements | Seasonal competitions |
| **Rewards Dashboard** | Planned | ✅ Core stats + claims | Add portfolio tracker | Add tax reporting |
| **Referral System** | Planned | ✅ 10% bonus | Multi-tier (10% → 15% → 20%) | Affiliate program (B2B) |
| **Smart Contracts** | Planned | ✅ Core logic | Add insurance pool | Add governance module |
| **Mobile App** | Backlog | ❌ Web-only | ✅ iOS + Android | In-app swap features |
| **Advanced Analytics** | Backlog | ❌ | ✅ Premium ($19/mo) | AI yield optimizer |
| **Multi-Bridge Support** | Backlog | ❌ Wormhole only | ✅ Add Celer | Add custom bridges |
| **Institutional Features** | Backlog | ❌ | ❌ | ✅ KYC, whitelisting |

---

## PRD Checklist

| Order | Topic | Status |
|-------|-------|--------|
| 1. | Title | ✅ Complete |
| 2. | Author | ✅ Complete |
| 3. | Decision Log | 🔄 In Progress |
| 4. | Change History | 🔄 In Progress |
| 5. | Overview | ✅ Complete |
| 6. | Success Overview | ✅ Complete |
| 7. | Messaging | ✅ Complete |
| 8. | Timeline/Release Planning | ✅ Complete |
| 9. | Personas | ✅ Complete |
| 10. | User Scenarios | ✅ Complete |
| 11. | User Stories/Features/Requirements | ✅ Complete |
| 12. | Features In | ✅ Complete |
| 13. | Features Out | ✅ Complete |
| 14. | Design | ✅ Complete |
| 15. | Open Issues | ✅ Complete |
| 16. | Q&A | ✅ Complete |
| 17. | Other Considerations | ✅ Complete |

---

## Decision Log

| Date | Decision | Rationale | Owner |
|------|----------|-----------|-------|
| 2026-01-22 | Use Wormhole as primary bridge | Most mature cross-chain bridge with strong security track record | Engineering Lead |
| 2026-01-22 | Limit MVP to 3 SUI protocols | Focus on quality over quantity; establish partnerships deeply | Product Manager |
| 2026-01-22 | 0.75% base reward rate | Balances attractive incentive with sustainable tokenomics | Product Manager |
| 2026-01-22 | 90-day vesting schedule | Industry standard, balances user liquidity with retention | Product Manager |
| 2026-01-22 | Black & white design aesthetic | Premium financial platform positioning | Designer |
| 2026-01-22 | Target $50K SUI Foundation grant | Realistic for MVP scope, sufficient for 3-month development | Product Manager |

---

## Change History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-22 | Initial PRD creation for SUI migration | Product Team |

---

## Appendix: MVP Success Criteria Summary

**At 6 months post-launch, LiquidX MVP is successful if:**

1. ✅ **$10M+ total liquidity bridged to SUI**
2. ✅ **5,000+ unique users**
3. ✅ **70%+ auto-deploy adoption rate**
4. ✅ **$25K+ monthly revenue from fees**
5. ✅ **NPS score >50**
6. ✅ **Zero critical smart contract vulnerabilities**
7. ✅ **Featured as top 3 bridge on SUI ecosystem**
8. ✅ **2+ major partnerships with SUI DeFi protocols**

**Grant Deliverables for SUI Foundation:**
- ✅ Production-ready smart contracts (audited)
- ✅ Live web application (mainnet)
- ✅ Integration with 3 top SUI DeFi protocols
- ✅ 5,000+ users onboarded
- ✅ $10M+ liquidity brought to SUI
- ✅ Open-source code repository
- ✅ Comprehensive documentation

---

**Document Status:** Ready for Review  
**Next Steps:** 
1. Internal team review and feedback (Week 1)
2. Incorporate feedback and finalize (Week 2)
3. Submit to SUI Foundation Grant Program (Week 3)
4. Begin MVP development upon grant approval (Month 1)

---

*This PRD is a living document and will be updated as the product evolves.*
