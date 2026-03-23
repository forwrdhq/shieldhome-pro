import Button from '@/components/ui/Button'

const products = [
  {
    image: '/images/products/outdoor-camera-pro.png',
    title: 'Outdoor Camera Pro',
    badge: 'AI-Powered',
    features: [
      'Smart Sentry\u2122 AI spots and stops real threats',
      "Doesn't just record crime \u2014 it helps prevent it",
      'Live and recorded video, 3x HD zoom',
    ],
  },
  {
    image: '/images/products/doorbell-camera-pro.png',
    title: 'Doorbell Camera Pro',
    badge: 'Free Included',
    features: [
      "180\u00b0 x 180\u00b0 view \u2014 the widest in the industry",
      'AI Package Protection spots deliveries',
      '1080p HDR video, two-way talk',
    ],
  },
  {
    image: '/images/products/smart-hub.png',
    title: 'Smart Hub + Panel',
    badge: '24/7 Monitoring',
    features: [
      'Control everything from one touchscreen',
      '24/7 professional monitoring',
      'Built-in glass break detection',
    ],
  },
  {
    image: '/images/products/smart-lock.png',
    title: 'Smart Home Bundle',
    badge: 'Full Automation',
    features: [
      'Kwikset smart locks, Nest connection',
      'Automate lights, locks, thermostat',
      'Control from anywhere via app',
    ],
  },
]

export default function ProductShowcase() {
  return (
    <section id="products" className="py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12" data-animate>
          <h2 className="text-h2 text-white mb-3">
            What&apos;s Included in Your System
          </h2>
          <p className="text-body-lg text-slate-400">
            Pro-grade security tech, all set up for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.title}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover"
              data-animate
            >
              <div className="relative h-48 bg-slate-700/30 flex items-center justify-center p-6">
                <span className="absolute top-3 right-3 text-[11px] px-2.5 py-1 bg-emerald-900 text-emerald-300 rounded-full font-medium z-10">
                  {product.badge}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-36 max-w-full object-contain"
                  loading="lazy"
                  width={200}
                  height={144}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-h4 text-white mb-3">
                  {product.title}
                </h3>
                <ul className="space-y-2 flex-1">
                  {product.features.map((f, i) => (
                    <li key={i} className="text-body-sm text-slate-400 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-caption text-emerald-400 font-semibold">
                  Included with your system
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12" data-animate>
          <a href="#quiz">
            <Button variant="primary" size="xl" className="w-full sm:w-auto">
              Build Your Custom System
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
