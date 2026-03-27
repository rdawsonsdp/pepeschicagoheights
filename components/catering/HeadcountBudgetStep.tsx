'use client';

import { useEffect, useRef } from 'react';
import { useCatering } from '@/context/CateringContext';
import { BUDGET_RANGES } from '@/lib/budgets';
import BudgetCard from './BudgetCard';

export default function HeadcountBudgetStep() {
  const { state, dispatch } = useCatering();
  const sectionRef = useRef<HTMLDivElement>(null);
  const quickHeadcounts = [10, 25, 50, 100, 150, 200];

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleHeadcountChange = (value: number) => {
    dispatch({ type: 'SET_HEADCOUNT', payload: Math.max(1, value) });
  };

  const handleSelectBudget = (budget: typeof BUDGET_RANGES[number]) => {
    dispatch({ type: 'SET_BUDGET_RANGE', payload: budget });
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_STEP', payload: 4 as 1 | 2 | 3 | 4 });
  };

  const handleSkipBudget = () => {
    dispatch({ type: 'SET_STEP', payload: 4 as 1 | 2 | 3 | 4 });
  };

  const handleBack = () => {
    dispatch({ type: 'GO_BACK' });
  };

  return (
    <div ref={sectionRef} className="bg-pepe-cream py-8 sm:py-16 scroll-mt-4 texture-paper relative">
      <div className="container mx-auto px-4 relative z-10">
        {/* Headcount Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-oswald text-2xl sm:text-4xl md:text-5xl font-bold text-pepe-dark tracking-wider mb-2 sm:mb-4">
            HOW MANY GUESTS?
          </h2>
          <p className="font-crimson text-pepe-charcoal/70 text-sm sm:text-lg max-w-2xl mx-auto mb-4 sm:mb-8 italic">
            This helps us recommend the right portions and pricing
          </p>

          {/* Large Headcount Input */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() => handleHeadcountChange(state.headcount - 5)}
              className="w-14 h-14 rounded-full bg-pepe-warm-white border-2 border-pepe-sand hover:bg-pepe-red hover:text-white hover:border-pepe-red text-pepe-dark font-bold text-2xl transition-colors flex items-center justify-center"
              aria-label="Decrease guests by 5"
            >
              -
            </button>
            <input
              type="number"
              value={state.headcount}
              onChange={(e) => handleHeadcountChange(parseInt(e.target.value) || 10)}
              className="w-28 h-14 text-center text-3xl font-oswald font-bold border-2 border-pepe-sand bg-pepe-warm-white rounded-xl focus:ring-2 focus:ring-pepe-orange/50 focus:border-pepe-orange focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              min="1"
            />
            <button
              onClick={() => handleHeadcountChange(state.headcount + 5)}
              className="w-14 h-14 rounded-full bg-pepe-warm-white border-2 border-pepe-sand hover:bg-pepe-red hover:text-white hover:border-pepe-red text-pepe-dark font-bold text-2xl transition-colors flex items-center justify-center"
              aria-label="Increase guests by 5"
            >
              +
            </button>
          </div>

          {/* Quick-select pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickHeadcounts.map((n) => {
              const isSelected = state.headcount === n;
              const isUnselected = !isSelected;

              return (
                <button
                  key={n}
                  onClick={() => handleHeadcountChange(n)}
                  className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                    isSelected
                      ? 'bg-pepe-dark text-white border-pepe-dark scale-[1.02] shadow-warm'
                      : isUnselected
                        ? 'bg-pepe-warm-white text-muted border-pepe-sand opacity-50 hover:opacity-100 hover:bg-pepe-red/10 hover:text-pepe-dark'
                        : 'bg-pepe-warm-white text-muted border-pepe-sand hover:bg-pepe-red/10 hover:text-pepe-dark'
                  }`}
                >
                  {n} guests
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Section */}
        <div className="text-center mb-8">
          <h3 className="font-oswald text-xl sm:text-3xl font-bold text-pepe-dark tracking-wider mb-2">
            PER-PERSON BUDGET
          </h3>
          <p className="font-crimson text-pepe-charcoal/70 text-sm sm:text-base max-w-2xl mx-auto mb-4 italic">
            Optional — helps us highlight the best options
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
            {BUDGET_RANGES.map((budget) => {
              const isSelected = state.budgetRange?.id === budget.id;
              return (
                <button
                  key={budget.id}
                  onClick={() => handleSelectBudget(budget)}
                  className={`px-3 py-3 sm:py-4 rounded-xl font-oswald font-bold text-sm sm:text-base tracking-wide transition-all border-2 ${
                    isSelected
                      ? 'bg-pepe-dark text-white border-pepe-dark scale-[1.02] shadow-warm'
                      : 'bg-pepe-warm-white text-pepe-dark border-pepe-sand hover:border-pepe-orange hover:bg-pepe-orange/5'
                  }`}
                >
                  {budget.label}
                  <span className="block text-[10px] sm:text-xs font-normal opacity-60 mt-0.5">per person</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 mt-6 sm:mt-10">
          <button
            onClick={handleContinue}
            className="bg-pepe-red text-white font-oswald font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-pepe-red-hover transition-colors text-base sm:text-lg tracking-wide shadow-warm"
          >
            LET&apos;S ORDER!
          </button>
          <button
            onClick={handleSkipBudget}
            className="font-oswald text-pepe-charcoal/60 hover:text-pepe-dark transition-colors tracking-wide text-sm"
          >
            Skip budget
          </button>
        </div>
      </div>
    </div>
  );
}
