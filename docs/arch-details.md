# tskcanvas Browser Extension - Architecture Details

> **Master Document**: Comprehensive view of the browser extension architecture
> **Last Updated**: 2024-12-12

---

## 1. Overview

### Purpose
A lightweight browser extension that saves all open browser tabs as a new tree in tskcanvas with one click.

### Core Functionality
1. Captures all open tabs in the current browser window
2. Authenticates with Clerk (same auth as tskcanvas.com via Sync Host)
3. Sends tabs to the tskcanvas Convex backend
4. Creates a hierarchical tree with each tab as a task

### User Flow
```
User clicks extension icon
        ↓
Extension checks auth status
        ↓
[Signed Out] → Show sign-in prompt → User signs in via Sync Host
[Signed In] → Continue
        ↓
Extension captures all open tabs
        ↓
User sees tab preview + tree name input
        ↓
User clicks "Save to tskcanvas"
        ↓
Extension sends data to Convex API
        ↓
Success notification with link to view tree
```

---

## 2. Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Manifest V3 | Chrome extension standard (2024+) |
| **Build Tool** | Plasmo | Better DX, auto-generates manifest |
| **Auth** | `@clerk/chrome-extension` v2+ | Sync Host for seamless auth |
| **UI** | React + Clerk hooks | ClerkProvider, useClerk, useUser |
| **Backend** | Convex | Existing tskcanvas backend |
| **Cross-browser** | WebExtension Polyfill | Firefox/Edge support (optional) |

---

## 3. Project Structure

```
tskcanvas-extension/
├── package.json              # Dependencies + manifest config
├── .env                      # Environment variables (not committed)
├── .env.example              # Template for .env
├── tsconfig.json             # TypeScript config
│
├── src/
│   ├── popup.tsx             # Main popup UI (Plasmo convention)
│   ├── popup.css             # Popup styles
│   ├── background.ts         # Service worker (Plasmo convention)
│   │
│   └── lib/
│       ├── api.ts            # Convex API calls
│       ├── auth.ts           # Auth helpers (message passing)
│       └── tabs.ts           # Chrome tabs helpers
│
├── assets/
│   ├── icon-16.png           # Toolbar icon
│   ├── icon-48.png           # Extension management
│   └── icon-128.png          # Chrome Web Store
│
├── docs/
│   ├── arch-details.md       # This file (master doc)
│   └── tasks/
│       ├── current.md        # Active task list
│       └── completed/        # Completed task archives
│
└── build/                    # Generated output (not committed)
    └── chrome-mv3-prod/      # Production build
```

---

## 4. Authentication Architecture

### Sync Host Pattern
The extension uses Clerk's **Sync Host** feature to share authentication state with tskcanvas.com:

```
┌─────────────────────┐     ┌──────────────────────┐
│   tskcanvas.com     │     │  Browser Extension   │
│   (Web App)         │     │  (Chrome)            │
├─────────────────────┤     ├──────────────────────┤
│ User signs in       │────▶│ Session synced       │
│ via Clerk           │     │ automatically        │
│                     │     │                      │
│ Session stored in   │     │ No separate          │
│ cookies             │     │ sign-in needed       │
└─────────────────────┘     └──────────────────────┘
```

### Message Passing Flow
```
┌─────────────────┐          ┌──────────────────────┐
│    popup.tsx    │          │   background.ts      │
├─────────────────┤          ├──────────────────────┤
│                 │─getToken▶│ clerk.session        │
│                 │          │   .getToken()        │
│                 │◀─token───│                      │
│                 │          │                      │
│ Uses token to   │          │ Clerk client         │
│ call Convex API │          │ manages session      │
└─────────────────┘          └──────────────────────┘
```

### Supported Sign-in Methods
| Method | Supported | Notes |
|--------|-----------|-------|
| Email + Password | ✅ Yes | Works in popup |
| Email codes (OTP) | ✅ Yes | Works in popup |
| OAuth (Google) | ❌ No | Popup closes during redirect |
| Magic links | ❌ No | Popup must stay open |
| **Sync Host** | ✅ Yes | **Recommended** |

---

## 5. API Contract

### Extension → Backend

**Endpoint**: `POST /api/extension/save-tabs`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body**:
```typescript
{
  treeName: string;           // e.g., "Saved Tabs - 12/12/2024"
  tabs: Array<{
    url: string;              // Full URL
    title: string;            // Page title
    favIconUrl?: string;      // Optional favicon URL
  }>;
}
```

