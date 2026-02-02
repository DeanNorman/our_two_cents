# Google Cloud Setup Guide

Follow these steps to create a Google Cloud service account and get the credentials needed for Our Two Cents.

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click **Select a project** at the top
4. Click **New Project**
5. Enter project name: `our-two-cents`
6. Click **Create**
7. Wait for the project to be created (takes ~30 seconds)
8. Make sure your new project is selected in the dropdown at the top

---

## Step 2: Enable Google Sheets API

1. In the left sidebar, click **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on **Google Sheets API**
4. Click **Enable**
5. Wait for it to enable (~10 seconds)

---

## Step 3: Create a Service Account

1. In the left sidebar, click **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** at the top
3. Select **Service Account**
4. Fill in the details:
   - **Service account name:** `our-two-cents-bot`
   - **Service account ID:** (auto-filled, leave as is)
   - **Description:** `Service account for Our Two Cents budget app`
5. Click **CREATE AND CONTINUE**
6. For **Grant this service account access to project**:
   - Select role: **Editor**
7. Click **CONTINUE**
8. Skip the optional step (Grant users access)
9. Click **DONE**

---

## Step 4: Create and Download the JSON Key

1. You should now see your service account in the list
2. Click on the service account email (looks like `our-two-cents-bot@our-two-cents-xxxxx.iam.gserviceaccount.com`)
3. Go to the **KEYS** tab
4. Click **ADD KEY** → **Create new key**
5. Select **JSON** format
6. Click **CREATE**
7. A JSON file will download to your computer (e.g., `our-two-cents-xxxxx.json`)
8. **IMPORTANT:** Keep this file safe! It contains your credentials.

---

## Step 5: Extract Credentials from JSON File

1. Open the downloaded JSON file in a text editor
2. Find these two fields:
   - `client_email` — This is your **GOOGLE_CLIENT_EMAIL**
   - `private_key` — This is your **GOOGLE_PRIVATE_KEY**

