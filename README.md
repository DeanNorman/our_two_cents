# � Our Two Cents

**A WhatsApp-first budget app that teaches couples to manage money together — one phase at a time.**

No apps to download. No logins to remember. Text your spends to WhatsApp, review them on a beautiful dashboard, and gradually level up your financial skills as a couple.

Built for Dean & Abigail. Saving for a house. Learning as they go.

---

## 🎯 What It Does

- **📱 WhatsApp Bot** — Log expenses in 3 seconds: `groceries 350 woolworths`
- **📊 Google Sheets** — Your data lives in a spreadsheet you own and control
- **🎨 React Dashboard** — Glassmorphic real-time spending visualization
- **� Phase System** — Features unlock progressively as you build financial habits
- **🔥 Tracking Streaks** — Gamified consistency tracking
- **🏠 Savings Goal** — House deposit progress tracker

---

## 🗺️ The Journey

The app follows a 4-phase roadmap. Features are gated — you unlock more as you advance:

| Phase | Name | Focus | Dashboard Shows |
|-------|------|-------|-----------------|
| **1** | Discovery | Build the tracking habit | Summary card, category bars, streak, transactions |
| **2** | Understanding | See your patterns | + Pie charts, monthly wins, analytics tab |
| **3** | Confidence | Set budgets together | + Insights, budget warnings, bot budget replies |
| **4** | Goals | Save intentionally | + Savings projections, goal tracking |

You start in Phase 1. Advance when you're both ready (click the phase badge on the dashboard).

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google Cloud account (free tier)
- Twilio account (free trial)
- ngrok (`brew install ngrok`)

### 1. Clone & Install

```bash
git clone https://github.com/DeanNorman/our_two_cents.git
cd our_two_cents

# Install backend
cd backend && npm install

# Install dashboard
cd ../dashboard && npm install
```

### 2. Set Up Google Sheets

**Full guide:** [`docs/SETUP_GOOGLE_CLOUD.md`](docs/SETUP_GOOGLE_CLOUD.md)

1. Create Google Cloud project → Enable Google Sheets API
2. Create service account → Download credentials JSON
3. Create Google Sheet with 4 tabs: `Transactions`, `Monthly Budgets`, `Savings Goal`, `Categories`
4. Share the sheet with the service account email

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```bash
# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Users
USER_A_PHONE=+27747046341
USER_A_NAME=Dean
USER_B_PHONE=+27848672310
USER_B_NAME=Abigail

# Dashboard
DASHBOARD_TOKEN=your_random_token_here

# Phase (1=Discovery, 2=Understanding, 3=Confidence, 4=Goals)
APP_PHASE=1
```

### 4. Set Up Twilio WhatsApp

**Full guide:** [`docs/SETUP_TWILIO.md`](docs/SETUP_TWILIO.md)

1. In Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Both users join the sandbox: send the join code to **+1 415 523 8886**
3. Start ngrok: `ngrok http 3000`
4. Set Twilio webhook URL to: `https://your-ngrok-url.ngrok-free.dev/webhook/whatsapp` (POST)

**Note:** Sandbox sessions expire after ~72 hours of inactivity. Re-send the join code to reconnect.

### 5. Configure Dashboard

```bash
cd dashboard
cp .env.example .env
```

Edit `.env`:
```bash
VITE_API_URL=http://localhost:3000/api/dashboard
VITE_DASHBOARD_TOKEN=same_token_from_backend
```

### 6. Start Everything

```bash
# Terminal 1 — Backend
cd backend && node server.js

# Terminal 2 — ngrok tunnel
ngrok http 3000

# Terminal 3 — Dashboard
cd dashboard && npm run dev
```

### 7. Test It

Send a WhatsApp message to **+1 415 523 8886**:
```
groceries 350 woolworths
```

You should get:
```
✅ Logged: R350.00 — Groceries (woolworths)

You're on a 2-day tracking streak! 🔥
```

Dashboard: http://localhost:5173

---

## 📱 WhatsApp Commands

| Command | Example | Description |
|---------|---------|-------------|
| **Log spend** | `groceries 350` | Log a transaction |
| **With merchant** | `dining 85 nandos` | Include where you spent |
| **Help** | `help` | Show all commands and examples |
| **Categories** | `categories` | List all 10 categories |
| **Balance** | `balance` | Budget status (Phase 3+) |
| **Goal** | `goal` | House deposit progress |
| **Undo** | `undo` | Delete your last transaction |

