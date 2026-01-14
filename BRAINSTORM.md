# TradeLingo: Gold Themed Professional Forex Learning Platform - Brainstorming

## 1. Core Vision
To create a "Duolingo for Forex" but with a premium, professional aesthetic. It bridges the gap between dry financial textbooks and addictive mobile games.

## 2. Visual Identity & Theme
*   **Primary Palette:** 
    *   Backgrounds: Deep Charcoal (`#1a1a1a`), Rich Black (`#0f0f0f`).
    *   Accents: Metallic Gold (`#d4af37`), Champagne (`#f7e7ce`), Bronze (`#cd7f32`).
    *   Text: Off-white for readability, Gold for headers/highlights.
*   **Vibe:** Exclusive, High-End, Institutional, yet accessible.
*   **Typography:** 
    *   Headings: `Playfair Display` or `Merriweather` (Serif - Professional/Trust).
    *   Body/UI: `Inter` or `Lato` (Sans-serif - Clean/Modern).

## 3. Gamification Elements
*   **Progression System:** Users start as "Retail Trader" and level up to "Hedge Fund Manager" or "Central Banker".
*   **Currency:** Earn "Gold Bars" or "Pips" for completing lessons.
*   **Lives/Risk:** "Capital". You have a starting capital (e.g., $100k virtual). Wrong answers in quizzes lose capital.
*   **Streaks:** "Market Open" streak.
*   **Achievements:** "First Profit", "Risk Manager", "Chartist".

## 4. Key Features (MVP)
### A. Learning Path (The "Map")
*   Linear progression of modules (e.g., "Intro to Pips", "Candlestick Patterns", "Support/Resistance").
*   Locked levels until previous ones are completed.

### B. Interactive Quizzes
*   Not just multiple choice.
*   "Identify the Trend" (Click on the chart).
*   "Buy or Sell?" scenarios.

### C. Trading Simulator (The "Arena")
*   Simplified trading interface.
*   Place dummy trades based on historical scenarios.
*   Visual feedback on Profit/Loss.

### D. Dashboard
*   Visualizing progress.
*   Net Worth (XP).
*   Win Rate (Quiz accuracy).

## 5. Technical Stack Proposal
*   **Framework:** Next.js 15 (App Router) - Fast, SEO friendly, modern.
*   **Language:** TypeScript - Type safety for financial calculations.
*   **Styling:** Tailwind CSS - Rapid styling with custom "Gold" configuration.
*   **Icons:** Lucide React - Clean, professional icons.
*   **Charts:** Recharts or Lightweight-charts (TradingView library) - for financial visualization.
*   **State Management:** Zustand - Simple, fast global state.
*   **Animation:** Framer Motion - For smooth, premium transitions (gold sheen effects).
*   **Persistence:** LocalStorage (MVP) -> Supabase/PostgreSQL (Later).

## 6. Project Structure Ideas
*   `/app`: Routes (Dashboard, Learn, Simulate).
*   `/components`: UI Kit (GoldButton, DarkCard, ProgressBar).
*   `/lib`: Helper functions (Currency formatting, XP logic).
*   `/data`: Static lesson content (for MVP).

## 7. Next Steps
1.  Initialize Next.js project.
2.  Configure Tailwind with the Gold color palette.
3.  Build the "Landing/Welcome" screen to establish the vibe.
4.  Create the "Learning Path" layout.
