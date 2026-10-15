# Money Manager: Improvements To-Do

A working list of polish, features and technical improvements. Tick items off (`- [x]`) as they're done.

**Priority:** 🔴 high · 🟡 medium · 🟢 nice to have  
**Effort:** S = small (an hour or two) · M = medium (a day) · L = large (several days)

Suggested order: **Phase 1** → **Phase 2** → **Phase 3** → **Phase 4**.
If only three things get done next: in-app dialogs + undo, budgets, recurring expenses.

---

## Phase 1: Polish (UI/UX)

### In-app dialogs instead of browser pop-ups
- [x] 🔴 **M** Replace all browser `prompt()` (7), `alert()` (15) and `confirm()` (16) calls with in-app sheets/dialogs that match the app's design _(in-app dialog: `showDialog` / `askConfirm` / `askText` / `showMessage`)_
  - e.g. "New subcategory name", "Delete this expense?", "Your UPI ID", "New group name"
- [x] 🔴 **S** "Deleted · **Undo**" toast instead of "Are you sure?" for deletes (expenses, settle-ups, bills) _(expenses, payments, shared bills and payments, groups on this device)_
- [x] 🟡 **S** Small confirmation toasts: "Saved ✓", "Copied ✓", "Payment recorded ✓" _(added / saved / payment recorded / imported)_

### Faster "Add expense" flow
- [x] 🔴 **S** Recently used categories as one-tap chips at the top of the form
- [x] 🟡 **S** Amount field first, with the number keypad open straight away _(it already was; keypad opens with the form)_
- [x] 🟡 **S** Date shown as "Today", with quick chips for Yesterday / pick a date _(chips: Today / Yesterday / 2 days ago)_
- [x] 🟡 **S** "Save & add another" button for entering several bills in a row _(keeps type and date)_

### Empty states, loading, first impressions
- [x] 🟡 **S** Friendly empty states with a clear next step (no expenses this month, no groups, no friends yet) _(transactions, search, charts)_
- [x] 🟡 **S** Skeleton placeholders instead of blank areas while shared groups load _(shared groups card while connecting)_
- [x] 🟢 **M** Short 3-screen intro for new users: Track → Split → Sync _(already covered by the existing first-run guide (`startGuide`))_

### Visual consistency
- [ ] 🟡 **M** One icon style throughout (today emoji mix with text symbols like ✕ ‹ ›)
- [ ] 🟡 **S** Consistent card spacing and one clear button hierarchy (primary / secondary / text link)
- [ ] 🟢 **M** Swipe left on a transaction to edit or delete
- [x] 🟢 **S** Haptic feedback (vibration) on save and delete, on Android _(on save and delete)_

### Accessibility
- [x] 🟡 **M** Keep keyboard and screen-reader focus inside open popups; return focus when they close _(dialogs trap focus; sheets get role="dialog", Escape closes, focus returns)_
- [x] 🟡 **S** Check text contrast in dark mode (especially muted text and coloured amounts) _(fixed: accent and red text now use lighter `--accent-ink` / `--danger-ink` in dark mode; light muted grey darkened to pass 4.5:1)_
- [x] 🟡 **S** Make every tap target at least 44px (small ✕ buttons, chips) _(small ✕ and close buttons enlarged; chips 34px+)_

---

## Phase 2: Foundation (architecture & reliability)

### Code structure
- [ ] 🔴 **L** Split the single `index.html` (~6,650 lines) into modules: storage, sync (Drive/GitHub), cloud (Firebase), split & groups, charts & reports, bill photos & scanning, UI
  - Plain ES modules or a light build tool (e.g. Vite); still deployed free on GitHub Pages

### Automated tests
- [ ] 🔴 **M** Unit tests for the money logic: split shares (equal/custom), simplify debts, group balances, spending report, scanned-bill share calculation, sync merge (newer change wins, deletions)
- [ ] 🟡 **M** End-to-end tests for the main flows (add/edit/delete expense, split, shared group with the Firebase emulator, bill photo sync)
- [ ] 🟡 **S** Run the tests on every push with GitHub Actions
- [ ] 🟡 **S** Run the Firestore security-rules tests (`firestore.rules`) in CI too

