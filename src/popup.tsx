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

// ScrollText icon from Lucide (inline SVG) - thinner strokes for better readability
const ScrollTextIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="38" 
    height="38" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 12h-5"/>
    <path d="M15 8h-5"/>
    <path d="M19 17V5a2 2 0 0 0-2-2H4"/>
    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>
  </svg>
)

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
  const [selectedTabs, setSelectedTabs] = useState<Set<number>>(new Set())
  const [treeName, setTreeName] = useState("")
  const [allWindows, setAllWindows] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)

  useEffect(() => {
    async function loadTabs() {
      // When allWindows is false, we want currentWindowOnly = true
      const currentTabs = await getAllTabs(!allWindows)
      setTabs(currentTabs)
      // Select all tabs by default
      setSelectedTabs(new Set(currentTabs.map((_, i) => i)))
      setTreeName(`Saved Tabs - ${new Date().toLocaleDateString()}`)
    }
    loadTabs()
  }, [allWindows])

  const toggleTab = (index: number) => {
    setSelectedTabs(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedTabs.size === tabs.length) {
      setSelectedTabs(new Set())
    } else {
      setSelectedTabs(new Set(tabs.map((_, i) => i)))
    }
  }

  const selectedCount = selectedTabs.size

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken({ template: "convex" })
      if (!token) throw new Error("Not authenticated")

      // Only save selected tabs
      const tabsToSave = tabs.filter((_, i) => selectedTabs.has(i))
      const response = await saveTabsToTree(token, treeName, tabsToSave)
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
          <div className="success-container">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="success-title">Saved!</h2>
            <p className="success-text">{selectedCount} tabs saved to your canvas</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ animation: 'fadeInUp 0.4s ease-out 0.3s both' }}>
              View Canvas →
            </a>
          </div>
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
        <h2 className="title">Save {selectedCount} of {tabs.length} tabs</h2>
        <span className="user-email">
          {user?.primaryEmailAddress?.emailAddress}
        </span>
      </div>

      <input
        type="text"
        value={treeName}
        onChange={(e) => setTreeName(e.target.value)}
        placeholder="Canvas name"
        className="tree-name-input"
      />

      <label className="checkbox-inline">
        <input
          type="checkbox"
          checked={allWindows}
          onChange={(e) => setAllWindows(e.target.checked)}
        />
        <span>Include all browser windows</span>
      </label>

      <div className="tabs-header">
        <button 
          className="toggle-all-btn"
          onClick={toggleAll}
        >
          {selectedTabs.size === tabs.length ? "Deselect all" : "Select all"}
        </button>
      </div>

      <div className="tabs-list">
        {tabs.map((tab, i) => (
          <div 
            key={i} 
            className={`tab-item ${selectedTabs.has(i) ? 'selected' : 'deselected'}`}
            onClick={() => toggleTab(i)}
          >
            <input
              type="checkbox"
              checked={selectedTabs.has(i)}
              onChange={() => toggleTab(i)}
              className="tab-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
            {tab.favIconUrl && (
              <img src={tab.favIconUrl} className="tab-favicon" alt="" />
            )}
            <span className="tab-title">{tab.title}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || selectedCount === 0}
        className="btn btn-primary">
        {saving ? "Saving..." : "Save to MasterCanvas"}
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
      <div className="welcome-icon">
        <ScrollTextIcon />
      </div>
      <h2 className="welcome-title">MasterCanvas</h2>
      <p className="welcome-subtitle">Save all your tabs to your canvas</p>
      
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
          Sign in at MasterCanvas
        </a>
      </div>
      
      <p className="tip">
        Already signed in? Just refresh this popup!
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
