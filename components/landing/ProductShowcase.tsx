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
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-3">
            What&apos;s Included in Your System
          </h2>
          <p className="text-gray-600 text-lg">
            Pro-grade security tech, all set up for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.title}
              className="relative bg-[#F8F9FA] rounded-xl border border-gray-100 hover:border-[#00C853] hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="relative h-48 bg-[#1A1A2E] flex items-center justify-center p-6">
                <span className="absolute top-3 right-3 text-xs px-2 py-1 bg-[#00C853] text-white rounded-full font-medium z-10">
                  {product.badge}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-36 max-w-full object-contain drop-shadow-lg"
                  loading="lazy"
                  width={200}
                  height={144}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">
                  {product.title}
                </h3>
                <ul className="space-y-2 flex-1">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-[#00C853] font-bold mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[#00C853] font-semibold">
                  Included with your system
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop only — mobile has sticky bar */}
        <div className="hidden sm:block text-center mt-10">
          <a href="#quiz">
            <Button variant="primary" size="xl">
              Build Your Custom System
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
