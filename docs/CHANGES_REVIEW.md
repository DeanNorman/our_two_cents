# Senior Engineer Review — Phase System Changes

**Reviewer:** Cascade (Senior Engineer)
**Date:** 7 Feb 2026
**Scope:** All uncommitted changes + new files added in this session

---

## Summary

This session introduced a **phase-gating system** that progressively reveals dashboard features as Dean and Abigail advance through their budgeting journey. The system spans both frontend (React context, gate component, settings UI) and backend (phase-aware WhatsApp bot responses).

**Total changes:** 7 modified files, 3 new components, 3 new docs, +142 lines / -14 lines in code.

---

## 1. New Files Created

### `dashboard/src/contexts/PhaseContext.tsx` (101 lines)

**Purpose:** React Context + hook for managing the current phase (1–4) with localStorage persistence.

**What's Good:**
- Clean separation of concerns — context, types, constants, and persistence are all in one file but logically grouped
- `useCallback` on `setPhase` and `isPhaseUnlocked` prevents unnecessary re-renders
- Defensive `try/catch` around localStorage (handles SSR / incognito gracefully)
- `loadPhase` passed as initializer function to `useState` (lazy init, runs once)
- Type-safe `PhaseNumber` union type prevents invalid phases at compile time

**Issues Found:**

1. **No validation on parsed value type.** `parseInt` can return `NaN` or values outside 1–4 for corrupted localStorage. The `>=1 && <=4` check handles this, but `NaN >= 1` is `false`, so it falls through to default. This works but is **accidentally correct** — add a `!isNaN(parsed)` check for clarity.

2. **Phase state lives in two places.** The dashboard reads phase from `localStorage`, but the backend reads it from `APP_PHASE` in `.env`. These can drift. If Dean advances to Phase 2 on the dashboard, the WhatsApp bot still behaves as Phase 1 until someone manually edits `.env` and restarts the server. **This is the biggest architectural gap in the current implementation.**

   **Recommendation:** Either:
   - (Simple) Add a `/api/phase` endpoint that reads/writes phase to a cell in Google Sheets, so both frontend and backend share the same source of truth
   - (Current) Accept the split and document it clearly — dashboard phase controls what you *see*, backend phase controls what the *bot says*

### `dashboard/src/components/PhaseGate.tsx` (19 lines)

**Purpose:** Conditionally renders children based on current phase.

**What's Good:**
- Minimal, single-responsibility component
- `fallback` prop allows showing placeholder/teaser content for locked features
- No side effects, pure render logic

**No issues.** This is exactly what this component should be.

### `dashboard/src/components/PhaseSettings.tsx` (180 lines)

**Purpose:** Modal for viewing/changing phases + a badge component for the sidebar.

**What's Good:**
- Two-step confirmation before phase changes (prevents accidental advances)
- Can only advance one phase at a time (`disabled={phaseNum > phase + 1}`)
- Can go backwards (features hidden, data preserved — clearly communicated to user)
- Good copy: "Make sure you've both discussed this during a Weekly Recon"
- Visual hierarchy is clear: current (blue), unlocked (green), next (dashed border), locked (dimmed)
- Badge and settings exported from the same file — appropriate colocation

**Issues Found:**

1. **Accessibility.** The modal backdrop click-to-close works, but there's no `aria-modal`, `role="dialog"`, or focus trapping. For a two-person app this is fine, but worth noting.

2. **`confirmingPhase` state persists across modal opens.** If you select Phase 2, don't confirm, close the modal, then reopen it — the confirmation banner is still visible. Should reset on close:
   ```tsx
   // In PhaseSettings, add:
   useEffect(() => {
     if (!isOpen) setConfirmingPhase(null);
   }, [isOpen]);
   ```

---

## 2. Modified Files

### `dashboard/src/App.tsx`

**Change:** Wrapped app in `<PhaseProvider>`.

**Verdict:** Correct. Provider is at the right level — above layout and all pages.

### `dashboard/src/layouts/DashboardLayout.tsx`

**Changes:**
- Added `usePhase` hook, `PhaseBadge`, and `PhaseSettings`
- Filters `navItems` by phase (Analytics hidden until Phase 2)
- Phase badge in sidebar (desktop) and header (mobile)
- Phase settings modal

**What's Good:**
- Nav filtering is clean and declarative
- Mobile-responsive — badge shows in header on small screens
- Modal is rendered once at the layout level (not duplicated)

**Issues Found:**

1. **Nav items are statically defined with JSX icons.** The `navItems` array creates new React elements on every module load. This is fine for 4 items but is technically wasteful. Not a real problem here.

2. **Settings and Transactions nav items exist but do nothing.** There are no `/settings` or `/transactions` routes — the app is a single page. Clicking them changes `activeNav` state but doesn't navigate anywhere. This predates my changes but is worth noting. Consider either:
   - Hiding them behind phase gates too
   - Building those pages
   - Removing dead nav items

### `dashboard/src/pages/DashboardHome.tsx`

