'use client'

import { useState } from 'react'
import Link from 'next/link'
import ContentHeader from '@/components/content/ContentHeader'
import ContentFooter from '@/components/content/ContentFooter'
import CTABanner from '@/components/content/CTABanner'
import { Shield, Home, Camera, Bell, Lock, Wifi, DollarSign, Check, Phone, ChevronDown } from 'lucide-react'
import { PHONE_NUMBER, PHONE_NUMBER_RAW } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CalcState {
  homeSize: string
  stories: string
  entryPoints: string
  cameras: string
  wantsDoorbell: boolean
  wantsSmartLock: boolean
  wantsSmokeDetector: boolean
  monitoringLevel: string
}

function calculateEstimate(state: CalcState) {
  let equipmentBase = 0
  let monthly = 0

  // Base by home size
  if (state.homeSize === 'small') { equipmentBase = 299; monthly = 29.99 }
  else if (state.homeSize === 'medium') { equipmentBase = 499; monthly = 39.99 }
  else if (state.homeSize === 'large') { equipmentBase = 799; monthly = 49.99 }
  else { equipmentBase = 1199; monthly = 59.99 }

  // Entry points
  if (state.entryPoints === '6-10') equipmentBase += 100
  else if (state.entryPoints === '11-15') equipmentBase += 200
  else if (state.entryPoints === '15+') equipmentBase += 350

  // Cameras
  if (state.cameras === '2') equipmentBase += 200
  else if (state.cameras === '3-4') equipmentBase += 400
  else if (state.cameras === '5+') equipmentBase += 700

  // Add-ons
  if (state.wantsDoorbell) { /* free promo */ }
  if (state.wantsSmartLock) equipmentBase += 199
  if (state.wantsSmokeDetector) equipmentBase += 99

  // Monitoring
  if (state.monitoringLevel === 'standard') monthly = monthly
  else if (state.monitoringLevel === 'premium') monthly += 10
  else if (state.monitoringLevel === 'ultimate') monthly += 20

  // With Vivint promo: $0 down
  return {
    equipmentValue: equipmentBase,
    upfrontCost: 0, // $0 down promo
    monthlyEstimate: monthly,
    annualEstimate: monthly * 12,
    savings: equipmentBase, // value of free equipment
  }
}

