class ParserService {
  parseMessage(text, categories) {
    const cleanText = text.trim().toLowerCase();
    const normalizedText = this.stripCommandPrefix(cleanText);

    const amount = this.extractAmount(normalizedText);
    const category = this.extractCategory(normalizedText, categories);
    const categoryInfo = category ? categories.find(c => c.categoryId === category) || null : null;
    const merchant = this.extractMerchant(normalizedText, amount, categoryInfo);

    return {
      amount,
      category,
      merchant,
      isValid: amount !== null && category !== null,
    };
  }

  stripCommandPrefix(text) {
    return text.replace(/^save\s+spend\b[:\-–—]?\s*/i, '').trim();
  }

  extractAmount(text) {
    const patterns = [
      /r\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rand|zar)?/i,
      /(\d+(?:\.\d{2})?)/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amountStr = match[1].replace(/,/g, '');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }

    return null;
  }

  extractCategory(text, categories) {
    for (const category of categories) {
      if (text.includes(category.categoryId.toLowerCase())) {
        return category.categoryId;
      }

      if (text.includes(category.displayName.toLowerCase())) {
        return category.categoryId;
      }

      for (const keyword of category.keywords) {
        if (text.includes(keyword)) {
          return category.categoryId;
        }
      }
    }

    return null;
  }

  extractMerchant(text, amount, categoryInfo) {
    let cleanText = text;

    if (amount !== null) {
      cleanText = cleanText.replace(/r\s*\d+(?:,\d{3})*(?:\.\d{2})?/gi, '');
      cleanText = cleanText.replace(/\d+(?:,\d{3})*(?:\.\d{2})?/g, '');
    }

    if (categoryInfo) {
      if (categoryInfo.categoryId) {
        cleanText = cleanText.replace(
          new RegExp(`\\b${this.escapeRegExp(categoryInfo.categoryId)}\\b`, 'gi'),
          ''
        );
      }

      if (categoryInfo.displayName) {
        cleanText = cleanText.replace(
          new RegExp(`\\b${this.escapeRegExp(categoryInfo.displayName)}\\b`, 'gi'),
          ''
        );
      }
    }

    cleanText = cleanText.replace(/\b(rand|zar)\b/gi, '');

    cleanText = cleanText.replace(/^\s*(at|from|to|for|on)\s+/i, '');
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    return cleanText || null;
  }

  escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  detectBankNotification(text) {
    const patterns = [
      /r\s*\d+(?:\.\d{2})?\s+(?:spent at|debited|debit)/i,
      /(?:spent at|debited|debit).*r\s*\d+/i,
      /transaction.*r\s*\d+/i,
    ];

    return patterns.some(pattern => pattern.test(text));
  }

  parseBankNotification(text) {
    const amount = this.extractAmount(text);

    const merchantPatterns = [
      /spent at\s+(.+?)(?:\s*$|\s*\|)/i,
      /debited\s*[-—]\s*(.+?)(?:\s*$|\s*\|)/i,
      /\|\s*(.+?)(?:\s*$)/i,
    ];

    let merchant = null;
    for (const pattern of merchantPatterns) {
      const match = text.match(pattern);
      if (match) {
        merchant = match[1].trim();
        break;
      }
    }

    return {
      amount,
      merchant,
      isValid: amount !== null && merchant !== null,
    };
  }
}

module.exports = new ParserService();
