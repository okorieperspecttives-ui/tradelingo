# TradeLingo - Visual Wireframes

## 1. Main Dashboard (The "Trading Floor")
This is the main hub where users see their progression path.

**Desktop View:**
```text
+----------------------------------------------------------------+
|  [LOGO] TradeLingo       (Search)             [🔔] [User 👤]   |
+---------------------+------------------------------------------+
|  SIDEBAR NAV        |  MAIN CONTENT AREA                       |
|                     |                                          |
|  [🏠] Dashboard     |  +------------------------------------+  |
|  [📚] Learn         |  |  CURRENT STATUS: "Retail Trader"   |  |
|  [📈] Simulator     |  |  💰 Capital: $100,000 (Virtual)    |  |
|  [💬] Community     |  |  🔥 Streak: 5 Days                 |  |
|  [🏆] Leaderboard   |  +------------------------------------+  |
|  [⚙️] Settings      |                                          |
|                     |  THE PATH (Scrollable)                   |
|                     |                                          |
|                     |       [ UNIT 1: FOUNDATIONS ]            |
|                     |       "What is a Pip?"                   |
|                     |             |                            |
|                     |           ( ⭐ )  <-- Completed (Gold)   |
|                     |             |                            |
|                     |           ( 🔒 )  <-- Locked (Grey)      |
|                     |             |                            |
|                     |           ( 🔒 )                         |
|                     |                                          |
|                     |       [ UNIT 2: CANDLESTICKS ]           |
|                     |           ( 🔒 )                         |
|                     |                                          |
+---------------------+------------------------------------------+
```

**Mobile View:**
```text
+----------------------------------------+
| [🍔] TradeLingo        [🔥 5] [💰 100k]|
+----------------------------------------+
|                                        |
|   CURRENT UNIT: FOUNDATIONS            |
|   "What is a Pip?"                     |
|                                        |
|          ( ⭐ )                        |
|            |                           |
|            |                           |
|          ( 🔓 )  <-- Current           |
|            |                           |
|            |                           |
|          ( 🔒 )                        |
|                                        |
|                                        |
+----------------------------------------+
| [🏠]   [📚]   [💬]    [📈]   [👤]   |
| Home   Learn  Chat     Sim    Profile  |
+----------------------------------------+
```

## 2. Lesson Interface (The "Terminal")
... (Same as before) ...

## 3. Community Forum ("The Pit")
A place for traders to share ideas, charts, and trades.

**Feed View:**
```text
+----------------------------------------------------------------+
|  Filter: [🔥 Hot] [🆕 New] [📈 Charts] [💡 Ideas]              |
+----------------------------------------------------------------+
|                                                                |
|  [User Avatar]  **Bearish on GBP/USD?**  • 2h ago              |
|  "Price is hitting major resistance at 1.2500..."              |
|                                                                |
|  +--------------------------------------------------------+    |
|  |  [ CHART IMAGE / SNAPSHOT ]                            |    |
|  |  [                        ]                            |    |
|  +--------------------------------------------------------+    |
|                                                                |
|  [👍 Bullish (12)]  [👎 Bearish (45)]  [💬 Comment (5)]       |
|                                                                |
+----------------------------------------------------------------+
|                                                                |
|  [User Avatar]  **Just passed Level 5!**  • 10m ago            |
|  "Finally understood Fibonacci retracements..."                |
|                                                                |
|  [👍 Like (8)]  [💬 Comment (2)]                               |
|                                                                |
+----------------------------------------------------------------+
|  [ (+) NEW POST ] (Floating Action Button)                     |
+----------------------------------------------------------------+
```

**Post Creation:**
```text
+----------------------------------------+
|  Create Post                           |
+----------------------------------------+
|  Title: _____________________________  |
|                                        |
|  Content:                              |
|  [ Write your analysis...           ]  |
|  [                                  ]  |
|                                        |
|  [📷 Add Image]  [📈 Link Chart]       |
|                                        |
|  [ POST ] (Gold Button)                |
+----------------------------------------+
```

## 4. Trading Simulator (The "Arena")
... (Same as before) ...

## Color Palette Application
*   **Backgrounds:** `bg-slate-950` or Custom Black `#0f0f0f`
*   **Borders/Dividers:** `border-yellow-600/30` (Subtle Gold)
*   **Active Elements:** `bg-yellow-500` to `bg-yellow-600` (Gold Gradient)
*   **Text:** `text-slate-200` (Body), `text-yellow-400` (Headers)
