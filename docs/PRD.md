# Our Two Cents — Product Requirements & Implementation Plan

A WhatsApp-first shared household budget app for couples saving for a house, using Google Sheets as the database, Node.js backend, Twilio for WhatsApp, and React dashboard.

---

## Executive Summary

Our Two Cents is a shared household budget application built for couples who are saving toward a shared financial goal — in this case, buying a house together. The app is designed around a single core philosophy: **budgeting should happen where you already live, not in a separate app you have to remember to open.**

The primary input method is WhatsApp — a tool both users already use dozens of times a day. You spend money, you message the bot, it logs it, it tells you where you stand, and you move on with your life. No app to open. No login screen. No friction.

---

## The Problem We Are Solving

### The Friction Problem
Budgeting apps exist, but most couples don't use them consistently because of **friction**. Every extra step between "I spent money" and "that spend is recorded" is a place where the habit breaks.

**Traditional budgeting flow (8 steps):**
1. Pay for groceries
2. Open your phone
3. Find the budgeting app
4. Log in or unlock it
5. Tap "add expense"
6. Type the amount
7. Select a category
8. Save it

**Our Two Cents flow (3 steps):**
1. Pay for groceries
2. Open WhatsApp (you're already here)
3. Type "groceries 350"
4. Done. The bot confirms and tells you where you stand.

### The Transparency Problem
When two people share finances, there's invisible tension: **who spent what, and does the other person know?** Our Two Cents makes all spending visible to both partners in real time. No surprises. No arguments.

### The "Where Did The Money Go?" Problem
Our Two Cents answers this question in real time, not at the end of the month. Every spend triggers an instant budget status update. If you're trending toward overspending, it warns you *before* it happens.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        THE USER'S WORLD                         │
│   📱 User A (WhatsApp)          📱 User B (WhatsApp)            │
│        │                              │                         │
│        ▼                              ▼                         │
│   "groceries 350"              "petrol 450"                     │
└────────┼──────────────────────────────┼─────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      WHATSAPP BOT LAYER                         │
│   Receives messages → Parses → Sends to backend                 │
│   Receives confirmation → Sends reply with budget status        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js)                        │
│   Receives data → Writes to Google Sheets                       │
│   Calculates budgets → Checks warnings → Returns status         │
│   Serves dashboard API                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GOOGLE SHEETS                               │
│   Single source of truth for all data                           │
│   Tabs: Transactions, Monthly Budgets, Savings Goal, Categories │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT DASHBOARD                              │
│   Beautiful visual review of spending and savings              │
│   Category breakdowns, progress bars, savings goal             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| **Database** | Google Sheets | Free, real-time sync, transparent, familiar, has API |
| **Backend** | Node.js + Express | Lightweight, JavaScript everywhere, async-friendly |
| **WhatsApp** | Twilio API | Most reliable WhatsApp provider, free tier sufficient |
| **Frontend** | React + TailwindCSS | Modern, component-based, mobile-responsive |
| **Charts** | Recharts | Lightweight React charting library |
| **Hosting** | Railway (backend) + Vercel (frontend) | Free tiers, easy deployment |

---

## Google Sheets Structure

### Tab 1: Transactions
Every single spend gets logged here.

| Column | Name | Type | Example |
|--------|------|------|---------|
| A | ID | Number | 1 |
| B | Date | Date | 2026-02-01 |
| C | User | Text | User A |
| D | Category | Text | Groceries |
| E | Amount | Number | 350 |
| F | Merchant | Text | Woolworths |
| G | Note | Text | Weekly groceries |
| H | Source | Text | bot |
| I | Confirmed | Boolean | TRUE |

### Tab 2: Monthly Budgets
Budget allocation per category per month.

| Column | Name | Type | Example |
|--------|------|------|---------|
| A | Month | Text | 2026-02 |
| B | Category | Text | Groceries |
| C | Budget Amount | Number | 2500 |

### Tab 3: Savings Goal
Tracks the house deposit goal.

| Column | Name | Type | Example |
|--------|------|------|---------|
| A | Goal Name | Text | House Deposit |
| B | Target Amount | Number | 500000 |
| C | Current Savings | Number | 87000 |
| D | Monthly Contribution | Number | 8000 |
| E | Target Date | Date | 2031-06-01 |

### Tab 4: Categories
Valid spending categories with metadata.

| Column | Name | Type | Example |
|--------|------|------|---------|
| A | Category ID | Text | groceries |
| B | Display Name | Text | Groceries |
| C | Icon | Text | 🛒 |
| D | Color | Text | #7CB87A |
| E | Keywords | Text | woolworths, checkers, pick n pay, spar |

---

## WhatsApp Bot Commands

