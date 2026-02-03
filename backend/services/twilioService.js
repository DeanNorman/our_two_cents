const twilio = require('twilio');
const config = require('../config');

class TwilioService {
  constructor() {
    this.client = twilio(config.twilio.accountSid, config.twilio.authToken);
    this.whatsappNumber = config.twilio.whatsappNumber;
  }

  async sendWhatsAppMessage(to, message) {
    try {
      const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
      
      const result = await this.client.messages.create({
        from: this.whatsappNumber,
        to: formattedTo,
        body: message,
      });

      console.log(`Message sent to ${to}: ${result.sid}`);
      return result;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  formatBudgetReply(transaction, budgetStatus, categoryInfo) {
    const { amount, category, merchant, user } = transaction;
    
    // Phase 1: Simple response without budget info or warnings
    const icon = categoryInfo?.icon || '💰';
    const displayName = categoryInfo?.displayName || category;

    let message = `✅ Logged: R${amount.toFixed(2)} — ${displayName}`;
    
    if (merchant) {
      message += ` (${merchant})`;
    }
    
    // Check if we have a streak and add it (will implement streak tracking later)
    if (transaction.streak && transaction.streak > 1) {
      message += `\n\nYou're on a ${transaction.streak}-day tracking streak! 🔥`;
    }
    
    return message;
  }

  formatHelpMessage() {
    return `👋 Hi! Here's how to log a spend:

💬 Just type: [category] [amount] [merchant (optional)]

Examples:
• groceries 350
• petrol 450 shell
• dining 120 italian place
• entertainment 200 netflix

📋 Available commands:
• help — Show this message
• categories — List all categories
• balance — Show all budgets
• goal — Show savings goal
• undo — Delete last transaction

Need the category list? Type "categories"`;
  }

  formatCategoriesList(categories) {
    let message = '📋 Available Categories:\n\n';
    
    categories.forEach(cat => {
      message += `${cat.icon} ${cat.displayName} — "${cat.categoryId}"\n`;
    });

    message += '\n💡 Tip: You can use the category ID or display name when logging spends.';
    
    return message;
  }

  formatBalanceMessage(statuses) {
    let message = '💰 Budget Status:\n\n';

    statuses.forEach(status => {
      const { icon, displayName, totalSpent, budgetAmount, remaining, percentUsed } = status;
      const bar = this.getProgressBar(percentUsed);
      
      message += `${icon} ${displayName}\n`;
      message += `${bar} ${percentUsed}%\n`;
      message += `R${totalSpent.toFixed(0)} / R${budgetAmount.toFixed(0)} (R${remaining.toFixed(0)} left)\n\n`;
    });

    return message;
  }

  formatGoalMessage(goal) {
    if (!goal) {
      return '🏠 No savings goal set yet.';
    }

    const { goalName, targetAmount, currentSavings, monthlyContribution } = goal;
    const percentComplete = (currentSavings / targetAmount) * 100;
    const remaining = targetAmount - currentSavings;
    const monthsToGo = Math.ceil(remaining / monthlyContribution);

    let message = `🏠 ${goalName}\n\n`;
    message += `Target: R${targetAmount.toLocaleString()}\n`;
    message += `Current: R${currentSavings.toLocaleString()}\n`;
    message += `Progress: ${percentComplete.toFixed(1)}%\n\n`;
    message += `💰 R${remaining.toLocaleString()} to go\n`;
    message += `📅 ~${monthsToGo} months at R${monthlyContribution.toLocaleString()}/month`;

    return message;
  }

  getProgressBar(percent) {
    const filled = Math.round(percent / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

module.exports = new TwilioService();
