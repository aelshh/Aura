import { motion, AnimatePresence } from 'framer-motion'
import { useSessionStore } from '../store/sessionStore'
import { formatAura } from '../lib/aura'
import { Sparkles, X } from 'lucide-react'

export default function ReentryReward() {
  const { showReentryModal, earnedWhileAway, dismissReentryModal } = useSessionStore()

  return (
    <AnimatePresence>
      {showReentryModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={dismissReentryModal}
          />

          {/* Modal */}
          <motion.div
            className="relative glass-card rounded-3xl p-8 max-w-sm w-full flex flex-col items-center gap-5 text-center"
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              boxShadow: '0 0 60px rgba(124,58,237,0.3), 0 0 120px rgba(124,58,237,0.1)',
            }}
          >
            <button
              onClick={dismissReentryModal}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-500/20 border border-purple-500/30 aura-purple">
                <Sparkles className="text-purple-300" size={36} />
              </div>
            </div>

            <div>
              <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-2">
                Welcome Back
              </p>
              <h2 className="font-display font-extrabold text-3xl text-white mb-1">
                You Earned
              </h2>
              <p className="font-display font-extrabold text-5xl aura-shimmer">
                +{formatAura(earnedWhileAway)}
              </p>
              <p className="text-white/40 text-sm mt-1">aura while you were away</p>
            </div>

            <p className="text-white/30 text-xs max-w-xs">
              Your discipline continued accumulating energy. Stay on the path.
            </p>

            <button
              onClick={dismissReentryModal}
              className="w-full py-3 rounded-2xl font-display font-semibold text-white transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              }}
            >
              Claim Aura ✦
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
