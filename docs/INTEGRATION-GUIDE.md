# tskcanvas Extension - Backend Integration Guide

> **For the tskcanvas dev team**: This document covers what you need to implement in the main tskcanvas Convex backend to support the browser extension.

**Last Updated**: 2024-12-12

---

## Overview

The browser extension is complete and tested. It:
- ✅ Authenticates via Clerk (shares session with tskcanvas web app)
- ✅ Captures all open browser tabs
- ✅ Displays a UI for naming and saving tabs
- ❌ **Needs a backend endpoint** to actually save the tabs

---

## What the Extension Sends

### API Request

```
POST /api/extension/save-tabs
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json
```

### Request Body

```typescript
{
  treeName: string;           // e.g., "Saved Tabs - 12/12/2024"
  tabs: Array<{
    url: string;              // Full URL (e.g., "https://github.com/repo")
    title: string;            // Page title (e.g., "GitHub - repo")
    favIconUrl?: string;      // Optional favicon URL
  }>;
}
```

### Expected Response (Success)

```typescript
{
  success: true;
  treeId: string;             // Convex document ID of created tree
  url: string;                // Direct link to view tree (e.g., "https://tskcanvas.com/tree/abc123")
}
```

### Expected Response (Error)

```typescript
{
  success: false;
  error: string;              // Error message
}
```

---

## Backend Implementation Required

### 1. Create HTTP Endpoint

In your Convex backend, create an HTTP endpoint:

```typescript
// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/api/extension/save-tabs",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // 1. Validate Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const token = authHeader.slice(7);
    
    // 2. Verify JWT and get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ success: false, error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 3. Parse request body
    const body = await request.json();
    const { treeName, tabs } = body;
    
    if (!treeName || !tabs || !Array.isArray(tabs)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // 4. Create tree and tasks (call your mutation)
    const result = await ctx.runMutation(api.extension.createTreeFromTabs, {
      treeName,
      tabs,
      userId: identity.subject
    });
    
    // 5. Return success response
    return new Response(JSON.stringify({
      success: true,
      treeId: result.treeId,
      url: `https://tskcanvas.com/tree/${result.treeId}`  // Adjust URL format as needed
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"  // For extension CORS
      }
    });
  })
});

export default http;
```

### 2. Create Mutation for Tree/Task Creation

```typescript
// convex/extension.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTreeFromTabs = mutation({
  args: {
    treeName: v.string(),
    tabs: v.array(v.object({
      url: v.string(),
      title: v.string(),
      favIconUrl: v.optional(v.string())
    })),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const { treeName, tabs, userId } = args;
    
    // 1. Create the tree
    const treeId = await ctx.db.insert("trees", {
      name: treeName,
      userId: userId,
      createdAt: Date.now(),
      // ... other tree fields as per your schema
    });
    
    // 2. Create a task for each tab
    for (const tab of tabs) {
      await ctx.db.insert("tasks", {
        treeId: treeId,
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
        userId: userId,
        completed: false,
        createdAt: Date.now(),
        // ... other task fields as per your schema
      });
    }
    
    return { treeId };
  }
});
```

---

## Implementation Notes

### Authentication

- The extension sends a **Clerk JWT** with `template: "convex"`
- This is the same JWT format your web app uses
- Use `ctx.auth.getUserIdentity()` to validate

### CORS

The extension makes requests from `chrome-extension://` origin. You may need:

```typescript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
```

### Data Structure Flexibility

The extension sends minimal tab data. You can:
- Store `url` as a link/reference field on tasks
- Use `favIconUrl` for display purposes
- Add additional metadata as needed

---

## Clerk Dashboard Configuration (Production)

When deploying to production, configure Clerk:

### 1. Add Sync Host
- **Location**: Clerk Dashboard → Configure → Settings → Paths
- **Value**: `tskcanvas.com`

### 2. Add Extension Origin
- **Location**: Clerk Dashboard → Configure → Settings → Allowed Origins
- **Value**: `chrome-extension://YOUR_EXTENSION_ID`

### 3. Verify JWT Template
- **Location**: Clerk Dashboard → JWT Templates
- **Name**: `convex`
- Should already exist from main app setup

---

## Extension Configuration Changes for Production

In the extension code (`src/popup.tsx`), update:

```typescript
// Change from localhost to production
syncHost="https://tskcanvas.com"
```

In `package.json`, update host_permissions:

```json
"host_permissions": [
  "https://tskcanvas.com/*",           // Remove localhost
  "https://*.convex.cloud/*",
  "https://*.clerk.accounts.dev/*"
]
```

---

## Testing Checklist

### Backend Team
- [ ] HTTP endpoint created at `/api/extension/save-tabs`
- [ ] JWT validation working
- [ ] Tree creation working
- [ ] Task creation for each tab working
- [ ] Response format matches expected schema
- [ ] CORS headers configured

### Full Integration Test
- [ ] Sign in to tskcanvas web app
- [ ] Open extension popup
- [ ] Verify user is auto-signed in (via Sync Host)
- [ ] Click "Save to tskcanvas"
- [ ] Verify tree created with correct name
- [ ] Verify tasks created for each tab
- [ ] Verify "View Tree" link works

---

## Current Extension Status

| Component | Status | Notes |
|-----------|--------|-------|
| Plasmo Framework | ✅ Done | v0.90.5 |
| Clerk Auth | ✅ Done | Using hooks directly in popup |
| Tab Capture | ✅ Done | Filters browser internal pages |
| Popup UI | ✅ Done | 360x500px, responsive |
| API Client | ✅ Done | Ready for endpoint |
| Icons | ✅ Done | Placeholder "T" logo |
| **Backend Endpoint** | ❌ Needed | See implementation above |

---

## Files Reference

| Extension File | Purpose |
|----------------|---------|
| `src/popup.tsx` | Main UI, Clerk auth |
| `src/lib/api.ts` | API call to backend |
| `src/lib/tabs.ts` | Tab capture logic |
| `package.json` | Manifest permissions |

---

## Questions?

Contact the extension developer or refer to:
- Original spec: `tskcanvas-extension-docs.md`
- Task tracking: `docs/tasks/current.md`
- Architecture: `docs/arch-details.md`