export default function CostCalculatorPage() {
  const [calc, setCalc] = useState<CalcState>({
    homeSize: '',
    stories: '1',
    entryPoints: '1-5',
    cameras: '1',
    wantsDoorbell: true,
    wantsSmartLock: false,
    wantsSmokeDetector: false,
    monitoringLevel: 'standard',
  })
  const [showResults, setShowResults] = useState(false)

  const estimate = calculateEstimate(calc)

  return (
    <div className="min-h-screen bg-white">
      <ContentHeader />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-500 px-4 py-2 rounded-full text-sm font-bold mb-6">
              <DollarSign size={16} />
              <span>Free Calculator</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Home Security Cost Calculator
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get an instant estimate of what a home security system would cost for your home. Customize your setup and see real pricing.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 space-y-8">
                {/* Home Size */}
                <div>
                  <label className="block font-bold text-slate-900 mb-3">How big is your home?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'small', label: 'Small', desc: 'Under 1,500 sq ft' },
                      { value: 'medium', label: 'Medium', desc: '1,500 - 2,500 sq ft' },
                      { value: 'large', label: 'Large', desc: '2,500 - 4,000 sq ft' },
                      { value: 'xlarge', label: 'Extra Large', desc: '4,000+ sq ft' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCalc((s) => ({ ...s, homeSize: opt.value }))}
                        className={cn(
                          'p-4 rounded-xl border-2 text-center transition-all',
                          calc.homeSize === opt.value
                            ? 'border-emerald-600 bg-green-50'
                            : 'border-gray-200 hover:border-emerald-600'
                        )}
                      >
                        <Home size={24} className={cn('mx-auto mb-2', calc.homeSize === opt.value ? 'text-emerald-500' : 'text-gray-400')} />
                        <div className="font-semibold text-sm">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entry Points */}
                <div>
                  <label className="block font-bold text-slate-900 mb-3">How many doors & windows?</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['1-5', '6-10', '11-15', '15+'].map((value) => (
                      <button
                        key={value}
                        onClick={() => setCalc((s) => ({ ...s, entryPoints: value }))}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center text-sm font-semibold transition-all',
                          calc.entryPoints === value
                            ? 'border-emerald-600 bg-green-50 text-emerald-500'
                            : 'border-gray-200 hover:border-emerald-600 text-gray-700'
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cameras */}
                <div>
                  <label className="block font-bold text-slate-900 mb-3">How many outdoor cameras?</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: '1', label: '1 camera' },
                      { value: '2', label: '2 cameras' },
                      { value: '3-4', label: '3-4 cameras' },
                      { value: '5+', label: '5+ cameras' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCalc((s) => ({ ...s, cameras: opt.value }))}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center text-sm font-semibold transition-all',
                          calc.cameras === opt.value
                            ? 'border-emerald-600 bg-green-50 text-emerald-500'
                            : 'border-gray-200 hover:border-emerald-600 text-gray-700'
                        )}
                      >
                        <Camera size={18} className="mx-auto mb-1" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <label className="block font-bold text-slate-900 mb-3">Add-ons</label>
                  <div className="space-y-3">
                    {[
                      { key: 'wantsDoorbell' as const, icon: <Bell size={20} />, label: 'Doorbell Camera Pro', price: 'FREE (limited time)' },
                      { key: 'wantsSmartLock' as const, icon: <Lock size={20} />, label: 'Smart Door Lock', price: '+$199' },
                      { key: 'wantsSmokeDetector' as const, icon: <Shield size={20} />, label: 'Smart Smoke/CO Detector', price: '+$99' },
                    ].map((addon) => (
                      <button
                        key={addon.key}
                        onClick={() => setCalc((s) => ({ ...s, [addon.key]: !s[addon.key] }))}
                        className={cn(
                          'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left',
                          calc[addon.key]
                            ? 'border-emerald-600 bg-green-50'
                            : 'border-gray-200 hover:border-emerald-600'
                        )}
                      >
                        <span className={calc[addon.key] ? 'text-emerald-500' : 'text-gray-400'}>{addon.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-slate-900">{addon.label}</div>
                          <div className="text-xs text-gray-500">{addon.price}</div>
                        </div>
                        {calc[addon.key] && <Check size={20} className="text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monitoring Level */}
                <div>
                  <label className="block font-bold text-slate-900 mb-3">Monitoring Plan</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      { value: 'standard', label: 'Smart Security', desc: '24/7 monitoring, smart hub, sensors', extra: '' },
                      { value: 'premium', label: 'Smart Security+', desc: '+ Outdoor cameras, video storage', extra: '+$10/mo' },
                      { value: 'ultimate', label: 'Smart Complete', desc: '+ Smart locks, garage, full automation', extra: '+$20/mo' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setCalc((s) => ({ ...s, monitoringLevel: opt.value }))}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          calc.monitoringLevel === opt.value
                            ? 'border-emerald-600 bg-green-50'
                            : 'border-gray-200 hover:border-emerald-600'
                        )}
                      >
                        <div className="font-semibold text-sm text-slate-900">{opt.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                        {opt.extra && <div className="text-xs font-bold text-emerald-500 mt-1">{opt.extra}</div>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={() => setShowResults(true)}
                  disabled={!calc.homeSize}
                  className={cn(
                    'w-full py-4 rounded-xl font-bold text-lg transition-colors',
                    calc.homeSize
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Calculate My Estimate
                </button>
              </div>

              {/* Results */}
              {showResults && calc.homeSize && (
                <div className="border-t-2 border-emerald-600 bg-gradient-to-b from-green-50 to-white p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Your Estimated Cost</h2>

                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                      <div className="text-sm text-gray-500 mb-1">Upfront Cost</div>
                      <div className="text-3xl font-extrabold text-emerald-500">$0</div>
                      <div className="text-xs text-gray-400 mt-1">$0 down with Vivint financing</div>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-emerald-600 p-5 text-center">
                      <div className="text-sm text-gray-500 mb-1">Monthly Estimate</div>
                      <div className="text-3xl font-extrabold text-slate-900">${estimate.monthlyEstimate.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 mt-1">${(estimate.monthlyEstimate / 30).toFixed(2)}/day</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                      <div className="text-sm text-gray-500 mb-1">Equipment Value</div>
                      <div className="text-3xl font-extrabold text-slate-900">${estimate.equipmentValue.toLocaleString()}</div>
                      <div className="text-xs text-emerald-500 font-bold mt-1">FREE with $0 down</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-6 text-center">
                    <p className="text-gray-300 text-sm mb-4">
                      This is an estimate. Get your exact personalized quote with our free 60-second quiz.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Link
                        href="/home-security-quiz"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                      >
                        Get My Exact Quote — Free
                      </Link>
                      <a href={`tel:${PHONE_NUMBER_RAW}`} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                        <Phone size={16} />
                        <span>Or call {PHONE_NUMBER}</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How Much Does Home Security Really Cost?</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                The cost of a home security system depends on several factors: your home&apos;s size, number of entry points, how many cameras you need, and which smart home features you want. Most homeowners pay between $29.99 and $59.99 per month for professional monitoring, with equipment costs starting at $0 down through Vivint&apos;s financing options.
              </p>
              <p>
                With Vivint through ShieldHome Pro, you get free professional installation (a $200+ value), a free doorbell camera (limited time), and $0 down equipment financing. This means the only ongoing cost is your monthly monitoring fee, which covers 24/7 professional monitoring, cloud video storage, smart home controls, and the Vivint app.
              </p>
              <p>
                Compared to the average burglary loss of $2,661, a home security system pays for itself many times over. FBI data shows that homes without security systems are 300% more likely to be burglarized, and 60% of convicted burglars say they would avoid a home with a visible security system.
              </p>
            </div>
          </div>
        </section>

        <CTABanner variant="quiz" />
      </main>

      <ContentFooter />
    </div>
  )
}
