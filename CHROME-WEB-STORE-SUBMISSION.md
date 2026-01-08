# Chrome Web Store Submission Checklist

## ✅ Build Status: READY

**Build Date:** 2026-01-04  
**Version:** 1.0.1  
**Build Output:** `/Users/jc_io/src/mastercanvas-extension/build/chrome-mv3-prod.zip`  
**File Size:** 704 KB

---

## 📦 What's Included in This Version

### New Features (v1.0.1)
- ✅ Google OAuth Sign-in/Sign-up with proper routing
- ✅ Logout dropdown menu (click email to sign out)
- ✅ Separate Sign In and Sign Up flows
- ✅ Hash-based routing for OAuth redirects
- ✅ User info display in dropdown (email + name)

### Core Features
- ✅ One-click tab saving to MasterCanvas
- ✅ Select which tabs to save (checkboxes)
- ✅ Save tabs from current window or all windows
- ✅ Sync authentication with mastercanvas.app
- ✅ Beautiful gradient UI with animations

---

## 🌐 Chrome Web Store Submission Steps

### 1. Go to Developer Dashboard
**URL:** https://chrome.google.com/webstore/devconsole

### 2. Upload Extension Package
- Click **"New Item"**
- Upload: `build/chrome-mv3-prod.zip` (704 KB)
- Wait for validation to complete

### 3. Fill in Store Listing

#### Product Details
```
Name: MasterCanvas Tab Saver
Category: Productivity
Language: English (United States)
```

#### Description
**Short Description (132 chars):**
```
Save all your browser tabs to MasterCanvas with one click. Organize, share, and never lose important tabs again.
```

**Detailed Description:**
```
MasterCanvas Tab Saver

Save all your open browser tabs to your MasterCanvas workspace with a single click.

✨ FEATURES
• One-click tab saving
• Save tabs from current window or all windows
• Selective tab saving with checkboxes
• Automatic organization in MasterCanvas
• Sync with your MasterCanvas account
• Google Sign-in support

🚀 HOW IT WORKS
1. Click the extension icon
2. Select which tabs to save
3. Give your collection a name
4. Click "Save to MasterCanvas"
5. View your organized tabs at mastercanvas.app

🔒 PRIVACY & SECURITY
• Requires authentication with MasterCanvas
• Only saves tabs you explicitly select
• Data is stored securely in your MasterCanvas account
• No tracking or data collection

📧 SUPPORT
For questions or issues, visit https://mastercanvas.app/support
```

#### Media Assets
**Location:** `/Users/jc_io/src/mastercanvas-extension/screenshots/`

- ✅ **Screenshot:** `store-screenshot.png` (1280 x 800, 436 KB)
  - Shows updated logo (no box, just icon with glow)
  - Full popup with 8 tabs visible
  - No white borders

- ✅ **Icons:** All sizes included in build
  - 16x16, 32x32, 48x48, 64x64, 128x128

#### Privacy Policy
**Required:** You need to host `privacy.html` publicly

**Options:**
1. Host on mastercanvas.app/privacy
2. Host on GitHub Pages
3. Host on your domain

**Privacy Policy URL:** `https://mastercanvas.app/privacy` (update as needed)

---

## 🔧 Technical Information

### Manifest Details
```json
{
  "version": "1.0.1",
  "name": "MasterCanvas Tab Saver",
  "description": "Save all open browser tabs to your MasterCanvas with one click",
  "homepage_url": "https://mastercanvas.app",
  "author": "centerline07"
}
```

### Permissions Required
| Permission | Justification |
|------------|---------------|
| `tabs` | To read open tabs for saving to MasterCanvas |
| `storage` | To store user preferences and settings |
| `cookies` | For authentication sync with mastercanvas.app via Clerk |

### Host Permissions
| Host | Purpose |
|------|---------|
| `https://mastercanvas.app/*` | Sync Host for Clerk authentication |
| `https://*.convex.site/*` | Backend API for saving tabs |
| `https://*.clerk.accounts.dev/*` | Authentication provider |

---

## ⚙️ Post-Upload Configuration

### In Clerk Dashboard
After getting your extension ID from Chrome:

1. Go to Clerk Dashboard → Settings → Domains
2. Add to **Allowed Origins:**
   ```
   chrome-extension://<your-extension-id>
   ```
3. Verify **Sync Host** is set to: `https://mastercanvas.app`
4. Ensure **Google OAuth** is enabled

### Testing After Publication
1. Install extension from Chrome Web Store
2. Test Google Sign-in
3. Test Google Sign-up
4. Test logout dropdown
5. Test tab saving functionality
6. Test Sync Host (sign in at mastercanvas.app, then use extension)

---

## 📋 Pre-Submission Checklist

- ✅ Extension built for production
- ✅ ZIP file created (704 KB)
- ✅ Screenshot updated (new logo, no white border)
- ✅ Version incremented to 1.0.1
- ✅ OAuth improvements included
- ✅ Logout dropdown included
- [ ] Privacy policy hosted publicly
- [ ] Store listing text prepared (see above)
- [ ] Support email/URL ready
- [ ] Clerk dashboard ready for extension ID

---

## 📊 Version History

### v1.0.1 (2026-01-04) - Current
- Added Google OAuth sign-in/sign-up
- Added logout dropdown menu
- Improved authentication flow
- Updated screenshot

### v1.0.0 (2024-12-12) - Initial
- Basic tab saving functionality
- Email authentication only
- Sync Host support

---

## 🚀 Submission Checklist

### Before Upload
- ✅ Build completed
- ✅ ZIP file ready
- ✅ Screenshot ready
- ✅ Icons verified
- [ ] Privacy policy URL confirmed
- [ ] Description finalized

### During Upload
- [ ] Upload chrome-mv3-prod.zip
- [ ] Add store screenshot
- [ ] Fill in all required fields
- [ ] Set visibility (Public/Unlisted/Private)
- [ ] Set pricing (Free)
- [ ] Select distribution regions

### After Upload (First Time Only)
- [ ] Pay $5 developer registration fee
- [ ] Wait for review (1-3 business days)
- [ ] Get extension ID
- [ ] Add extension ID to Clerk dashboard
- [ ] Test published extension

---

## 📞 Important URLs

- **Developer Dashboard:** https://chrome.google.com/webstore/devconsole
- **Developer Policies:** https://developer.chrome.com/docs/webstore/program-policies/
- **Support:** https://developer.chrome.com/docs/webstore/
- **Clerk Dashboard:** https://dashboard.clerk.com

---

## 🎯 Quick Upload Command

```bash
# Your extension is ready at:
/Users/jc_io/src/mastercanvas-extension/build/chrome-mv3-prod.zip

# Screenshot is at:
/Users/jc_io/src/mastercanvas-extension/screenshots/store-screenshot.png
```

---

**Status:** ✅ **READY FOR SUBMISSION**  
**Next Step:** Upload to Chrome Web Store Developer Dashboard

**Note:** After upload, you'll receive an extension ID. Add it to Clerk's Allowed Origins to enable authentication.
