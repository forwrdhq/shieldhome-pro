'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, XCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { APP_URL, PHONE_NUMBER } from '@/lib/constants'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <Shield size={20} className="text-emerald-500" />
          <span className="text-white font-bold text-lg">ShieldHome Pro</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          {status === 'success' ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="text-emerald-500" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">You&apos;ve been unsubscribed</h1>
              <p className="text-gray-500 mb-6 leading-relaxed">
                You&apos;ve been removed from our email list and will no longer receive automated messages from ShieldHome Pro.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                If you unsubscribed by mistake or want to get a new quote in the future, feel free to reach out anytime.
              </p>
            </>
          ) : status === 'error' ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <XCircle className="text-red-500" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">Something went wrong</h1>
              <p className="text-gray-500 mb-6 leading-relaxed">
                We weren&apos;t able to process your unsubscribe request. Please contact us directly and we&apos;ll take care of it right away.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <Shield className="text-gray-400" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">Unsubscribe</h1>
              <p className="text-gray-500 mb-6 leading-relaxed">
                To unsubscribe from ShieldHome Pro emails, please use the unsubscribe link in one of our emails, or contact us directly.
              </p>
            </>
          )}

          <div className="space-y-3">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="block w-full py-3 px-6 bg-slate-900 text-white rounded-xl font-semibold hover:bg-[#2a2a3e] transition-colors"
            >
              Contact Us: {PHONE_NUMBER}
            </a>
            <Link
              href="/"
              className="block w-full py-3 px-6 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-6 text-center text-xs">
        <p>ShieldHome Pro — Authorized Vivint Smart Home Dealer</p>
        <p className="mt-1">© {new Date().getFullYear()} ShieldHome Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <UnsubscribeContent />
    </Suspense>
  )
}
