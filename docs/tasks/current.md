# tskcanvas Browser Extension - Master Task List

> **Project Goal**: Save all open browser tabs as a new tree in tskcanvas with one click
> **Estimated Total Hours**: 10-15 hours
> **Last Updated**: 2024-12-12

---

## Phase 1: Project Setup & Clerk Configuration (1-2 hrs)
**Status**: 🔴 Not Started

### 1.1 Initialize Plasmo Project
- [ ] Run `npm create plasmo@latest tskcanvas-extension -- --with-clerk`
- [ ] Verify project structure matches expected layout
- [ ] Install additional dependencies (if needed)
- [ ] Create `.env` file with placeholders

### 1.2 Environment Configuration
- [ ] Add `PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env`
- [ ] Add `PLASMO_PUBLIC_CONVEX_URL` to `.env`
- [ ] Create `.env.example` for reference
- [ ] Add `.env` to `.gitignore`

### 1.3 Clerk Dashboard Setup
- [ ] Add Sync Host: `tskcanvas.com` (Settings → Paths)
- [ ] Add Extension Origin: `chrome-extension://<extension-id>` (Settings → Domains → Allowed Origins)
- [ ] Verify JWT Template `convex` exists
- [ ] Document extension ID retrieval process

### 1.4 Manifest Configuration
- [ ] Configure permissions in `package.json`: `tabs`, `storage`, `cookies`
- [ ] Configure host_permissions: `tskcanvas.com/*`, `*.convex.cloud/*`, `*.clerk.accounts.dev/*`
- [ ] Verify Plasmo generates correct `manifest.json`

---

## Phase 2: Authentication Implementation (2-3 hrs)
**Status**: 🔴 Not Started

### 2.1 Background Service Worker (`src/background.ts`)
- [ ] Import and configure `createClerkClient` from `@clerk/chrome-extension`
- [ ] Set `syncHost` to `https://tskcanvas.com`
- [ ] Implement `getToken` message handler (JWT with `convex` template)
- [ ] Implement `isSignedIn` message handler
- [ ] Implement `signOut` message handler
- [ ] Add auth state change listener for logging

### 2.2 Auth Helper Functions (`src/lib/auth.ts`)
- [ ] Create `getAuthToken()` function using message passing
- [ ] Create `checkIsSignedIn()` function
- [ ] Add proper error handling for `chrome.runtime.lastError`
- [ ] Add TypeScript types for message responses

### 2.3 Test Authentication Flow
- [ ] Load unpacked extension in Chrome
- [ ] Get extension ID from `chrome://extensions`
- [ ] Add extension ID to Clerk allowed origins
- [ ] Test sign-in via tskcanvas.com (Sync Host)
- [ ] Verify token retrieval works
- [ ] Test sign-out functionality

---

## Phase 3: Tab Capture Implementation (1 hr)
**Status**: 🔴 Not Started

### 3.1 Tab Helper Functions (`src/lib/tabs.ts`)
- [ ] Define `Tab` interface: `url`, `title`, `favIconUrl`
- [ ] Define `EXCLUDED_URL_PREFIXES` array:
  - `chrome://`
  - `chrome-extension://`
  - `edge://`
  - `about:`
  - `moz-extension://`
  - `file://`
  - `devtools://`
- [ ] Implement `getAllTabs()` function using `chrome.tabs.query`
- [ ] Filter out excluded URLs
- [ ] Map tabs to clean `Tab` objects

### 3.2 Test Tab Capture
- [ ] Open multiple tabs in browser
- [ ] Verify excluded URLs are filtered
- [ ] Verify title fallback to hostname works
- [ ] Verify favIconUrl is captured (when available)

---

## Phase 4: API Integration (2-3 hrs)
**Status**: 🔴 Not Started

### 4.1 API Helper Functions (`src/lib/api.ts`)
- [ ] Define `SaveTabsResponse` interface
- [ ] Implement `saveTabsToTree()` function
- [ ] Configure proper headers: `Content-Type`, `Authorization` (Bearer token)
- [ ] Handle error responses with meaningful messages

### 4.2 Convex Backend Endpoint (tskcanvas main repo)
- [ ] Create `api/extension/save-tabs` HTTP endpoint
- [ ] Validate JWT token from extension
- [ ] Parse incoming tabs array
- [ ] Create new tree with provided name
- [ ] Create task for each tab (with URL and title)
- [ ] Return `treeId` and `url` for navigation

