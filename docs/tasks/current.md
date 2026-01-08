# mastercanvas Browser Extension - Master Task List

> **Project Goal**: Save all open browser tabs as a new tree in mastercanvas with one click
> **Estimated Total Hours**: 10-15 hours
> **Last Updated**: 2024-12-12

---

## Phase 1: Project Setup & Clerk Configuration (1-2 hrs)
**Status**: 🟢 Complete (Code) / 🟡 Pending (Dashboard Config)

### 1.1 Initialize Plasmo Project ✅
- [x] ~~Run `npm create plasmo@latest mastercanvas-extension -- --with-clerk`~~ (Manual setup - template deprecated)
- [x] Verify project structure matches expected layout
- [x] Install dependencies: `plasmo`, `@clerk/chrome-extension`, `react`, `react-dom`
- [x] Create `.env` file with placeholders

### 1.2 Environment Configuration ✅
- [x] Add `PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env`
- [x] Add `PLASMO_PUBLIC_CONVEX_URL` to `.env`
- [x] Create `.env.example` for reference
- [x] Add `.env` to `.gitignore`

### 1.3 Clerk Dashboard Setup ⏳ (USER ACTION REQUIRED)
- [ ] Add Sync Host: `mastercanvas.app` (Settings → Paths)
- [ ] Add Extension Origin: `chrome-extension://<extension-id>` (Settings → Domains → Allowed Origins)
- [ ] Verify JWT Template `convex` exists
- [ ] Document extension ID retrieval process

### 1.4 Manifest Configuration ✅
- [x] Configure permissions in `package.json`: `tabs`, `storage`
- [x] Configure host_permissions: `mastercanvas.app/*`, `*.convex.cloud/*`, `*.clerk.accounts.dev/*`
- [x] Verify Plasmo generates correct `manifest.json`

---

## Phase 2: Authentication Implementation (2-3 hrs)
**Status**: 🟢 Complete (Code) / ⏳ Testing Required

### 2.1 Background Service Worker (`src/background.ts`) ✅
- [x] ~~Import and configure `createClerkClient`~~ (API changed - using ClerkProvider in popup)
- [x] Basic service worker setup for extension lifecycle
- [x] Message handler stub for future use

### 2.2 Auth in Popup (Updated Approach) ✅
- [x] Use `ClerkProvider` with `syncHost` directly in popup
- [x] Use `useAuth` hook for `getToken({ template: "convex" })`
- [x] Use `useUser` hook for user info
- [x] Use `useClerk` hook for sign-in/out
- [x] Configure OAuth routing with hash-based navigation
- [x] Add `SignUp` component with proper routing

### 2.3 Google OAuth & Logout Improvements (2026-01-04) ✅
- [x] Add proper `SignIn` and `SignUp` components with routing
- [x] Configure hash-based routing for OAuth redirects (`signInUrl`, `signUpUrl`)
- [x] Add user menu dropdown component
- [x] Implement logout functionality with `useClerk().signOut()`
- [x] Add user info display (email + name) in dropdown
- [x] Style dropdown with animations and hover states
- [x] Add authentication mode switcher (welcome/signin/signup)
- [x] Update welcome screen with Sign In / Sign Up options

### 2.4 Test Authentication Flow ⏳ (USER ACTION REQUIRED)
- [ ] Load unpacked extension in Chrome
- [ ] Get extension ID from `chrome://extensions`
- [ ] Add extension ID to Clerk allowed origins in dashboard
- [ ] **Test Google OAuth sign-in** (new - should work with proper routing)
- [ ] **Test Google OAuth sign-up** (new - should work with proper routing)
- [ ] Test sign-in via mastercanvas.app (Sync Host)
- [ ] **Test logout dropdown functionality** (new)
- [ ] Verify token retrieval works
- [ ] Test sign-out functionality

---

## Phase 3: Tab Capture Implementation (1 hr)
**Status**: 🟢 Complete

