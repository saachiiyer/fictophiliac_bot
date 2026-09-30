import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function StepPastReads({ initialReads, onNext, onSkip }) {
  const [reads, setReads] = useState([
    initialReads[0] || '',
    initialReads[1] || '',
    initialReads[2] || '',
  ]);

  const handleChange = (index, value) => {
    const updated = [...reads];
    updated[index] = value;
    setReads(updated);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const valid = reads.map((r) => r.trim()).filter(Boolean);
    onNext(valid);
  };

  return (
    <form onSubmit={handleContinue} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-semibold text-zinc-200 mb-1">
          Name up to three books you loved recently:
        </label>
        <p className="text-xs text-zinc-400 mb-3">
          For example: <em>Daisy Darker</em>, <em>And Then There Were None</em>, <em>The Love Hypothesis</em>
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">#1</span>
          <input
            type="text"
            value={reads[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            placeholder="e.g. Daisy Darker by Alice Feeney"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">#2</span>
          <input
            type="text"
            value={reads[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            placeholder="e.g. And Then There Were None by Agatha Christie"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 text-xs">#3</span>
          <input
            type="text"
            value={reads[2]}
            onChange={(e) => handleChange(2, e.target.value)}
            placeholder="e.g. The Love Hypothesis by Ali Hazelwood"
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition py-2 px-3 rounded-lg hover:bg-zinc-800"
        >
          Skip this step &rarr;
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-brand-600/20 flex items-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

