const sheetsService = require('./sheetsService');

class BudgetService {
  async calculateBudgetStatus(category, month) {
    try {
      const transactions = await sheetsService.getTransactions(month);
      const budgets = await sheetsService.getMonthlyBudgets(month);

      const categoryTransactions = transactions.filter(t => t.category === category);
      const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

      const budget = budgets.find(b => b.category === category);
      const budgetAmount = budget ? budget.budgetAmount : 0;

      const remaining = budgetAmount - totalSpent;
      const percentUsed = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;

      const daysLeftInMonth = this.getDaysLeftInMonth();
      const warningLevel = this.getWarningLevel(percentUsed, totalSpent, budgetAmount);

      return {
        category,
        totalSpent,
        budgetAmount,
        remaining,
        percentUsed: Math.round(percentUsed),
        daysLeftInMonth,
        warningLevel,
      };
    } catch (error) {
      console.error('Error calculating budget status:', error);
      throw error;
    }
  }

  async getAllCategoryStatuses(month) {
    try {
      const categories = await sheetsService.getCategories();
      const statuses = [];

      for (const category of categories) {
        const status = await this.calculateBudgetStatus(category.categoryId, month);
        statuses.push({
          ...status,
          displayName: category.displayName,
          icon: category.icon,
          color: category.color,
        });
      }

      return statuses;
    } catch (error) {
      console.error('Error getting all category statuses:', error);
      throw error;
    }
  }

  async getMonthlyOverview(month) {
    try {
      const statuses = await this.getAllCategoryStatuses(month);

      const totalSpent = statuses.reduce((sum, s) => sum + s.totalSpent, 0);
      const totalBudget = statuses.reduce((sum, s) => sum + s.budgetAmount, 0);
      const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      return {
        month,
        totalSpent,
        totalBudget,
        percentUsed: Math.round(percentUsed),
        categories: statuses,
      };
    } catch (error) {
      console.error('Error getting monthly overview:', error);
      throw error;
    }
  }

  getWarningLevel(percentUsed, totalSpent, budgetAmount) {
    if (totalSpent > budgetAmount) {
      return 'over';
    } else if (percentUsed >= 100) {
      return 'red';
    } else if (percentUsed >= 90) {
      return 'orange';
    } else if (percentUsed >= 80) {
      return 'yellow';
    } else if (percentUsed >= 60) {
      return 'gentle';
    }
    return 'none';
  }

  getDaysLeftInMonth() {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = lastDay.getDate() - now.getDate();
    return Math.max(0, daysLeft);
  }

  getCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}

module.exports = new BudgetService();