### 3.1 Tab Helper Functions (`src/lib/tabs.ts`) ✅
- [x] Define `Tab` interface: `url`, `title`, `favIconUrl`
- [x] Define `EXCLUDED_URL_PREFIXES` array (chrome://, edge://, etc.)
- [x] Implement `getAllTabs()` function using `chrome.tabs.query`
- [x] Filter out excluded URLs
- [x] Map tabs to clean `Tab` objects

### 3.2 Test Tab Capture ⏳
- [ ] Open multiple tabs in browser
- [ ] Verify excluded URLs are filtered
- [ ] Verify title fallback to hostname works
- [ ] Verify favIconUrl is captured (when available)

---

## Phase 4: API Integration (2-3 hrs)
**Status**: 🟡 In Progress (Extension side complete, backend needed)

### 4.1 API Helper Functions (`src/lib/api.ts`) ✅
- [x] Define `SaveTabsResponse` interface
- [x] Implement `saveTabsToTree()` function
- [x] Configure proper headers: `Content-Type`, `Authorization` (Bearer token)
- [x] Handle error responses with meaningful messages

### 4.2 Convex Backend Endpoint (mastercanvas main repo) ⏳
- [ ] Create `api/extension/save-tabs` HTTP endpoint
- [ ] Validate JWT token from extension
- [ ] Parse incoming tabs array
- [ ] Create new tree with provided name
- [ ] Create task for each tab (with URL and title)
- [ ] Return `treeId` and `url` for navigation

### 4.3 Test API Integration ⏳
- [ ] Test endpoint with valid token
- [ ] Test endpoint with invalid/expired token
- [ ] Verify tree creation in mastercanvas
- [ ] Verify tasks are created with correct data

---

## Phase 5: UI Implementation (2-3 hrs)
**Status**: 🟢 Complete

### 5.1 Popup Component (`src/popup.tsx`) ✅
- [x] Set up `ClerkProvider` with `syncHost`
- [x] Create main `Popup` component with `SignedIn`/`SignedOut` conditionals

### 5.2 SignedIn Content ✅
- [x] Display user email
- [x] Show tab count
- [x] Tree name input (default: "Saved Tabs - [Date]")
- [x] Scrollable tab preview list with favicons
- [x] "Save to mastercanvas" button
- [x] Loading state during save
- [x] Success view with "View Tree" link
- [x] Error view with "Try again" button

### 5.3 SignedOut Content ✅
- [x] "Sign in to mastercanvas" header
- [x] Explanation text
- [x] Sign-in button (opens Clerk modal)
- [x] Tip about mastercanvas.app sign-in for Sync Host

### 5.4 Styling (`src/popup.css`) ✅
- [x] Set popup width to 320px
- [x] Style input fields
- [x] Style buttons (primary blue, hover states, disabled states)
- [x] Style tab list (scrollable, truncated titles)
- [x] Style success/error states
- [x] Clean scrollbar styling

---

## Phase 6: Polish & Assets (1-2 hrs)
**Status**: 🟡 In Progress

### 6.1 Extension Icons ✅
- [x] Create placeholder icons (16/32/48/64/128px)
- [x] Blue "T" logo using sharp
- [x] Verify icons display correctly in build
- [ ] Replace with final mastercanvas branded icons (optional)

### 6.2 UX Improvements ⏳
- [ ] Add loading spinner during tab fetch
- [ ] Add keyboard shortcuts (optional)
- [ ] Add "Select All / Deselect All" for tabs (optional)
- [ ] Improve error messages for common failures
- [ ] Add analytics/logging (optional)

### 6.3 Code Cleanup ⏳
- [ ] Remove console.log statements (or convert to debug flag)
- [ ] Add JSDoc comments to functions
- [ ] Review TypeScript types for completeness
- [ ] Test all edge cases

---

## Phase 7: Testing & Publishing (1-2 hrs)
**Status**: 🔴 Not Started

### 7.1 Cross-Browser Testing
- [ ] Test in Chrome (primary target)
- [ ] Test in Edge (Chromium-based)
- [ ] Test in Firefox (if targeting)

### 7.2 Build for Production ✅
- [x] Run `npm run build`
- [x] Verify `build/chrome-mv3-prod` output
- [ ] Test production build locally

### 7.3 Chrome Web Store Submission
- [ ] Create Chrome Web Store Developer account (if needed)
- [ ] Pay $5 registration fee (if first time)
- [ ] Prepare store listing:
  - [ ] Extension name: "mastercanvas Tab Saver"
  - [ ] Short description
  - [ ] Detailed description
  - [ ] Screenshots (at least 1)
  - [ ] Privacy policy URL
  - [ ] Category selection
- [ ] Zip `build/chrome-mv3-prod` folder
- [ ] Upload and submit for review
- [ ] Monitor review status (1-3 days)

### 7.4 Firefox Add-ons (Optional)
- [ ] Build: `npm run build -- --target=firefox-mv2`
- [ ] Create Firefox Developer account
- [ ] Submit to Firefox Add-ons

---

## 🎯 Next Steps (Priority Order)

1. **Clerk Dashboard Setup** - Configure Sync Host and extension origin
2. **Convex Backend Endpoint** - Create `/api/extension/save-tabs` in main mastercanvas repo
3. **Test Extension** - Load unpacked and verify full flow
4. **Polish** - Final icons, error handling, code cleanup
5. **Publish** - Chrome Web Store submission

---

## Known Limitations & Notes

### Sign-in Methods (Updated 2026-01-04)
- ✅ Email + Password works
- ✅ Email codes (OTP) works
- 🟡 OAuth (Google, GitHub) - **NEW: Configured with hash-based routing, requires testing**
- ❌ Magic links - requires popup to stay open

### OAuth Improvements (2026-01-04)
- Added proper `SignIn` / `SignUp` components with routing configuration
- Configured `signInUrl="#/sign-in"` and `signUpUrl="#/sign-up"` on ClerkProvider
- Used hash-based routing (`routing="hash"`) to handle redirects in extension context
- **Status**: Code complete, requires user testing to verify Google OAuth works

### Best Practice
- **Primary**: Use **Sync Host** so users sign in once on mastercanvas.app and the extension automatically picks up their session
- **Alternative**: Use direct sign-in/sign-up in extension (now supports OAuth with routing)

### Debugging Tips
- **Popup**: Right-click extension icon → "Inspect popup"
- **Background**: `chrome://extensions` → "Inspect views: service worker"

---

## Quick Reference

| File | Purpose |
|------|---------|
| `src/popup.tsx` | Main popup UI with ClerkProvider |
| `src/background.ts` | Service worker stub |
| `src/lib/tabs.ts` | Tab capture helpers |
| `src/lib/api.ts` | Convex API calls |
| `src/popup.css` | Popup styling |
| `assets/` | Extension icons |

---

## Progress Tracking

| Phase | Status | Est. Hours | Actual Hours |
|-------|--------|------------|--------------|
| 1. Setup & Clerk Config | 🟢 Complete | 1-2 | ~1 |
| 2. Auth Implementation | 🟢 Complete | 2-3 | ~0.5 |
| 3. Tab Capture | 🟢 Complete | 1 | ~0.25 |
| 4. API Integration | 🟡 Extension Done | 2-3 | ~0.5 |
| 5. UI Implementation | 🟢 Complete | 2-3 | ~0.5 |
| 6. Polish & Assets | 🟡 In Progress | 1-2 | ~0.25 |
| 7. Testing & Publishing | 🔴 Not Started | 1-2 | - |
| **TOTAL** | | **10-15** | **~3** |

**Legend**: 🔴 Not Started | 🟡 In Progress | 🟢 Complete
