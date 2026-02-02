const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
  googleSheets: {
    sheetId: process.env.GOOGLE_SHEET_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
};

const SHEET_ID = process.argv[2] || config.googleSheets.sheetId;

if (!SHEET_ID) {
  console.error('Please provide a Sheet ID as an argument or in .env');
  process.exit(1);
}

console.log(`Setting up Sheet ID: ${SHEET_ID}`);

if (!config.googleSheets.clientEmail || !config.googleSheets.privateKey) {
  console.error('Missing Google Cloud credentials in .env');
  console.log('CLIENT_EMAIL:', config.googleSheets.clientEmail ? 'Found' : 'Missing');
  console.log('PRIVATE_KEY:', config.googleSheets.privateKey ? 'Found' : 'Missing');
  process.exit(1);
}

const auth = new google.auth.JWT(
  config.googleSheets.clientEmail,
  null,
  config.googleSheets.privateKey,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

async function setup() {
  try {
    console.log('Authenticating...');
    const doc = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const currentSheets = doc.data.sheets;
    
    const requests = [];
    const findSheet = (title) => currentSheets.find(s => s.properties.title === title);
    
    // Tab 1: Transactions
    let transactionsSheet = findSheet('Transactions');
    if (!transactionsSheet) {
      const sheet1 = findSheet('Sheet1');
      if (sheet1) {
        requests.push({
          updateSheetProperties: {
            properties: { sheetId: sheet1.properties.sheetId, title: 'Transactions' },
            fields: 'title'
          }
        });
      } else {
        requests.push({ addSheet: { properties: { title: 'Transactions' } } });
      }
    }

    if (!findSheet('Monthly Budgets')) requests.push({ addSheet: { properties: { title: 'Monthly Budgets' } } });
    if (!findSheet('Savings Goal')) requests.push({ addSheet: { properties: { title: 'Savings Goal' } } });
    if (!findSheet('Categories')) requests.push({ addSheet: { properties: { title: 'Categories' } } });

    if (requests.length > 0) {
      console.log('Updating structure...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: { requests }
      });
    }

    console.log('Populating data...');
    const data = [
      {
        range: 'Transactions!A1:I1',
        values: [['ID', 'Date', 'User', 'Category', 'Amount', 'Merchant', 'Note', 'Source', 'Confirmed']]
      },
      {
        range: 'Monthly Budgets!A1:C11',
        values: [
          ['Month', 'Category', 'Budget Amount'],
          ['2026-02', 'groceries', 2500],
          ['2026-02', 'transport', 1500],
          ['2026-02', 'dining', 2000],
          ['2026-02', 'entertainment', 800],
          ['2026-02', 'utilities', 1200],
          ['2026-02', 'housing', 8000],
          ['2026-02', 'shopping', 1000],
          ['2026-02', 'health', 500],
          ['2026-02', 'savings', 8000],
          ['2026-02', 'other', 500]
        ]
      },
      {
        range: 'Savings Goal!A1:E2',
        values: [
          ['Goal Name', 'Target Amount', 'Current Savings', 'Monthly Contribution', 'Target Date'],
          ['House Deposit', 500000, 0, 8000, '2031-06-01']
        ]
      },
      {
        range: 'Categories!A1:E11',
        values: [
          ['Category ID', 'Display Name', 'Icon', 'Color', 'Keywords'],
          ['groceries', 'Groceries', '🛒', '#7CB87A', 'woolworths,checkers,pick n pay,spar,food'],
          ['transport', 'Transport', '🚗', '#4A90E2', 'petrol,fuel,uber,bolt,taxi,parking'],
          ['dining', 'Dining Out', '🍽️', '#C47FD4', 'restaurant,takeaway,uber eats,mr d'],
          ['entertainment', 'Entertainment', '🎬', '#F5A623', 'movies,netflix,spotify,games,cinema'],
          ['utilities', 'Utilities', '💡', '#50E3C2', 'electricity,water,internet,phone'],
          ['housing', 'Housing', '🏠', '#D0021B', 'rent,bond,rates,insurance'],
          ['shopping', 'Shopping', '🛍️', '#BD10E0', 'clothing,amazon,takealot,online'],
          ['health', 'Health', '🏥', '#7ED321', 'pharmacy,doctor,gym,medical'],
          ['savings', 'Savings', '💰', '#417505', 'deposit,investment,save'],
          ['other', 'Other', '📦', '#9013FE', 'misc,other']
        ]
      }
    ];

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: { valueInputOption: 'USER_ENTERED', data }
    });

    console.log('Setup complete! 🎉');
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) console.error(error.response.data);
  }
}

setup();