**Changes:**
- Imported `CategoryVisualizer`, `MonthlyWins`, `InsightsList`, `PhaseGate`, `usePhase`
- Added `Flame` icon for streak display
- Calculated `trackingStreak` via `useMemo`
- Changed stats grid from 2 to 3 columns (added streak)
- Wrapped `CategoryVisualizer` and `MonthlyWins` in `<PhaseGate minPhase={2}>`
- Wrapped `InsightsList` in `<PhaseGate minPhase={3}>`

**What's Good:**
- Streak calculation is correct: counts consecutive days backwards from today/yesterday
- `useMemo` dependency on `uniqueDates` is appropriate
- Phase gates are at the right granularity — whole sections, not individual elements
- Category data mapping is consistent across all gated components

**Issues Found:**

1. **`uniqueDates` is not memoized but used as a `useMemo` dependency.** `uniqueDates` is a `new Set(...)` created on every render. The `trackingStreak` `useMemo` depends on it, but since a new Set is a new reference every render, the memo never actually caches — it recalculates every time.

   **Fix:**
   ```tsx
   const uniqueDates = useMemo(
     () => new Set(recentTransactions.map((t) => t.date.split('T')[0])),
     [recentTransactions]
   );
   ```

2. **Streak calculation uses `86400000` magic number.** Minor readability issue. Could be `const ONE_DAY_MS = 86400000;`. Not important for a two-person app.

3. **`phase` is destructured from `usePhase()` but never used directly.** It's imported but not referenced in the JSX or logic — only `PhaseGate` uses it implicitly. The import is harmless but unnecessary.

### `backend/config/index.js`

**Change:** Added `phase: parseInt(process.env.APP_PHASE || '1', 10)`.

**Verdict:** Clean. Default to Phase 1 if not set. No issues.

### `backend/routes/whatsapp.js`

**Changes:**
- Added `currentPhase` from config
- Phase-gated the `balance` command (Phase 3+ only)
- Phase-gated the transaction reply (simple reply in Phase 1–2, budget reply in Phase 3+)
- Now captures `addTransaction` return value for streak

**What's Good:**
- Graceful degradation — Phase 1 users get a friendly message for `balance`, not an error
- Streak is passed through to reply messages
- `formatSimpleReply` is used for Phase 1–2, `formatBudgetReply` for Phase 3+

**Issues Found:**

1. **`currentPhase` is set at module load, not per-request.** If you change `APP_PHASE` in `.env`, you must restart the server. This is fine for now but means hot-reloading the phase isn't possible. In a deployed environment, this is actually the correct behavior (env vars are set at deploy time).

2. **`categoryInfo` lookup uses `c.categoryId` but category objects have `c.id`.** Looking at the categories API response:
   ```json
   {"id": "groceries", "name": "groceries", "displayName": "Groceries", ...}
   ```
   The field is `id`, not `categoryId`. So `categories.find(c => c.categoryId === parsed.category)` will always return `undefined`, and `categoryInfo` will always be `null`. This means `formatSimpleReply` falls back to `transaction.category` for the display name (which works but loses the icon and proper display name).

   **This bug predates my changes** — it was in the original code. But I carried it forward.

   **Fix (in whatsapp.js line 93):**
   ```javascript
   const categoryInfo = categories.find(c => c.id === parsed.category);
   ```

### `backend/services/twilioService.js`

**Change:** Added `formatSimpleReply` method.

**What's Good:**
- Clean, minimal reply format for Phase 1
- Streak gamification built in (only shows for streaks > 1 day)
- Consistent format with `formatBudgetReply`

**Issues Found:**

1. **`formatBudgetReply` is now functionally identical to `formatSimpleReply`.** Looking at the current `formatBudgetReply` code — it never actually uses the `budgetStatus` parameter. It builds the exact same message as `formatSimpleReply`. This means the Phase 3 budget reply doesn't actually show budget information.

   **This is from the previous commit's refactor** where `formatBudgetReply` was simplified for Phase 1. The budget display logic was stripped out but the method signature kept the parameter. When Phase 3 is activated, the bot will still just say "Logged: R85.00 — Dining Out" with no budget context.

   **Fix:** Restore the budget status display in `formatBudgetReply`:
   ```javascript
   formatBudgetReply(transaction, budgetStatus, categoryInfo) {
     // ... existing message building ...

     // Add budget context (Phase 3+)
     if (budgetStatus) {
       const { totalSpent, budgetAmount, remaining, percentUsed } = budgetStatus;
       message += `\n📊 ${displayName}: R${totalSpent} of R${budgetAmount} used (${percentUsed}%)`;
       message += `\n💰 R${remaining} remaining`;
     }

     return message;
   }
   ```

2. **`icon` variable is declared but never used** in both `formatSimpleReply` and `formatBudgetReply`. Minor dead code.

---

## 3. New Documentation

### `docs/PHASE_1_GUIDE.md`