### Reliability
- [ ] 🔴 **S** "Update available, tap to refresh" banner, and bump `VERSION` in `sw.js` on each release, so phones always run the latest version
- [ ] 🟡 **M** Move expenses/categories from browser localStorage (~5 MB limit) to IndexedDB (already used for bill photos)
- [ ] 🟡 **M** Firebase **App Check** (reCAPTCHA) so only the real app can use the project's Gemini and Firestore free allowance
- [ ] 🟡 **S** Restore API key restrictions in Google Cloud if loosened while debugging: browser key → websites `https://rohanbas95.github.io/*` and `https://moneymanager-713e3.firebaseapp.com/*`, plus the 5 APIs (Cloud Firestore, Firebase AI Logic, Firebase Installations, Identity Toolkit, Token Service). Leave the "Gemini Developer API key" with no website restriction.
- [ ] 🟡 **M** Deleting a shared group should also remove its bills, payments and UPI entries from Firebase (today they stay stored, though unreadable)
- [ ] 🟢 **S** Test GitHub sync for bill photos (written but untested; GitHub sync is hidden in the UI)

### Monitoring
- [ ] 🟢 **S** "Send diagnostic info" button in Settings (app version, sync state, last errors) to make phone issues easier to debug
- [ ] 🟢 **M** Lightweight error reporting so failures on phones are visible

---

## Phase 3: Features (product)

### Most valuable
- [ ] 🔴 **M** **Budgets:** monthly limit per category (e.g. Food ₹6,000), progress bars, "80% used" warning
- [ ] 🔴 **M** **Recurring expenses & income:** rent, salary, subscriptions, EMIs added automatically each month
  - [ ] 🟡 **S** "Subscriptions" list with the monthly total
- [ ] 🟡 **M** **Monthly insights:** "You spent 18% more on Food than last month", top categories, biggest expense
  - [ ] 🟡 **M** Month-by-month trend chart
- [ ] 🟡 **S** **Export to CSV / Excel** (today only a JSON backup exists)

### Nice to have
- [ ] 🟢 **M** **Accounts / payment methods:** Cash, UPI, Credit card, with a balance for each
- [ ] 🟢 **M** **Search filters:** amount range, category, person, date range (today: text search only)
- [ ] 🟢 **S** Home-screen shortcut to "Add expense" (installed-app shortcut in `manifest.webmanifest`)

---

## Phase 4: Split extras

- [ ] 🟡 **S** **Nudge reminders:** share a WhatsApp message with the amount owed and your UPI ID
- [ ] 🟡 **S** **"🔍 Read again more carefully"** on the Split by items screen: re-reads the same bill with Gemini 3.8 Flash (20 free requests/day) when Flash-Lite misreads
- [ ] 🟢 **L** **Bill photos on shared-group bills** (option C), visible to everyone in the group
  - Needs either the Firebase Blaze plan (Cloud Storage) or a free workaround (small compressed image stored in Firestore, under 1 MB)
- [ ] 🟢 **S** Optional: after "Pay with UPI", ask "Did the payment go through?" on return and save the settle-up with one tap
- [ ] 🟢 **S** "Simplify debts" setting also applied to the "Friends on this device" list, the Split tab's top totals, and the 📤 Share summary for device groups

---

## Housekeeping

- [ ] 🔴 **S** Commit the current work on `splitshared` and deploy to GitHub Pages
- [ ] 🔴 **S** Review `privacy.html` before publishing (bill photos, shared groups / Firebase, Gemini free tier may use scanned photos)
- [ ] 🟡 **S** Close the GitHub secret-scanning alert for the Firebase web API key as "False positive": the key is public by design and restricted in Google Cloud
- [ ] 🟢 **S** Keep an eye on free-tier usage: Firebase console → Usage and billing; Gemini limits at https://ai.dev/rate-limit

---

## Reference

- **Gemini models:** bill scanning tries `gemini-3.5-flash-lite` first, then `gemini-3.8-flash` (free tier: 20 requests/day). Daily limits reset at midnight US Pacific (12:30 / 13:30 IST).
- **Firestore free (Spark) limits:** 1 GiB stored, 50K reads/day, 20K writes/day, 20K deletes/day, 10 GiB/month downloads. Spark has no billing account, so going over a limit pauses that feature; it is never charged.
- **Security rules:** `firestore.rules` must be republished in the Firebase console whenever it changes.