| Command | What It Does | Example |
|---------|-------------|---------|
| `[category] [amount]` | Log a spend | `groceries 350` |
| `[category] [amount] [merchant]` | Log with merchant | `petrol 450 shell` |
| `help` | Show help message | `help` |
| `categories` | List all categories | `categories` |
| `balance` | Show all category budgets | `balance` |
| `[category] balance` | Show one category budget | `groceries balance` |
| `goal` | Show savings goal progress | `goal` |
| `undo` | Delete last transaction | `undo` |

### Example Bot Conversation

**User:** `groceries 350 woolworths`

**Bot:**
```
✅ Logged: R350.00 — Groceries (Woolworths)
📊 Groceries: R1,850 of R2,500 used (74%)
💰 R650 remaining | 18 days left this month
```

**User:** `dining 320`

**Bot:**
```
✅ Logged: R320.00 — Dining Out
⚠️ WARNING: Dining Out is at 92% of budget!
📊 Dining Out: R1,840 of R2,000 used (92%)
💰 R160 remaining | 18 days left this month
```

---

## Budget Warning Thresholds

| Threshold | Warning Type | Icon |
|-----------|-------------|------|
| 60% used | Gentle nudge | 💬 |
| 80% used | Yellow warning | ⚠️ |
| 90% used | Orange warning | 🚨 |
| 100% used | Red warning | 🛑 |
| Over budget | Critical alert | 🛑 |

---

## Dashboard Features (Phase 1)

### Overview Page

**Monthly Summary Card**
- Total spent this month vs total budget
- Percentage used
- Large, clear numbers

**Category Grid**
- Card for each category showing:
  - Icon + name
  - Color-coded progress bar
  - Amount spent / Budget amount
  - Remaining budget
- Color coding:
  - Green: < 60% used
  - Yellow: 60-80% used
  - Orange: 80-95% used
  - Red: > 95% used

**Savings Goal Card**
- Progress bar to target
- Current savings / Target amount
- Percentage complete
- Estimated completion date

**Recent Transactions**
- Last 10 transactions
- Date, category icon, amount, merchant, user
- Reverse chronological order

---

## Backend Structure

```
backend/
├── server.js                 # Entry point
├── routes/
│   ├── whatsapp.js          # WhatsApp webhook handler
│   └── dashboard.js         # Dashboard API endpoints
├── services/
│   ├── sheetsService.js     # Google Sheets read/write
│   ├── parserService.js     # Message parsing logic
│   ├── budgetService.js     # Budget calculations
│   └── twilioService.js     # WhatsApp message sending
├── middleware/
│   └── auth.js              # Dashboard token auth
├── config/
│   └── index.js             # Environment config
├── package.json
├── .env.example
└── .gitignore
```

### Core Services

**sheetsService.js**
- `getTransactions(month)` — Read all transactions
- `addTransaction(transaction)` — Append new row
- `getMonthlyBudgets(month)` — Read budgets
- `getSavingsGoal()` — Read savings goal
- `getCategories()` — Read categories
- `getLastTransactionByUser(user)` — For undo

**parserService.js**
- `parseMessage(text, categories)` — Extract amount, category, merchant
- Regex patterns for amounts: `R[\d,]+\.?\d*`
- Category matching: exact match or keyword lookup
- Merchant: remaining text

**budgetService.js**
- `calculateBudgetStatus(category, month)` — Calculate totals, remaining, warnings
- `getAllCategoryStatuses(month)` — All categories
- `getMonthlyOverview(month)` — Total summary

**twilioService.js**
- `sendWhatsAppMessage(to, message)` — Send via Twilio
- `formatBudgetReply(transaction, budgetStatus)` — Format confirmation
- `formatHelpMessage()` — Help text
- `formatCategoriesList(categories)` — List categories
- `formatBalanceMessage(statuses)` — Show balances

---

## API Endpoints

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/overview` | Monthly summary + all categories + recent transactions + savings goal |
| GET | `/api/dashboard/categories` | All categories with budget status |
| GET | `/api/dashboard/transactions` | All transactions for current month |
| GET | `/api/dashboard/transactions/:category` | Transactions filtered by category |
| GET | `/api/dashboard/goal` | Savings goal with projections |

### Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Add new transaction |
| DELETE | `/api/transactions/last/:user` | Delete last transaction (undo) |

### WhatsApp Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook/whatsapp` | Receives incoming messages from Twilio |

---

## Environment Variables

```bash
# Server
PORT=3000

# Google Sheets
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+27XXXXXXXXX

# User Phone Numbers
USER_A_PHONE=+27XXXXXXXXX
USER_B_PHONE=+27XXXXXXXXX

# Dashboard
DASHBOARD_TOKEN=your_random_secure_token
```

---

## Implementation Timeline

### Week 1: Foundation
- **Day 1-2:** Google Sheets setup + service account
- **Day 3-4:** Backend scaffolding + sheetsService
- **Day 5-6:** parserService + budgetService
- **Day 7:** WhatsApp webhook route

