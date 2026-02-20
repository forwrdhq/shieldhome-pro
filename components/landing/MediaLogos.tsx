export default function MediaLogos() {
  const outlets = [
    { name: 'Forbes', letters: 'Forbes' },
    { name: 'CNET', letters: 'CNET' },
    { name: 'PC Magazine', letters: 'PCMag' },
    { name: 'TechRadar', letters: 'TechRadar' },
    { name: 'Tom\'s Guide', letters: "Tom's Guide" },
  ]

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {outlets.map((o) => (
            <div
              key={o.name}
              className="text-gray-300 font-extrabold text-xl md:text-2xl tracking-tight select-none"
              title={o.name}
              aria-label={`Featured in ${o.name}`}
            >
              {o.letters}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
