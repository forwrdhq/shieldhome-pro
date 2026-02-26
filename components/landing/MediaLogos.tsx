export default function MediaLogos() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {/* Forbes */}
          <svg className="h-6 md:h-7 text-gray-300" viewBox="0 0 200 50" fill="currentColor" aria-label="Forbes">
            <text x="0" y="40" fontFamily="Georgia, serif" fontSize="42" fontWeight="bold" letterSpacing="-1">Forbes</text>
          </svg>

          {/* CNET */}
          <svg className="h-6 md:h-7 text-gray-300" viewBox="0 0 160 50" fill="currentColor" aria-label="CNET">
            <text x="0" y="40" fontFamily="Arial, Helvetica, sans-serif" fontSize="42" fontWeight="bold" letterSpacing="2">CNET</text>
          </svg>

          {/* PCMag */}
          <svg className="h-6 md:h-7 text-gray-300" viewBox="0 0 200 50" fill="currentColor" aria-label="PCMag">
            <text x="0" y="40" fontFamily="Arial, Helvetica, sans-serif" fontSize="38" fontWeight="bold">PCMag</text>
          </svg>

          {/* TechRadar */}
          <svg className="h-6 md:h-7 text-gray-300" viewBox="0 0 280 50" fill="currentColor" aria-label="TechRadar">
            <text x="0" y="40" fontFamily="Arial, Helvetica, sans-serif" fontSize="38" fontWeight="bold">TechRadar</text>
          </svg>

          {/* Tom's Guide */}
          <svg className="h-6 md:h-7 text-gray-300" viewBox="0 0 300 50" fill="currentColor" aria-label="Tom&#39;s Guide">
            <text x="0" y="40" fontFamily="Arial, Helvetica, sans-serif" fontSize="38" fontWeight="bold">{"Tom's Guide"}</text>
          </svg>
        </div>
      </div>
    </section>
  )
}
