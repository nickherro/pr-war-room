import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const CRED_HASH = '8261739e1bf1c090cf0d3877fafe091b46944ebef1a202ce38bebd96f196ab2c'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function AuthGate() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('_a') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const hash = await sha256(user.trim().toLowerCase() + ':' + pass)
    if (hash === CRED_HASH) {
      sessionStorage.setItem('_a', '1')
      setAuthed(true)
    } else {
      setError(true)
    }
    setLoading(false)
  }, [user, pass])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('_a')
    setAuthed(false)
    setUser('')
    setPass('')
  }, [])

  if (authed) return <App onLogout={handleLogout} />

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#FFFFFF',
        border: '1px solid #c8dce8',
        borderRadius: 12,
        padding: '48px 40px',
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 2px 12px rgba(5,59,87,0.08)',
      }}>
        <div style={{ color: '#053b57', fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8, opacity: 0.5 }}>
          Authorized Access Only
        </div>
        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={e => setUser(e.target.value)}
          autoComplete="off"
          autoFocus
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            border: error ? '1px solid #e74c3c' : '1px solid #c8dce8',
            background: '#f2f7fb',
            color: '#053b57',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          autoComplete="off"
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            border: error ? '1px solid #e74c3c' : '1px solid #c8dce8',
            background: '#f2f7fb',
            color: '#053b57',
            fontSize: 15,
            outline: 'none',
          }}
        />
        {error && (
          <div style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center' }}>
            Invalid credentials
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#f5841f',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Verifying…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>,
)
