# Welcome to Our Two Cents
## Dean & Abigail's Onboarding Guide

Hey, it's your app talking. You built me to help you two figure out where your money goes — together, without stress, without arguments, and without pretending you already know the answers.

This guide is your coach. It tells you exactly what to do, day by day, week by week, for the next 8 weeks. After that, you'll know your money better than 90% of couples.

---

## Before You Start

### What You Need Running

Dean, you're maintaining the app. Here's the checklist:

1. **Backend server** — In terminal: `cd backend && node server.js`
2. **ngrok tunnel** — In another terminal: `ngrok http 3000`
3. **Dashboard** — In another terminal: `cd dashboard && npm run dev`
4. **Twilio webhook** — Update the Twilio sandbox webhook URL to your ngrok URL + `/webhook/whatsapp` (this changes every time you restart ngrok)

**Both phones:**
- Open WhatsApp
- Message **+1 415 523 8886**
- Send: `join beyond-event`
- Wait for the "You're connected" confirmation

**Important:** The sandbox session expires after ~72 hours of inactivity. If the bot stops responding, both of you need to send the join code again. This is a Twilio sandbox limitation — it goes away when you move to a production number later.

### What You Need to Know

- The dashboard is at `http://localhost:5173` on Dean's Mac
- The bot lives in WhatsApp — that's your primary tool
- Everything you log goes to Google Sheets — it's your real data, not a demo
- You're in **Phase 1: Discovery** — the app is intentionally simple right now

---

## How This Works — The Big Picture

You're on a 4-phase journey. Each phase builds on the last:

```
Phase 1: Discovery     →  "Where does our money go?"     (You are here)
Phase 2: Understanding →  "What are our patterns?"       (Unlocks after 6-8 weeks)
Phase 3: Confidence    →  "Let's set budgets together"   (Unlocks after ~4 months)
Phase 4: Goals         →  "Let's save for our house"     (Unlocks after ~6 months)
```

**You cannot skip phases.** Each one teaches you something the next one needs. Phase 1 is the foundation — if you rush it, everything after it wobbles.

**Right now, your only job is: log every purchase.**

That's it. No budgets. No limits. No guilt. Just data.

---

## Day-to-Day: How to Log

### The 30-Second Routine

Every time either of you spends money — anything, anywhere, any amount — do this:

1. Open WhatsApp
2. Go to the bot chat (+1 415 523 8886)
3. Type: `category amount merchant`
4. Send
5. Done. Move on with your life.

### Examples You'll Actually Use

**Dean's typical day:**
```
transport 65 uber
dining 45 vida
groceries 580 woolworths
entertainment 99 spotify
```

**Abigail's typical day:**
```
housing 12000 rent
utilities 1800 city power
health 2200 discovery
groceries 350 checkers
```

### The 10 Categories

Pick the closest one. Don't overthink it.

| You type | What it covers | Examples |
|----------|---------------|----------|
| `groceries` | Food from shops | Woolworths, Spar, Checkers, Pick n Pay |
| `dining` | Eating out | Nandos, Vida, Uber Eats, any restaurant |
| `transport` | Getting around | Petrol, Uber, parking, tolls |
| `entertainment` | Fun stuff | Netflix, movies, games, outings |
| `utilities` | Running the home | Electricity, water, internet, phone |
| `housing` | Your home | Rent, rates, body corporate, home insurance |
| `shopping` | Buying things | Clothes, Takealot, gifts, home goods |
| `health` | Staying alive | Doctor, pharmacy, medical aid, gym |
| `savings` | Future money | House fund, emergency fund |
| `other` | The rest | Car wash, haircut, anything that doesn't fit |

### Rules That Make This Work

1. **Log within 24 hours.** You'll forget after that.
2. **Don't overthink categories.** Is coffee `dining` or `entertainment`? Pick one. Stay consistent. Done.
3. **Round if you want.** `groceries 350` is fine instead of `groceries 347.89`.
4. **Log everything.** Even the R12 parking. Even the R25 coffee. Small stuff adds up — that's the whole point.
5. **Both of you log.** If only one person logs, the data is useless.

### Bot Commands

| Type this | What happens |
|-----------|-------------|
| `groceries 350 woolworths` | Logs R350 to Groceries |
| `help` | Shows all commands |
| `categories` | Lists all categories |
| `goal` | Shows house deposit progress |
| `undo` | Deletes your last logged transaction |

### Common Mistakes (and What to Do)

**"I bought something but forgot the category"**
→ Use `other`. Fix it mentally next time.

