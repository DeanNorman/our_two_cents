# Phase 1 PRD: Discovery Mode
## "Just Track, Don't Judge" (Weeks 1-4)

---

## 📋 Document Overview

**Phase:** 1 of 4  
**Duration:** 4 weeks (can extend to 8 weeks if needed)  
**Version:** 1.0  
**Last Updated:** February 2, 2026  
**Status:** Ready for Implementation

---

## 🎯 Phase Goal

**Primary Objective:** Discover your financial baseline by tracking all spending without judgment or restriction.

**The Transformation:**
- **Before:** "We don't know where our money goes"
- **After:** "We know exactly what we spend and where"

**Success Criteria:**
- 80%+ of purchases logged via WhatsApp
- Both users comfortable with tracking system
- Completed First Money Discovery Session
- Know total monthly income and spending
- Identified top 3-5 spending categories
- Zero money-related arguments

---

## 👥 User Context

### Dean's Starting Point
- **Feeling:** "I'm in the dark about our finances"
- **Behavior:** Has allowance system, asks Abigail before big purchases
- **Pain:** Feels guilty when spending, like asking parent for permission
- **Desire:** To be an informed partner, not dependent

### Abigail's Starting Point
- **Feeling:** "I'm managing everything alone and don't actually know the numbers"
- **Behavior:** Says yes/no to Dean's requests based on gut feeling
- **Pain:** 100% mental load, guessing and hoping it works out
- **Desire:** To share the burden, have actual data

### What They Both Know Now
✅ Can afford their lifestyle (bills get paid)  
✅ Dean has allowance that provides accountability  
✅ Both committed to not arguing about money

### What They DON'T Know
❓ Total monthly income (combined)  
❓ Total monthly spending  
❓ Spending by category  
❓ What's "normal" vs "a lot"  
❓ How much is left after fixed costs  
❓ Whether they're saving anything

---

## 🚫 What We're NOT Doing in Phase 1

This is critical - Phase 1 is about **observation only**:

