import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, ListX, Loader2, AlertTriangle } from 'lucide-react'
import { useSession } from '../hooks/useSession'
import { useAuraEngine } from '../hooks/useAuraEngine'
import { useSessionStore } from '../store/sessionStore'
import { getCurrentLevel } from '../lib/levels'
import { getStreakDays } from '../lib/aura'
import AuraFarmOrb from '../components/AuraFarmOrb'
import StreakTimer from '../components/StreakTimer'
import MilestoneBar from '../components/MilestoneBar'
import ReentryReward from '../components/ReentryReward'
import UserMenu from '../components/UserMenu'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { relapse: relapseAPI } = useSession()
  const { session, isLoading, applyRelapse, liveAura } = useSessionStore()
  const [showRelapseConfirm, setShowRelapseConfirm] = useState(false)
  const [relapseLoading, setRelapseLoading] = useState(false)

  useAuraEngine()

  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/onboarding', { replace: true })
    }
  }, [isLoading, session, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="text-purple-400 animate-spin" size={32} />
          <p className="text-white/40 text-sm">Loading your aura...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const streakDays = getStreakDays(new Date(session.start_timestamp), new Date())
  const currentLevel = getCurrentLevel(streakDays)

  const handleRelapse = async () => {
    setRelapseLoading(true)
    await relapseAPI()
    applyRelapse()
    setShowRelapseConfirm(false)
    setRelapseLoading(false)
  }

  return (
    <div className="min-h-screen cosmic-bg stars-bg flex flex-col overflow-hidden">
      {/* Gradient glow */}
      <div
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${currentLevel.glowColor}25 0%, transparent 70%)`,
        }}
      />

      {/* Top bar */}
      <div className="relative z-20 flex justify-between items-center px-5 pt-12 pb-2">
        <div>
          <p className="text-xs text-white/30 font-medium tracking-widest uppercase">Aura</p>
          <h1 className="font-display font-bold text-xl text-white">Dashboard</h1>
        </div>
        <UserMenu />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-5 pb-28 overflow-y-auto">

        {/* Aura Farm Orb — replaces LevelCard + AuraCounter + AuraPopupContainer */}
        <div className="mt-6 mb-6 w-full flex flex-col items-center">
          <AuraFarmOrb />
        </div>

        {/* Timer */}
        <div className="glass-card rounded-3xl p-6 w-full mb-4">
          <p className="text-xs text-white/30 font-medium text-center mb-4 uppercase tracking-widest">
            Time Clean
          </p>
          <StreakTimer />
        </div>

        {/* Milestone progress */}
        <div className="glass-card rounded-3xl p-5 w-full mb-4">
          <p className="text-xs text-white/30 font-medium uppercase tracking-widest mb-3">
            Next Level
          </p>
          <MilestoneBar />
        </div>

        {/* Brain & Performance stats */}
        <motion.div
          className="glass-card rounded-3xl p-5 w-full mb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-white/30 font-medium uppercase tracking-widest mb-3">
            Current State
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold text-white/50 mb-0.5">🧠 Brain</p>
              <p className="text-sm text-white/70">{currentLevel.brain}</p>
            </div>
            <div className="h-px bg-white/5" />
            <div>
              <p className="text-xs font-semibold text-white/50 mb-0.5">⚡ Performance</p>
              <p className="text-sm text-white/70">{currentLevel.performance}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick nav */}
        <div className="flex gap-3 w-full mb-6">
          <motion.button
            onClick={() => navigate('/journey')}
            whileTap={{ scale: 0.96 }}
            className="flex-1 glass-card rounded-2xl py-4 flex flex-col items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          >
            <Map size={20} />
            <span className="text-xs font-medium">Journey</span>
          </motion.button>
          <motion.button
            onClick={() => navigate('/avoided-items')}
            whileTap={{ scale: 0.96 }}
            className="flex-1 glass-card rounded-2xl py-4 flex flex-col items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          >
            <ListX size={20} />
            <span className="text-xs font-medium">Avoid List</span>
          </motion.button>
        </div>

        {/* Relapse button */}
        <button
          onClick={() => setShowRelapseConfirm(true)}
          className="text-red-400/50 hover:text-red-400/80 text-xs font-medium transition-colors underline underline-offset-2 cursor-pointer mb-4"
        >
          I relapsed
        </button>
      </div>

      {/* Relapse confirm modal */}
      <AnimatePresence>
        {showRelapseConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowRelapseConfirm(false)}
            />
            <motion.div
              className="relative glass-card rounded-t-3xl p-7 w-full max-w-lg"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-6" />
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-400" size={24} />
                <h3 className="font-display font-bold text-lg text-white">Reset Streak?</h3>
              </div>
              <p className="text-white/50 text-sm mb-2">
                Your <span className="text-white/80 font-medium">{streakDays} day</span> streak
                and timer will reset to zero.
              </p>
              <p className="text-white/30 text-sm mb-6">
                Your{' '}
                <span className="text-yellow-400 font-medium">
                  {Math.floor(liveAura).toLocaleString()} aura
                </span>{' '}
                is yours forever — it doesn't disappear.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRelapseConfirm(false)}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-white/60 transition-colors glass-card cursor-pointer"
                >
                  Keep Going
                </button>
                <button
                  onClick={handleRelapse}
                  disabled={relapseLoading}
                  className="flex-1 py-3.5 rounded-2xl font-semibold text-red-300 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}
                >
                  {relapseLoading ? <Loader2 size={16} className="animate-spin" /> : 'Reset Streak'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-entry reward modal */}
      <ReentryReward />
    </div>
  )
}