**"I paid for something that's two categories"**
→ Pick the main one. R800 Woolworths shop with R200 of beauty products? Just log `groceries 800 woolworths`. Don't split it. Simplicity > accuracy in Phase 1.

**"I logged the wrong amount"**
→ Type `undo`, then re-log it correctly.

**"I forgot to log yesterday"**
→ Log it now. The date will be today instead of yesterday — that's fine. Getting the data in matters more than the date being perfect.

**"The bot isn't responding"**
→ Your sandbox session probably expired. Send `join beyond-event` to +1 415 523 8886 again. If that doesn't work, Dean: check that the backend server and ngrok are running.

---

## Week-by-Week Game Plan

### Week 1: Just Get Started

**Goal:** Build the muscle memory. It'll feel awkward.

**Daily:**
- Log every purchase. Both of you.
- Don't look at the dashboard yet.
- Don't think about totals.

**End of Week 1:**
- Dean: Open the dashboard once to make sure transactions are showing
- That's it. No analysis. Just verify it works.

**What's normal this week:**
- Forgetting to log half your purchases
- Feeling like this is pointless
- Not being sure which category to use
- Logging some things late

**All of that is fine.** You're building a new habit. It takes 3-4 weeks to feel automatic.

---

### Week 2: Getting the Rhythm

**Goal:** Start catching more purchases. It's getting easier.

**Daily:**
- Log every purchase
- If you forgot something from yesterday, log it now
- Start logging immediately after paying (not "later tonight")

**Sunday evening — Your First Weekly Recon (15 minutes):**

Set a timer. Pour some tea or wine. Sit together. Open the dashboard.

**What to do:**
1. Look at the summary card — total spent, transaction count, streak
2. Scroll through recent transactions — "Oh yeah, that Spar trip"
3. Glance at the category bars — which ones are biggest?
4. Talk about what you notice

**What to say:**
- "Interesting, groceries is our biggest category"
- "We had 15 transactions this week, not bad"
- "Oh, I forgot to log that Takealot order — let me do it now"

**What NOT to say:**
- "We spent too much on dining"
- "You shouldn't have bought that"
- "We need to cut back"

**Close the laptop after 15 minutes. High-five. Done.**

---

### Week 3: The Habit Is Forming

**Goal:** Tracking feels more natural. You're catching 70%+ of purchases.

**Daily:**
- Log purchases — it should feel almost automatic now
- Help each other: "Did you log that coffee?" (curious, not nagging)

**Sunday — Weekly Recon #2 (15 minutes):**

Same routine. Open dashboard. Set timer.

This week, notice:
- "We seem to buy groceries on Tuesdays and Saturdays"
- "Dean's logging more transport than Abigail"
- "Our total is around R_____ so far this month"

Still no judgment. You're scientists collecting data.

**Check-in questions (ask each other):**