❌ Setting budgets or spending limits  
❌ Judging spending behavior  
❌ Trying to reduce spending  
❌ Perfect categorization (that's Phase 2)  
❌ Daily dashboard checks  
❌ Feeling guilty about purchases  
❌ Making any changes to spending habits

**Why?** You can't manage what you don't measure. First, measure. Then understand. Then manage.

---

## ✅ What We ARE Doing in Phase 1

### Daily Actions (30 seconds per purchase)
**Every time either person buys something:**

1. Open WhatsApp
2. Message bot: `"85 dining nandos"`
3. Bot confirms
4. Done. Carry on with life.

**Rules:**
- Don't overthink the category - pick closest one
- Log within 24 hours while you remember
- If unsure between categories, just pick one
- Dean: Log everything, even from allowance
- Abigail: Log everything, including bills

### Weekly Actions (15 minutes - Sunday evening)
**"The Weekly Recon"**

This is couple time with finances, not homework.

**Dean's job:**
- Look at Recent Transactions list
- Point out your purchases: "Oh yeah, that was books"
- Ask questions: "What was that R450 thing?"
- Get familiar with seeing money move

**Abigail's job:**
- Answer Dean's questions
- Point out your purchases
- Verify transactions showing correctly

**Both of you:**
- Don't judge each other
- Don't judge yourselves
- This is data collection, not a report card
- Notice patterns: "Huh, we bought groceries 3 times this week"
- No action needed, just observation

**DO NOT:**
- Calculate totals (dashboard does this)
- Decide to "spend less next week"
- Feel bad about anything
- Argue about purchases
- Set goals

**Close laptop after 15 minutes whether done or not.**

### Monthly Actions (45 minutes - End of Month 1)
**"The First Money Discovery Session"**

This is where the magic happens. For the first time ever, you'll know your real numbers.

#### Part 1: Income Discovery (10 min)
```
Dean's salary (after tax):     R_______
Abigail's salary (after tax):  R_______
Other income:                  R_______

TOTAL MONTHLY INCOME:          R_______
```

Write this LARGE on paper. You've never calculated this together before.

#### Part 2: Spending Discovery (15 min)
```
Total Spent (from dashboard):  R_______
```

Write this LARGE on the same paper.

#### Part 3: Reality Check (10 min)
```
Money In - Money Out = R_______
```

**If positive (spent less than earned):**
- Celebrate! You're saving!
- Where did this money go? Sitting in savings? Or just in account?

**If negative (spent more than earned):**
- Don't panic
- Was this a weird month? (Big once-off expense?)
- Or is this normal? (Critical to know)

**If close to zero:**
- You're spending everything you earn
- Not bad, but no buffer for emergencies
- Very common

#### Part 4: Category Curiosity (10 min)

Look at your 8 categories. Which are biggest?

Example:
```
1. Home & Bills:    R12,000 (biggest)
2. Groceries:       R4,500
3. Dining Out:      R2,800
4. Transport:       R2,200
5. Entertainment:   R1,500
6. Shopping:        R800
7. Other:           R400

Total:              R24,200
```

**Questions to discuss:**
- "Whoa, we spend THAT much on dining out?"
- "Groceries seems lower than I thought"
- "I had no idea home costs were that much"

That's it. No judgment. No action plans. Just: **"Huh. Interesting. Now we know."**

#### Part 5: Decision Time (10 min)

**Do Phase 1 again if:**
- This month was weird (lots of once-offs)
- Only tracked 60% of purchases
- Numbers don't make sense yet
- Want more data before decisions

**Move to Phase 2 if:**
- Tracked 80%+ of purchases
- Numbers seem realistic
- Both comfortable with system
- Ready to understand categories better

**No wrong answer.** Recommended: at least 2 months of tracking before making decisions.

---

## 🛠️ Technical Requirements

### WhatsApp Bot - Phase 1 Specification

#### Must Have (Simple is Key)

**Accept these formats:**
```
"85 dining nandos"          → Logs R85 to Dining Out, merchant: Nandos
"85 dining"                 → Logs R85 to Dining Out, no merchant
"45 coffee"                 → Logs R45 to Dining Out (assume)
"1200 rent"                 → Logs R1200 to Home
```

**Confirmation message:**
```
✅ Logged R85 to Dining Out
```

**That's it.** Keep it stupid simple.

#### Must NOT Have

❌ Show budgets (don't have any yet)  
❌ Show warnings (no limits yet)  
❌ Show daily/monthly totals (reduces friction)  
❌ Require perfect category names  

**Why?** Every extra feature adds friction. Friction kills habits. Phase 1 is about building the habit.

#### Bot Flexibility Examples

```javascript
// Accept variations
"45 coffee"       → Dining Out
"45 dining vida"  → Dining Out
"45 groceries"    → Groceries
"1200 rent"       → Home
"food 85"         → Groceries (reverse order OK)
```

#### Error Handling

**If amount missing:**
```
❌ Please include amount: "85 dining nandos"
```

**If category unclear:**
```
❌ Category not recognized. Try: groceries, dining, transport, shopping, entertainment, home, bills, other
```

**If duplicate detected (same amount, category, time):**
```
⚠️ You just logged R85 to Dining Out 2 minutes ago. Is this a duplicate?
Reply ✓ to confirm or ✗ to cancel
```

### Dashboard - Phase 1 Specification

#### Must Have Views

**1. Recent Transactions (Primary View)**

```
┌─────────────────────────────────────────┐
│  Recent Transactions                    │
├─────────────────────────────────────────┤
│  Today                                  │
│  • Dean - Groceries - R245 - Woolworths│
│  • Abigail - Coffee - R65 - Vida       │
│                                         │
│  Yesterday                              │
│  • Dean - Petrol - R850 - Engen        │
│  • Abigail - Groceries - R180 - Spar   │
│                                         │
│  [Show More]                            │
└─────────────────────────────────────────┘
```

**Fields:**
- Date grouping (Today, Yesterday, 2 days ago, etc.)
- User initial (D or A)
- Category
- Amount
- Merchant (if provided)

**Interaction:**
- Click to edit/delete
- Simple list, no fancy formatting needed

**2. Category Totals (Simple Bar Chart)**

```
┌─────────────────────────────────────────┐
│  This Month's Spending                  │
├─────────────────────────────────────────┤
│  Groceries        ████████  R4,500      │
│  Dining Out       █████     R2,800      │
│  Transport        ████      R2,200      │
│  Entertainment    ██        R1,200      │
│  Shopping         █         R800        │
│  Home & Bills     ████████████ R12,000  │
│  Other            █         R400        │
├─────────────────────────────────────────┤
│  TOTAL                      R24,200     │
└─────────────────────────────────────────┘
```

**Show:**
- Category name
- Visual bar (proportional to amount)
- Total spent in that category
- Overall total at bottom

**Don't show:**
- Budgets (don't have them yet)
- "Remaining" amounts
- Warnings or colors (all neutral)

**3. Overall Summary (Top Card)**

```
┌─────────────────────────────────────────┐
│  February 2026                          │
├─────────────────────────────────────────┤
│  Total Spent This Month:  R24,200       │
│  Number of Transactions:  47            │
│  Days Tracked:            18 / 28       │
└─────────────────────────────────────────┘
```

**Purpose:** Quick overview, nothing more.

#### Must NOT Have (Yet)

❌ Budget progress bars  
❌ Warnings/alerts  
❌ Month-over-month comparisons (no prior month yet)  
❌ Savings goals display  
❌ Complex charts  
❌ Predictions or trends  
❌ Spending pace indicators  

**Why?** More features = more overwhelm. Phase 1 is about comfort with tracking, not analysis.

### Google Sheets - Phase 1 Structure

**Transactions Sheet:**
```
| Date       | User    | Category      | Amount | Merchant   | Source | Confirmed |
|------------|---------|---------------|--------|------------|--------|-----------|
| 2026-02-02 | Dean    | Groceries     | 245    | Woolworths | bot    | TRUE      |
| 2026-02-02 | Abigail | Dining Out    | 65     | Vida       | bot    | TRUE      |
| 2026-02-01 | Dean    | Transport     | 850    | Engen      | bot    | TRUE      |
```

**Categories Sheet:**
```
| Category      | Display Name  | Icon | Color   |
|---------------|---------------|------|---------|
| groceries     | Groceries     | 🛒   | #7CB87A |
| dining        | Dining Out    | 🍽️   | #C47FD4 |
| transport     | Transport     | 🚗   | #4A90E2 |
| shopping      | Shopping      | 🛍️   | #BD10E0 |
| entertainment | Entertainment | 🎬   | #F5A623 |
| home          | Home          | 🏠   | #D0021B |
| bills         | Bills         | 💡   | #50E3C2 |
| other         | Other         | 📦   | #9013FE |
```

**Users Sheet:**
```
| Name    | Phone          | Initial |
|---------|----------------|---------|
| Dean    | +27747046341   | D       |
| Abigail | +27848672310   | A       |
```

---

## 📊 Success Metrics

### Quantitative Metrics

**Tracking Consistency:**
- Target: 80% of purchases logged
- Measure: (Transactions logged / Estimated total transactions) × 100
- How to estimate: Compare bank statement to logged transactions

**Engagement:**
- Target: 3 out of 4 Weekly Recons completed
- Measure: Calendar check-ins

**System Reliability:**
- Target: 95% of WhatsApp messages successfully logged
- Measure: Bot success rate

### Qualitative Metrics

**Dean's Confidence:**
- Before: "I don't know what's happening" (1/10)
- Target: "I can see what we're spending" (5/10)
- Measure: Self-reported weekly

**Abigail's Burden:**
- Before: "I'm managing everything alone" (10/10 stress)
- Target: "Dean is tracking too, not just me" (7/10 stress)
- Measure: Self-reported weekly

**Relationship Health:**
- Target: Zero money-related arguments
- Measure: Weekly check-in question

### Phase 1 Completion Checklist

At end of Week 4, check these boxes:

**Tracking:**
- [ ] Tracked at least 80% of purchases via WhatsApp
- [ ] WhatsApp bot working reliably for both users
- [ ] Both users comfortable with logging process

**Engagement:**
- [ ] Completed 3 out of 4 Weekly Recons together
- [ ] Completed First Money Discovery Session
- [ ] Both users participating equally

**Knowledge:**
- [ ] Know combined monthly income
- [ ] Know total monthly spending
- [ ] Know top 3 spending categories
- [ ] Understand what's "fixed" vs "flexible"

**Emotional:**
- [ ] Dean feels MORE informed than before (not less)
- [ ] Abigail feels LESS alone than before (not more)
- [ ] Had zero fights about money
- [ ] Both feel system is sustainable

**Decision:**
- [ ] Decided whether to continue Phase 1 or move to Phase 2

**Scoring:**
- 8+ boxes: Move to Phase 2 ✅
- 5-7 boxes: Do one more month of Phase 1 🔄
- 0-4 boxes: Something's wrong, see troubleshooting 🚨

---

## 🎨 UX/UI Specifications

### Design Principles for Phase 1

**1. Minimal Cognitive Load**
- One primary action: "Log this purchase"
- One primary view: "See what we've spent"
- No decisions to make, no analysis required

**2. Positive Reinforcement**
- Celebrate tracking streaks
- No warnings or alerts
- Neutral colors (no red/yellow warnings)

**3. Couple-Focused Language**
- "We spent" not "You spent"
- "Our transactions" not "Your transactions"
- "Together" messaging throughout

### WhatsApp Bot UX

**Confirmation Message Design:**
```
✅ Logged R85 to Dining Out

You're on a 5-day tracking streak! 🔥
```

**Tone:**
- Friendly, not corporate
- Encouraging, not demanding
- Quick, not chatty

**Emoji Usage:**
- ✅ for success
- ❌ for errors
- 🔥 for streaks (optional, not pushy)

### Dashboard UX

**Color Palette (Phase 1 - Neutral):**
- Background: Cream (#FAF9F6)
- Text: Charcoal (#2C3E50)
- Cards: White (#FFFFFF)
- Accents: Warm Blue (#4A90E2)
- All category bars: Same neutral blue (no red/yellow yet)

**Typography:**
- Headers: Inter, 24px, Semibold
- Body: Inter, 16px, Regular
- Numbers: Inter, 24px, Bold (tabular figures)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Header: "Our Two Cents - February 2026"       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Summary Card (Centered, Prominent)             │
│  Total Spent: R24,200                           │
│  Transactions: 47                               │
│  Days Tracked: 18 / 28                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Category Breakdown (Simple Bars)               │
│  [All categories with neutral blue bars]        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Recent Transactions (Scrollable List)          │
│  [Last 20 transactions, grouped by date]        │
└─────────────────────────────────────────────────┘
```

**Mobile-First:**
- Stack all sections vertically
- Large touch targets (44px minimum)
- Easy to read on phone during Weekly Recon

---

## 🔧 Implementation Guide

### Week-by-Week Development Plan

**Week 1: Core Tracking**
- [ ] WhatsApp bot accepts basic format: "amount category merchant"
- [ ] Bot writes to Google Sheets
- [ ] Bot sends confirmation message
- [ ] Test with both users' phones

**Week 2: Dashboard Basics**
- [ ] Read from Google Sheets
- [ ] Display Recent Transactions list
- [ ] Display Category Totals (simple bars)
- [ ] Display Overall Summary card
- [ ] Deploy and test

**Week 3: Polish & Reliability**
- [ ] Add error handling to bot
- [ ] Add duplicate detection
- [ ] Improve dashboard loading speed
- [ ] Add mobile responsiveness
- [ ] User testing with Dean & Abigail

**Week 4: Monitoring & Support**
- [ ] Monitor tracking consistency
- [ ] Fix any bugs reported
- [ ] Prepare for First Money Discovery Session
- [ ] Gather feedback for Phase 2

### Technical Stack

**Current (Keep):**
- Frontend: React 18, Vite, TailwindCSS
- Backend: Node.js, Express
- Database: Google Sheets API
- Messaging: Twilio (WhatsApp)

**New Dependencies Needed:**
None - use existing stack.

### Code Examples

**WhatsApp Bot - Message Parser (Phase 1):**

```javascript
// backend/services/parserService.js - Phase 1 version

const parseMessage = (message) => {
  // Phase 1: Simple parsing only
  // Format: "amount category merchant" or "amount category"
  
  const parts = message.trim().toLowerCase().split(/\s+/);
  
  if (parts.length < 2) {
    return {
      success: false,
      error: 'Please include amount and category: "85 dining nandos"'
    };
  }
  
  const amount = parseFloat(parts[0]);
  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      error: 'Amount must be a positive number'
    };
  }
  
  const category = mapCategory(parts[1]);
  if (!category) {
    return {
      success: false,
      error: 'Category not recognized. Try: groceries, dining, transport, shopping, entertainment, home, bills, other'
    };
  }
  
  const merchant = parts.slice(2).join(' ') || '';
  
  return {
    success: true,
    amount,
    category,
    merchant
  };
};

const mapCategory = (input) => {
  const categoryMap = {
    'groceries': 'groceries',
    'grocery': 'groceries',
    'food': 'groceries',
    'dining': 'dining',
    'restaurant': 'dining',
    'coffee': 'dining',
    'takeout': 'dining',
    'transport': 'transport',
    'petrol': 'transport',
    'uber': 'transport',
    'fuel': 'transport',
    'shopping': 'shopping',
    'clothes': 'shopping',
    'entertainment': 'entertainment',
    'movies': 'entertainment',
    'home': 'home',
    'rent': 'home',
    'bills': 'bills',
    'electricity': 'bills',
    'water': 'bills',
    'other': 'other'
  };
  
  return categoryMap[input] || null;
};

module.exports = { parseMessage };
```

**Dashboard - Recent Transactions Component:**

```javascript
// dashboard/src/components/RecentTransactions.jsx - Phase 1

import React from 'react';

const RecentTransactions = ({ transactions }) => {
  // Group by date
  const groupedByDate = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const label = getDateLabel(date);
    
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(transaction);
    return groups;
  }, {});
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h2>
      
      {Object.entries(groupedByDate).map(([dateLabel, txns]) => (
        <div key={dateLabel} className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            {dateLabel}
          </h3>
          
          <div className="space-y-2">
            {txns.map((txn) => (
              <div 
                key={txn.id} 
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {txn.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {txn.category}
                    </p>
                    {txn.merchant && (
                      <p className="text-xs text-gray-500">
                        {txn.merchant}
                      </p>
                    )}
                  </div>
                </div>
                
                <p className="text-sm font-semibold text-gray-900">
                  R{txn.amount.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const getDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    return `${daysAgo} days ago`;
  }
};

export default RecentTransactions;
```

**Dashboard - Category Totals Component:**

```javascript
// dashboard/src/components/CategoryTotals.jsx - Phase 1

import React from 'react';

const CategoryTotals = ({ categories }) => {
  const maxAmount = Math.max(...categories.map(c => c.totalSpent));
  const totalSpent = categories.reduce((sum, c) => sum + c.totalSpent, 0);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        This Month's Spending
      </h2>
      
      <div className="space-y-4">
        {categories.map((category) => {
          const barWidth = (category.totalSpent / maxAmount) * 100;
          
          return (
            <div key={category.category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {category.displayName}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  R{category.totalSpent.toFixed(0)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            TOTAL
          </span>
          <span className="text-xl font-bold text-gray-900">
            R{totalSpent.toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryTotals;
```

---

## 🚨 Common Pitfalls & Solutions

### Pitfall 1: "We're Not Tracking Enough"

**Symptoms:**
- Missing 30%+ of transactions
- Mystery spending in bank statement
- Can't remember what purchases were

**Root Causes:**
- WhatsApp bot too complicated
- Forgetting to log in the moment
- One person logging, other not

**Solutions:**
1. **Simplify categories:** Fewer is better (6-8 max)
2. **Log immediately:** Right after purchase, in store
3. **Make it a game:** "Can we track 20 days in a row?"
4. **Shared accountability:** Check in with each other

**Rule of thumb:** 75%+ of discretionary spending is fine.

### Pitfall 2: "This Feels Like Homework"

**Symptoms:**
- Dreading Weekly Recon
- Skipping logging
- One person doing all the work

**Root Causes:**
- Taking it too seriously
- Trying to be perfect
- Forgetting this is Phase 1 (just observation)

**Solutions:**
1. **Make it pleasant:** Wine, coffee, couch time
2. **Set timer:** 15 minutes max, then stop
3. **No judgment:** This is data, not a report card
4. **Celebrate:** "We tracked 18 days! That's amazing!"

**Remember:** This should feel like couple time, not a chore.

### Pitfall 3: "The Numbers Don't Make Sense"

**Symptoms:**
- Total spending way higher/lower than expected
- Categories don't add up
- Confusion about what's included

**Root Causes:**
- Missing big purchases (rent, insurance)
- Double-counting (logged in bot AND manually)
- Inconsistent categorization

**Solutions:**
1. **Check bank statement:** Compare to logged transactions
2. **Look for big gaps:** Did you log rent? Insurance?
3. **Review together:** "Does this feel right?"
4. **It's okay to be wrong:** That's why we're tracking!

**Remember:** Month 1 is always messy. Month 2 will be better.

### Pitfall 4: "We're Already Trying to Change Spending"

**Symptoms:**
- Feeling guilty about purchases
- Avoiding logging "bad" purchases
- Discussing how to "cut back"

**Root Causes:**
- Jumping ahead to Phase 3
- Forgetting Phase 1 is observation only
- Anxiety about what you'll discover

**Solutions:**
1. **Stop:** Phase 1 is NOT about changing behavior
2. **Remind each other:** "We're just tracking, not judging"
3. **Save the ideas:** Write down "maybe reduce dining" for Phase 3
4. **Trust the process:** You can't set good budgets without data

**Remember:** Discovery before decisions. Always.

---

## 📅 Weekly Ritual Guide

### Sunday Evening: The Weekly Recon

**Setup (5 minutes before):**
- [ ] Pour wine/coffee
- [ ] Sit together on couch
- [ ] Open dashboard on laptop
- [ ] Set timer for 15 minutes
- [ ] Put phones away (except one with dashboard)

**The Ritual (15 minutes):**

**Minutes 1-5: Review Transactions**
- Scroll through Recent Transactions
- Dean: "That was me - books"
- Abigail: "That was me - groceries"
- Both: Notice anything interesting

**Minutes 6-10: Look at Categories**
- Check category totals
- Discuss: "Groceries is at R1,200 so far"
- Notice: "We bought groceries 3 times this week"
- No judgment, just observation

**Minutes 11-15: Quick Check-In**
- "How are we feeling about tracking?"
- "Anything confusing?"
- "Any purchases we forgot to log?"
- "Should we adjust any categories?"

**After 15 minutes:**
- Close laptop
- High-five
- Move on with evening

**Important:**
- This is NOT homework
- This is couple time
- Keep it light
- Keep it short

---

## 🎓 User Education

### For Dean

**What This Phase Means for You:**

Right now, you feel in the dark. You ask Abigail "Can I buy this?" and hope she says yes. You check your bank balance and pray there's money.

**After Phase 1, you'll:**
- See every transaction we make
- Understand where our money goes
- Know our top spending categories
- Feel like a partner, not a dependent

**Your Job:**
- Log every purchase via WhatsApp (even small ones)
- Participate in Weekly Recons
- Ask questions when confused
- Don't judge yourself or Abigail

**Remember:** You're not trying to be perfect. You're trying to learn.

### For Abigail

**What This Phase Means for You:**

Right now, you carry 100% of the mental load. Dean asks you questions, but you don't actually know the answers - you're guessing based on gut feeling.

**After Phase 1, you'll:**
- Share the mental load with Dean
- Have actual data instead of guesses
- See patterns you couldn't see before
- Feel less alone

**Your Job:**
- Log every purchase via WhatsApp (including bills)
- Participate in Weekly Recons
- Answer Dean's questions patiently
- Don't judge yourself or Dean

**Remember:** This is about sharing the burden, not adding to it.

### For Both of You

**The Transformation You're Building:**

**Week 1:**
- "This feels weird"
- "Am I doing this right?"
- "Why are we tracking coffee?"

**Week 2:**
- "Oh, this is becoming a habit"
- "I can see our spending"
- "This isn't as hard as I thought"

**Week 4:**
- "We know our numbers!"
- "We can see patterns"
- "We're ready for Phase 2"

**The Goal:**
By end of Phase 1, when someone asks "How much do you spend on groceries?" you can both answer confidently: "About R4,500 per month."

That's the transformation. From "I don't know" to "I know."

---

## 📈 Measuring Success

### Weekly Check-In Questions

**Every Sunday, ask each other:**

**For Dean:**
1. "On a scale of 1-10, how informed do you feel about our finances?"
   - Week 1 target: 3/10
   - Week 4 target: 5/10

2. "Did you log most of your purchases this week?"
   - Target: Yes

3. "Do you feel guilty about your spending?"
   - Target: No (if yes, we're doing something wrong)

**For Abigail:**
1. "On a scale of 1-10, how alone do you feel managing money?"
   - Week 1 target: 8/10 (still mostly alone)
   - Week 4 target: 5/10 (Dean is participating)

2. "Did you log most of your purchases this week?"
   - Target: Yes

3. "Do you feel Dean is engaged in this process?"
   - Target: Yes

**For Both:**
1. "Did we have any arguments about money this week?"
   - Target: No

2. "Does this system feel sustainable?"
   - Target: Yes (if no, we need to simplify)

### End of Phase 1 Assessment

**Quantitative:**
- [ ] Tracked 80%+ of purchases
- [ ] Completed 3/4 Weekly Recons
- [ ] Completed First Money Discovery Session
- [ ] Know total monthly income
- [ ] Know total monthly spending
- [ ] Know top 3 categories

**Qualitative:**
- [ ] Dean feels more informed (5/10 or higher)
- [ ] Abigail feels less alone (7/10 or lower stress)
- [ ] Zero money arguments
- [ ] System feels sustainable
- [ ] Both ready for Phase 2

**If 8+ boxes checked:** Move to Phase 2 ✅  
**If 5-7 boxes checked:** Do another month of Phase 1 🔄  
**If 0-4 boxes checked:** Something's wrong, troubleshoot 🚨

---

## 🎯 Transition to Phase 2

### How You'll Know You're Ready

**Signs you're ready for Phase 2:**
- Tracking feels automatic (not forced)
- You both check dashboard without prompting
- You can name your top 3 categories from memory
- The numbers "feel right" (not confusing)
- You're curious about patterns
- You're asking "why" questions

**Signs you're NOT ready:**
- Still forgetting to log purchases
- Numbers don't make sense
- One person doing all the work
- Dreading Weekly Recons
- Feeling overwhelmed

**No rush.** Phase 1 can last 2-3 months if needed. Better to build a solid foundation than rush ahead.

### What Changes in Phase 2

**Phase 2 Preview:**
- Continue tracking (same as Phase 1)
- Start analyzing patterns
- Understand "normal" vs "unusual"
- Identify fixed vs flexible spending
- Prepare for budgets (but not set them yet)

**What stays the same:**
- WhatsApp logging
- Weekly Recons
- No judgment
- Couple-focused approach

---

## 📝 Appendix

### The 8 Starting Categories

**1. Groceries** 🛒
- Food you buy at the store
- Supermarket trips
- Fresh produce markets

**2. Dining Out** 🍽️
- Restaurants
- Takeaways
- Coffee shops
- Uber Eats

**3. Transport** 🚗
- Petrol
- Uber/Bolt
- Parking
- Car maintenance

**4. Shopping** 🛍️
- Clothes
- Amazon
- Online shopping
- Random stuff

**5. Entertainment** 🎬
- Movies
- Subscriptions (Netflix, etc.)
- Hobbies
- Books

**6. Home** 🏠
- Rent/bond
- Electricity
- Water
- Internet
- Home stuff

**7. Fixed Bills** 💡
- Insurance
- Medical aid
- Bank fees
- Phone contracts

**8. Other** 📦
- Everything else
- Once-off purchases
- Gifts
- Misc

**Note:** You can adjust these in Phase 2 if needed.

### Sample Weekly Recon Script

**Dean:** "Okay, let's do our Weekly Recon. Timer set for 15 minutes."

**Abigail:** "Cool. Let me open the dashboard."

**Dean:** "So we spent... R1,850 this week. That's across 23 transactions."

**Abigail:** "Yeah, looks like groceries was the biggest - R650."

**Dean:** "Oh right, we did that big Woolworths shop on Saturday."

**Abigail:** "And dining out was R420. That's... three times this week?"

**Dean:** "Monday lunch, Wednesday coffee, Friday date night."

**Abigail:** "Makes sense. Nothing surprising."

**Dean:** "Transport was R850 - that was my petrol fill-up."

**Abigail:** "Okay. So overall, nothing weird. We're tracking well."

**Dean:** "Yeah, this is actually pretty easy now."

**Abigail:** "Agreed. Alright, 15 minutes is up. Let's watch that show."

**Dean:** "Done. See you next Sunday, money!"

---

## 🎬 Conclusion

Phase 1 is about one thing: **Discovery.**

You can't manage what you don't measure. You can't set budgets without data. You can't make decisions without understanding.

**The transformation:**
- From "We don't know" → "We know"
- From "Flying blind" → "We can see"
- From "Guessing" → "Data"
- From "Alone" → "Together"

**Remember:**
- This is observation, not judgment
- This is data collection, not behavior change
- This is building habits, not perfection
- This is couple time, not homework

**By the end of Phase 1:**
You'll know exactly where your money goes. And that knowledge is power.

Now close this document and log your first purchase. 🚀

---

**Next:** [Phase 2 PRD: Understanding Mode →](./PRD_PHASE_2_UNDERSTANDING.md)
