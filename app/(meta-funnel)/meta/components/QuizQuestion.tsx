'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { QuizQuestionData } from './questions'
import QuizProgressBar from './QuizProgressBar'

interface QuizQuestionProps {
  question: QuizQuestionData
  currentIndex: number
  totalQuestions: number
  selectedValue?: string | string[]
  onSelect: (value: string | string[]) => void
  onBack: () => void
  showBackButton: boolean
}

export default function QuizQuestion({
  question,
  currentIndex,
  totalQuestions,
  onSelect,
  onBack,
  showBackButton,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [renterWarning, setRenterWarning] = useState(false)

  const handleSingleSelect = (value: string) => {
    if (isAnimating) return
    setSelected(value)
    setIsAnimating(true)

    if (question.renterWarning && value === 'rent') {
      setRenterWarning(true)
      setTimeout(() => {
        setRenterWarning(false)
        onSelect(value)
      }, 3000)
      return
    }

    setTimeout(() => {
      onSelect(value)
    }, 300)
  }

  const handleMultiSelect = (value: string) => {
    if (value === 'all') {
      setMultiSelected(['all'])
      return
    }
    setMultiSelected(prev => {
      const filtered = prev.filter(v => v !== 'all')
      if (filtered.includes(value)) {
        return filtered.filter(v => v !== value)
      }
      return [...filtered, value]
    })
  }

  const handleContinue = () => {
    if (multiSelected.length > 0) {
      onSelect(multiSelected)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-5 md:px-8 pt-6 pb-8">
      {/* Progress Bar */}
      <div className="max-w-xl mx-auto w-full mb-10">
        <QuizProgressBar current={currentIndex + 1} total={totalQuestions} />
      </div>

      {/* Question */}
      <div
        className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full"
        style={{ animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        <h2 className="text-[22px] md:text-[28px] font-heading font-bold text-slate-900 text-center leading-[1.2] tracking-[-0.03em] mb-2">
          {question.question}
        </h2>
        {question.subtext && (
          <p className="text-[13px] text-slate-500 font-body text-center mb-6">{question.subtext}</p>
        )}
        {!question.subtext && <div className="mb-6" />}

        {/* Renter Warning Toast */}
        {renterWarning && (
          <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-[13px] font-body mb-4" style={{ animation: 'fadeUp 300ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            Note: Vivint systems typically need homeowner approval. If your landlord agrees, we can still help!
          </div>
        )}

        {/* Answer Cards Grid */}
        <div className={`grid gap-3 w-full ${question.options.length <= 3 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-2'}`}>
          {question.options.map((option) => {
            const isSelected = question.type === 'multi_select'
              ? multiSelected.includes(option.value)
              : selected === option.value

            return (
              <button
                key={option.value}
                onClick={() =>
                  question.type === 'multi_select'
                    ? handleMultiSelect(option.value)
                    : handleSingleSelect(option.value)
                }
                disabled={isAnimating && question.type === 'single_select'}
                className={`
                  relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 cursor-pointer min-h-[90px]
                  ${isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]'
                  }
                `}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {option.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-heading font-bold uppercase tracking-[0.1em] px-3 py-0.5 rounded-full whitespace-nowrap">
                    {option.badge}
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <span className="text-[32px] mb-2 leading-none">{option.icon}</span>
                <span className="text-[13px] font-heading font-semibold text-slate-700 text-center leading-tight tracking-[-0.01em]">{option.label}</span>
              </button>
            )
          })}
        </div>

        {/* Continue button for multi-select */}
        {question.showContinueButton && (
          <button
            onClick={handleContinue}
            disabled={multiSelected.length === 0}
            className={`
              w-full max-w-sm mt-6 py-3.5 px-6 rounded-lg font-heading font-semibold text-[15px] transition-all duration-300 cursor-pointer
              ${multiSelected.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(5,150,105,0.25)]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            Continue &rarr;
          </button>
        )}

        {/* Encouragement toast at question 5 (index 4) */}
        {currentIndex === 4 && (
          <div className="mt-5 text-[12px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-lg text-center font-body" style={{ animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) both' }}>
            Almost done &mdash; your personalized security report is nearly ready!
          </div>
        )}
      </div>

      {/* Back button */}
      {showBackButton && (
        <div className="max-w-xl mx-auto w-full mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-600 transition-colors duration-300 cursor-pointer font-body"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      )}
    </div>
  )
}
