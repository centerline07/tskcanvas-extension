/**
 * Main Popup Component
 * Displays when user clicks extension icon in toolbar
 */

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  useClerk,
  useAuth,
  useUser
} from "@clerk/chrome-extension"
import { useEffect, useState } from "react"

import { saveTabsToTree } from "~lib/api"
import { getAllTabs, type Tab } from "~lib/tabs"

import "./popup.css"

// Hardcoded Clerk key (env var has issues with Plasmo bundling)
const CLERK_PUBLISHABLE_KEY = "pk_test_dmFzdC1lc2NhcmdvdC02NS5jbGVyay5hY2NvdW50cy5kZXYk"

function SignedInContent() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [saving, setSaving] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([])
  const [treeName, setTreeName] = useState("")
  const [result, setResult] = useState<{
    success: boolean
    url?: string
    error?: string
  } | null>(null)

  useEffect(() => {
    async function loadTabs() {
      const currentTabs = await getAllTabs()
      setTabs(currentTabs)
      setTreeName(`Saved Tabs - ${new Date().toLocaleDateString()}`)
    }
    loadTabs()
  }, [])

  const handleSave = async () => {
    console.log("[tskcanvas] handleSave called")
    setSaving(true)
    try {
      console.log("[tskcanvas] Getting token...")
      const token = await getToken({ template: "convex" })
      console.log("[tskcanvas] Token result:", token ? "got token" : "NO TOKEN")
      if (!token) throw new Error("Not authenticated")

      console.log("[tskcanvas] Calling saveTabsToTree...")
      const response = await saveTabsToTree(token, treeName, tabs)
      console.log("[tskcanvas] saveTabsToTree response:", response)
      setResult({ success: true, url: response.url })
    } catch (error) {
      console.error("[tskcanvas] handleSave error:", error)
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
  const { openSignIn } = useClerk()

  return (
    <div className="popup-container">
      <h2 className="title">Sign in to tskcanvas</h2>
      <p className="description">Connect your account to save tabs.</p>
      <button onClick={() => openSignIn()} className="btn btn-primary">
        Sign in
      </button>
      <p className="tip">Tip: Sign in at tskcanvas.com for automatic sync</p>
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
