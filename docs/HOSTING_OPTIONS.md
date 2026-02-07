# Hosting Options for Our Two Cents

Your local setup works. Here's how to get it running 24/7 so you don't need your Mac on, ngrok running, or sandbox sessions.

---

## What Needs Hosting

| Component | Currently | Problem |
|-----------|-----------|---------|
| **Backend API** | `localhost:3000` | Only works when your Mac is on |
| **ngrok tunnel** | Random URL each restart | Must update Twilio every time |
| **Dashboard** | `localhost:5173` | Only accessible from your Mac |
| **WhatsApp sandbox** | Free, expires every 72h | Must re-join constantly |

**Google Sheets stays as-is** — it's already cloud-hosted. No changes needed there.

---

## The Two Things to Solve

### 1. Host the Backend (so the WhatsApp bot is always on)

This is the critical one. The bot must be reachable 24/7 for WhatsApp messages.

### 2. Host the Dashboard (so you can check it from any device)

Nice to have. You could also just run it locally and only check from your Mac.

---

## Backend Hosting Options

### Option A: Railway — Recommended

**Cost:** $5/month (Hobby plan, no free tier anymore)
**Why:** Easiest setup for Node.js. GitHub auto-deploy. Fixed URL.

**Setup:**
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub Repo"
3. Select `our_two_cents` repo, set root directory to `backend`
4. Add environment variables (copy from your `.env`):
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`
   - `USER_A_PHONE`
   - `USER_A_NAME`
   - `USER_B_PHONE`
   - `USER_B_NAME`
   - `DASHBOARD_TOKEN`
   - `APP_PHASE`
   - `PORT` = `3000`
5. Railway gives you a URL like `https://our-two-cents-backend.up.railway.app`
6. Set that as your Twilio webhook: `https://our-two-cents-backend.up.railway.app/webhook/whatsapp`
7. Done — no ngrok needed ever again

**Pros:**
- Dead simple setup
- Auto-deploys when you push to GitHub
- Always on, fixed URL
- Logs visible in dashboard

**Cons:**
- $5/month minimum
- No free tier

---

### Option B: Render

**Cost:** Free tier available (with cold starts) or $7/month (always on)
**Why:** Has a free tier. Good for testing before committing money.

