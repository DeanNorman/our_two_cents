const { google } = require('googleapis');
const config = require('../config');

class SheetsService {
  constructor() {
    this.auth = new google.auth.JWT(
      config.googleSheets.clientEmail,
      null,
      config.googleSheets.privateKey,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.sheetId = config.googleSheets.sheetId;
  }

  async getCategories() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Categories!A2:E',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        categoryId: row[0],
        displayName: row[1],
        icon: row[2],
        color: row[3],
        keywords: row[4] ? row[4].split(',').map(k => k.trim().toLowerCase()) : [],
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getTransactions(month) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Transactions!A2:I',
      });

      const rows = response.data.values || [];
      const transactions = rows
        .map((row, index) => ({
          id: row[0] !== undefined && row[0] !== '' ? parseInt(row[0]) : index + 1,
          date: row[1],
          user: row[2],
          category: row[3],
          amount: row[4] !== undefined && row[4] !== '' ? parseFloat(row[4]) : NaN,
          merchant: row[5] || '',
          note: row[6] || '',
          source: row[7] || 'manual',
          confirmed: row[8] === 'TRUE' || row[8] === true,
        }))
        .filter((t) =>
          t.date &&
          t.user &&
          t.category &&
          Number.isFinite(t.amount) &&
          t.amount > 0
        );

      if (month) {
        return transactions.filter(t => t.date && t.date.startsWith(month));
      }

      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async addTransaction(transaction) {
    try {
      const existingTransactions = await this.getTransactions();
      const nextId = this.getNextTransactionId(existingTransactions);
      const streak = await this.calculateUserStreak(
        transaction.user,
        transaction.date,
        existingTransactions
      );
      
      const row = [
        nextId,
        transaction.date,
        transaction.user,
        transaction.category,
        transaction.amount,
        transaction.merchant || '',
        transaction.note || '',
        transaction.source || 'bot',
        transaction.confirmed !== false ? 'TRUE' : 'FALSE',
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'Transactions!A:I',
        valueInputOption: 'RAW',
        resource: {
          values: [row],
        },
      });

      return {
        id: nextId,
        ...transaction,
        streak,
        confirmed: transaction.confirmed !== false,
      };
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }
  
  getNextTransactionId(transactions) {
    const maxId = transactions.reduce((max, t) => (t.id > max ? t.id : max), 0);
    return maxId + 1;
  }

  async calculateUserStreak(userName, transactionDate, transactions) {
    try {
      const allTransactions = transactions || (await this.getTransactions());
      const newDate = this.normalizeDate(transactionDate);

      if (!newDate) {
        return 1;
      }

      const dateSet = new Set(
        allTransactions
          .filter(t => t.user === userName)
          .map(t => this.normalizeDate(t.date))
          .filter(Boolean)
      );

      dateSet.add(newDate);

      let streak = 1;
      let cursor = this.parseDateUtc(newDate);

      while (true) {
        const prev = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
        const prevStr = this.formatDateUtc(prev);

        if (!dateSet.has(prevStr)) {
          break;
        }

        streak += 1;
        cursor = prev;
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 1; // Default to 1 on error
    }
  }

  normalizeDate(dateValue) {
    if (!dateValue || typeof dateValue !== 'string') {
      return null;
    }

    const match = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  }

  parseDateUtc(yyyyMmDd) {
    const [year, month, day] = yyyyMmDd.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  formatDateUtc(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getMonthlyBudgets(month) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Monthly Budgets!A2:C',
      });

      const rows = response.data.values || [];
      const budgets = rows
        .filter(row => row[0] === month)
        .map(row => ({
          month: row[0],
          category: row[1],
          budgetAmount: parseFloat(row[2]) || 0,
        }));

      return budgets;
    } catch (error) {
      console.error('Error fetching monthly budgets:', error);
      throw error;
    }
  }

  async getSavingsGoal() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Savings Goal!A2:E2',
      });

      const row = response.data.values?.[0] || [];
      if (row.length === 0) {
        return null;
      }

      return {
        goalName: row[0] || 'Savings Goal',
        targetAmount: parseFloat(row[1]) || 0,
        currentSavings: parseFloat(row[2]) || 0,
        monthlyContribution: parseFloat(row[3]) || 0,
        targetDate: row[4] || null,
      };
    } catch (error) {
      console.error('Error fetching savings goal:', error);
      return null;
    }
  }

  async getLastTransactionByUser(userName) {
    try {
      const transactions = await this.getTransactions();
      const userTransactions = transactions.filter(t => t.user === userName);
      
      if (userTransactions.length === 0) {
        return null;
      }

      return userTransactions.reduce((latest, current) =>
        current.id > latest.id ? current : latest
      , userTransactions[0]);
    } catch (error) {
      console.error('Error fetching last transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(transactionId) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Transactions!A2:A',
      });

      const ids = response.data.values || [];
      const rowIndex = ids.findIndex(row => parseInt(row[0]) === transactionId);

      if (rowIndex === -1) {
        throw new Error('Transaction not found');
      }

      const actualRowNumber = rowIndex + 2;

      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.sheetId,
        range: `Transactions!A${actualRowNumber}:I${actualRowNumber}`,
      });

      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
}

module.exports = new SheetsService();