**Example JSON structure:**
```json
{
  "type": "service_account",
  "project_id": "our-two-cents-xxxxx",
  "private_key_id": "xxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "our-two-cents-bot@our-two-cents-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

3. Copy the `client_email` value
4. Copy the entire `private_key` value (including the `\n` characters and the BEGIN/END lines)

---

## Step 6: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **Blank** to create a new spreadsheet
3. Name it: **Our Two Cents Budget**
4. Copy the Sheet ID from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXX/edit`
   - The long string between `/d/` and `/edit` is your **GOOGLE_SHEET_ID**
   - Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`

---

## Step 7: Share the Sheet with Your Service Account

**This is critical! The backend won't work without this step.**

1. In your Google Sheet, click the **Share** button (top right)
2. In the "Add people and groups" field, paste your service account email:
   - `our-two-cents-bot@our-two-cents-xxxxx.iam.gserviceaccount.com`
3. Make sure the permission is set to **Editor**
4. **UNCHECK** "Notify people" (the service account doesn't need an email)
5. Click **Share**

---

## Step 8: Set Up the Sheet Tabs

Your Google Sheet needs 4 tabs. Let me create them for you:

### Tab 1: Transactions
1. Rename "Sheet1" to **Transactions**
2. Add these headers in row 1:
   - A1: `ID`
   - B1: `Date`
   - C1: `User`
   - D1: `Category`
   - E1: `Amount`
   - F1: `Merchant`
   - G1: `Note`
   - H1: `Source`
   - I1: `Confirmed`

### Tab 2: Monthly Budgets
1. Click the **+** at the bottom to add a new sheet
2. Rename it to **Monthly Budgets**
3. Add these headers in row 1:
   - A1: `Month`
   - B1: `Category`
   - C1: `Budget Amount`
4. Add the current month's budgets (starting in row 2):
   - A2: `2026-02` | B2: `groceries` | C2: `2500`
   - A3: `2026-02` | B3: `transport` | C3: `1500`
   - A4: `2026-02` | B4: `dining` | C4: `2000`
   - A5: `2026-02` | B5: `entertainment` | C5: `800`
   - A6: `2026-02` | B6: `utilities` | C6: `1200`
   - A7: `2026-02` | B7: `housing` | C7: `8000`
   - A8: `2026-02` | B8: `shopping` | C8: `1000`
   - A9: `2026-02` | B9: `health` | C9: `500`
   - A10: `2026-02` | B10: `savings` | C10: `8000`
   - A11: `2026-02` | B11: `other` | C11: `500`

### Tab 3: Savings Goal
1. Add another new sheet
2. Rename it to **Savings Goal**
3. Add these headers in row 1:
   - A1: `Goal Name`
   - B1: `Target Amount`
   - C1: `Current Savings`
   - D1: `Monthly Contribution`
   - E1: `Target Date`
4. Add placeholder data in row 2:
   - A2: `House Deposit`
   - B2: `500000`
   - C2: `0`
   - D2: `8000`
   - E2: `2031-06-01`

### Tab 4: Categories
1. Add another new sheet
2. Rename it to **Categories**
3. Add these headers in row 1:
   - A1: `Category ID`
   - B1: `Display Name`
   - C1: `Icon`
   - D1: `Color`
   - E1: `Keywords`
4. Add all categories (starting in row 2):
   - A2: `groceries` | B2: `Groceries` | C2: `🛒` | D2: `#7CB87A` | E2: `woolworths,checkers,pick n pay,spar,food`
   - A3: `transport` | B3: `Transport` | C3: `🚗` | D3: `#4A90E2` | E3: `petrol,fuel,uber,bolt,taxi,parking`
   - A4: `dining` | B4: `Dining Out` | C4: `🍽️` | D4: `#C47FD4` | E4: `restaurant,takeaway,uber eats,mr d`
   - A5: `entertainment` | B5: `Entertainment` | C5: `🎬` | D5: `#F5A623` | E5: `movies,netflix,spotify,games,cinema`
   - A6: `utilities` | B6: `Utilities` | C6: `💡` | D6: `#50E3C2` | E6: `electricity,water,internet,phone`
   - A7: `housing` | B7: `Housing` | C7: `🏠` | D7: `#D0021B` | E7: `rent,bond,rates,insurance`
   - A8: `shopping` | B8: `Shopping` | C8: `🛍️` | D8: `#BD10E0` | E8: `clothing,amazon,takealot,online`
   - A9: `health` | B9: `Health` | C9: `🏥` | D9: `#7ED321` | E9: `pharmacy,doctor,gym,medical`
   - A10: `savings` | B10: `Savings` | C10: `💰` | D10: `#417505` | E10: `deposit,investment,save`
   - A11: `other` | B11: `Other` | C11: `📦` | D11: `#9013FE` | E11: `misc,other`

---

## Step 9: Add Credentials to Backend .env File

1. Navigate to `/Users/dean/Documents/GitHub/our_two_cents/backend/`
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` in a text editor
4. Fill in these values:
   - `GOOGLE_SHEET_ID=` (paste the Sheet ID from Step 6)
   - `GOOGLE_CLIENT_EMAIL=` (paste the client_email from Step 5)
   - `GOOGLE_PRIVATE_KEY=` (paste the entire private_key from Step 5, keep the quotes)

**Example:**
```
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
GOOGLE_CLIENT_EMAIL=our-two-cents-bot@our-two-cents-xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## Step 10: Test the Connection

Once you've set up the backend (next step), you can test if the Google Sheets connection works by running:

```bash
cd backend
npm install
npm run dev
```

The server should start without errors. If you see errors about Google Sheets authentication, double-check:
1. The service account email is correct
2. The private key is copied correctly (including all `\n` characters)
3. The Sheet ID is correct
4. The sheet is shared with the service account email

---

## Troubleshooting

**Error: "The caller does not have permission"**
- Make sure you shared the Google Sheet with the service account email
- Check that the permission is set to "Editor"

**Error: "Invalid JWT"**
- The private key is malformed
- Make sure you copied the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure the `\n` characters are preserved

**Error: "Requested entity was not found"**
- The Sheet ID is incorrect
- Double-check the ID from the URL

---

## Security Notes

- **Never commit the JSON key file to Git**
- **Never commit the .env file to Git** (it's in .gitignore)
- Keep the JSON key file in a safe place (you might need it again)
- If the key is ever compromised, delete it in Google Cloud Console and create a new one

---

**You're done! The Google Sheets backend is ready.** 🎉

Next step: Set up the backend server and test the connection.
