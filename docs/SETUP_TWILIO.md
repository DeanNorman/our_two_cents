# Twilio WhatsApp Setup Guide

This guide will help you set up Twilio's WhatsApp Sandbox for testing Our Two Cents.

---

## Quick Start (5 Minutes)

**Already have Google Sheets working?** Here's the fast track:

1. **Join Sandbox** (both Dean & Abigail):
   - WhatsApp → Message **+1 415 523 8886**
   - Send: `join <your-join-code>` (get code from Twilio Console)

2. **Set up ngrok**:
   ```bash
   brew install ngrok
   ngrok http 3000
   ```

3. **Configure webhook** in Twilio Console:
   - Go to: Messaging → Try it out → Send a WhatsApp message
   - Webhook URL: `https://xxxx.ngrok.io/webhook/whatsapp` (from ngrok)
   - Method: POST
   - Save

4. **Test**: Send `help` to +1 415 523 8886

---

## Prerequisites

Before starting, make sure you have:
- ✅ Completed Google Cloud setup (see `SETUP_GOOGLE_CLOUD.md`)
- ✅ Created your `.env` file with Google credentials
- ✅ Backend server running without errors (`npm run dev`)

**Important:** Fix any Google Sheets errors before setting up Twilio. The bot won't work if it can't access your Google Sheet.

**Common error:** `DECODER routines::unsupported` means your `GOOGLE_PRIVATE_KEY` in `.env` is malformed. See troubleshooting section below.

---

## Step 1: Access Your Twilio Account

You need a Twilio account with these credentials from your Twilio Console:
- **Account SID:** `your_account_sid`
- **Auth Token:** `your_auth_token`
- **WhatsApp Sandbox Number:** `+14155238886` (sandbox default)

