import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'

const PRESET_ITEMS = [
  { emoji: '📱', label: 'Instagram' },
  { emoji: '▶️', label: 'YouTube Shorts' },
  { emoji: '🎮', label: 'Gaming' },
  { emoji: '🍔', label: 'Junk Food' },
  { emoji: '🔞', label: 'Porn' },
  { emoji: '🐦', label: 'Twitter/X' },
  { emoji: '🎵', label: 'TikTok' },
  { emoji: '📺', label: 'Binge Watching' },
  { emoji: '🛒', label: 'Impulse Shopping' },
  { emoji: '💬', label: 'Junk Browsing' },
  { emoji: '🍭', label: 'Sugar' },
  { emoji: '☕', label: 'Caffeine' },
]

interface ItemPickerProps {
  selected: string[]
  onChange: (items: string[]) => void
}

export default function ItemPicker({ selected, onChange }: ItemPickerProps) {
  const [customInput, setCustomInput] = useState('')

  const toggle = (label: string) => {
    if (selected.includes(label)) {
      onChange(selected.filter((i) => i !== label))
    } else {
      onChange([...selected, label])
    }
  }

  const addCustom = () => {
    const trimmed = customInput.trim()
    if (!trimmed || selected.includes(trimmed)) return
    onChange([...selected, trimmed])
    setCustomInput('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preset grid */}
      <div className="grid grid-cols-3 gap-2">
        {PRESET_ITEMS.map((item) => {
          const isSelected = selected.includes(item.label)
          return (
            <motion.button
              key={item.label}
              onClick={() => toggle(item.label)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all text-sm font-medium"
              style={{
                background: isSelected ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                borderColor: isSelected ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? '0 0 12px rgba(124,58,237,0.25)' : 'none',
                color: isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.6)',
              }}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-xs leading-tight text-center px-1">{item.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustom()}
          placeholder="Add custom item..."
          className="flex-1 px-4 py-3 rounded-2xl text-sm text-white placeholder-white/25 outline-none transition-all focus:ring-1 focus:ring-purple-500/50"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
        <motion.button
          onClick={addCustom}
          whileTap={{ scale: 0.92 }}
          className="p-3 rounded-2xl text-white/60 hover:text-white transition-colors"
          style={{
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.3)',
          }}
        >
          <Plus size={18} />
        </motion.button>
      </div>

      {/* Custom items */}
      {selected.filter((i) => !PRESET_ITEMS.find((p) => p.label === i)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected
            .filter((i) => !PRESET_ITEMS.find((p) => p.label === i))
            .map((item) => (
              <motion.div
                key={item}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-purple-300"
                style={{
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.35)',
                }}
              >
                <span>✦ {item}</span>
                <button
                  onClick={() => toggle(item)}
                  className="text-purple-400/60 hover:text-purple-300 transition-colors"
                >
                  <X size={12} />
                </button>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  )
}
