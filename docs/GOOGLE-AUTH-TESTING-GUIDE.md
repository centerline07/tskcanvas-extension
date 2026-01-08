# Google OAuth & Logout Testing Guide

## Changes Summary (2026-01-04)

### 🎯 What Was Fixed

#### 1. Google OAuth Sign-in/Sign-up
**Problem**: Google OAuth wasn't working - extension only worked if you used the same email from the platform app.

**Solution**:
- ✅ Added proper `SignUp` component alongside `SignIn`
- ✅ Configured hash-based routing (`routing="hash"`) for OAuth redirects
- ✅ Added `signInUrl="#/sign-in"` and `signUpUrl="#/sign-up"` to ClerkProvider
- ✅ Created authentication mode switcher (welcome → signin → signup)
- ✅ Updated welcome screen with separate "Sign in" and "Sign up" buttons

#### 2. Logout Dropdown
**Problem**: No way to logout from the extension - email was just static text.

**Solution**:
- ✅ Added clickable user menu button in header
- ✅ Created dropdown menu with:
  - User email
  - User name (if available)
  - "Sign out" button
- ✅ Implemented logout functionality using `useClerk().signOut()`
- ✅ Added smooth animations and hover states

---

## 📁 Files Changed

| File | Changes |
|------|---------|
| `src/popup.tsx` | Added `SignUp` component, user menu dropdown, logout handler, auth mode switcher |
| `src/popup.css` | Added user menu styles, dropdown animations |
| `docs/tasks/current.md` | Updated Phase 2 with OAuth improvements |
| `docs/arch-details.md` | Updated supported auth methods |

---

## 🧪 Testing Instructions

### Prerequisites
1. Extension must be loaded as unpacked in Chrome
2. Get extension ID from `chrome://extensions`
3. Add extension ID to Clerk dashboard:
   - Go to Clerk Dashboard → Settings → Domains → Allowed Origins
   - Add: `chrome-extension://<your-extension-id>`

### Test Scenarios

#### Test 1: Google OAuth Sign-up (New User)
1. Open extension popup
2. Click **"Sign up"** button
3. In the sign-up form, click **"Continue with Google"**
4. Select Google account (can be any Gmail account)
5. **Expected**: 
   - OAuth popup should open
   - After selecting account, should redirect back to extension
   - User should be signed in
   - Header should show user's email with dropdown arrow

#### Test 2: Google OAuth Sign-in (Existing User)
1. If signed in, logout first
2. Open extension popup
3. Click **"Sign in"** button
4. In the sign-in form, click **"Continue with Google"**
5. Select Google account that was used to sign up
6. **Expected**: 
   - Should successfully sign in
   - Header should show user's email

#### Test 3: Logout Dropdown
1. When signed in, click on **email in upper right corner**
2. **Expected**: 
   - Dropdown menu appears with smooth animation
   - Shows user email and name
   - Shows "Sign out" button in red
3. Click **"Sign out"**
4. **Expected**:
   - User is signed out
   - Returns to welcome screen

#### Test 4: Email + Password Still Works
1. Open extension popup
2. Click **"Sign in"** or **"Sign up"**
3. Use email + password instead of Google
4. **Expected**: Should work as before

#### Test 5: Sync Host Still Works
1. Sign in at https://mastercanvas.app (using any method)
2. Open extension popup
3. **Expected**: 
   - Extension should automatically detect you're signed in
   - No need to sign in again

#### Test 6: UI/UX Checks
1. **Dropdown click-away**: Click outside dropdown → should close
2. **Dropdown hover**: Hover over "Sign out" → should show red background
3. **Navigation**: From welcome → signin → back button → should return to welcome
4. **Navigation**: From welcome → signup → back button → should return to welcome

---

## 🔍 Known Issues to Watch For

### If Google OAuth Still Doesn't Work:
1. **Verify Clerk Dashboard Configuration**:
   - Check that extension origin is added to Allowed Origins
   - Verify Google OAuth is enabled in Clerk dashboard
   - Ensure redirect URLs are configured

2. **Check Browser Console**:
   - Right-click extension icon → "Inspect popup"
   - Check for any error messages related to OAuth or redirects

3. **Possible Causes**:
   - Extension ID not whitelisted in Clerk
   - OAuth provider not configured in Clerk
   - Redirect URL mismatch

### If Dropdown Doesn't Work:
1. **Check CSS Loading**: Verify `popup.css` has the new user menu styles
2. **Check State**: Use React DevTools to verify `showUserMenu` state changes
3. **Click Outside**: The dropdown uses `onBlur` with setTimeout - if it closes too fast, the timing may need adjustment

---

## 📊 Success Criteria

✅ **Google OAuth Sign-up**: New users can create account with Google  
✅ **Google OAuth Sign-in**: Existing users can sign in with Google  
✅ **Email Auth**: Email + Password sign-in/up still works  
✅ **Sync Host**: Signing in at mastercanvas.app syncs to extension  
✅ **Logout**: Clicking email shows dropdown with sign out option  
✅ **UI Polish**: Dropdown animations and hover states work smoothly  

---

## 🐛 If You Find Issues

Please document:
1. Which test scenario failed
2. What you expected vs. what happened
3. Any error messages in browser console
4. Browser version and OS

---

## 📝 Technical Notes

### Why Hash-based Routing?
Extension popups can't use traditional URL-based routing. Hash-based routing (`#/sign-in`, `#/sign-up`) allows Clerk to handle OAuth redirects within the extension context without closing the popup.

### Logout Implementation
```typescript
const { signOut } = useClerk()
const handleLogout = async () => {
  await signOut()
  setShowUserMenu(false)
}
```

### Dropdown Click-away
Uses `onBlur` with `setTimeout` to allow clicks inside dropdown before closing:
```typescript
onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
```

---

## 🎉 What's Next

After testing confirms everything works:
1. Move this completed task to `docs/tasks/completed/`
2. Update main README with new auth features
3. Create new store screenshots showing sign-up flow
4. Consider adding analytics to track which auth method users prefer

---

**Last Updated**: 2026-01-04  
**Status**: Ready for Testing  
**Build**: ✅ Compiled successfully