Practical usage guide for Dean and Abigail covering how to log spends, weekly rituals, monthly check-ins, and when to advance to Phase 2.

**Verdict:** Excellent. Tone is right for the audience, actionable, and includes a quick reference card. The "What NOT to Say" section during Weekly Recons is particularly good — it sets the emotional framework correctly.

### `docs/HOSTING_OPTIONS.md`

Covers 5 backend hosting options (Railway, Render, Fly.io, Vercel, VPS) and 3 dashboard hosting options (Vercel, Netlify, GitHub Pages), with costs, setup steps, pros/cons, and a migration checklist.

**Verdict:** Thorough and well-structured. Recommendation (Railway + Vercel) is sound for the use case.

### `docs/PROJECT_REVIEW.md`

Comprehensive project review from previous session covering architecture, code quality, and recommendations.

**Verdict:** Already reviewed and discussed.

---

## 4. Bug Summary

| # | Severity | File | Issue |
|---|----------|------|-------|
| 1 | **High** | `whatsapp.js:93` | `c.categoryId` should be `c.id` — bot never finds category info |
| 2 | **High** | `twilioService.js` | `formatBudgetReply` doesn't use `budgetStatus` — Phase 3 bot replies won't show budgets |
| 3 | **Medium** | `PhaseContext.tsx` + `backend/.env` | Phase state split between localStorage and env var — can drift |
| 4 | **Low** | `DashboardHome.tsx` | `uniqueDates` not memoized, defeats `trackingStreak` useMemo |
| 5 | **Low** | `PhaseSettings.tsx` | `confirmingPhase` state persists across modal opens |
| 6 | **Low** | `twilioService.js` | `icon` variable unused in both reply methods |
| 7 | **Info** | `DashboardHome.tsx` | `phase` imported from `usePhase()` but unused |

---

## 5. Architecture Assessment

### What Works Well

- **Phase model maps cleanly to PRD.** The 4 phases (Discovery → Understanding → Confidence → Goals) translate directly to `PhaseNumber` 1–4. Feature gates are at sensible boundaries.
- **No data migration needed between phases.** All transaction data is captured identically regardless of phase. Phase 2–4 features just interpret the same data differently.
- **Separation of concerns.** Context for state, gate for conditional rendering, settings for UI. Each has one job.
- **Progressive disclosure is correct for the UX.** Phase 1 users see a clean, unintimidating dashboard. No budget bars, no warnings, no "you overspent" messaging.

### What Needs Attention

- **Phase sync between frontend and backend** is the biggest gap. Today it requires manual coordination. A shared phase source (Google Sheets cell or API endpoint) would eliminate this.
- **Nav items for unbuilt pages** create a confusing UX. Transactions and Settings links don't go anywhere.
- **The `formatBudgetReply` regression** means Phase 3 won't actually work as intended when you get there. This should be fixed before you forget about it.
- **The `categoryId` vs `id` bug** means bot replies show raw category keys instead of display names. This makes the bot say "Logged: R85.00 — groceries" instead of "Logged: R85.00 — Groceries" with the 🛒 icon.

---

## 6. Recommendations (Prioritised)

### Fix Now (Before Using Phase 1)

1. **Fix `categoryId` → `id` in `whatsapp.js:93`** — one-line fix, improves every bot reply
2. **Restore budget logic in `formatBudgetReply`** — won't affect Phase 1 but prevents a future surprise
3. **Memoize `uniqueDates`** — minor perf fix, correct React patterns

### Fix Soon (Before Phase 2)

4. **Sync phase between frontend and backend** — add a Google Sheets cell or API endpoint
5. **Reset `confirmingPhase` on modal close** — small UX polish
6. **Remove or gate dead nav items** (Transactions, Settings)

### Consider Later

7. **Add `aria-modal` and focus trapping to PhaseSettings** — accessibility
8. **Extract streak calculation to a shared utility** — backend already calculates it in `sheetsService`, frontend recalculates from transaction dates. Single source would be cleaner.

---

## 7. Hosting Options

A separate guide has been written at `docs/HOSTING_OPTIONS.md` covering all viable hosting options with costs, setup, and tradeoffs.

**Recommended stack for production:**

| Component | Host | Cost |
|-----------|------|------|
| Backend | Railway | ~R90/month |
| Dashboard | Vercel | Free |
| WhatsApp | Twilio production number | ~R20/month |
| Database | Google Sheets (no change) | Free |
| **Total** | | **~R110/month** |

This eliminates ngrok, sandbox session expiry, and the need to keep your Mac running. Full details in the hosting guide.

---

## Final Verdict

The phase system is **well-designed and correctly implemented** for Phase 1 use. The two high-severity bugs (#1 and #2) should be fixed immediately — they're both one-line changes. The phase sync issue (#3) should be addressed before advancing to Phase 2 so the bot and dashboard stay aligned.

The codebase is in good shape for a personal app. Ship Phase 1, use it for 6–8 weeks, and fix the bugs along the way.