1. Go to [Twilio Console](https://console.twilio.com)
2. Log in with your account

---

## Step 2: Set Up WhatsApp Sandbox

The WhatsApp Sandbox is a free testing environment perfect for Phase 1.

1. In the Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. You'll see instructions to join the sandbox
3. The sandbox number is: **+1 415 523 8886** (this is your `TWILIO_WHATSAPP_NUMBER`)

### Join the Sandbox (Dean)

1. On your phone, open WhatsApp
2. Create a new message to: **+1 415 523 8886**
3. Send the join code shown in the Twilio console (looks like: `join <word>-<word>`)
4. You should receive a confirmation message from Twilio

### Join the Sandbox (Abigail)

1. Abigail needs to do the same on her phone
2. Open WhatsApp
3. Message: **+1 415 523 8886**
4. Send the same join code
5. Receive confirmation

**Important:** Both users must join the sandbox before the bot will work for them.

---

## Step 3: Configure the Webhook

The webhook tells Twilio where to send incoming WhatsApp messages.

### For Local Testing (Using ngrok)

1. Install ngrok if you don't have it:
   ```bash
   brew install ngrok
   ```

2. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

3. In a new terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```

4. Copy the HTTPS URL from ngrok (looks like: `https://xxxx-xx-xx-xx-xx.ngrok.io`)

5. In Twilio Console, go to **Messaging** → **Try it out** → **Send a WhatsApp message**

6. Scroll down to **Sandbox Configuration**

7. In the **When a message comes in** field, enter:
   ```
   https://xxxx-xx-xx-xx-xx.ngrok.io/webhook/whatsapp
   ```
   (Replace with your actual ngrok URL)

8. Set the method to **POST**

9. Click **Save**

### For Production (After Deployment to Railway)

1. Deploy your backend to Railway (see `DEPLOYMENT.md`)

2. Get your Railway app URL (looks like: `https://our-two-cents-production.up.railway.app`)

3. In Twilio Console, update the webhook URL to:
   ```
   https://our-two-cents-production.up.railway.app/webhook/whatsapp
   ```

4. Click **Save**

---

## Step 4: Test the Connection

### Test 1: Send a Message to the Bot

1. On your phone (Dean or Abigail), open WhatsApp
2. Send a message to **+1 415 523 8886**:
   ```
   help
   ```

3. You should receive a help message back from the bot

### Test 2: Log a Spend

1. Send:
   ```
   groceries 350
   ```

2. You should receive:
   ```
   ✅ Logged: R350.00 — Groceries
   📊 Groceries: R350 of R2,500 used (14%)
   💰 R2,150 remaining | XX days left this month
   ```

3. Check your Google Sheet — the transaction should appear in the Transactions tab

### Test 3: Check Balance

1. Send:
   ```
   balance
   ```

2. You should receive a list of all categories with their budget status

---

## Step 5: Troubleshooting

### "I'm not receiving messages from the bot"

**Check 1: Did you join the sandbox?**
- Both Dean and Abigail must send the join code to the sandbox number
- You should have received a confirmation message

**Check 2: Is the webhook configured correctly?**
- Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
- Check the webhook URL is correct
- Make sure it ends with `/webhook/whatsapp`
- Make sure it's set to POST

**Check 3: Is your backend running?**
- Check that `npm run dev` is running without errors
- If using ngrok, check that ngrok is still running
- Test the webhook URL in a browser — you should see some response

**Check 4: Check Twilio logs**
- In Twilio Console, go to **Monitor** → **Logs** → **Errors & Warnings**
- Look for any errors related to your webhook
- Common issues:
  - Webhook URL returned an error (check backend logs)
  - Webhook URL is unreachable (check ngrok is running)

### "The bot responds but doesn't log transactions"

**Check 1: Google Sheets connection**
- Make sure your `.env` file has correct Google credentials
- Make sure the Sheet is shared with the service account email
- Test the API: `curl http://localhost:3000/api/dashboard/categories`

**Check 2: Check backend logs**
- Look for errors in the terminal where `npm run dev` is running
- Common issues:
  - "The caller does not have permission" → Sheet not shared
  - "Invalid JWT" → Private key is malformed

### "I get an error message from the bot"

**"I didn't understand that"**
- The message couldn't be parsed
- Make sure you're using the format: `[category] [amount]`
- Example: `groceries 350`
- Type `help` to see examples

**"Unknown user"**
- Your phone number doesn't match the ones in `.env`
- Check that `USER_A_PHONE` and `USER_B_PHONE` are correct
- Phone numbers must include country code: `+27747046341`

### "Error: DECODER routines::unsupported" (Google Sheets)

This error means your Google private key isn't formatted correctly in the `.env` file.

**Fix:**
1. Open your service account JSON file
2. Find the `private_key` field
3. Copy the ENTIRE value including quotes
4. In your `.env` file, paste it exactly as is:
   ```
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
   ```
5. Make sure the `\n` characters are preserved (they represent newlines)
6. Keep the double quotes around the entire key
7. Restart your server: `npm run dev`

**Alternative method (if above doesn't work):**
1. In your `.env` file, use single quotes and actual newlines:
   ```
   GOOGLE_PRIVATE_KEY='-----BEGIN PRIVATE KEY-----
   MIIEvQIBADANBg...
   -----END PRIVATE KEY-----'
   ```
2. Or use the JSON file path method (see backend/config/index.js for alternative setup)

---

## Step 6: Upgrading to Production WhatsApp Number

The sandbox is great for testing, but for production use, you'll want a dedicated WhatsApp Business number.

### Requirements
- A Twilio account (you have this)
- A phone number that can receive SMS (for verification)
- Business information (name, website, etc.)

### Process
1. In Twilio Console, go to **Messaging** → **WhatsApp** → **Senders**
2. Click **New Sender**
3. Follow the WhatsApp Business approval process
4. This can take 1-3 days for approval

### Benefits of Production Number
- No need for users to "join" — they can just message your number
- More reliable
- Custom sender name
- Higher message limits

**Recommendation:** Stick with the sandbox for Phase 1. Upgrade to production once everything is working smoothly.

---

## Webhook URL Summary

**Local testing with ngrok:**
```
https://xxxx-xx-xx-xx-xx.ngrok.io/webhook/whatsapp
```

**Production on Railway:**
```
https://our-two-cents-production.up.railway.app/webhook/whatsapp
```

---

## Phone Numbers Summary

**Dean:** +27747046341  
**Abigail:** +27848672310  
**Twilio Sandbox:** +1 415 523 8886  

---

**You're ready to start using the WhatsApp bot! 🎉**

Next: Test the bot by sending messages and logging some test transactions.
