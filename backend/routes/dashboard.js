const express = require('express');
const router = express.Router();
const sheetsService = require('../services/sheetsService');
const budgetService = require('../services/budgetService');

router.get('/overview', async (req, res) => {
  try {
    const currentMonth = budgetService.getCurrentMonth();
    const overview = await budgetService.getMonthlyOverview(currentMonth);
    const transactions = await sheetsService.getTransactions(currentMonth);
    const goal = await sheetsService.getSavingsGoal();

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    let goalData = null;
    if (goal) {
      const percentComplete = (goal.currentSavings / goal.targetAmount) * 100;
      const remaining = goal.targetAmount - goal.currentSavings;
      const monthsToGo = goal.monthlyContribution > 0 
        ? Math.ceil(remaining / goal.monthlyContribution) 
        : null;

      goalData = {
        ...goal,
        percentComplete: Math.round(percentComplete * 10) / 10,
        remaining,
        monthsToGo,
      };
    }

    res.json({
      month: currentMonth,
      totalSpent: overview.totalSpent,
      totalBudget: overview.totalBudget,
      percentUsed: overview.percentUsed,
      categories: overview.categories,
      recentTransactions,
      savingsGoal: goalData,
    });
  } catch (error) {
    console.error('Error getting overview:', error);
    res.status(500).json({ error: 'Failed to get overview' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await sheetsService.getCategories();
    res.json(
      categories.map((category) => ({
        id: category.categoryId,
        name: category.categoryId,
        displayName: category.displayName,
        icon: category.icon,
        color: category.color,
      }))
    );
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const currentMonth = budgetService.getCurrentMonth();
    const transactions = await sheetsService.getTransactions(currentMonth);
    const sorted = transactions
      .slice()
      .sort((a, b) => (b.id || 0) - (a.id || 0));
    res.json(sorted);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

router.get('/transactions/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const currentMonth = budgetService.getCurrentMonth();
    const transactions = await sheetsService.getTransactions(currentMonth);
    const filtered = transactions
      .filter(t => t.category === category)
      .slice()
      .sort((a, b) => (b.id || 0) - (a.id || 0));
    res.json(filtered);
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

router.get('/goal', async (req, res) => {
  try {
    const goal = await sheetsService.getSavingsGoal();
    
    if (!goal) {
      return res.json(null);
    }

    const percentComplete = (goal.currentSavings / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentSavings;
    const monthsToGo = goal.monthlyContribution > 0 
      ? Math.ceil(remaining / goal.monthlyContribution) 
      : null;

    res.json({
      ...goal,
      percentComplete: Math.round(percentComplete * 10) / 10,
      remaining,
      monthsToGo,
    });
  } catch (error) {
    console.error('Error getting goal:', error);
    res.status(500).json({ error: 'Failed to get goal' });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { user, category, amount, merchant, note } = req.body;

    if (!user || !category || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parsedAmount = parseFloat(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const transaction = {
      date: new Date().toISOString().split('T')[0],
      user,
      category,
      amount: parsedAmount,
      merchant: merchant || '',
      note: note || '',
      source: 'manual',
      confirmed: true,
    };

    const created = await sheetsService.addTransaction(transaction);
    res.json(created);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

router.delete('/transactions/last/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const lastTransaction = await sheetsService.getLastTransactionByUser(user);

    if (!lastTransaction) {
      return res.status(404).json({ error: 'No transactions found' });
    }

    await sheetsService.deleteTransaction(lastTransaction.id);
    res.json({ message: 'Transaction deleted', transaction: lastTransaction });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
