'use client';

const USE_CASES = [
  'Birthday Parties',
  'Office Catering',
  'Wedding Receptions',
  'Holiday Fiestas',
  'Graduation Parties',
  'Team Lunches',
  'Family Reunions',
  'Corporate Events',
];

export default function ClientLogos() {
  return (
    <section className="bg-pepe-cream py-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-4">
          Trusted for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {USE_CASES.map((useCase, index) => (
            <span
              key={index}
              className="px-4 py-1.5 rounded-full bg-pepe-warm-white text-pepe-charcoal text-xs sm:text-sm font-semibold border border-pepe-sand shadow-sm"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
