const services = [
  {
    emoji: '📹',
    title: 'AI-Powered Video Surveillance',
    body: 'Smart cameras with real-time AI detection. Get alerts before incidents escalate — not after.',
  },
  {
    emoji: '🔑',
    title: 'Smart Access Control',
    body: 'Control who enters your building, when, and how. Customizable user codes, auto-lock schedules, and instant access revocation.',
  },
  {
    emoji: '🚨',
    title: '24/7 Professional Monitoring',
    body: 'Average 8-second response time. Our monitoring center dispatches police, fire, and medical — faster than any competitor.',
  },
  {
    emoji: '🔐',
    title: 'Smart Locks & Entry Management',
    body: 'Keyless entry with full audit trails. Know exactly who came and went and when — accessible from your phone anywhere.',
  },
  {
    emoji: '🌡️',
    title: 'Environmental Monitoring',
    body: 'Smoke, CO, water, and temperature sensors protect your building and inventory 24/7 — even when nobody\'s there.',
  },
  {
    emoji: '📱',
    title: 'Multi-Location Dashboard',
    body: 'Manage security across all your locations from one app. One login. One bill. Total visibility.',
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-20" style={{ background: '#1A1A2E' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything Your Business Needs in One Smart System
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl p-6 border transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <div className="text-3xl mb-3">{service.emoji}</div>
              <h3 className="text-white font-bold text-base mb-2">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{service.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
