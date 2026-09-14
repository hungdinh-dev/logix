'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { StepNumber, STEP_LABELS } from '../types/course-create.types'

interface StepperProgressBarProps {
  currentStep: StepNumber
  onStepClick: (step: StepNumber) => void
}

export function StepperProgressBar({
  currentStep,
  onStepClick,
}: StepperProgressBarProps) {
  return (
    <div className="bg-background border-b px-6 py-3">
      <div className="max-w-6xl mx-auto">
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {STEP_LABELS.map((s) => {
            const isDone = currentStep > s.step
            const isCurrent = currentStep === s.step

            return (
              <li
                key={s.step}
                onClick={() => isDone && onStepClick(s.step)}
                className={`flex items-center gap-3 cursor-pointer transition-all ${
                  isDone ? 'opacity-90 hover:opacity-100' : isCurrent ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-sm'
                        : 'bg-muted text-muted-foreground border'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : s.step}
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Bước {s.step}
                  </span>
                  <span className="text-xs font-bold truncate block text-foreground">
                    {s.title}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
