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
    <section className="bg-white py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Trusted for
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {USE_CASES.map((useCase, index) => (
            <span
              key={index}
              className="px-4 py-1.5 rounded-full bg-[#D4782F] text-[#1C1C1C] text-xs sm:text-sm font-semibold"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
