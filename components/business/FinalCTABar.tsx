'use client'

export default function FinalCTABar() {
  function scrollToForm() {
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-14 text-center" style={{ background: '#00C853' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="text-white text-2xl sm:text-3xl font-extrabold mb-6">
          Ready to stop overpaying for outdated security?
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-base transition-colors"
          style={{ background: '#1A1A2E', color: 'white' }}
        >
          Get Your Free Assessment Today
        </button>
      </div>
    </section>
  )
}
