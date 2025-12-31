/**
 * Main Popup Component
 * Displays when user clicks extension icon in toolbar
 */

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  useAuth,
  useUser
} from "@clerk/chrome-extension"
import { useEffect, useState } from "react"

import { saveTabsToTree } from "~lib/api"
import { getAllTabs, type Tab } from "~lib/tabs"

import "./popup.css"

// Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_dmFzdC1lc2NhcmdvdC02NS5jbGVyay5hY2NvdW50cy5kZXYk"

// Custom Clerk appearance to remove dev branding
const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "bottom" as const,
    showOptionalFields: false,
    logoPlacement: "none" as const
  },
  elements: {
    rootBox: "clerk-root",
    card: "clerk-card",
    headerTitle: "clerk-header-title",
    headerSubtitle: "clerk-header-subtitle",
    socialButtonsBlockButton: "clerk-social-btn",
    formButtonPrimary: "clerk-primary-btn",
    footerAction: "clerk-footer",
    // Hide dev mode banner
    badge: "clerk-hidden",
    alertText: "clerk-hidden",
    identityPreviewEditButton: "clerk-hidden"
  }
}

function SignedInContent() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [saving, setSaving] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([])
  const [treeName, setTreeName] = useState("")
  const [currentWindowOnly, setCurrentWindowOnly] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)

  useEffect(() => {
    async function loadTabs() {
      const currentTabs = await getAllTabs(currentWindowOnly)
      setTabs(currentTabs)
      setTreeName(`Saved Tabs - ${new Date().toLocaleDateString()}`)
    }
    loadTabs()
  }, [currentWindowOnly])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken({ template: "convex" })
      if (!token) throw new Error("Not authenticated")

      const response = await saveTabsToTree(token, treeName, tabs)
      setResult({ success: true, url: response.url })
    } catch (error) {
      setResult({ success: false, error: (error as Error).message })
    }
    setSaving(false)
  }

  if (result) {
    return (
      <div className="popup-container">
        {result.success ? (
          <>
            <h2 className="success-title">✓ Saved!</h2>
            <p className="success-text">{tabs.length} tabs saved to tree.</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary">
              View Tree
            </a>
          </>
        ) : (
          <>
            <h2 className="error-title">Error</h2>
            <p className="error-text">{result.error}</p>
            <button onClick={() => setResult(null)} className="btn btn-secondary">
              Try again
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="popup-container">
      <div className="header">
        <h2 className="title">Save {tabs.length} tabs</h2>
        <span className="user-email">
          {user?.primaryEmailAddress?.emailAddress}
        </span>
      </div>

      <input
        type="text"
        value={treeName}
        onChange={(e) => setTreeName(e.target.value)}
        placeholder="Tree name"
        className="tree-name-input"
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={currentWindowOnly}
          onChange={(e) => setCurrentWindowOnly(e.target.checked)}
        />
        <span>Include tabs from this window only</span>
      </label>

      <div className="tabs-list">
        {tabs.map((tab, i) => (
          <div key={i} className="tab-item">
            {tab.favIconUrl && (
              <img src={tab.favIconUrl} className="tab-favicon" alt="" />
            )}
            <span className="tab-title">{tab.title}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || tabs.length === 0}
        className="btn btn-primary">
        {saving ? "Saving..." : "Save to tskcanvas"}
      </button>
    </div>
  )
}

function SignedOutContent() {
  const [showSignIn, setShowSignIn] = useState(false)

  if (showSignIn) {
    return (
      <div className="popup-container signin-container">
        <div className="signin-header">
          <button 
            onClick={() => setShowSignIn(false)} 
            className="back-btn"
            aria-label="Go back"
          >
            ←
          </button>
          <span className="signin-title">Sign in</span>
        </div>
        <SignIn 
          appearance={clerkAppearance}
          routing="hash"
        />
      </div>
    )
  }

  return (
    <div className="popup-container welcome-container">
      <div className="welcome-icon">🌳</div>
      <h2 className="welcome-title">tskcanvas</h2>
      <p className="welcome-subtitle">Save all your tabs as a task tree</p>
      
      <div className="signin-options">
        <button 
          onClick={() => setShowSignIn(true)} 
          className="btn btn-primary"
        >
          Sign in with Email
        </button>
        
        <div className="divider">
          <span>or</span>
        </div>
        
        <a 
          href="https://tskcanvas.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          Sign in at tskcanvas.com
        </a>
      </div>
      
      <p className="tip">
        Already signed in at tskcanvas.com? Just refresh this popup!
      </p>
    </div>
  )
}

export default function Popup() {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      // Sync auth with tskcanvas.com
      syncHost="https://tskcanvas.com"
    >
      <SignedIn>
        <SignedInContent />
      </SignedIn>
      <SignedOut>
        <SignedOutContent />
      </SignedOut>
    </ClerkProvider>
  )
}
