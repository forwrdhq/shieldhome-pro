'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield } from 'lucide-react'

interface AnimatedCounterProps {
  target?: number
  duration?: number
}

export default function AnimatedCounter({ target = 2147832, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = performance.now()

          function animate(now: number) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasAnimated, target, duration])

  return (
    <div ref={ref} className="flex items-center justify-center gap-3 py-4">
      <Shield size={24} className="text-[#00C853]" />
      <span className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E]">
        {count.toLocaleString()}
      </span>
      <span className="text-gray-600 font-medium">homes protected and counting</span>
    </div>
  )
}
