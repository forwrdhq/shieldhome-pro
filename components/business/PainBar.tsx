import { DollarSign, Wifi, Lock } from 'lucide-react'

const pains = [
  {
    icon: DollarSign,
    title: 'Overpaying for Monitoring?',
    desc: "ADT charges businesses $50–120/mo for monitoring we provide at ~$40/mo. That's money leaving your business every single month for no reason.",
  },
  {
    icon: Wifi,
    title: 'Running Outdated Technology?',
    desc: "If your system was installed before 2020, it may lack smart detection, mobile alerts, and LTE backup — meaning it could fail when you need it most.",
  },
  {
    icon: Lock,
    title: 'Locked In a Contract?',
    desc: "We help cover up to $1,000 in switching costs for businesses trapped in ADT, Brinks, or other contracts. You shouldn't be held hostage by a provider you're not happy with.",
  },
]

export default function PainBar() {
  return (
    <section className="py-16 bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A1A2E] text-center mb-12">
          Is your business security costing too much and doing too little?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {pains.map((p) => (
            <div key={p.title} className="text-center">
              <div className="w-14 h-14 bg-[#00C853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <p.icon className="text-[#00C853]" size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{p.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
