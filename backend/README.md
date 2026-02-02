# Our Two Cents — Backend

Node.js backend for the Our Two Cents budget app.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Google Cloud & Google Sheets

Follow the guide in `docs/SETUP_GOOGLE_CLOUD.md` to:
- Create a Google Cloud service account
- Create your Google Sheet with all tabs
- Get your credentials

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `GOOGLE_SHEET_ID` — From your Google Sheet URL
- `GOOGLE_CLIENT_EMAIL` — From service account JSON
- `GOOGLE_PRIVATE_KEY` — From service account JSON
- `TWILIO_ACCOUNT_SID` — From Twilio dashboard
- `TWILIO_AUTH_TOKEN` — From Twilio dashboard
- `TWILIO_WHATSAPP_NUMBER` — Your Twilio WhatsApp number
- `USER_A_PHONE` — Dean's phone: +27747046341
- `USER_B_PHONE` — Abigail's phone: +27848672310
- `DASHBOARD_TOKEN` — Generate a random secure token

**Generate a secure token:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run the Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### WhatsApp Webhook
- `POST /webhook/whatsapp` — Receives messages from Twilio

### Dashboard API
- `GET /api/dashboard/overview` — Monthly summary + categories + transactions + goal
- `GET /api/dashboard/categories` — All categories with budget status
- `GET /api/dashboard/transactions` — All transactions for current month
- `GET /api/dashboard/transactions/:category` — Transactions by category
- `GET /api/dashboard/goal` — Savings goal with projections
- `POST /api/transactions` — Add new transaction manually
- `DELETE /api/transactions/last/:user` — Delete last transaction (undo)

## WhatsApp Bot Commands

- `groceries 350` — Log a spend
- `petrol 450 shell` — Log with merchant
- `help` — Show help message
- `categories` — List all categories
- `balance` — Show all budgets
- `goal` — Show savings goal
- `undo` — Delete last transaction

## Testing

Test the Google Sheets connection:
```bash
curl http://localhost:3000/api/dashboard/categories
```

Test adding a transaction:
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user": "Dean",
    "category": "groceries",
    "amount": 350,
    "merchant": "Woolworths"
  }'
```

## Project Structure

```
backend/
├── server.js              # Entry point
├── config/
│   └── index.js          # Environment config
├── routes/
│   ├── whatsapp.js       # WhatsApp webhook
│   └── dashboard.js      # Dashboard API
├── services/
│   ├── sheetsService.js  # Google Sheets operations
│   ├── parserService.js  # Message parsing
│   ├── budgetService.js  # Budget calculations
│   └── twilioService.js  # WhatsApp messaging
├── middleware/
│   └── auth.js           # Dashboard authentication
└── package.json
```

## Troubleshooting

**Error: "The caller does not have permission"**
- Make sure the Google Sheet is shared with your service account email
- Check that the service account has Editor permissions

**Error: "Invalid JWT"**
- The private key in `.env` is malformed
- Make sure you copied the entire key including BEGIN/END lines
- Ensure `\n` characters are preserved

**WhatsApp messages not received**
- Check that Twilio webhook URL is set correctly
- Make sure the server is publicly accessible (use ngrok for local testing)
- Check Twilio logs in the Twilio console

**Bot not responding**
- Check server logs for errors
- Verify phone numbers match exactly in `.env`
- Test the `/webhook/whatsapp` endpoint manually

## Deployment

See `docs/DEPLOYMENT.md` for Railway deployment instructions.