### Week 2: Core Features
- **Day 8-9:** Twilio integration + bot commands
- **Day 10-11:** Dashboard API endpoints
- **Day 12-13:** React dashboard scaffolding
- **Day 14:** Overview page components

### Week 3: Polish & Deploy
- **Day 15-16:** Category cards + styling
- **Day 17-18:** Savings goal + transactions
- **Day 19-20:** Mobile responsive design
- **Day 21:** Deployment + testing

---

## Phase Roadmap

### Phase 1 — The Core (Build This First)
✅ Google Sheets setup with all tabs  
✅ Node.js backend with all services  
✅ WhatsApp bot with core commands  
✅ React dashboard with Overview page  
✅ Budget warnings at thresholds  
✅ Mobile-responsive design  
✅ Deployment to Railway + Vercel  

### Phase 2 — The Smart Stuff
- Bank notification parsing with confirmation
- Trend-based warnings (projected overspend)
- Weekly digest (Sunday morning automated summary)
- Undo command
- Enhanced dashboard pages (Spending Breakdown, Trends, Goal Tracker)

### Phase 3 — The Delight
- Dashboard animations and transitions
- Gamification (milestone celebrations)
- Budget management via WhatsApp
- Multi-goal support

---

## Success Criteria

Phase 1 is complete when:

✅ Both users can log spends via WhatsApp  
✅ Bot replies with budget status within 3 seconds  
✅ All spends appear in Google Sheets immediately  
✅ Dashboard shows accurate monthly overview  
✅ Category progress bars update in real-time  
✅ Savings goal displays correctly  
✅ Warning messages trigger at correct thresholds  
✅ Dashboard works beautifully on mobile  
✅ System handles edge cases gracefully  
✅ Both users use it daily for 2+ weeks without friction  

---

## Default Categories

| Category ID | Display Name | Icon | Color | Keywords |
|-------------|-------------|------|-------|----------|
| groceries | Groceries | 🛒 | #7CB87A | woolworths, checkers, pick n pay, spar, food |
| transport | Transport | 🚗 | #4A90E2 | petrol, fuel, uber, bolt, taxi, parking |
| dining | Dining Out | 🍽️ | #C47FD4 | restaurant, takeaway, uber eats, mr d |
| entertainment | Entertainment | 🎬 | #F5A623 | movies, netflix, spotify, games, cinema |
| utilities | Utilities | 💡 | #50E3C2 | electricity, water, internet, phone |
| housing | Housing | 🏠 | #D0021B | rent, bond, rates, insurance |
| shopping | Shopping | 🛍️ | #BD10E0 | clothing, amazon, takealot, online |
| health | Health | 🏥 | #7ED321 | pharmacy, doctor, gym, medical |
| savings | Savings | 💰 | #417505 | deposit, investment, save |
| other | Other | 📦 | #9013FE | misc, other |

---

## Security Considerations

- **Environment variables:** All secrets in `.env`, never committed to Git
- **HTTPS everywhere:** All communication encrypted
- **Dashboard token:** API calls require authentication token
- **Google Sheets sharing:** Shared only with service account
- **Twilio webhook validation:** Verify requests come from Twilio (Phase 2)

---

## Data Flow Example

```
1. User spends R350 at Woolworths
2. User opens WhatsApp → types "groceries 350 woolworths"
3. Twilio receives message → sends webhook to backend
4. Backend parses: amount=350, category=groceries, merchant=woolworths
5. Backend writes to Google Sheets Transactions tab
6. Backend reads all groceries transactions for current month
7. Backend calculates: spent=R1,850, budget=R2,500, remaining=R650
8. Backend checks warnings: 74% used, no warning needed
9. Backend tells Twilio to reply
10. User receives: "✅ Logged: R350.00 — Groceries (Woolworths)
    📊 Groceries: R1,850 of R2,500 used (74%)
    💰 R650 remaining | 18 days left this month"
11. Partner can open dashboard and see the spend immediately
```

**Total time:** ~2-3 seconds

---

## Why This Will Work

1. **Zero friction:** Logging happens in WhatsApp, where you already are
2. **Instant feedback:** You know your budget status immediately
3. **Shared visibility:** Both partners see everything in real time
4. **Beautiful review:** Dashboard makes weekly reviews feel rewarding
5. **Smart warnings:** Prevents overspending before it happens
6. **Goal-focused:** House deposit progress keeps you motivated

---

## Next Steps

1. Answer configuration questions (see CONFIG.md)
2. Set up Google Cloud service account
3. Set up Twilio account
4. Create Google Sheet with tabs
5. Build backend services
6. Build WhatsApp bot
7. Build React dashboard
8. Deploy and test
9. Use daily for 2 weeks
10. Iterate to Phase 2

---

**Ready to build your financial future together? Let's go! 🏠💰**