### 4.3 Test API Integration
- [ ] Test endpoint with valid token
- [ ] Test endpoint with invalid/expired token
- [ ] Verify tree creation in tskcanvas
- [ ] Verify tasks are created with correct data

---

## Phase 5: UI Implementation (2-3 hrs)
**Status**: 🔴 Not Started

### 5.1 Popup Component (`src/popup.tsx`)
- [ ] Set up `ClerkProvider` with `syncHost`
- [ ] Create main `Popup` component with `SignedIn`/`SignedOut` conditionals

### 5.2 SignedIn Content
- [ ] Display user email
- [ ] Show tab count
- [ ] Tree name input (default: "Saved Tabs - [Date]")
- [ ] Scrollable tab preview list with favicons
- [ ] "Save to tskcanvas" button
- [ ] Loading state during save
- [ ] Success view with "View Tree" link
- [ ] Error view with "Try again" button

### 5.3 SignedOut Content
- [ ] "Sign in to tskcanvas" header
- [ ] Explanation text
- [ ] Sign-in button (opens Clerk modal)
- [ ] Tip about tskcanvas.com sign-in for Sync Host

### 5.4 Styling (`src/popup.css`)
- [ ] Set popup width to 320px
- [ ] Style input fields
- [ ] Style buttons (primary blue, hover states, disabled states)
- [ ] Style tab list (scrollable, truncated titles)
- [ ] Style success/error states
- [ ] Match tskcanvas brand colors (if applicable)

---

## Phase 6: Polish & Assets (1-2 hrs)
**Status**: 🔴 Not Started

### 6.1 Extension Icons
- [ ] Create or obtain `icon-16.png`
- [ ] Create or obtain `icon-48.png`
- [ ] Create or obtain `icon-128.png`
- [ ] Place icons in `assets/` folder
- [ ] Verify icons display correctly in toolbar

### 6.2 UX Improvements
- [ ] Add loading spinner during tab fetch
- [ ] Add keyboard shortcuts (optional)
- [ ] Add "Select All / Deselect All" for tabs (optional)
- [ ] Improve error messages for common failures
- [ ] Add analytics/logging (optional)

### 6.3 Code Cleanup
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

### 7.2 Build for Production
- [ ] Run `npm run build`
- [ ] Verify `build/chrome-mv3-prod` output
- [ ] Test production build locally

### 7.3 Chrome Web Store Submission
- [ ] Create Chrome Web Store Developer account (if needed)
- [ ] Pay $5 registration fee (if first time)
- [ ] Prepare store listing:
  - [ ] Extension name: "tskcanvas Tab Saver"
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

## Known Limitations & Notes

### Sign-in Limitations (by design)
- ✅ Email + Password works
- ✅ Email codes (OTP) works
- ❌ OAuth (Google, GitHub) - popup closes during redirect
- ❌ Magic links - requires popup to stay open

### Best Practice
- Use **Sync Host** so users sign in once on tskcanvas.com and the extension automatically picks up their session

### Debugging Tips
- **Popup**: Right-click extension icon → "Inspect popup"
- **Background**: `chrome://extensions` → "Inspect views: service worker"

---

## Quick Reference

| File | Purpose |
|------|---------|
| `src/popup.tsx` | Main popup UI |
| `src/background.ts` | Service worker for auth |
| `src/lib/auth.ts` | Auth helper functions |
| `src/lib/tabs.ts` | Tab capture helpers |
| `src/lib/api.ts` | Convex API calls |
| `assets/` | Extension icons |

---

## Progress Tracking

| Phase | Status | Est. Hours | Actual Hours |
|-------|--------|------------|--------------|
| 1. Setup & Clerk Config | 🔴 Not Started | 1-2 | - |
| 2. Auth Implementation | 🔴 Not Started | 2-3 | - |
| 3. Tab Capture | 🔴 Not Started | 1 | - |
| 4. API Integration | 🔴 Not Started | 2-3 | - |
| 5. UI Implementation | 🔴 Not Started | 2-3 | - |
| 6. Polish & Assets | 🔴 Not Started | 1-2 | - |
| 7. Testing & Publishing | 🔴 Not Started | 1-2 | - |
| **TOTAL** | | **10-15** | - |

**Legend**: 🔴 Not Started | 🟡 In Progress | 🟢 Complete
