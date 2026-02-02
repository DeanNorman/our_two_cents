# 💰 Our Two Cents

**A WhatsApp-based budget app for couples saving for a house.**

Budget where you already live — no apps to download, no logins to remember. Just text your spends to WhatsApp and watch your budget in a beautiful dashboard.

---

## 🎯 What It Does

- **📱 WhatsApp Bot** — Log expenses naturally: `groceries 350 woolworths`
- **📊 Google Sheets** — All your data in one spreadsheet you control
- **🎨 React Dashboard** — Beautiful real-time budget visualization
- **🚨 Smart Alerts** — Budget warnings at 60%, 80%, 90%, 100%
- **🏠 Savings Tracker** — Monitor progress toward your house deposit goal

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Google Cloud account (free tier)
- Twilio account (free trial)
- ngrok (for local testing)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/our_two_cents.git
cd our_two_cents

# Install backend
cd backend
npm install

# Install dashboard
cd ../dashboard
npm install
```

### 2. Set Up Google Cloud & Sheets

**Detailed guide:** [`docs/SETUP_GOOGLE_CLOUD.md`](docs/SETUP_GOOGLE_CLOUD.md)

**Quick steps:**
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account & download credentials
4. Create Google Sheet with 4 tabs: `Transactions`, `Monthly Budgets`, `Savings Goal`, `Categories`
5. Share sheet with service account email
6. Copy Sheet ID from URL

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
# Google Sheets
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Users
USER_A_PHONE=+1234567890
USER_A_NAME=User A
USER_B_PHONE=+0987654321
USER_B_NAME=User B

# Dashboard (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
DASHBOARD_TOKEN=your_random_token_here
```

### 4. Set Up Twilio WhatsApp

**Detailed guide:** [`docs/SETUP_TWILIO.md`](docs/SETUP_TWILIO.md)

**Quick steps:**
1. Join Twilio WhatsApp Sandbox (send join code to +1 415 523 8886)
2. Install ngrok: `brew install ngrok`
3. Start ngrok: `ngrok http 3000`
4. Set Twilio webhook to: `https://xxxx.ngrok-free.app/webhook/whatsapp`

### 5. Configure Dashboard

```bash
cd dashboard
cp .env.example .env
```

Edit `.env`:
```bash
VITE_API_URL=http://localhost:3000/api/dashboard
VITE_DASHBOARD_TOKEN=same_token_from_backend_env
```

### 6. Start Everything

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — ngrok:**
```bash
ngrok http 3000
```

**Terminal 3 — Dashboard:**
```bash
cd dashboard
npm run dev
```

### 7. Test It!

**Send a WhatsApp message to +1 415 523 8886:**
```
groceries 350 woolworths
```

**You should get:**
```
✅ Logged: R350.00 — Groceries
📊 Groceries: R350 of R2,500 used (14%)
💰 R2,150 remaining | 26 days left this month
```

**Check your dashboard:** http://localhost:5173

---

## 📱 WhatsApp Commands

| Command | Example | Description |
|---------|---------|-------------|
| Log spend | `groceries 350` | Add transaction |
| With merchant | `petrol 450 shell` | Include merchant name |
| Help | `help` | Show all commands |
| Categories | `categories` | List all budget categories |
| Balance | `balance` | Show all category budgets |
| Savings goal | `goal` | View house deposit progress |
| Undo | `undo` | Delete your last transaction |

---

## 🏗️ Architecture

```
WhatsApp (Users)
    ↓
Twilio API
    ↓
Node.js Backend (Express)
    ↓
Google Sheets (Database)
    ↑
React Dashboard (Vite + TailwindCSS)
```

### Tech Stack

- **Backend:** Node.js, Express, Google Sheets API, Twilio API
- **Frontend:** React, Vite, TailwindCSS, Recharts, Axios
- **Database:** Google Sheets (4 tabs)
- **Hosting:** Railway (backend), Vercel (frontend)
- **Development:** ngrok (local webhook testing)

---

## 📂 Project Structure

