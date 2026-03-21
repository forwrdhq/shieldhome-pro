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
    <section className="bg-white py-6 border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
