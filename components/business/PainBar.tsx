import { DollarSign, Radio, Lock } from 'lucide-react'

const pains = [
  {
    icon: <DollarSign className="w-8 h-8" style={{ color: '#00C853' }} />,
    title: 'Overpaying for Monitoring?',
    body: 'ADT charges businesses $50–120/mo for monitoring we provide at ~$40/mo. That\'s money leaving your business every single month for no reason.',
  },
  {
    icon: <Radio className="w-8 h-8" style={{ color: '#00C853' }} />,
    title: 'Running Outdated Technology?',
    body: 'If your system was installed before 2020, it may lack smart detection, mobile alerts, and LTE backup — meaning it could fail when you need it most.',
  },
  {
    icon: <Lock className="w-8 h-8" style={{ color: '#00C853' }} />,
    title: 'Locked In a Contract?',
    body: 'We help cover up to $1,000 in switching costs for businesses trapped in ADT, Brinks, or other contracts. You shouldn\'t be held hostage by a provider you\'re not happy with.',
  },
]

export default function PainBar() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1A1A2E' }}>
          Is your business security costing too much and doing too little?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pains.map((pain) => (
            <div key={pain.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="mb-4">{pain.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>{pain.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{pain.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