```
our_two_cents/
├── backend/
│   ├── server.js              # Express server
│   ├── config/
│   │   └── index.js          # Environment config
│   ├── routes/
│   │   ├── whatsapp.js       # WhatsApp webhook
│   │   └── dashboard.js      # Dashboard API
│   ├── services/
│   │   ├── sheetsService.js  # Google Sheets operations
│   │   ├── parserService.js  # Message parsing
│   │   ├── budgetService.js  # Budget calculations
│   │   └── twilioService.js  # WhatsApp messaging
│   └── middleware/
│       └── auth.js           # Dashboard authentication
├── dashboard/
│   ├── src/
│   │   ├── App.jsx           # Main dashboard
│   │   ├── components/       # React components
│   │   └── services/
│   │       └── api.js        # Backend API client
│   └── package.json
└── docs/
    ├── PRD.md                # Product requirements
    ├── SETUP_GOOGLE_CLOUD.md
    └── SETUP_TWILIO.md
```

---

## 🎨 Dashboard Features

- **Overview Cards** — Month, total spent, budget usage
- **Category Cards** — 10 categories with progress bars and icons
- **Savings Goal** — House deposit tracker with percentage complete
- **Recent Transactions** — Scrollable list with user, date, amount, merchant
- **Auto-refresh** — Updates every 2 minutes
- **Manual Refresh** — Click button to update immediately

---

## 🔧 API Endpoints

### Dashboard API

- `GET /api/dashboard/overview` — Monthly summary + categories + transactions + goal
- `GET /api/dashboard/categories` — All categories with budget status
- `GET /api/dashboard/transactions` — All transactions for current month
- `GET /api/dashboard/goal` — Savings goal with projections

### WhatsApp Webhook

- `POST /webhook/whatsapp` — Receives messages from Twilio

---

## 🐛 Troubleshooting

### Bot Not Responding

1. Check backend is running: `npm run dev` in `backend/`
2. Check ngrok is running: `ngrok http 3000`
3. Verify Twilio webhook URL is correct
4. Confirm you joined the sandbox (send join code)

### Google Sheets Errors

1. Verify sheet is shared with service account email
2. Check credentials in `.env` are correct
3. Test: `curl http://localhost:3000/api/dashboard/categories`

### Dashboard 500 Errors

1. Check backend is running on port 3000
2. Verify `DASHBOARD_TOKEN` matches in both `.env` files
3. Check for Google Sheets API rate limiting (wait 1 minute)

### Unknown User Error

1. Phone numbers in `.env` must match exactly
2. Include country code: `+27747046341`
3. Format: `whatsapp:+27...` for Twilio

---

## 📊 Budget Categories

| Category | Icon | Monthly Budget |
|----------|------|----------------|
| Groceries | 🛒 | R2,500 |
| Transport | 🚗 | R1,500 |
| Dining Out | 🍽️ | R2,000 |
| Entertainment | 🎬 | R800 |
| Utilities | 💡 | R1,200 |
| Housing | 🏠 | R8,000 |
| Shopping | 🛍️ | R1,000 |
| Health | 🏥 | R500 |
| Savings | 💰 | R8,000 |
| Other | 📦 | R500 |

**Total Monthly Budget:** R26,000

---

## 🚀 Deployment

### Backend (Railway)

1. Create Railway project
2. Add environment variables from `.env`
3. Deploy from GitHub
4. Update Twilio webhook to Railway URL

### Frontend (Vercel)

1. Create Vercel project
2. Add environment variables
3. Deploy from GitHub
4. Update `VITE_API_URL` to Railway backend URL

---

## 📝 Development

### Run Tests

```bash
# Test backend API
curl http://localhost:3000/api/dashboard/overview

# Test Google Sheets connection
curl http://localhost:3000/api/dashboard/categories
```

### Add New Category

1. Add to Google Sheet `Categories` tab
2. Update `Monthly Budgets` tab
3. Restart backend

### Modify Budget Amounts

Edit `Monthly Budgets` tab in Google Sheet — changes apply immediately.

---

## 🎯 Roadmap

**Phase 1: The Core** ✅
- WhatsApp bot with natural language parsing
- Google Sheets integration
- Budget tracking and warnings
- React dashboard

**Phase 2: The Smart Stuff** (Coming Soon)
- Trend analysis and predictions
- Recurring transaction detection
- Smart category suggestions
- Weekly/monthly summaries

**Phase 3: The Delight** (Future)
- Bank account integration
- Receipt photo parsing
- Shared shopping lists
- Celebration animations for savings milestones

---

## 👥 Users

- **User A** — Your phone number
- **User B** — Partner's phone number

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

Built with ❤️ for couples saving for their dream home.

**Tech:** Node.js • Express • React • Google Sheets API • Twilio • TailwindCSS

---

**Questions?** Check the detailed guides in [`docs/`](docs/) or open an issue.

**Ready to save?** 🏠💰
