export default function MediaLogos() {
  const outlets = [
    { name: 'Forbes', letters: 'Forbes' },
    { name: 'CNET', letters: 'CNET' },
    { name: 'PC Magazine', letters: 'PCMag' },
    { name: 'TechRadar', letters: 'TechRadar' },
    { name: 'Tom\'s Guide', letters: "Tom's Guide" },
  ]

  return (
    <section className="py-6 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16">
        <p className="text-overline text-center text-slate-400 mb-4">
          As Featured In
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {outlets.map((o) => (
            <div
              key={o.name}
              className="text-slate-300 font-heading font-bold text-xl md:text-2xl tracking-tight select-none opacity-40 hover:opacity-70 transition-opacity duration-150"
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
