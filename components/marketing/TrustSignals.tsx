'use client';

const PROCESS_STEPS = [
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    step: '1',
    title: 'Order Online',
    description: 'Browse our catering menu and place your order in minutes — no calls or emails required.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    step: '2',
    title: 'We Confirm',
    description: 'Our team reviews every order and confirms the details. We require at least 2 day notice for most orders.',
  },
  {
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    step: '3',
    title: 'Pay & Enjoy',
    description: 'Pre-payment is required for most orders. Delivery is available for an additional fee.',
  },
];

export default function TrustSignals() {
  return (
    <section className="bg-[#D4782F] py-10 sm:py-14 border-y border-[#006847]/20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-2">
          How It Works
        </h2>
        <p className="text-center text-sm sm:text-base text-[#1C1C1C]/60 mb-8 sm:mb-10">
          Three simple steps to a perfectly catered fiesta.
        </p>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8 sm:gap-6 lg:gap-12 max-w-4xl mx-auto">
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center flex-1 max-w-[260px] relative">
              {index < PROCESS_STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-40px)] lg:w-[calc(100%-20px)]">
                  <svg className="w-full h-4 text-[#006847]/40" viewBox="0 0 100 16" preserveAspectRatio="none">
                    <path d="M0 8h90M85 3l7 5-7 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <div className="w-16 h-16 rounded-full bg-[#1C1C1C] text-[#C8102E] flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-[#006847] tracking-widest uppercase mb-1">
                Step {step.step}
              </span>
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">{step.title}</h3>
              <p className="text-sm text-[#1C1C1C]/70 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
