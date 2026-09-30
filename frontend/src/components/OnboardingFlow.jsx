import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import StepperProgress from './StepperProgress';
import StepPastReads from './StepPastReads';
import StepAuthors from './StepAuthors';
import StepGenres from './StepGenres';
import LoadingState from './LoadingState';

export default function OnboardingFlow({
  userProfile,
  setUserProfile,
  onGenerate,
  isLoading,
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handlePastReadsNext = (reads) => {
    setUserProfile((prev) => ({ ...prev, previousReads: reads }));
    setCurrentStep(2);
  };

  const handlePastReadsSkip = () => {
    setCurrentStep(2);
  };

  const handleAuthorsNext = (authors) => {
    setUserProfile((prev) => ({ ...prev, favoriteAuthors: authors }));
    setCurrentStep(3);
  };

  const handleAuthorsSkip = () => {
    setCurrentStep(3);
  };

  const handleGenresSubmit = (genres, count) => {
    const updatedProfile = { ...userProfile, preferredGenres: genres };
    setUserProfile(updatedProfile);
    onGenerate(updatedProfile, count);
  };

  return (
    <div className="bg-darkCard/90 border border-zinc-800/90 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 max-w-2xl mx-auto w-full">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amberGlow/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{greeting}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
          Let&apos;s find your next unforgettable read.
        </h2>
        <p className="text-sm text-zinc-400 mt-2">
          Answer what you like, or simply hit <span className="text-brand-400 font-medium">Skip</span> on anything. Gemini will calibrate recommendations dynamically.
        </p>
      </div>

      <StepperProgress currentStep={currentStep} />

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {currentStep === 1 && (
            <StepPastReads
              initialReads={userProfile.previousReads || []}
              onNext={handlePastReadsNext}
              onSkip={handlePastReadsSkip}
            />
          )}

          {currentStep === 2 && (
            <StepAuthors
              initialAuthors={userProfile.favoriteAuthors || []}
              onNext={handleAuthorsNext}
              onBack={() => setCurrentStep(1)}
              onSkip={handleAuthorsSkip}
            />
          )}

          {currentStep === 3 && (
            <StepGenres
              initialGenres={userProfile.preferredGenres || []}
              onSubmit={handleGenresSubmit}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </>
      )}
    </div>
  );
}

