# Dashboard — Our Two Cents

Beautiful React dashboard for visualizing your budget data in real-time.

## Features

- 📊 **Real-time budget tracking** — See all spending instantly
- 💰 **Category breakdown** — 10 categories with progress bars and icons
- 🏠 **Savings goal** — House deposit progress tracker
- 📝 **Recent transactions** — Scrollable list with user, date, amount, merchant
- 🔄 **Auto-refresh** — Updates every 2 minutes (to avoid API rate limits)
- 🎨 **Modern UI** — Built with TailwindCSS v4 and Lucide icons

## Quick Start

### 1. Install Dependencies

```bash
cd dashboard
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
VITE_API_URL=http://localhost:3000/api/dashboard
VITE_DASHBOARD_TOKEN=your_dashboard_token_from_backend_env
```

**Important:** The `DASHBOARD_TOKEN` must match the one in `backend/.env`.

### 3. Start Development Server

```bash
npm run dev
```

Dashboard will be available at: **http://localhost:5173**

## Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool and dev server
- **TailwindCSS v4** — Styling with PostCSS
- **Lucide React** — Icon library
- **Axios** — HTTP client for API calls
- **Recharts** — Charting library (future use)

## Project Structure

```
dashboard/
├── src/
│   ├── App.jsx                 # Main dashboard component
│   ├── index.css              # Tailwind imports
│   ├── components/
│   │   ├── CategoryCard.jsx   # Budget category card
│   │   ├── TransactionList.jsx # Recent transactions
│   │   └── SavingsGoal.jsx    # Savings progress
│   └── services/
│       └── api.js             # Backend API client
├── .env                       # Environment variables (not committed)
├── .env.example              # Example environment variables
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS with Tailwind v4
└── package.json
```

## API Integration

The dashboard fetches data from the backend API:

- `GET /api/dashboard/overview` — Monthly summary, categories, transactions, savings goal

Authentication is handled via the `x-dashboard-token` header.

## Development

### Auto-refresh Behavior

The dashboard automatically refreshes every **2 minutes** to avoid Google Sheets API rate limiting (60 requests/minute).

You can also manually refresh by clicking the "Refresh" button.

### Troubleshooting

**Dashboard shows "Failed to load data":**
1. Check backend is running on port 3000
2. Verify `VITE_API_URL` in `.env` is correct
3. Confirm `VITE_DASHBOARD_TOKEN` matches backend token
4. Check browser console for errors

**500 errors from backend:**
1. Wait 1 minute (Google Sheets API rate limit)
2. Check backend logs for errors
3. Verify Google Sheets credentials in backend `.env`

**Styles not loading:**
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Check `postcss.config.js` uses `@tailwindcss/postcss`

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready for deployment to Vercel or Netlify.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_API_URL` — Your Railway backend URL
   - `VITE_DASHBOARD_TOKEN` — Same token from backend
4. Deploy

### Environment Variables for Production

```bash
VITE_API_URL=https://your-backend.railway.app/api/dashboard
VITE_DASHBOARD_TOKEN=your_production_token
```

## Components

### CategoryCard

Displays individual category budget status with:
- Icon and category name
- Amount spent vs budget
- Progress bar with color coding
- Warning indicators (60%, 80%, 90%, 100%)

### TransactionList

Shows recent transactions with:
- Category icon
- User name
- Date
- Amount (formatted as currency)
- Merchant name

### SavingsGoal

Displays house deposit progress:
- Target amount (R500,000)
- Current savings
- Percentage complete
- Progress bar

## License

MIT
