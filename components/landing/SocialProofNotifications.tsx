'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Bell } from 'lucide-react'

const notifications = [
  { name: 'Sarah', city: 'Phoenix, AZ', action: 'just requested a free quote', time: '3 minutes ago' },
  { name: 'Robert', city: 'Dallas, TX', action: 'just had his system installed', time: '12 minutes ago' },
  { name: 'Jennifer', city: 'Atlanta, GA', action: 'just requested a free quote', time: '7 minutes ago' },
  { name: 'David', city: 'Denver, CO', action: 'just got protected', time: '22 minutes ago' },
  { name: 'Maria', city: 'Sacramento, CA', action: 'just requested a free quote', time: '5 minutes ago' },
  { name: 'James', city: 'Chicago, IL', action: 'just scheduled installation', time: '15 minutes ago' },
]

const areaMessages = [
  '12 homeowners in your area got protected this week',
  '8 families nearby upgraded their security this month',
]

export default function SocialProofNotifications() {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const allMessages = [
    ...notifications.map(n => `${n.name} from ${n.city} ${n.action} — ${n.time}`),
    ...areaMessages,
  ]

  const showNext = useCallback(() => {
    if (dismissed) return
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % allMessages.length)
      }, 500)
    }, 6000)
  }, [dismissed, allMessages.length])

  useEffect(() => {
    if (dismissed) return

    // Initial delay of 5 seconds
    const initialTimeout = setTimeout(() => {
      showNext()
    }, 5000)

    return () => clearTimeout(initialTimeout)
  }, [dismissed, showNext])

  useEffect(() => {
    if (dismissed || index === 0) return

    const cycleTimeout = setTimeout(() => {
      showNext()
    }, 8000)

    return () => clearTimeout(cycleTimeout)
  }, [index, dismissed, showNext])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-20 md:bottom-20 left-4 z-40 max-w-sm transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-[#00C853]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bell size={16} className="text-[#00C853]" />
        </div>
        <p className="text-sm text-gray-700 flex-1 leading-relaxed">
          {allMessages[index]}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 flex-shrink-0"
          aria-label="Dismiss notifications"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
