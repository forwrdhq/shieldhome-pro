import { Phone, Zap, MapPin, Shield } from 'lucide-react'

const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || '(877) 555-0199'
const PHONE_RAW = process.env.NEXT_PUBLIC_PHONE_NUMBER_RAW || '+18775550199'

export default function HeroSection() {
  return (
    <section
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: '#1A1A2E' }}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, #00C853 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(0,200,83,0.15)', color: '#00C853', border: '1px solid rgba(0,200,83,0.3)' }}
          >
            <Shield className="w-3 h-3" />
            Authorized Vivint Commercial Dealer
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Smart Commercial Security<br />
            <span style={{ color: '#00C853' }}>at Residential Rates</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Most businesses overpay by 30–40% for outdated monitoring. Get a free security assessment and see exactly how much you could save.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href="#assessment"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold text-base transition-colors"
              style={{ background: '#00C853' }}
            >
              Get Your Free Security Assessment →
            </a>
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base border-2 border-white text-white hover:bg-white hover:text-[#1A1A2E] transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now: {PHONE}
            </a>
          </div>

          {/* Trust micro-badges */}
          <div className="flex flex-wrap gap-4">
            {[
              { icon: <Zap className="w-4 h-4" />, text: '8-Second Response Time' },
              { icon: <MapPin className="w-4 h-4" />, text: 'Nationwide Installation' },
              { icon: <Shield className="w-4 h-4" />, text: 'No Contract Required' },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: '#00C853' }}
              >
                {badge.icon}
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