**Setup:**
1. Go to [render.com](https://render.com) and sign in with GitHub
2. New → Web Service → Connect your repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables (same list as Railway)
7. You get a URL like `https://our-two-cents.onrender.com`

**Pros:**
- Free tier exists
- Simple GitHub deploy
- Fixed URL

**Cons:**
- **Free tier spins down after 15 min of inactivity** — first message after sleep takes 30-50 seconds to respond (WhatsApp may timeout)
- Paid tier ($7/month) fixes this
- Free tier has 750 hours/month limit

---

### Option C: Fly.io

**Cost:** Free tier (3 shared VMs, 256MB) or ~$3-5/month
**Why:** Cheapest always-on option. Slightly more setup.

**Setup:**
1. Install Fly CLI: `brew install flyctl`
2. `cd backend`
3. `fly launch` — follow prompts
4. Set secrets:
   ```bash
   fly secrets set GOOGLE_SHEET_ID=xxx TWILIO_ACCOUNT_SID=xxx ...
   ```
5. `fly deploy`
6. You get a URL like `https://our-two-cents.fly.dev`

**Pros:**
- Generous free tier (no cold starts)
- Very fast deploys
- Good uptime

**Cons:**
- CLI-based setup (no web UI for deploy)
- Slightly more technical
- Free tier may change

---

### Option D: Vercel (Serverless)

**Cost:** Free tier (generous)
**Why:** Free and reliable. Requires restructuring backend to serverless functions.

**Setup:**
- Would need to convert Express routes to Vercel serverless functions
- Each route becomes its own file in `/api/` folder
- Moderate refactor required

**Pros:**
- Truly free for this scale
- Excellent uptime
- Auto-deploy from GitHub

**Cons:**
- **Requires code refactor** — Express → serverless functions
- Cold starts on free tier (less severe than Render)
- Not a simple drop-in

---

### Option E: VPS (DigitalOcean / Hetzner)

**Cost:** $4-6/month
**Why:** Full control. Run anything you want.

**Setup:**
- Spin up a $4/month droplet
- Install Node.js, clone repo, run with PM2
- Set up Nginx reverse proxy + Let's Encrypt SSL
- Point a domain to it

**Pros:**
- Full control
- Can host backend + dashboard on same server
- Cheapest always-on option if you already have a VPS

**Cons:**
- Most setup work
- You manage the server (updates, security, restarts)
- Overkill for this app

---

## Dashboard Hosting Options

The dashboard is a static React app (Vite build). Much simpler to host.

### Option 1: Vercel — Recommended

**Cost:** Free
**Why:** Built for React apps. Zero config.

**Setup:**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Import `our_two_cents` repo
3. Set root directory to `dashboard`
4. Framework preset: Vite
5. Add environment variables:
   - `VITE_API_URL` = your backend URL (e.g., `https://our-two-cents-backend.up.railway.app/api/dashboard`)
   - `VITE_DASHBOARD_TOKEN` = your token
6. Deploy
7. You get a URL like `https://our-two-cents.vercel.app`

### Option 2: Netlify

**Cost:** Free
**Why:** Also great for static sites. Similar to Vercel.

**Setup:**
1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. New site → Import from Git
3. Base directory: `dashboard`
4. Build command: `npm run build`
5. Publish directory: `dashboard/dist`
6. Add environment variables (same as Vercel)

### Option 3: GitHub Pages

**Cost:** Free
**Why:** Already using GitHub.

**Cons:** Requires manual build + deploy workflow. No server-side env vars (token would be in built JS).

---

## My Recommendation

**For your situation (2 people, Phase 1, ~R100/month budget):**

| Component | Host | Cost |
|-----------|------|------|
| Backend | **Railway** | $5/month (~R90) |
| Dashboard | **Vercel** | Free |
| WhatsApp | **Twilio production number** | ~$1/month + ~$0.005/msg (~R20/month) |
| Database | **Google Sheets** (no change) | Free |

**Total: ~R110/month**

This gives you:
- Bot always on, no ngrok, no sandbox expiry
- Dashboard accessible from any device
- WhatsApp just works — no join codes
- Auto-deploys when you push code

---

## Twilio Production WhatsApp Number

To eliminate the sandbox entirely:

1. **Twilio Console** → Messaging → WhatsApp → Senders → **New Sender**
2. You need a Twilio phone number (~$1/month) or bring your own
3. Submit for WhatsApp Business approval (1-3 business days)
4. Once approved, update your `.env`:
   ```
   TWILIO_WHATSAPP_NUMBER=whatsapp:+your_new_number
   ```
5. No more sandbox, no join codes, no session expiry

**Note:** You can stay on the sandbox while setting this up. Just keep re-joining every few days.

---

## Migration Checklist

When you're ready to go live:

- [ ] Deploy backend to Railway (or chosen host)
- [ ] Verify backend API works via the hosted URL
- [ ] Update Twilio webhook URL to hosted backend URL
- [ ] Test WhatsApp bot end-to-end
- [ ] Deploy dashboard to Vercel
- [ ] Update `VITE_API_URL` to point to hosted backend
- [ ] Verify dashboard loads and shows data
- [ ] (Optional) Register Twilio production WhatsApp number
- [ ] (Optional) Abigail re-joins sandbox or uses new number
- [ ] Kill local ngrok — you don't need it anymore

---

## What Stays the Same

No matter which hosting option you choose:
- **Google Sheets** remains your database (no migration needed)
- **All your Phase 1 data is preserved** — nothing changes
- **The code is the same** — hosting is just where it runs
- **You can always run locally** as a fallback
