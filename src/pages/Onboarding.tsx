import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import ItemPicker from '../components/ItemPicker'
import { useSession } from '../hooks/useSession'
import { useSessionStore } from '../store/sessionStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { createSession } = useSession()
  const { initFromSession } = useSessionStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    if (selectedItems.length === 0) {
      setError('Select at least one thing to avoid.')
      return
    }
    setLoading(true)
    setError('')
    const session = await createSession(selectedItems)
    if (session) {
      initFromSession(session)
      navigate('/', { replace: true })
    } else {
      setError('Failed to start session. Check your connection.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen cosmic-bg flex flex-col">
      {/* Header gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col flex-1 px-6 py-12 max-w-lg mx-auto w-full">
        <motion.div
          className="mb-8"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-4xl mb-3 block">⚡</span>
          <h1 className="font-display font-extrabold text-3xl text-white leading-tight">
            Start Your Detox
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Select what you're cutting out. Your identity upgrade starts now.
          </p>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ItemPicker selected={selectedItems} onChange={setSelectedItems} />
        </motion.div>

        {/* Selected count */}
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 mb-2 text-center text-sm text-purple-300/70"
          >
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </motion.div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mt-2">{error}</p>
        )}

        <motion.button
          onClick={handleStart}
          disabled={loading || selectedItems.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 w-full py-4 rounded-2xl font-display font-bold text-white text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
            boxShadow: selectedItems.length > 0 ? '0 8px 32px rgba(124,58,237,0.4)' : 'none',
          }}
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Begin Journey <ArrowRight size={20} />
            </>
          )}
        </motion.button>

        <p className="text-center text-white/20 text-xs mt-4">
          Your streak starts the moment you tap Begin.
        </p>
      </div>
    </div>
  )
}
