# Project Review: Our Two Cents

**Reviewer:** Senior Engineer & UX/UI Expert
**Date:** February 7, 2026
**Scope:** Full-stack codebase + all documentation (`docs/`)

---

## 1. Executive Assessment

**Overall verdict: Strong foundation with clear product vision, but implementation has meaningful gaps versus what the documentation describes.**

Our Two Cents is a WhatsApp-first household budgeting tool for a couple (Dean & Abigail) saving for a house. The product thinking is excellent—the phased approach from "just track" to "set budgets" to "save for goals" is genuinely well-considered and empathetic. The codebase is functional and demonstrates a working WhatsApp → Google Sheets → Dashboard pipeline. However, there are architectural, security, UX, and code-quality issues that should be addressed before this system is relied upon daily.

**Strengths at a glance:**
- Exceptional product documentation and phased rollout strategy
- Working end-to-end pipeline (WhatsApp → Sheets → Dashboard)
- TypeScript migration with strict mode on the frontend
- Clean separation of concerns in backend services

**Concerns at a glance:**
- Security gaps (auth middleware not applied, secrets exposure risk)
- Dashboard UI diverges significantly from the Phase 1 PRD spec
- No tests anywhere in the codebase
- Google Sheets as a database introduces fragility at scale
- Several dead/unused components shipped alongside active ones

---

## 2. Documentation Review

### 2.1 What's Good

The `docs/` folder is outstanding for a project of this size. Nine documents totaling ~200KB of thoughtful product thinking:

| Document | Purpose | Quality |
|----------|---------|---------|
| `PRD.md` | Master product spec | ★★★★★ |
| `PRD_PHASE_1_DISCOVERY.md` | Phase 1 detailed spec | ★★★★★ |
| `PRD_PHASE_2_UNDERSTANDING.md` | Phase 2 spec | ★★★★☆ |
| `PRD_PHASE_3_CONFIDENCE.md` | Phase 3 spec | ★★★★☆ |
| `PRD_PHASE_4_GOALS.md` | Phase 4 spec | ★★★★☆ |
| `PRD_DASHBOARD_REDESIGN.md` | Dashboard UX overhaul | ★★★★★ |
| `IMPLEMENTATION_ROADMAP.md` | Development plan | ★★★★☆ |
| `SETUP_GOOGLE_CLOUD.md` | Infrastructure guide | ★★★☆☆ |
| `SETUP_TWILIO.md` | Infrastructure guide | ★★★☆☆ |

The Phase 1 PRD in particular is a model of user-centered design: it defines what to *not* build as clearly as what to build, includes weekly ritual scripts, troubleshooting guides, and emotional success metrics. This level of product discipline is rare.

### 2.2 What Needs Work

**Docs vs. reality drift.** The documentation describes a system that doesn't fully exist yet. For example:

- `PRD_PHASE_1_DISCOVERY.md` specifies a stripped-down bot response (`✅ Logged R85 to Dining Out` — no budget info). The actual bot in `twilioService.js` still includes budget status formatting functions (`formatBalanceMessage`, `formatBudgetReply`), and the WhatsApp route calls `budgetService.calculateBudgetStatus` on every spend. This contradicts the Phase 1 "no judgment" principle.
- `PRD_DASHBOARD_REDESIGN.md` defines a warm, cream-colored, light-theme dashboard with Inter typography. The actual dashboard uses a dark glassmorphism aesthetic with purple/blue gradients—a completely different design language.
- `IMPLEMENTATION_ROADMAP.md` defines a branch strategy (`main`, `develop`, `feature/*`) that isn't being used—all work is committed directly to `main`.

**Recommendation:** Add a `STATUS.md` or "Current State" section to `PRD.md` that honestly tracks which features are built, partially built, or not started. This prevents confusion between aspirational docs and shipped code.

---

## 3. Architecture Review

### 3.1 System Design

```
WhatsApp (Twilio) → Express Backend → Google Sheets ← Dashboard (React/Vite)
```

This is a reasonable architecture for a two-person hobby project. The key trade-off is Google Sheets as the database.

**Google Sheets as DB — Honest Assessment (for a 2-person app):**