**Dean:** "On a scale of 1-10, how informed do you feel about our finances right now?"
- Target: 3-4/10 (you're just starting)

**Abigail:** "On a scale of 1-10, how alone do you feel managing money?"
- Target: 7-8/10 (Dean is starting to participate)

**Both:** "Did we argue about money this week?"
- Target: No

---

### Week 4: One Month Down

**Goal:** You've been tracking for a full month. Time for your first real look.

**Daily:** Keep logging. It's a habit now.

**Sunday — Weekly Recon #3 + The First Money Discovery Session (45 minutes)**

This is the big one. This is the first time in your relationship you'll know your real numbers.

**Part 1: Income Discovery (10 min)**

Write these numbers down on actual paper. Big. You've probably never calculated this together.

```
Dean's salary (after tax):     R_______
Abigail's salary (after tax):  R_______
Other income:                  R_______
───────────────────────────────────────
TOTAL MONTHLY INCOME:          R_______
```

**Part 2: Spending Discovery (15 min)**

Open the dashboard. Look at the total.

```
Total Spent This Month:        R_______
```

Write it on the same paper, under income.

**Part 3: The Gap (10 min)**

```
Income - Spending = R_______
```

Three possible outcomes:

**Positive (you spent less than you earned):**
Celebrate. You're saving money, even if you didn't know it. The question is: where did the surplus go? Is it sitting in a savings account? Or did it just vanish into the current account?

**Negative (you spent more than you earned):**
Don't panic. Was this a weird month? A big once-off expense? Or is this normal? You need Month 2 to know. Either way — this is exactly why you're tracking. You caught it.

**Close to zero:**
Very common. You're spending what you earn. No buffer for emergencies, no savings building. Not a crisis, but important to know.

**Part 4: Category Curiosity (10 min)**

Look at your categories. Which are biggest? Write down your top 5:

```
1. ____________:  R_______
2. ____________:  R_______
3. ____________:  R_______
4. ____________:  R_______
5. ____________:  R_______
```

Discuss:
- "Whoa, we spend THAT much on [category]?"
- "[Category] is smaller than I thought"
- "I had no idea [category] was so high"

**No action plans. No "we should spend less on X." Just: "Huh. Interesting. Now we know."**

**Part 5: Decision**

Do you want to do another month of Phase 1, or are you ready to keep going?

Most couples should do **at least 2 months** before moving on. One month of data isn't enough to see patterns — you need to compare Month 1 to Month 2.

---

### Weeks 5-8: Month 2 — Building the Baseline

**Goal:** Get a second month of data so you can compare. Patterns start to emerge.

**Daily:** Keep logging. It's on autopilot now.

**Weekly Recons (15 min each Sunday):**

Same format. But now you have more data, so you might notice:
- "We always spend more on groceries in the first half of the month"
- "Dining out spikes on weekends"
- "Dean's transport costs are pretty consistent"
- "That R_____ grocery shop at [store] happens every Saturday"

**End of Month 2 — The Comparison Session (30 min):**

This is where it gets powerful.

```
                        Month 1         Month 2
─────────────────────────────────────────────────
Total Spent:            R_______        R_______
Transactions:           _______         _______
Days Tracked:           ___/___         ___/___

Top Categories:
  Groceries:            R_______        R_______
  Transport:            R_______        R_______
  Dining:               R_______        R_______
  Housing:              R_______        R_______
  Utilities:            R_______        R_______
```

**Questions to answer together:**

1. Were the totals similar? Or was one month unusual?
2. Which categories stayed roughly the same? → Those are your **fixed costs** (rent, utilities, insurance)
3. Which categories changed? → Those are your **flexible costs** (dining, shopping, entertainment)
4. Any surprises?

**This distinction — fixed vs flexible — is the key insight that unlocks Phase 2.** You can't change fixed costs easily. Flexible costs are where you have choices.

Write down:
```
Fixed costs (roughly same both months):      R_______
Flexible costs (changed between months):     R_______
```

---

## When to Move to Phase 2

You're ready when ALL of these are true:

- [ ] Tracked for 2 full calendar months
- [ ] 80%+ of days have at least one transaction logged
- [ ] Both of you are logging consistently (not just one person)
- [ ] You've done at least 6 Weekly Recons
- [ ] You've done the Month 1 Discovery Session and Month 2 Comparison
- [ ] You can name your top 3 spending categories from memory
- [ ] Tracking feels easy, not like a chore
- [ ] You're curious about your patterns (not anxious about them)

**How to advance:** On the dashboard, click the phase badge in the sidebar → select Phase 2 → confirm.

**If you're not sure:** Stay in Phase 1 for another month. There is zero downside to extra data. There IS a downside to rushing ahead before the habit is solid.

---

## What Phase 2 Unlocks

When you advance, the dashboard will reveal:

- **Pie chart visualizer** — see your spending as a visual breakdown
- **Monthly Wins** — celebrate things like "lowest dining week" or "8-day tracking streak"
- **Analytics tab** — deeper patterns and month-over-month trends
- **Pattern detection** — "You always spend more on Fridays"

The bot stays the same. Your logging habit doesn't change. Phase 2 just gives you better glasses to look at the same data.

---

## The Emotional Side (Read This Together)

### For Dean

Right now, you feel like you're in the dark about your own money. You ask Abigail before buying things. It feels like asking a parent for permission. That's not how partners should work.

Phase 1 changes that. By the end, you'll know every category, every pattern, every number. When Abigail says "we spent a lot on groceries this month," you'll be able to say "yeah, R4,200 — about R800 more than last month because we had people over twice."

That's the shift. From dependent to informed. From asking to knowing.

**Your job for the next 8 weeks:**
- Log everything (even the small stuff)
- Show up for Weekly Recons
- Ask questions when you see something you don't understand
- Don't judge Abigail's spending
- Don't judge your own spending

### For Abigail

Right now, you carry the entire mental load of finances. Dean asks "can I buy this?" and you say yes or no based on gut feeling — not because you actually know, but because someone has to decide. That's exhausting.

Phase 1 changes that. When Dean is logging his purchases too, when you're both looking at the dashboard together, when you both know the numbers — the weight is shared. You don't have to carry it alone anymore.

**Your job for the next 8 weeks:**
- Log everything (including bills and debit orders)
- Show up for Weekly Recons
- Answer Dean's questions patiently (he's learning)
- Don't judge Dean's spending
- Don't judge your own spending
- Let go of being the "only one who knows" — it's scary, but it's the goal

