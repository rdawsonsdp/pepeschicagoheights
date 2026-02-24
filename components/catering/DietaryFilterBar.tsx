'use client';

interface DietaryFilterBarProps {
  activeTags: string[];
  onToggleTag: (tag: string) => void;
}

const DIETARY_FILTERS = [
  { id: 'popular', label: 'Popular' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'healthy', label: 'Healthy' },
  { id: 'southern', label: 'Southern' },
];

export default function DietaryFilterBar({ activeTags, onToggleTag }: DietaryFilterBarProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
      {DIETARY_FILTERS.map((filter) => {
        const isActive = activeTags.includes(filter.id);
        return (
          <button
            key={filter.id}
            onClick={() => onToggleTag(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-pepe-dark text-white shadow-warm'
                : 'bg-pepe-warm-white text-pepe-charcoal border border-pepe-sand hover:border-pepe-red/50 hover:text-pepe-red'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
      {activeTags.length > 0 && (
        <button
          onClick={() => activeTags.forEach(tag => onToggleTag(tag))}
          className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap text-pepe-red hover:bg-pepe-red/5 transition-all"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