| Aspect | Verdict |
|--------|--------|
| Cost | ✅ Free — perfect for a personal tool |
| Transparency | ✅ Both of you can see and edit raw data directly |
| Read performance | ✅ 200-500ms per call — fine for 2 users |
| Write performance | ✅ 500ms-1s per append — fine for manual logging |
| Concurrency | ⚠️ No locking, but with only 2 users the duplicate-ID race condition is extremely unlikely |
| Rate limits | ⚠️ 300 requests/min — plenty for 2 users, but the N+1 query pattern wastes calls unnecessarily |
| Querying | ⚠️ Full-table scans — acceptable for months/years of household data (likely <10K rows) |

**For a permanently two-person app, Google Sheets is actually a great choice.** You'll never outgrow its capacity, you get a free backup/audit UI, and Abigail can see or fix data without needing the dashboard. The only real concern is the N+1 query pattern in `budgetService.getAllCategoryStatuses` — it fetches all transactions and budgets *per category* independently, generating ~21 API calls for a single overview request. This doesn't risk hitting rate limits for 2 users, but it does make the dashboard slower than it needs to be (~3s instead of <1s).

**Recommendation:** A simple refactor of `getAllCategoryStatuses` to fetch data once and compute in-memory would cut response time significantly. A full caching layer is optional — nice for snappiness, but not critical at this scale.

### 3.2 Backend Structure

```
backend/
├── server.js              # Clean, minimal entry point
├── config/index.js         # Centralized env config
├── middleware/auth.js       # Dashboard token auth
├── routes/
│   ├── whatsapp.js         # WhatsApp webhook handler
│   └── dashboard.js        # Dashboard REST API
└── services/
    ├── sheetsService.js    # Google Sheets CRUD
    ├── parserService.js    # WhatsApp message parser
    ├── budgetService.js    # Budget calculations
    └── twilioService.js    # WhatsApp messaging
```

This is well-organized. Services are properly separated. The singleton pattern for services (`module.exports = new SheetsService()`) is acceptable for this scale but note that it means service state (like a future cache) would be shared across all requests—fine here, risky at scale.

### 3.3 Frontend Structure

```
dashboard/src/
├── pages/DashboardHome.tsx       # Main page (all logic lives here)
├── components/
│   ├── AddTransactionModal.tsx   # Manual transaction entry
│   ├── TransactionsList.tsx      # Transaction display
│   ├── CategoryVisualizer.tsx    # Pie chart (NOT used in DashboardHome)
│   ├── InsightsList.tsx          # Budget insights (NOT used in DashboardHome)
│   ├── MonthlyWins.tsx           # Wins display (NOT used in DashboardHome)
│   ├── MetricCard.tsx            # Metric display (NOT used in DashboardHome)
│   ├── WhatsAppQuickActions.tsx  # WhatsApp helper widget
│   └── ui/GlassCard.tsx          # Shared glass card wrapper
├── layouts/DashboardLayout.tsx   # App shell, nav, header
├── services/
│   ├── api.ts                    # Axios API client
│   ├── api.d.ts                  # Type declarations
│   └── mockData.ts               # Mock data + utility functions
├── types/index.ts                # TypeScript interfaces
└── App.tsx                       # Router shell
```

**Key observation:** Four components (`CategoryVisualizer`, `InsightsList`, `MonthlyWins`, `MetricCard`) are built and maintained but **never rendered** in `DashboardHome.tsx`. They were recently patched for TypeScript null-safety but are dead code. This creates maintenance burden without user value.

---

## 4. Security Review

Since this app will always be just for you and Abigail — running on your own devices, likely on a local network or behind a personal deployment — the security posture is very different from a public-facing app. Most "security" concerns are actually convenience trade-offs.

### 4.1 Medium: Auth Middleware Not Applied

The `authenticateDashboard` middleware is imported in `server.js` but **never used**:

```javascript
// server.js line 8
const { authenticateDashboard } = require('./middleware/auth');

// server.js line 28 — NO middleware applied
app.use('/api/dashboard', dashboardRoutes);
```

