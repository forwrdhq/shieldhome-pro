'use client'

import { useEffect } from 'react'
import MetaQuiz from '@/components/landing/MetaQuiz'
import { Shield } from 'lucide-react'

export default function QuizPage() {
  // Fire ViewContent on page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', { content_name: 'meta_quiz_page' })
      }
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'page_view', page_type: 'meta-quiz' })
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Minimal header — logo only, no phone CTA */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-14">
            <div className="flex items-center gap-2">
              <Shield className="text-emerald-500" size={24} />
              <div>
                <div className="font-bold text-slate-900 text-base leading-none">ShieldHome Pro</div>
                <div className="text-[10px] text-gray-500">Vivint Smart Home Partner</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Quiz intro + quiz */}
      <main className="py-8 md:py-12">
        <div className="max-w-lg mx-auto px-4 text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
            Is Your Home Protected?
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Answer 6 quick questions and get a personalized home security recommendation — free, no obligation.
          </p>
        </div>

        <MetaQuiz />
      </main>

      {/* Minimal footer */}
      <footer className="bg-gray-900 text-gray-500 py-6 text-center text-xs space-y-1">
        <p className="text-gray-400">ShieldHome Pro — Vivint Smart Home Partner</p>
        <div className="flex items-center justify-center gap-3">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms</a>
        </div>
        <p>© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}
