import React from 'react';

export default function StepperProgress({ currentStep }) {
  const steps = [
    { number: 1, label: 'Past Reads' },
    { number: 2, label: 'Authors' },
    { number: 3, label: 'Genres' },
  ];

  const progressPercent = ((currentStep - 1) / 2) * 100;

  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0"></div>
      <div
        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-brand-500 to-amberGlow -translate-y-1/2 z-0 transition-all duration-500 ease-out"
        style={{ width: `${progressPercent}%` }}
      ></div>

      {steps.map((s) => {
        const isCompletedOrActive = s.number <= currentStep;
        const isCurrent = s.number === currentStep;

        return (
          <div key={s.number} className="relative z-10 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                isCurrent
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 ring-2 ring-brand-500/50'
                  : isCompletedOrActive
                  ? 'bg-brand-700 text-zinc-100'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
              }`}
            >
              {s.number}
            </div>
            <span
              className={`text-[11px] font-medium mt-1 transition-colors ${
                isCompletedOrActive ? 'text-zinc-200' : 'text-zinc-500'
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

