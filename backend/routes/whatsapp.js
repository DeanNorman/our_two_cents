const express = require('express');
const router = express.Router();
const sheetsService = require('../services/sheetsService');
const parserService = require('../services/parserService');
const budgetService = require('../services/budgetService');
const twilioService = require('../services/twilioService');
const config = require('../config');

const currentPhase = config.phase || 1;

router.post('/whatsapp', async (req, res) => {
  try {
    const { Body, From } = req.body;
    const messageText = Body?.trim() || '';
    const fromNumber = From?.replace('whatsapp:', '') || '';

    console.log(`Received message from ${fromNumber}: ${messageText}`);

    const userName = getUserName(fromNumber);
    if (!userName) {
      console.log(`Unknown user: ${fromNumber}`);
      return res.status(200).send('OK');
    }

    const command = messageText.toLowerCase().trim();

    if (command === 'help') {
      const helpMessage = twilioService.formatHelpMessage();
      await twilioService.sendWhatsAppMessage(fromNumber, helpMessage);
      return res.status(200).send('OK');
    }

    if (command === 'categories') {
      const categories = await sheetsService.getCategories();
      const categoriesMessage = twilioService.formatCategoriesList(categories);
      await twilioService.sendWhatsAppMessage(fromNumber, categoriesMessage);
      return res.status(200).send('OK');
    }

    if (command === 'balance') {
      if (currentPhase < 3) {
        await twilioService.sendWhatsAppMessage(fromNumber, '📊 Balance tracking unlocks in Phase 3.\nFor now, just keep logging — you\'re building great habits!');
        return res.status(200).send('OK');
      }
      const currentMonth = budgetService.getCurrentMonth();
      const statuses = await budgetService.getAllCategoryStatuses(currentMonth);
      const balanceMessage = twilioService.formatBalanceMessage(statuses);
      await twilioService.sendWhatsAppMessage(fromNumber, balanceMessage);
      return res.status(200).send('OK');
    }

    if (command === 'goal') {
      const goal = await sheetsService.getSavingsGoal();
      const goalMessage = twilioService.formatGoalMessage(goal);
      await twilioService.sendWhatsAppMessage(fromNumber, goalMessage);
      return res.status(200).send('OK');
    }

    if (command === 'undo') {
      const lastTransaction = await sheetsService.getLastTransactionByUser(userName);
      if (!lastTransaction) {
        await twilioService.sendWhatsAppMessage(fromNumber, '❌ No transactions found to undo.');
        return res.status(200).send('OK');
      }

      await sheetsService.deleteTransaction(lastTransaction.id);
      const undoMessage = `✅ Deleted: R${lastTransaction.amount.toFixed(2)} — ${lastTransaction.category}`;
      await twilioService.sendWhatsAppMessage(fromNumber, undoMessage);
      return res.status(200).send('OK');
    }

    const categories = await sheetsService.getCategories();
    const parsed = parserService.parseMessage(messageText, categories);

    if (!parsed.isValid) {
      const errorMessage = `❌ I didn't understand that.\n\n${twilioService.formatHelpMessage()}`;
      await twilioService.sendWhatsAppMessage(fromNumber, errorMessage);
      return res.status(200).send('OK');
    }

    const transaction = {
      date: new Date().toISOString().split('T')[0],
      user: userName,
      category: parsed.category,
      amount: parsed.amount,
      merchant: parsed.merchant,
      note: '',
      source: 'bot',
      confirmed: true,
    };

    const created = await sheetsService.addTransaction(transaction);
    const categoryInfo = categories.find(c => c.id === parsed.category);

    let replyMessage;
    if (currentPhase >= 3) {
      const currentMonth = budgetService.getCurrentMonth();
      const budgetStatus = await budgetService.calculateBudgetStatus(parsed.category, currentMonth);
      replyMessage = twilioService.formatBudgetReply({ ...transaction, streak: created.streak }, budgetStatus, categoryInfo);
    } else {
      replyMessage = twilioService.formatSimpleReply({ ...transaction, streak: created.streak }, categoryInfo);
    }
    await twilioService.sendWhatsAppMessage(fromNumber, replyMessage);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    res.status(500).send('Error processing message');
  }
});

function getUserName(phoneNumber) {
  const cleanNumber = phoneNumber.replace(/\s+/g, '');
  
  if (cleanNumber === config.users.userA.phone.replace(/\s+/g, '')) {
    return config.users.userA.name;
  }
  
  if (cleanNumber === config.users.userB.phone.replace(/\s+/g, '')) {
    return config.users.userB.name;
  }
  
  return null;
}

module.exports = router;