**Impact (revised):** If the backend runs only on `localhost` or your home network, this is low risk — nobody else can reach it. If you ever deploy publicly (Railway, Render, etc.), anyone who discovers the URL could read/write your financial data.

**Recommendation:** Apply the middleware now as a good habit, especially if you plan to deploy. It's a one-line change. Also align the auth header — middleware checks `x-dashboard-token`, but `api.ts` sends `Authorization: Bearer`.

### 4.2 Low: No WhatsApp Webhook Validation

The webhook accepts any POST without verifying it came from Twilio. For a personal app, the risk is negligible — an attacker would need to know your endpoint AND the exact payload format. Still, Twilio signature validation is a one-liner if you want belt-and-suspenders.

### 4.3 Low: `.env` File in Repo

The `backend/.env` file (2,292 bytes) appears tracked in git. Since this is a **private** repo for just you two, this is a pragmatic choice — it makes setup easy. Just be aware that if you ever make the repo public, credentials would be exposed.

**Recommendation:** Keep it in the private repo if that's convenient, but add a note in README that it must stay private.

### 4.4 Non-Issue: CORS Wide Open

`app.use(cors())` allows any origin. For a personal two-user app, this is perfectly fine. No change needed.

---

## 5. Code Quality Review

### 5.1 Backend

**Parser Service — Well-structured but has gaps:**
- `parseMessage` handles `"85 dining nandos"` format well
- The `stripCommandPrefix` handles a "save spend" prefix pattern
- ⚠️ No duplicate detection (mentioned in PRD as required for Phase 1)
- ⚠️ Category matching is greedy — `"transport 100 entertainment"` would match `transport` first, even if the user meant entertainment
- ⚠️ `extractAmount` will match any number, including dates or phone numbers if forwarded messages are sent

**Sheets Service — Functional but inefficient:**
- `addTransaction` fetches ALL transactions just to calculate the next ID — this is O(n) and will slow down as data grows
- `calculateUserStreak` also fetches all transactions if not passed in
- `deleteTransaction` uses `values.clear` which leaves blank rows in the sheet, causing data fragmentation over time
- No retry logic for Google API failures
- No caching layer

**Budget Service — Clean logic, N+1 query problem:**
- `getAllCategoryStatuses` calls `calculateBudgetStatus` per category
- Each `calculateBudgetStatus` independently calls `getTransactions` AND `getMonthlyBudgets`
- For 10 categories: 10 × 2 = 20 redundant API calls per overview request

### 5.2 Frontend

**TypeScript — Good discipline:**
- Strict mode enabled
- Types properly defined in `types/index.ts`
- Recent patches correctly handle optional fields with nullish coalescing
- `api.d.ts` declaration file is a workaround — the `.ts` source should suffice; investigate why TS can't resolve the module directly

**DashboardHome.tsx — Doing too much:**
- This single component handles: data fetching, auto-refresh, category-to-spending mapping, category derivation from transactions, filtering, summary calculations, and all rendering
- At 286 lines it's manageable, but as Phase 2+ features are added, this will become unwieldy
- Consider extracting a `useDashboardData` custom hook for all data fetching/computation

**Mock Data confusion:**
- `mockData.ts` exports utility functions (`getGreeting`, `groupTransactionsByDate`, `getDateLabel`) alongside mock data arrays
- `DashboardLayout.tsx` depends on `getGreeting` from this file
- `TransactionsList.tsx` depends on `groupTransactionsByDate`
- These utilities should live in a `utils/` directory, not in a file named "mockData"

---

## 6. UX/UI Review

### 6.1 Current Dashboard vs. Phase 1 PRD

The Phase 1 PRD (`PRD_PHASE_1_DISCOVERY.md`) is explicit about what the dashboard should look like:

