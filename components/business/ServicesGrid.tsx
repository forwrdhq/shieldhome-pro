import { Camera, Key, Siren, LockKeyhole, Thermometer, Smartphone } from 'lucide-react'

const services = [
  {
    icon: Camera,
    title: 'AI-Powered Video Surveillance',
    desc: 'Smart cameras with real-time AI detection. Get alerts before incidents escalate — not after.',
  },
  {
    icon: Key,
    title: 'Smart Access Control',
    desc: 'Control who enters your building, when, and how. Customizable user codes, auto-lock schedules, and instant access revocation.',
  },
  {
    icon: Siren,
    title: '24/7 Professional Monitoring',
    desc: 'Average 8-second response time. Our monitoring center dispatches police, fire, and medical — faster than any competitor.',
  },
  {
    icon: LockKeyhole,
    title: 'Smart Locks & Entry Management',
    desc: 'Keyless entry with full audit trails. Know exactly who came and went and when — accessible from your phone anywhere.',
  },
  {
    icon: Thermometer,
    title: 'Environmental Monitoring',
    desc: "Smoke, CO, water, and temperature sensors protect your building and inventory 24/7 — even when nobody's there.",
  },
  {
    icon: Smartphone,
    title: 'Multi-Location Dashboard',
    desc: 'Manage security across all your locations from one app. One login. One bill. Total visibility.',
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-16 bg-[#1A1A2E]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-12">
          Everything Your Business Needs in One Smart System
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 bg-[#00C853]/20 rounded-lg flex items-center justify-center mb-4">
                <s.icon className="text-[#00C853]" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