### Categories

| Keyword | Category | What goes here |
|---------|----------|---------------|
| `groceries` | 🛒 Groceries | Woolworths, Spar, Checkers |
| `transport` | 🚗 Transport | Petrol, Uber, parking |
| `dining` | 🍽️ Dining Out | Restaurants, coffee, takeaway |
| `entertainment` | 🎬 Entertainment | Netflix, movies, hobbies |
| `utilities` | 💡 Utilities | Electricity, water, internet |
| `housing` | 🏠 Housing | Rent, rates, home insurance |
| `shopping` | 🛍️ Shopping | Clothes, Takealot, gifts |
| `health` | 🏥 Health | Doctor, pharmacy, medical aid |
| `savings` | 💰 Savings | House fund, investments |
| `other` | 📦 Other | Everything else |

---

## 🏗️ Architecture

```
📱 WhatsApp (Dean & Abigail)
    ↓
☁️  Twilio API → ngrok tunnel
    ↓
⚙️  Node.js Backend (Express)
    ↓                ↑
📊 Google Sheets    🎨 React Dashboard
   (Database)       (Vite + TailwindCSS)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express, Google Sheets API, Twilio |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Framer Motion, Recharts |
| **Database** | Google Sheets (Transactions, Monthly Budgets, Savings Goal, Categories) |
| **State** | React Context (PhaseContext for phase gating) |
| **Dev Tools** | ngrok (webhook tunnel) |

---

## 📂 Project Structure

```
our_two_cents/
├── backend/
│   ├── server.js                 # Express server entry
│   ├── config/index.js           # Environment config + phase
│   ├── routes/
│   │   ├── whatsapp.js           # WhatsApp webhook (phase-aware)
│   │   └── dashboard.js          # Dashboard API endpoints
│   ├── services/
│   │   ├── sheetsService.js      # Google Sheets CRUD + streak calc
│   │   ├── parserService.js      # Message parsing
│   │   ├── budgetService.js      # Budget calculations
│   │   └── twilioService.js      # WhatsApp messaging + reply formatting
│   └── middleware/auth.js        # Dashboard token auth
│
├── dashboard/
│   ├── src/
│   │   ├── App.tsx               # Root (wrapped in PhaseProvider)
│   │   ├── contexts/
│   │   │   └── PhaseContext.tsx   # Phase state (localStorage)
│   │   ├── components/
│   │   │   ├── PhaseGate.tsx     # Conditional rendering by phase
│   │   │   ├── PhaseSettings.tsx # Phase advancement UI + badge
│   │   │   ├── TransactionsList.tsx
│   │   │   ├── CategoryVisualizer.tsx  # (Phase 2+)
│   │   │   ├── MonthlyWins.tsx         # (Phase 2+)
│   │   │   ├── InsightsList.tsx        # (Phase 3+)
│   │   │   ├── AddTransactionModal.tsx
│   │   │   ├── WhatsAppQuickActions.tsx
│   │   │   └── ui/GlassCard.tsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx  # Sidebar, header, nav (phase-filtered)
│   │   ├── pages/
│   │   │   └── DashboardHome.tsx    # Main page with phase gates
│   │   ├── services/api.ts          # Typed API client (Axios)
│   │   └── types/index.ts           # TypeScript interfaces
│   └── package.json
│
└── docs/
    ├── ONBOARDING.md             # Start here — day-to-day usage guide
    ├── PHASE_1_GUIDE.md          # Phase 1 quick reference
    ├── PRD.md                    # Full product requirements
    ├── PRD_PHASE_1_DISCOVERY.md  # Phase 1 detailed spec
    ├── PRD_PHASE_2_UNDERSTANDING.md
    ├── PRD_PHASE_3_CONFIDENCE.md
    ├── PRD_PHASE_4_GOALS.md
    ├── PROJECT_REVIEW.md         # Senior engineer review
    ├── CHANGES_REVIEW.md         # Phase system code review
    ├── HOSTING_OPTIONS.md        # Deployment options & costs
    ├── SETUP_GOOGLE_CLOUD.md     # Google Sheets setup guide
    └── SETUP_TWILIO.md           # Twilio WhatsApp setup guide
