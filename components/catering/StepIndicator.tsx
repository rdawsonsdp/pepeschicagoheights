'use client';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  totalSteps?: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps = 4,
}: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Event Type' },
    { number: 2, label: 'Guests & Budget' },
    { number: 3, label: 'Order Type' },
    { number: 4, label: 'Build Order' },
  ];

  return (
    <div className="flex items-center justify-center mb-8 sm:mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                font-bold text-sm sm:text-base transition-all duration-300
                ${
                  currentStep > step.number
                    ? 'bg-pepe-orange text-pepe-dark'
                    : currentStep === step.number
                    ? 'bg-pepe-dark text-white ring-4 ring-pepe-orange/30'
                    : 'bg-pepe-sand text-muted'
                }
              `}
            >
              {currentStep > step.number ? (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span
              className={`
                mt-2 text-xs sm:text-sm font-medium hidden sm:block
                ${
                  currentStep >= step.number
                    ? 'text-pepe-dark'
                    : 'text-muted'
                }
              `}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`
                w-8 sm:w-16 h-1 mx-1 sm:mx-3 rounded-full transition-all duration-300
                ${
                  currentStep > step.number
                    ? 'bg-pepe-orange'
                    : 'bg-pepe-sand'
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
