'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function DoNotSellForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const form = e.currentTarget
    const data = {
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      requestType: (form.elements.namedItem('requestType') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
    }

    try {
      const res = await fetch('/api/do-not-sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again or email us directly.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-[#00C853]/30 bg-[#00C853]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#00C853]/15">
          <svg className="h-7 w-7 text-[#00C853]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Request Received</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          We have logged your privacy request. We will process it and respond
          within <strong>45 days</strong> to the email address you provided.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Jane"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 transition"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Smith"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 transition"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="jane@example.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 transition"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Phone Number (if applicable)
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="(555) 555-5555"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 transition"
        />
      </div>

      <div>
        <label htmlFor="requestType" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Request Type <span className="text-red-500">*</span>
        </label>
        <select
          id="requestType"
          name="requestType"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 transition bg-white"
        >
          <option value="">Select a request type…</option>
          <option value="opt_out_sale">Opt Out of Sale / Sharing of Personal Information</option>
          <option value="opt_out_marketing">Opt Out of Marketing Communications</option>
          <option value="opt_out_sms">Opt Out of SMS Messages</option>
          <option value="delete">Request Deletion of My Personal Information</option>
          <option value="access">Request Access to My Personal Information</option>
          <option value="correct">Request Correction of My Personal Information</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">
          Additional Details (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Any additional context for your request…"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#00C853] focus:outline-none focus:ring-2 focus:ring-[#00C853]/20 transition resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A1A2E] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#2a2a4e] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting…
          </>
        ) : (
          'Submit Privacy Request'
        )}
      </button>

      <p className="text-xs text-gray-500 leading-relaxed">
        We will verify your identity before processing your request and respond
        within 45 days. This request will not affect your ability to receive a
        home security quote.
      </p>
    </form>
  )
}
