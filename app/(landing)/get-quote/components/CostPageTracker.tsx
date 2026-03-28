'use client'

import { useEffect } from 'react'
import { pushDataLayer } from '@/lib/google-tracking'

export default function CostPageTracker() {
  useEffect(() => {
    pushDataLayer('cost_lp_view', { page: '/get-quote' })
  }, [])

  return null
}