### For Both of You

**The rule:** No money arguments for 8 weeks. Seriously. If something bothers you about a purchase, write it down and save it for Phase 3 (when you set budgets together). Phase 1 is observation only.

**Why this works:**
Most couples fight about money because they're guessing. "I think we spend too much on X" is a feeling, not a fact. After Phase 1, you'll have facts. And facts are much easier to discuss than feelings.

**The transformation you're building:**

```
Week 1:  "This feels weird"
Week 2:  "Oh, this is getting easier"
Week 3:  "I can see our spending"
Week 4:  "We know our numbers!"
Week 6:  "I can spot patterns"
Week 8:  "We're ready for Phase 2"
```

---

## Troubleshooting

### "One of Us Keeps Forgetting to Log"

This is the #1 problem. Solutions:
- **Log immediately** at the point of sale, not "later tonight"
- **Set a daily reminder** — 8pm, "Did I log everything today?"
- **Help each other** — "Did you log that petrol?" (curious, not nagging)
- **Make it competitive** — "I logged 5 things today, you?"
- **Lower the bar** — catching 70% is better than giving up because you can't hit 100%

### "The Weekly Recon Feels Like Homework"

You're taking it too seriously. Fix:
- Pour wine or make tea first
- Set a strict 15-minute timer
- No calculations — just look and talk
- End with something fun ("let's watch a show now")
- Remember: this is couple time, not a meeting

### "The Numbers Are Stressing Me Out"

You're jumping ahead. In Phase 1:
- Numbers are not good or bad — they're just data
- There's nothing to "fix" yet
- No one is "overspending" because there are no budgets
- If seeing a total makes you anxious, that's exactly why we're doing this gradually

### "We're Already Trying to Change Our Spending"

Resist the urge. Phase 1 is observation only because:
- You don't have enough data yet (need 2 months minimum)
- Cutting spending without understanding patterns leads to guilt and rebounding
- Changes made in Phase 3 will be based on real data and will actually stick

If you have ideas, write them down in a note called "Phase 3 Ideas." Don't act on them yet.

### "Dean's Asking Too Many Questions About Abigail's Spending"

Dean — you're new to seeing the full picture. It's natural to have reactions. But keep them to yourself for now. Abigail has been managing this alone, and having someone suddenly scrutinize every purchase feels invasive. 

The rule: observe, don't comment. You'll discuss spending together in Phase 3 when you set budgets as a team.

### "Abigail Feels Like She Lost Control"

Abigail — sharing financial visibility can feel vulnerable when you've been the sole manager. That's normal. You haven't lost control — you've gained a partner. The data is the same; now two people can see it instead of one.

---

## Quick Reference (Screenshot This)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       OUR TWO CENTS — PHASE 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOG A SPEND:
  groceries 350 woolworths
  dining 85 nandos
  transport 450 shell

COMMANDS:
  help · categories · goal · undo

WEEKLY RECON: Sunday, 15 min
  Open dashboard → Look → Talk → Done

THE RULES:
  ✓ Log everything
  ✓ Don't judge
  ✓ Both participate
  ✗ No budgets yet
  ✗ No "we should spend less"
  ✗ No arguments about money

BOT NUMBER: +1 415 523 8886
JOIN CODE:  join beyond-event

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Your Phase 1 Calendar

```
WEEK 1  |  Start logging. Feel awkward. That's normal.
WEEK 2  |  First Weekly Recon. Getting easier.
WEEK 3  |  Weekly Recon #2. Catching most purchases now.
WEEK 4  |  Weekly Recon #3 + First Money Discovery Session.
         |  You now know your numbers.
WEEK 5  |  Month 2 begins. Keep logging.
WEEK 6  |  Weekly Recon #5. Noticing patterns.
WEEK 7  |  Weekly Recon #6. It's on autopilot.
WEEK 8  |  Month 2 Comparison Session.
         |  Decision: Phase 2 or one more month?
```

---

## One Last Thing

Most couples never get past "we should probably budget." You two built an app, set up a bot, and are reading an onboarding guide at 2am. You're already ahead.

Phase 1 isn't hard. It's just new. In 8 weeks, you'll look back and wonder why you didn't do this sooner.

Start now. Open WhatsApp. Log your last purchase.

Go.

*— Our Two Cents*
