import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2, CheckCircle } from 'lucide-react'
import { useSessionStore } from '../store/sessionStore'
import { useSession } from '../hooks/useSession'
import ItemPicker from '../components/ItemPicker'

export default function AvoidedItemsPage() {
  const navigate = useNavigate()
  const { session, updateAvoidedItems: updateStore } = useSessionStore()
  const { updateAvoidedItems } = useSession()

  const [items, setItems] = useState<string[]>(session?.avoided_items ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateAvoidedItems(items)
    updateStore(items)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="min-h-screen cosmic-bg flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl glass-card text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-xl text-white">Avoid List</h1>
          <p className="text-xs text-white/30">Things you're cutting from your life</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-5 pb-10">
        <motion.div
          className="glass-card rounded-3xl p-5 mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ItemPicker selected={items} onChange={setItems} />
        </motion.div>

        {/* Selected summary */}
        {items.length > 0 && (
          <motion.div
            className="glass-card rounded-2xl px-5 py-3 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xs text-white/40 mb-2">Currently avoiding:</p>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2.5 py-1 rounded-full text-purple-300"
                  style={{
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.25)',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-display font-bold text-white flex items-center justify-center gap-2 transition-all"
          style={{
            background: saved
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            boxShadow: saved
              ? '0 8px 24px rgba(16,185,129,0.35)'
              : '0 8px 24px rgba(124,58,237,0.35)',
          }}
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle size={18} /> Saved!
            </>
          ) : (
            <>
              <Save size={18} /> Save Changes
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}