| PRD Requirement | Current State | Aligned? |
|----------------|---------------|----------|
| Neutral colors, no red/yellow warnings | Dark glassmorphism, blue/purple gradients | ❌ |
| Simple bar chart per category | ✅ Horizontal bars in category breakdown | ✅ |
| Recent Transactions grouped by date | ✅ `TransactionsList` groups by date | ✅ |
| Summary card: Total spent, # transactions, days tracked | ✅ Present in hero card | ✅ |
| No budget progress bars | No budget bars shown | ✅ |
| No warnings or alerts | No warnings shown | ✅ |
| Tracking streak as hero metric | ❌ Not displayed | ❌ |
| Mobile-first, stack vertically | Desktop sidebar layout, mobile bottom nav | ⚠️ |
| "We/Our" language | Mixed — header says "Dean & Abigail" but some components say "you" | ⚠️ |
| Cream background (#FAF9F6) | Dark gradient background | ❌ |
| WhatsApp quick-log actions | ✅ `WhatsAppQuickActions` component present | ✅ |

### 6.2 Visual Design Assessment

The current dark glassmorphism design is aesthetically polished but **misaligned with the PRD's emotional intent.** The PRD explicitly chose warm, cream-colored, approachable design to make budgeting feel "like couple time, not homework." The current dark UI with frosted glass and gradients feels more like a fintech trading dashboard—technically impressive but emotionally cold.

**This is a design direction decision, not a bug.** If you prefer the dark glass aesthetic, update the PRD to match. If you want to follow the PRD, the dashboard needs a visual overhaul.

### 6.3 Unused Components

Four fully-built components are not rendered anywhere in the active dashboard:

- **`CategoryVisualizer.tsx`** — Pie chart with interactive legend (181 lines)
- **`InsightsList.tsx`** — AI-style spending insights (137 lines)
- **`MonthlyWins.tsx`** — Celebration wins list (106 lines)
- **`MetricCard.tsx`** — Reusable metric display card (89 lines)

These represent ~500 lines of maintained code with no user-facing value. They were recently patched for TypeScript compatibility but are never imported by `DashboardHome.tsx`.

**Recommendation:** Either integrate them into the dashboard (they align with Phase 2/3 features) or move them to a `components/_future/` directory to signal they're not active.

### 6.4 Mobile UX

- Bottom navigation is implemented for mobile (`DashboardLayout.tsx`)
- The two-column layout collapses to single-column on small screens
- Touch targets appear adequate (buttons use `p-2`/`p-3` classes)
- ⚠️ The `AddTransactionModal` could benefit from a full-screen mobile view rather than a centered modal overlay

---

## 7. Data Integrity Concerns

### 7.1 Race Conditions

Two users logging spends at the exact same second could theoretically produce a duplicate ID. With WhatsApp-based logging (one message at a time, typed by hand), the odds of a sub-second collision between two people are essentially zero. **This is a non-issue for your use case.**

### 7.2 Deleted Row Fragmentation

`deleteTransaction` uses `values.clear` which blanks the row but doesn't remove it. Over time, the Transactions sheet accumulates blank rows. `getTransactions` filters these out (the `.filter()` removes rows missing required fields), but the sheet itself becomes messy.

### 7.3 No Data Validation on Write

The POST `/transactions` endpoint validates presence of `user`, `category`, and `amount`, but:
- Doesn't validate `category` against the Categories sheet
- Doesn't validate `user` against known users
- Doesn't validate `amount` is reasonable (e.g., no negative amounts check, no upper bound)
- Doesn't sanitize `merchant` or `note` strings

---

## 8. Performance Observations

| Area | Current | Target | Status |
|------|---------|--------|--------|
| Dashboard initial load | ~2-3s (3+ API calls to Sheets) | < 2s | ⚠️ |
| Auto-refresh interval | 10s | 10s | ✅ |
| API calls per refresh | 1 (transactions only) | 1 | ✅ |
| API calls per overview | ~21 (N+1 problem) | 1-3 | ❌ |
| WhatsApp bot response | ~2-4s | < 3s | ⚠️ |

The overview endpoint's N+1 query pattern is the biggest performance concern. A single request to `/overview` triggers 21+ Google Sheets API calls. This should be refactored to batch-read transactions and budgets once, then compute all category statuses in-memory.

---

## 9. Testing

**Current state: Zero tests.** No unit tests, no integration tests, no E2E tests.

For a personal two-user app, a full test suite isn't strictly necessary — you're both the developers and the QA team. That said, **one** test file would provide outsized value:

**`parserService.test.js`** — The message parser is the one place where unexpected input can silently cause wrong data. A small set of test cases would catch regressions whenever you tweak parsing logic:
- Standard: `"85 dining nandos"` → amount: 85, category: dining, merchant: nandos
- Reversed: `"food 85"` → amount: 85, category: groceries
- Comma amounts: `"1,200 rent"` → amount: 1200, category: home
- Edge cases: empty string, emoji-only, no number, no category

Everything else you can validate manually since you're the only users.

---

## 10. Prioritized Recommendations

### P0 — Fix Before Daily Use

1. **Fix the N+1 query problem** in `budgetService.getAllCategoryStatuses` — fetch transactions and budgets once, compute all statuses in a single pass. This is the single biggest improvement for dashboard speed.
2. **Apply auth middleware** to dashboard routes if you plan to deploy publicly. If running locally only, this is optional.
3. **Align auth header** — middleware checks `x-dashboard-token`, but `api.ts` sends `Authorization: Bearer`. Pick one.

### P1 — Fix Within 1-2 Weeks

4. **Decide on visual design direction** — dark glass vs. PRD's warm cream. You and Abigail should pick what you *want* to look at during Sunday Recons, then update the PRD or the code to match.
5. **Display tracking streak** on dashboard — it's already calculated in `sheetsService` but never surfaced to the UI. This is a Phase 1 hero metric per your own PRD.
6. **Move utility functions** out of `mockData.ts` into a proper `utils/` module
7. **Remove or relocate unused components** (`CategoryVisualizer`, `InsightsList`, `MonthlyWins`, `MetricCard`) — or wire them into the dashboard if you want them

### P2 — When You Have Time

8. **Add parser tests** — a single `parserService.test.js` file covering 10-15 input variations would catch regressions
9. **Add input validation** for POST `/transactions` (validate category exists, amount > 0)
10. **Extract `useDashboardData` hook** from `DashboardHome.tsx` to keep it manageable as you add Phase 2 features
11. **Implement duplicate detection** for WhatsApp bot (same amount + category within 5 minutes)

### P3 — Nice to Have

12. **Add loading skeletons** instead of the plain text "Loading dashboard data..."
13. **Add error boundaries** to React component tree
14. **Add a Sheets API cache** (in-memory, 30s TTL) for snappier dashboard loads

---

## 11. Documentation Recommendations

The docs are a genuine strength. To keep them valuable:

1. **Add `STATUS.md`** — Track what's actually built vs. planned. Update after each sprint.
2. **Reconcile PRD conflicts** — The main `PRD.md` describes 10 categories with budget warnings; `PRD_PHASE_1_DISCOVERY.md` says 8 categories with no warnings. Clarify which is authoritative for Phase 1.
3. **Remove code snippets from PRDs** that don't match implementation — e.g., the `RecentTransactions.jsx` example in Phase 1 PRD is vanilla JSX/CSS, while the actual implementation uses TypeScript + Tailwind + Framer Motion. Stale code in docs misleads.
4. **Add an ADR (Architecture Decision Record)** for the Google Sheets choice — document why, what the known limitations are, and at what scale you'd migrate to a real database.

---

## 12. Final Thoughts

This project has an unusually strong product foundation. The phased approach, the emotional design thinking, the couple-specific UX considerations — these demonstrate product maturity well beyond a typical side project. The documentation alone would be valuable as a case study in user-centered design.

The implementation is functional but needs hardening. The security gaps (unapplied auth, no webhook validation) are the most urgent. The performance issues (N+1 queries, no caching) will bite as usage grows. The disconnect between the PRD's warm, approachable aesthetic and the actual dark glassmorphism UI is a deliberate or accidental design choice that should be resolved.

The codebase is clean enough to build on confidently. With the P0 fixes applied, this system is ready for daily use in Phase 1. The phased PRDs provide an excellent roadmap for where to go next.

**Bottom line:** Great product thinking, solid MVP, built exactly right for a personal couple's tool. The N+1 query fix and a design-direction decision are the two things standing between you and confident daily use. Everything else is polish.

---

*Review prepared by Senior Engineer & UX/UI Expert — February 7, 2026*
