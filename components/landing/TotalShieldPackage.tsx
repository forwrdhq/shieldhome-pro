'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Phone, Check } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'

interface TotalShieldPackageProps {
  onQuizOpen?: () => void
}

const lineItems = [
  {
    title: 'Premium Equipment Kit Savings',
    description: 'Upgrade to our Premium Vivint kit — save big over standard pricing',
    value: '$1,200',
  },
  {
    title: 'Bonus Equipment Credit',
    description: 'Apply up to $500 toward extra cameras, smart locks, or sensors',
    value: '$500',
  },
  {
    title: 'Buy 2 Cameras, Get 1 FREE',
    description: 'Add a 3rd Vivint camera at no charge — eliminate blind spots',
    value: '$329',
  },
  {
    title: '$100 in Free Door & Window Sensors',
    description: 'Round out perimeter coverage on entry points that need it most',
    value: '$100',
  },
  {
    title: '50% OFF Professional Installation',
    description: 'Certified Vivint tech installs everything — half the standard rate',
    value: '$99',
  },
  {
    title: '3 Months FREE Pro Monitoring',
    description: '24/7 monitored protection included — start saving from day one',
    value: '$120',
  },
  {
    title: '$200 Visa Gift Card (Welcome Bonus)',
    description: 'When you schedule install this week — yours to spend anywhere',
    value: '$200',
  },
  {
    title: '$40/mo Loyalty Savings — Year 1 Value',
    description: 'Lock in our lowest monthly monitoring rate, locked for life of contract',
    value: '$300',
  },
  {
    title: 'The Protected Home Promise',
    description: '60-day money-back guarantee + price lock for life of contract',
    value: 'Priceless',
  },
]

export default function TotalShieldPackage({ onQuizOpen }: TotalShieldPackageProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if ((window as any).dataLayer) {
              (window as any).dataLayer.push({ event: 'total_shield_viewed' })
            }
            obs.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  function trackPhoneClick() {
    if (typeof window !== 'undefined') {
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: 'phone_click' })
    }
  }

  return (
    <section ref={ref} className="py-14 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Faded background imagery — Vivint hub */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/products/smart-hub.png"
          alt=""
          fill
          aria-hidden
          className="object-contain object-center opacity-[0.06]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/60 to-slate-50" />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'rgba(5, 150, 105, 0.06)' }} />

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-8 md:mb-12">
          <p
            className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3"
            style={{ color: 'var(--color-brass-400)' }}
          >
            Limited-Time Promotions
          </p>
          <h2 className="font-heading font-bold text-[24px] md:text-[40px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3 leading-[1.15]">
            Our Special Offers Available
          </h2>
          <p className="text-[14px] md:text-[16px] font-body text-slate-500 max-w-lg mx-auto">
            Stack the offers that fit your home — authorized Vivint dealer pricing.
          </p>
        </div>

        {/* Value stack card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-8 divide-y divide-slate-100">
            {lineItems.map((item) => (
              <div
                key={item.title}
                className="py-4 md:py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-[15px] md:text-[16px] text-slate-900 leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[13px] md:text-[14px] font-body text-slate-500 leading-[1.5]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="sm:w-24 sm:text-right pl-9 sm:pl-0">
                  <span
                    className={`font-heading font-bold text-[14px] md:text-[15px] ${
                      item.value === 'Priceless' ? 'text-emerald-600 italic' : 'text-slate-700'
                    }`}
                  >
                    {item.value === 'Priceless' ? item.value : `${item.value} value`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total + CTA section */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-center px-5 md:px-8 py-7 md:py-9">
            <div className="mb-3">
              <p className="text-[12px] md:text-[13px] font-heading font-semibold text-slate-400 uppercase tracking-[0.12em] mb-1">
                Total Package Value
              </p>
              <p className="text-[28px] md:text-[34px] font-heading font-bold text-emerald-400 leading-none">
                Full Smart Security System
              </p>
            </div>

            <div className="mb-5">
              <p className="text-[12px] md:text-[13px] font-heading font-semibold text-emerald-400 uppercase tracking-[0.12em] mb-1">
                Your Investment
              </p>
              <p className="text-[40px] md:text-[56px] font-heading font-bold text-white leading-none tracking-[-0.03em]">
                $0 Down
              </p>
              <p className="text-[12px] md:text-[13px] text-slate-400 mt-2 font-body">
                Professional monitoring from $19.99/mo · 0% APR financing available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {onQuizOpen ? (
                <button
                  onClick={onQuizOpen}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-heading font-bold text-[16px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)]"
                >
                  See If I Qualify →
                </button>
              ) : (
                <a
                  href="#quiz"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-heading font-bold text-[16px] tracking-[-0.01em] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_30px_rgba(5,150,105,0.4)]"
                >
                  See If I Qualify →
                </a>
              )}
              <a
                href={`tel:${PHONE_NUMBER_RAW}`}
                onClick={trackPhoneClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-600 hover:border-slate-500 text-white px-6 py-4 rounded-lg font-heading font-semibold text-[15px] transition-colors"
              >
                <Phone size={15} />
                Call {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>

        <p className="text-[11px] md:text-[12px] text-slate-400 text-center mt-5 max-w-2xl mx-auto leading-[1.5] font-body">
          *$0 down offer requires qualifying purchase minimum and execution of Vivint monitoring services agreement.
          Monthly service fees vary by plan. Authorized Vivint Dealer — independent pricing.
        </p>
      </div>
    </section>
  )
}
