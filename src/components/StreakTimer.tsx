import { useState, useEffect } from 'react'
import { useSessionStore } from '../store/sessionStore'
import { getElapsedSeconds } from '../lib/aura'

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, '0')
}

export default function StreakTimer() {
  const { session } = useSessionStore()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!session) return
    const update = () => {
      const seconds = getElapsedSeconds(new Date(session.start_timestamp), new Date())
      setElapsed(seconds)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [session?.start_timestamp])

  if (!session) return null

  const totalSeconds = elapsed
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return (
    <div className="flex flex-col items-center gap-2">
      {days > 0 && (
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/25">
          <span className="text-sm font-semibold text-purple-300">
            {days} {days === 1 ? 'day' : 'days'}
          </span>
          <span className="text-purple-500/60 text-xs">streak</span>
        </div>
      )}
      <div className="flex items-center gap-1 font-display">
        <TimeUnit value={pad(hours)} label="HRS" />
        <span className="text-2xl text-white/40 mb-3 font-light">:</span>
        <TimeUnit value={pad(minutes)} label="MIN" />
        <span className="text-2xl text-white/40 mb-3 font-light">:</span>
        <TimeUnit value={pad(seconds)} label="SEC" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold text-white tabular-nums leading-none">{value}</span>
      <span className="text-[10px] text-white/30 font-medium tracking-widest mt-0.5">{label}</span>
    </div>
  )
}
