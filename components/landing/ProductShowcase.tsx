'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useScrollReveal, useStaggerReveal } from '@/hooks/useScrollReveal'

const products = [
  {
    thumbnail: '/images/google/products/indoor-camera-pro.png',
    title: 'Indoor Camera Pro',
    description: "See the inside of your home like you've never seen it before.",
    youtubeId: 'qJ_PMvMGbJE',
  },
  {
    thumbnail: '/images/google/products/outdoor-camera-pro.png',
    title: 'Outdoor Camera Pro 3',
    description: "The industry's smartest outdoor camera — now with enhanced Smart Deter.",
    youtubeId: 'aaUxMjDWxbU',
  },
  {
    thumbnail: '/images/google/products/doorbell-camera-pro.png',
    title: 'Doorbell Camera Pro 2',
    description: 'Stop package theft before it happens with enhanced deterrence.',
    youtubeId: 'jfFr1HhpkEU',
  },
  {
    thumbnail: '/images/google/products/spotlight-pro.png',
    title: 'Spotlight Pro',
    description: "Spot, track, and deter with the industry's smartest security floodlight.",
    youtubeId: 'aZ2MxfsfMVE',
  },
  {
    thumbnail: '/images/google/products/smoke-co-detector.png',
    title: 'Smoke & CO Detector',
    description: 'The best way to protect against fires and gas leaks? Prevent them altogether.',
    youtubeId: null,
  },
]

function ProductCard({ product, onClick }: { product: typeof products[0]; onClick: (p: typeof products[0]) => void }) {
  return (
    <button
      onClick={() => onClick(product)}
      className="group w-full text-left bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-[15px] md:text-[16px] text-slate-900 tracking-[-0.01em]">
          {product.title}
        </h3>
        <p className="text-[12px] md:text-[13px] font-body text-slate-400 mt-1 leading-[1.5]">
          {product.description}
        </p>
      </div>
    </button>
  )
}

export default function ProductShowcase() {
  const [showAll, setShowAll] = useState(false)
  const headingRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useStaggerReveal<HTMLDivElement>(80)

  const handleCardClick = useCallback((_product: typeof products[0]) => {
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const visibleProducts = showAll ? products : products.slice(0, 3)

  return (
    <>
      <section id="products" className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5 md:px-8">
          <div ref={headingRef} className="text-center mb-10 md:mb-14">
            <p className="text-[10px] md:text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-2 md:mb-3" style={{ color: 'var(--color-brass-400)' }}>
              The Vivint Lineup
            </p>
            <h2 className="font-heading font-bold text-[22px] md:text-[38px] tracking-[-0.03em] text-slate-900 mb-2 md:mb-3">
              Meet the Products That Protect Your Home
            </h2>
            <p className="text-[13px] md:text-[15px] font-body text-slate-400 max-w-lg mx-auto">
              Every device is professionally installed and works together as one smart system.
            </p>
          </div>

          {/* Desktop: 3+2 grid */}
          <div className="hidden md:block">
            <div ref={gridRef} className="grid grid-cols-3 gap-5 mb-5">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.title} product={product} onClick={handleCardClick} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="col-start-1">
                <ProductCard product={products[3]} onClick={handleCardClick} />
              </div>
              <div className="col-start-2">
                <ProductCard product={products[4]} onClick={handleCardClick} />
              </div>
            </div>
          </div>

          {/* Mobile: single column */}
          <div className="md:hidden">
            <div className="space-y-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.title} product={product} onClick={handleCardClick} />
              ))}
            </div>
            {!showAll && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full mt-4 py-3 text-[13px] font-heading font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                View all products +
              </button>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  )
}
