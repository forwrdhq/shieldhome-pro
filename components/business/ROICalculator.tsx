'use client'

import { useState, useRef, useCallback } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { pushDataLayer } from '@/lib/google-tracking'

function scrollToForm() {
  document.querySelector('#business-form')?.scrollIntoView({ behavior: 'smooth' })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default function ROICalculator() {
  const headingRef = useScrollReveal<HTMLDivElement>()

  const [businessType, setBusinessType] = useState('Retail')
  const [currentMonthly, setCurrentMonthly] = useState(49.99)
  const [annualInsurance, setAnnualInsurance] = useState(5000)
  const [annualTheft, setAnnualTheft] = useState(5000)
  const [numLocations, setNumLocations] = useState('1')

  const hasEngaged = useRef(false)

  const trackEngagement = useCallback(() => {
    if (!hasEngaged.current) {
      hasEngaged.current = true
      pushDataLayer('roi_calculator_engaged', { businessType })
    }
  }, [businessType])

  // Calculations
  const monitoringSavings = Math.max(0, (currentMonthly - 39.99)) * 12
  const insuranceSavings = annualInsurance * 0.10
  const theftDeterrence = annualTheft * 0.50
  const totalAnnual = monitoringSavings + insuranceSavings + theftDeterrence
  const threeYearSavings = totalAnnual * 3

  // Months to payoff: since equipment is free, we calculate based on how quickly savings cover monitoring
  const monthlyTotalSavings = totalAnnual / 12
  const monthsToPayoff = monthlyTotalSavings > 0 ? Math.max(1, Math.ceil((39.99 * 12) / totalAnnual)) : 0

  const locationMultiplier = numLocations === '1' ? 1 : numLocations === '2–3' ? 2.5 : numLocations === '4–10' ? 7 : 12

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-5 md:px-12">
        <div ref={headingRef} className="text-center mb-10 md:mb-12">
          <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
            ROI Calculator
          </p>
          <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900">
            What Is Your Current Security Setup Actually Costing You?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {/* Inputs */}
          <div className="space-y-6">
            {/* Business Type */}
            <div>
              <label className="block text-[12px] font-heading font-semibold text-slate-600 uppercase tracking-[0.1em] mb-2">
                Business Type
              </label>
              <select
                value={businessType}
                onChange={(e) => { setBusinessType(e.target.value); trackEngagement() }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-[15px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"
              >
                <option>Retail</option>
                <option>Office</option>
                <option>Warehouse</option>
                <option>Restaurant</option>
                <option>Other</option>
              </select>
            </div>

            {/* Current Monthly */}
            <div>
              <label className="block text-[12px] font-heading font-semibold text-slate-600 uppercase tracking-[0.1em] mb-2">
                Current Monthly Monitoring Fee
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={150}
                  step={0.01}
                  value={currentMonthly}
                  onChange={(e) => { setCurrentMonthly(parseFloat(e.target.value)); trackEngagement() }}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-emerald-600 bg-slate-200"
                />
                <span className="text-[15px] font-heading font-semibold text-slate-900 w-20 text-right">
                  ${currentMonthly.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Annual Insurance */}
            <div>
              <label className="block text-[12px] font-heading font-semibold text-slate-600 uppercase tracking-[0.1em] mb-2">
                Annual Property Insurance Premium
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={100}
                  value={annualInsurance}
                  onChange={(e) => { setAnnualInsurance(parseInt(e.target.value)); trackEngagement() }}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-emerald-600 bg-slate-200"
                />
                <span className="text-[15px] font-heading font-semibold text-slate-900 w-20 text-right">
                  {formatCurrency(annualInsurance)}
                </span>
              </div>
            </div>

            {/* Annual Theft */}
            <div>
              <label className="block text-[12px] font-heading font-semibold text-slate-600 uppercase tracking-[0.1em] mb-2">
                Estimated Annual Theft/Loss
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={annualTheft}
                  onChange={(e) => { setAnnualTheft(parseInt(e.target.value)); trackEngagement() }}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-emerald-600 bg-slate-200"
                />
                <span className="text-[15px] font-heading font-semibold text-slate-900 w-20 text-right">
                  {formatCurrency(annualTheft)}
                </span>
              </div>
            </div>

            {/* Number of Locations */}
            <div>
              <label className="block text-[12px] font-heading font-semibold text-slate-600 uppercase tracking-[0.1em] mb-2">
                Number of Locations
              </label>
              <select
                value={numLocations}
                onChange={(e) => { setNumLocations(e.target.value); trackEngagement() }}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 text-[15px] font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-200"
              >
                <option>1</option>
                <option>2–3</option>
                <option>4–10</option>
                <option>10+</option>
              </select>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white">
            {/* Headline Output */}
            <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.14em] text-emerald-400/70 mb-2">
              Your System Pays for Itself In
            </p>
            <p className="font-heading font-bold text-[48px] md:text-[60px] text-emerald-400 leading-none tracking-[-0.03em]">
              {monthsToPayoff}
            </p>
            <p className="text-[14px] font-body text-slate-400 mb-6 md:mb-8">
              months
            </p>

            <div className="h-px bg-white/10 mb-5" />

            <p className="text-[11px] font-heading font-semibold uppercase tracking-[0.14em] text-slate-400 mb-4">
              Estimated Annual Savings
            </p>
            <div className="space-y-2.5 text-[13px] md:text-[14px] font-body mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Monitoring savings vs. current:</span>
                <span className="font-semibold text-white">{formatCurrency(monitoringSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Insurance premium savings (est. 10%):</span>
                <span className="font-semibold text-white">{formatCurrency(insuranceSavings)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Theft deterrence value (est. 50%):</span>
                <span className="font-semibold text-white">{formatCurrency(theftDeterrence)}</span>
              </div>
            </div>

            <div className="h-px bg-white/10 mb-4" />

            <div className="flex justify-between text-[14px] md:text-[15px] font-heading font-bold mb-2">
              <span className="text-slate-300">Total annual savings:</span>
              <span className="text-emerald-400">{formatCurrency(totalAnnual)}</span>
            </div>
            <div className="flex justify-between text-[16px] md:text-[18px] font-heading font-bold">
              <span className="text-white">3-year savings:</span>
              <span className="text-emerald-400">{formatCurrency(threeYearSavings)}</span>
            </div>

            {locationMultiplier > 1 && (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                <p className="text-[12px] font-body text-emerald-300">
                  With {numLocations} locations: <strong>{formatCurrency(threeYearSavings * locationMultiplier)}</strong> potential 3-year savings
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Credibility Line */}
        <p className="text-[11px] md:text-[12px] font-body text-slate-400 text-center mt-6 max-w-md mx-auto">
          These are conservative estimates. Insurance savings vary by carrier and policy.
          Ask your ShieldHome Pro about the documentation for your specific insurer.
        </p>

        {/* Calculator CTA */}
        <div className="text-center mt-8">
          <button
            onClick={scrollToForm}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-[15px] rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            These Are My Numbers — Claim My Free Quote →
          </button>
        </div>
      </div>
    </section>
  )
}
