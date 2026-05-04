'use client'

import { useRef } from 'react'
import {
  Lock,
  ChevronDown,
  ShieldCheck,
  Eye,
  DollarSign,
  Clock,
  Video,
  WifiOff,
  PawPrint,
  Smartphone,
  Award,
  Building2,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react'

interface QuizStartScreenProps {
  onStart: () => void
}

export default function QuizStartScreen({ onStart }: QuizStartScreenProps) {
  const belowFoldRef = useRef<HTMLDivElement>(null)

  const scrollToMore = () => {
    belowFoldRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ═══════════════════════════════════════
          ABOVE THE FOLD — Steps 1-3
          ═══════════════════════════════════════ */}
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 mb-6" style={{ animation: 'fadeUp 600ms var(--ease-out) 100ms both' }}>
          <span className="text-white font-heading font-bold text-[15px] tracking-[-0.01em]">
            Shield<span className="text-emerald-400">Home</span>
          </span>
        </div>

        {/* Badge */}
        <div
          className="relative z-10 inline-flex items-center gap-2.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-5 py-2 rounded-full text-[11px] font-heading font-semibold uppercase tracking-[0.12em] mb-6"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 150ms both' }}
        >
          <span>Free</span>
          <span className="w-1 h-1 bg-emerald-500/40 rounded-full" />
          <span>90 Seconds</span>
          <span className="w-1 h-1 bg-emerald-500/40 rounded-full" />
          <span>No Obligation</span>
        </div>

        {/* Step 1: Audience callout */}
        <p
          className="relative z-10 text-amber-400 text-[11px] font-heading font-semibold uppercase tracking-[0.15em] mb-4"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 180ms both' }}
        >
          ATTENTION HOMEOWNERS
        </p>

        {/* Step 2: Headline */}
        <h1
          className="relative z-10 text-white font-heading font-bold text-[28px] md:text-[40px] leading-[1.1] tracking-[-0.03em] text-center max-w-lg mb-5"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 220ms both' }}
        >
          Your Home Has Security Blind Spots{' '}
          <span className="text-emerald-400">Burglars Already Know About</span>
        </h1>

        {/* Subheadline */}
        <p
          className="relative z-10 text-slate-400 font-body text-[14px] leading-[1.6] text-center max-w-md mb-7"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 300ms both' }}
        >
          Answer 7 quick questions. Get your personalized Security Score &mdash; and see exactly where your home is vulnerable before someone else finds out first.
        </p>

        {/* Step 3: Fascination bullets */}
        <div
          className="relative z-10 text-left max-w-sm mx-auto mb-7"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 350ms both' }}
        >
          <p className="text-[13px] text-slate-300 font-body leading-[1.7] mb-1">
            <span className="text-emerald-400">&rarr;</span> The entry point 73% of homeowners leave completely unprotected
          </p>
          <p
            className="text-[13px] text-slate-300 font-body leading-[1.7] mb-1"
            style={{ animation: 'fadeUp 500ms var(--ease-out) 450ms both' }}
          >
            <span className="text-emerald-400">&rarr;</span> Why your Ring doorbell might be giving you a false sense of security
          </p>
          <p
            className="text-[13px] text-slate-300 font-body leading-[1.7]"
            style={{ animation: 'fadeUp 500ms var(--ease-out) 550ms both' }}
          >
            <span className="text-emerald-400">&rarr;</span> The one feature that makes burglars skip your house entirely
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="relative z-10 w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 600ms both' }}
        >
          SEE MY SECURITY SCORE &rarr;
        </button>

        <p
          className="relative z-10 text-[11px] text-slate-600 mt-4 text-center tracking-wide"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 650ms both' }}
        >
          Free &bull; No credit card &bull; No obligation
        </p>

        <p
          className="relative z-10 text-[12px] text-slate-500 mt-5 text-center font-body"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 680ms both' }}
        >
          Trusted by Vivint &mdash; America&apos;s #1 Smart Home Security Provider
        </p>

        {/* Trust badges */}
        <div
          className="relative z-10 flex items-center gap-5 mt-4 text-[10px] text-slate-600 uppercase tracking-[0.1em] font-heading"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 720ms both' }}
        >
          <span>BBB A+ Rated</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>Vivint Smart Home Partner</span>
          <span className="w-1 h-1 bg-slate-700 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToMore}
          className="relative z-10 flex flex-col items-center gap-1 mt-8 text-slate-600 cursor-pointer hover:text-slate-400 transition-colors"
          style={{ animation: 'fadeUp 600ms var(--ease-out) 800ms both' }}
        >
          <span className="text-[11px] font-body">Scroll to learn more</span>
          <ChevronDown
            className="w-4 h-4"
            style={{ animation: 'softBounce 2s ease-in-out infinite' }}
          />
        </button>

        <style>{`
          @keyframes softBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(4px); }
          }
        `}</style>
      </div>

      {/* ═══════════════════════════════════════
          BELOW THE FOLD — Steps 4-8, 13-17
          ═══════════════════════════════════════ */}

      {/* ═══ SECTION A: Problem Agitation — Step 4 ═══ */}
      <div ref={belowFoldRef} className="bg-slate-800 py-16 px-5">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-emerald-400 text-[11px] uppercase tracking-[0.15em] font-heading font-semibold mb-4">
            HERE&apos;S WHAT NOBODY TELLS YOU
          </p>
          <h2 className="text-white font-heading font-bold text-[22px] md:text-[28px] leading-[1.2] tracking-[-0.03em] mb-6">
            You Think You&apos;re Protected. Here&apos;s Why You&apos;re Not.
          </h2>
          <div className="text-slate-300 font-body text-[14px] md:text-[15px] leading-[1.8] space-y-4">
            <p>
              You lock your doors every night. You&apos;ve got a Ring on the front porch. Maybe some cameras from Amazon. Maybe a sticker from an old alarm company in the window.
            </p>
            <p>
              But a camera that records isn&apos;t a camera that protects. A doorbell that notifies you isn&apos;t a doorbell that calls the police. And cheap cameras? They go offline more than they&apos;re online &mdash; and when they do work, the footage is too blurry to identify anyone.
            </p>
            <p>
              Here&apos;s what the data says: the average break-in takes 90 seconds. The average time before police are even notified? 8 minutes. In that gap &mdash; while you&apos;re at work, while your kids are home after school, while your family is sleeping &mdash; everything you care about is unprotected.
            </p>
            <p>
              Most homeowners don&apos;t discover their system doesn&apos;t actually work until the middle of the night when it&apos;s too late.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ SECTION A2: "You've Probably Tried This" — Step 4 continued ═══ */}
      <div className="bg-slate-900 py-14 px-5">
        <div className="max-w-lg mx-auto">
          <p className="text-emerald-400 text-[11px] uppercase tracking-[0.15em] font-heading font-semibold mb-8 text-center">
            SOUND FAMILIAR?
          </p>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Video className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
              <div>
                <p className="text-white font-semibold text-[14px] font-body mb-1">
                  You bought a Ring doorbell after a package got stolen.
                </p>
                <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                  It covers the front door. But 23% of break-ins come through first-floor windows and 22% through back doors. A doorbell camera records. It doesn&apos;t protect.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <WifiOff className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
              <div>
                <p className="text-white font-semibold text-[14px] font-body mb-1">
                  You tried cheap cameras from Amazon.
                </p>
                <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                  WiFi dropout, terrible night vision, no monitoring. You have footage of the aftermath &mdash; but nobody was alerted and nobody responded.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <PawPrint className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
              <div>
                <p className="text-white font-semibold text-[14px] font-body mb-1">
                  You trust your dog.
                </p>
                <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                  Dogs sleep through break-ins, get scared, and can be neutralized with a treat. A security system doesn&apos;t need to eat, sleep, or go to the vet.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Smartphone className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
              <div>
                <p className="text-white font-semibold text-[14px] font-body mb-1">
                  You read about break-ins on Nextdoor every week.
                </p>
                <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                  Awareness without action just increases anxiety. You know crime is happening in your neighborhood &mdash; but you can&apos;t prevent the next one from being yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION B: Solution + Benefits — Steps 5 & 7 ═══ */}
      <div className="bg-slate-900 py-16 px-5 border-t border-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-400 text-[11px] uppercase tracking-[0.15em] font-heading font-semibold text-center mb-8">
            YOUR PERSONALIZED SECURITY SCORE REVEALS:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <ShieldCheck className="w-7 h-7 text-emerald-400 mb-3" />
              <h3 className="text-white font-heading font-semibold text-[15px] mb-2">
                How Protected You Actually Are
              </h3>
              <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                A 0&ndash;100 Security Score based on your property type, entry points, and current setup. Know your real number &mdash; not what you hope it is.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <Eye className="w-7 h-7 text-emerald-400 mb-3" />
              <h3 className="text-white font-heading font-semibold text-[15px] mb-2">
                Where You&apos;re Most Vulnerable
              </h3>
              <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                The specific blind spot a burglar would target first at your home. Most homeowners are shocked by what the assessment reveals.
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <DollarSign className="w-7 h-7 text-emerald-400 mb-3" />
              <h3 className="text-white font-heading font-semibold text-[15px] mb-2">
                What Real Protection Costs
              </h3>
              <p className="text-slate-400 text-[13px] font-body leading-[1.6]">
                A custom equipment recommendation with actual monthly pricing. Most families pay less than $2/day for complete 24/7 professional monitoring &mdash; less than your daily coffee.
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto text-center mt-10">
            <p className="text-slate-400 font-body text-[14px] leading-[1.6] mb-6">
              In 90 seconds, you&apos;ll know more about your home&apos;s security than most homeowners learn in a lifetime. And it&apos;s completely free.
            </p>
            <button
              onClick={onStart}
              className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
            >
              GET MY SECURITY SCORE &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ═══ SECTION C: Credentials — Step 6 ═══ */}
      <div className="bg-slate-800 py-12 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Award className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-white text-[13px] font-semibold font-heading">Vivint Smart Home Partner</p>
              <p className="text-slate-500 text-[11px] font-body mt-1">Official partner of America&apos;s #1 smart home security provider</p>
            </div>
            <div>
              <Building2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-white text-[13px] font-semibold font-heading">BBB A+ Rated</p>
              <p className="text-slate-500 text-[11px] font-body mt-1">Highest possible Better Business Bureau rating</p>
            </div>
            <div>
              <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-white text-[13px] font-semibold font-heading">2M+ Homes Protected</p>
              <p className="text-slate-500 text-[11px] font-body mt-1">Through Vivint&apos;s nationwide professional monitoring network</p>
            </div>
            <div>
              <Lock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-white text-[13px] font-semibold font-heading">24/7 Professional Monitoring</p>
              <p className="text-slate-500 text-[11px] font-body mt-1">Live agents verify alarms via camera and dispatch police, fire, and EMS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION D: Social Proof — Step 8 ═══ */}
      <div className="bg-slate-900 py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <p className="text-emerald-400 text-[11px] uppercase tracking-[0.15em] font-heading font-semibold text-center mb-8">
            WHAT HOMEOWNERS ARE SAYING
          </p>

          {/* TODO: Replace with real customer testimonials from Gunnar's customers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 text-[13px] font-body italic leading-[1.6] mb-3">
                &ldquo;After our daughter was born, I realized our Ring doorbell wasn&apos;t a security system. Took the assessment, saw our score was 28 out of 100, and had a full system installed three days later. I finally sleep through the night.&rdquo;
              </p>
              <p className="text-slate-500 text-[11px] font-body">&mdash; Sarah M., New Mom</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 text-[13px] font-body italic leading-[1.6] mb-3">
                &ldquo;Someone came up to our back door at 2am. The outdoor camera spotted him, the floodlight hit, and the siren went off automatically. He took off running before he even touched the door. All caught on camera. Worth every penny.&rdquo;
              </p>
              <p className="text-slate-500 text-[11px] font-body">&mdash; James T., Homeowner</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-300 text-[13px] font-body italic leading-[1.6] mb-3">
                &ldquo;Just bought our first house and kept putting this off because I thought it would be expensive. The monitoring is less than $1 a day. Should have done this the week we moved in instead of waiting six months.&rdquo;
              </p>
              <p className="text-slate-500 text-[11px] font-body">&mdash; Maria L., First-Time Homeowner</p>
            </div>
          </div>

          {/* Stat bar */}
          <div className="flex gap-6 md:gap-10 justify-center mt-10">
            <div className="text-center">
              <p className="text-emerald-400 font-heading font-bold text-[20px]">300%</p>
              <p className="text-slate-500 text-[11px] font-body">less likely to be burglarized with a visible system</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-400 font-heading font-bold text-[20px]">41%</p>
              <p className="text-slate-500 text-[11px] font-body">of break-in victims regret not having cameras</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-400 font-heading font-bold text-[20px]">24/7</p>
              <p className="text-slate-500 text-[11px] font-body">professional monitoring with video verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION E: Godfather Offer Teaser — Steps 9-10 Preview ═══ */}
      <div className="bg-slate-800 py-16 px-5">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-emerald-400 text-[11px] uppercase tracking-[0.15em] font-heading font-semibold mb-4">
            WHAT YOU QUALIFY FOR AFTER YOUR ASSESSMENT
          </p>
          <h3 className="text-white font-heading font-bold text-[20px] md:text-[22px] leading-[1.2] tracking-[-0.02em] mb-6">
            The Total Shield Package &mdash; Exclusive Dealer Savings
          </h3>

          <div className="space-y-3 max-w-sm mx-auto text-left mb-6">
            <p className="text-slate-200 text-[14px] font-body flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              Free professional installation by certified Vivint technicians
            </p>
            <p className="text-slate-200 text-[14px] font-body flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              Up to $1,200 off equipment &mdash; cameras, sensors, smart hub included
            </p>
            <p className="text-slate-200 text-[14px] font-body flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              First 3 months of 24/7 professional monitoring on us
            </p>
            <p className="text-slate-200 text-[14px] font-body flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              90 days free professional monitoring included
            </p>
          </div>

          <p className="text-slate-500 text-[13px] font-body leading-[1.6] mb-6 max-w-sm mx-auto">
            Exact savings depend on your home&apos;s needs. Take the 90-second assessment to see your personalized package and monthly cost &mdash; most families pay less than $2/day.
          </p>

          {/* Insurance savings hook */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4 max-w-sm mx-auto mb-8">
            <p className="text-slate-400 text-[12px] font-body leading-[1.5] flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              Most homeowners save 10&ndash;20% on homeowners insurance with a monitored system &mdash; often enough to make monitoring pay for itself.
            </p>
          </div>

          <button
            onClick={onStart}
            className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            SEE WHAT I QUALIFY FOR &rarr;
          </button>
        </div>
      </div>

      {/* ═══ SECTION F: Scarcity + Guarantee — Steps 13 & 14 ═══ */}
      <div className="bg-slate-900 py-14 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Scarcity */}
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-6">
            <Clock className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-white font-heading font-semibold text-[16px] mb-2">
              Limited Availability
            </h3>
            <p className="text-slate-400 text-[13px] font-body leading-[1.6] mb-4">
              Our installation team handles 15 homes per month in each service area. Once this month&apos;s slots are filled, the next available installation is 3&ndash;4 weeks out.
            </p>
            <p className="text-amber-400 text-[12px] font-heading font-semibold">
              Free assessments available through April 2026.
            </p>
          </div>

          {/* Guarantee */}
          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-white font-heading font-semibold text-[16px] mb-2">
              The Protected Home Promise
            </h3>
            <p className="text-slate-500 text-[11px] font-body leading-[1.5]">
              Once your equipment is paid off, monitoring is month-to-month with no service contract. You stay because you want to, not because you&apos;re trapped.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ SECTION G: The Warning — Step 16 ═══ */}
      <div className="bg-slate-800 py-12 px-5">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-white font-heading font-bold text-[18px] leading-[1.3] tracking-[-0.02em] mb-5">
            What 41% of Break-In Victims Say Afterward
          </h3>
          <div className="text-slate-400 font-body text-[14px] leading-[1.7] space-y-4 text-left">
            <p>
              &ldquo;I wish I&apos;d had cameras.&rdquo; &ldquo;I could have prevented this.&rdquo; &ldquo;I kept telling myself I&apos;d get around to it.&rdquo;
            </p>
            <p>
              That&apos;s what people say after the break-in. After they come home to a kicked-in door and an empty jewelry box. After their kids are scared to sleep in their own rooms. After they realize the Ring doorbell didn&apos;t record anything useful because the camera was offline.
            </p>
            <p>
              Nobody plans to be a statistic. 1 in 36 homes will be broken into this year. The ones without security systems are 300% more likely to be the target.
            </p>
            <p>
              You can find out where you stand in 90 seconds. Or you can keep hoping it doesn&apos;t happen to you.
            </p>
          </div>
          <button
            onClick={onStart}
            className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)] mt-8"
          >
            TAKE THE ASSESSMENT NOW &rarr;
          </button>
        </div>
      </div>

      {/* ═══ SECTION H: P.S. Closer — Step 17 ═══ */}
      <div className="bg-slate-900 py-12 px-5">
        <div className="max-w-md mx-auto text-center">
          <p className="text-emerald-400 font-heading font-bold text-[14px] mb-3">P.S.</p>
          <p className="text-slate-300 text-[13px] font-body leading-[1.7] mb-8">
            This 90-second assessment is free, completely confidential, and shows you your home&apos;s exact Security Score. You&apos;ll see where you&apos;re vulnerable, what protection actually costs (most families pay less than $2/day), and what you qualify for through our Total Shield Package &mdash; including up to $1,200 off equipment, free professional installation, and 3 months of free monitoring. We only have 15 installation slots this month and they fill fast. There&apos;s zero obligation. Take the quiz now.
          </p>

          <button
            onClick={onStart}
            className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-semibold text-[15px] py-4 px-8 rounded-lg transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]"
          >
            SEE MY SECURITY SCORE &rarr;
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-6 text-[10px] text-slate-600 uppercase tracking-[0.1em] font-heading">
            <span>BBB A+ Rated</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Vivint Smart Home Partner</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>256-bit Encrypted</span>
            </div>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </>
  )
}