```

---

## 🔧 API Endpoints

### Dashboard API (authenticated via `DASHBOARD_TOKEN`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/overview` | Monthly summary, categories, transactions, savings goal |
| `GET` | `/api/dashboard/categories` | All categories with metadata |
| `GET` | `/api/dashboard/transactions` | Current month transactions |
| `GET` | `/api/dashboard/goal` | Savings goal with projections |
| `POST` | `/api/dashboard/transactions` | Add transaction manually |
| `DELETE` | `/api/dashboard/transactions/last/:user` | Delete user's last transaction |

### WhatsApp Webhook

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/webhook/whatsapp` | Receives messages from Twilio |

---

## 🐛 Troubleshooting

### Bot Not Responding

1. Is the backend running? `node server.js` in `backend/`
2. Is ngrok running? `ngrok http 3000`
3. Is the Twilio webhook URL correct and pointing to your ngrok URL?
4. Did you join the sandbox? Send `join beyond-event` to +1 415 523 8886
5. Sandbox sessions expire after ~72 hours — re-send the join code

### Google Sheets Errors

1. Sheet must be shared with the service account email
2. Check `GOOGLE_PRIVATE_KEY` formatting in `.env` (preserve `\n` characters)
3. Test: `curl http://localhost:3000/api/dashboard/categories`

### Dashboard Not Loading

1. Backend must be running on port 3000
2. `VITE_DASHBOARD_TOKEN` must match `DASHBOARD_TOKEN` in backend `.env`
3. `VITE_API_URL` must be `http://localhost:3000/api/dashboard`

### "Unknown User" in Backend Logs

Phone numbers in `.env` must include country code and match exactly: `+27747046341`

---

## � Development

### Verify Everything Works

```bash
# Backend health check
curl http://localhost:3000/

# Test Google Sheets read
curl http://localhost:3000/api/dashboard/categories

# Test transactions
curl http://localhost:3000/api/dashboard/transactions

# Test WhatsApp webhook locally
curl -X POST http://localhost:3000/webhook/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "Body=help&From=whatsapp:+27747046341"
```

### TypeScript Build Check

```bash
cd dashboard && npx tsc --noEmit
```

### Add a New Category

1. Add a row to the `Categories` tab in Google Sheets
2. Add a corresponding row to `Monthly Budgets` for the current month
3. Restart the backend

### Change Phase (Backend)

Edit `APP_PHASE` in `backend/.env` and restart the server. This controls the WhatsApp bot's behavior (simple replies in Phase 1-2, budget replies in Phase 3+).

### Change Phase (Dashboard)

Click the phase badge in the sidebar → select new phase → confirm. Stored in `localStorage`.

---

## 📚 Documentation

| Doc | What it covers |
|-----|---------------|
| [`ONBOARDING.md`](docs/ONBOARDING.md) | **Start here.** Day-to-day usage guide for Dean & Abigail |
| [`PHASE_1_GUIDE.md`](docs/PHASE_1_GUIDE.md) | Phase 1 quick reference and cheat sheet |
| [`PRD.md`](docs/PRD.md) | Full product requirements and architecture |
| [`PRD_PHASE_1_DISCOVERY.md`](docs/PRD_PHASE_1_DISCOVERY.md) | Phase 1 detailed spec |
| [`PROJECT_REVIEW.md`](docs/PROJECT_REVIEW.md) | Senior engineer project review |
| [`CHANGES_REVIEW.md`](docs/CHANGES_REVIEW.md) | Phase system code review |
| [`HOSTING_OPTIONS.md`](docs/HOSTING_OPTIONS.md) | Deployment options and costs |
| [`SETUP_GOOGLE_CLOUD.md`](docs/SETUP_GOOGLE_CLOUD.md) | Google Cloud & Sheets setup |
| [`SETUP_TWILIO.md`](docs/SETUP_TWILIO.md) | Twilio WhatsApp setup |

---

## � Built For

**Dean** — Wants to be an informed partner, not in the dark about finances.
**Abigail** — Wants to share the mental load, not carry it alone.

Together, saving for a house. One rand at a time.

---

## 📄 License

MIT

---

Built with love. �
