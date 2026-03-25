'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  delay?: number
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.15,
  delay = 0,
  once = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip animation if reduced motion or no IntersectionObserver
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    el.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          if (once) observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px 50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, delay, once])

  return ref
}

/**
 * Stagger children reveals — attach to a parent container,
 * and each direct child animates in sequence.
 */
export function useStaggerReveal<T extends HTMLElement>(
  staggerMs = 80,
  { threshold = 0.1 } = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const children = Array.from(el.children) as HTMLElement[]
    children.forEach((child, i) => {
      child.style.opacity = '0'
      child.style.transform = 'translateY(20px)'
      child.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerMs}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerMs}ms`
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child) => {
            child.style.opacity = '1'
            child.style.transform = 'translateY(0)'
          })
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px 50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [staggerMs, threshold])

  return ref
}
