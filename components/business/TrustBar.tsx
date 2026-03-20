const badges = [
  'Vivint Authorized Dealer',
  'UL Listed Monitoring',
  'J.D. Power #1 Rated',
  'Forbes Home Best Security 2024',
  '500+ Commercial Clients',
  'Nationwide Coverage',
]

export default function TrustBar() {
  return (
    <section className="py-6 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs md:text-sm font-medium text-gray-700"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
