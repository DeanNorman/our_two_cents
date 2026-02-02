require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  
  googleSheets: {
    sheetId: process.env.GOOGLE_SHEET_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER,
  },
  
  users: {
    userA: {
      phone: process.env.USER_A_PHONE,
      name: process.env.USER_A_NAME || 'User A',
    },
    userB: {
      phone: process.env.USER_B_PHONE,
      name: process.env.USER_B_NAME || 'User B',
    },
  },
  
  dashboard: {
    token: process.env.DASHBOARD_TOKEN,
  },
};