**Response (Success)**:
```typescript
{
  success: true;
  treeId: string;             // Convex document ID
  url: string;                // Direct link to tree on tskcanvas.com
}
```

**Response (Error)**:
```typescript
{
  success: false;
  error: string;              // Error message
}
```

---

## 6. Permissions

### Chrome Permissions (manifest.json)

| Permission | Purpose | Required |
|------------|---------|----------|
| `tabs` | Query open tabs | ✅ Yes |
| `storage` | Store user preferences | ✅ Yes |
| `cookies` | Clerk Sync Host session | ✅ Yes |

### Host Permissions

| Host | Purpose |
|------|---------|
| `https://tskcanvas.com/*` | Sync Host for auth |
| `https://*.convex.cloud/*` | Backend API calls |
| `https://*.clerk.accounts.dev/*` | Clerk authentication |

---

## 7. UI Components

### Popup States

```
┌─────────────────────────────────────────────┐
│ STATE: SIGNED OUT                           │
├─────────────────────────────────────────────┤
│                                             │
│   Sign in to tskcanvas                      │
│                                             │
│   Connect your account to save tabs.        │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │          Sign in                    │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   Tip: Sign in at tskcanvas.com for         │
│        automatic sync                       │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ STATE: SIGNED IN (Ready to Save)            │
├─────────────────────────────────────────────┤
│                                             │
│   Save 12 tabs          user@email.com     │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ Saved Tabs - 12/12/2024            │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │ 🌐 GitHub - project/repo           │   │
│   │ 📄 Stack Overflow - question...     │   │
│   │ 🔧 npm - package-name               │   │
│   │ ... (scrollable)                    │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │       Save to tskcanvas             │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ STATE: SUCCESS                              │
├─────────────────────────────────────────────┤
│                                             │
│   ✓ Saved!                                  │
│                                             │
│   12 tabs saved to tree.                    │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │          View Tree                  │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ STATE: ERROR                                │
├─────────────────────────────────────────────┤
│                                             │
│   Error                                     │
│                                             │
│   Failed to save tabs: Network error        │
│                                             │
│   ┌─────────────────────────────────────┐   │
│   │          Try again                  │   │
│   └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 8. Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_xxx` |
| `PLASMO_PUBLIC_CONVEX_URL` | Convex deployment URL | `https://xxx.convex.cloud` |

---

## 9. Build & Deploy

### Development
```bash
npm run dev          # Start development server
# Load extension from build/chrome-mv3-dev in Chrome
```

### Production Build
```bash
npm run build        # Build for Chrome
# Output: build/chrome-mv3-prod
```

### Firefox Build (Optional)
```bash
npm run build -- --target=firefox-mv2
# Output: build/firefox-mv2-prod
```

### Publishing Checklist
1. [ ] Chrome Web Store account created
2. [ ] $5 registration fee paid
3. [ ] Production build generated
4. [ ] Store listing prepared (screenshots, description)
5. [ ] Privacy policy URL ready
6. [ ] Extension submitted for review

---

## 10. Debugging

### Inspect Popup
Right-click extension icon → "Inspect popup"

### Inspect Background Worker
`chrome://extensions` → Find extension → "Inspect views: service worker"

### Common Issues

| Issue | Solution |
|-------|----------|
| Session not found | Check `cookies` permission, verify Sync Host config |
| Token request fails | Use message passing (not direct `getToken()`) |
| OAuth doesn't work | Expected - use Sync Host instead |
| Extension ID missing | Load unpacked first, get ID from chrome://extensions |

---

## 11. Future Enhancements (Out of Scope)

- [ ] Tab grouping by domain
- [ ] Selective tab saving (checkboxes)
- [ ] Keyboard shortcut to trigger save
- [ ] Context menu integration
- [ ] Cross-device sync indicator
- [ ] Undo last save
- [ ] Favorites/pinned tabs handling
- [ ] Tab group name import

---

## 12. Related Documentation

| Document | Purpose |
|----------|---------|
| `tskcanvas-extension-docs.md` | Original spec + code samples |
| `docs/tasks/current.md` | Active task tracking |
| `docs/tasks/completed/*.md` | Completed task archives |
