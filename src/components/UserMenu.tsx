import { useState, useEffect, useRef } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [hoveringSignOut, setHoveringSignOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const initials = user?.email?.[0]?.toUpperCase() ?? '?'

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
    } catch (_) {}
    setSigningOut(false)
    navigate('/sign-in', { replace: true })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full ring-2 ring-purple-500/40 ring-offset-2 ring-offset-[#050510] flex items-center justify-center text-sm font-bold text-white/80 hover:text-white hover:ring-purple-500/70 transition-all cursor-pointer select-none"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(99,102,241,0.3))',
        }}
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 rounded-2xl py-1 min-w-[160px] shadow-xl"
          style={{
            background: 'rgba(13,13,34,0.95)',
            border: '1px solid rgba(124,58,237,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <p className="px-4 py-2 text-xs text-white/30 truncate max-w-[200px] select-none">
            {user?.email}
          </p>
          <div className="h-px mx-3 my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <button
            onClick={(e) => { e.stopPropagation(); handleSignOut() }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveringSignOut(true)}
            onMouseLeave={() => setHoveringSignOut(false)}
            disabled={signingOut}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium transition-all cursor-pointer disabled:opacity-50 rounded-b-2xl"
            style={{
              color: hoveringSignOut ? 'rgba(248,113,113,1)' : 'rgba(248,113,113,0.7)',
              background: hoveringSignOut ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}
          >
            <LogOut size={14} />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
