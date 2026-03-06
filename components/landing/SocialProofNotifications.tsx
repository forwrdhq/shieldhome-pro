'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Bell, CheckCircle } from 'lucide-react'

const FIRST_NAMES = [
  'Sarah', 'Robert', 'Jennifer', 'David', 'Maria', 'James', 'Jessica', 'Michael',
  'Ashley', 'Chris', 'Amanda', 'Daniel', 'Stephanie', 'Kevin', 'Lisa', 'Brian',
  'Nicole', 'Ryan', 'Lauren', 'Tyler', 'Rachel', 'Jason', 'Megan', 'Andrew',
  'Emily', 'Nathan', 'Olivia', 'Marcus', 'Heather', 'Carlos',
]

const CITIES = [
  'Phoenix, AZ', 'Dallas, TX', 'Atlanta, GA', 'Denver, CO', 'Sacramento, CA',
  'Chicago, IL', 'Houston, TX', 'Nashville, TN', 'Charlotte, NC', 'San Antonio, TX',
  'Orlando, FL', 'Tampa, FL', 'Austin, TX', 'Las Vegas, NV', 'Raleigh, NC',
  'Columbus, OH', 'Indianapolis, IN', 'Jacksonville, FL', 'San Diego, CA', 'Portland, OR',
  'Kansas City, MO', 'Salt Lake City, UT', 'Memphis, TN', 'Richmond, VA', 'Boise, ID',
]

const ACTIONS = [
  'just requested a free quote',
  'just requested a free quote',
  'just scheduled a consultation',
  'just had their system installed',
  'just upgraded to the camera package',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateNotification() {
  const minutes = Math.floor(Math.random() * 38) + 2
  return {
    name: pick(FIRST_NAMES),
    city: pick(CITIES),
    action: pick(ACTIONS),
    time: `${minutes} min ago`,
  }
}

export default function SocialProofNotifications() {
  const [visible, setVisible] = useState(false)
  const [notification, setNotification] = useState<ReturnType<typeof generateNotification> | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const showNext = useCallback(() => {
    if (dismissed) return
    setNotification(generateNotification())
    setVisible(true)

    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      // Schedule next notification after fade-out
      timeoutRef.current = setTimeout(() => {
        showNext()
      }, Math.random() * 8000 + 15000) // 15-23 seconds between
    }, 5000) // Show for 5 seconds
  }, [dismissed])

  useEffect(() => {
    if (dismissed) return

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showNext()
    }, 8000)

    return () => {
      clearTimeout(initialTimeout)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [dismissed, showNext])

  if (dismissed || !notification) return null

  return (
    <div
      className={`fixed bottom-24 md:bottom-24 left-4 z-40 max-w-sm transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
        <div className="w-8 h-8 bg-[#00C853]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bell size={16} className="text-[#00C853]" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>{notification.name}</strong> from {notification.city} {notification.action}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle size={12} className="text-[#00C853]" />
            <span className="text-xs text-gray-400">{notification.time}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setDismissed(true)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
          }}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 flex-shrink-0"
          aria-label="Dismiss notifications"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
