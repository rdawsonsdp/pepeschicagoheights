'use client';

import Card from '@/components/ui/Card';
import { EventTypeConfig } from '@/lib/types';

interface EventTypeCardProps {
  eventType: EventTypeConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export default function EventTypeCard({
  eventType,
  isSelected,
  onSelect,
}: EventTypeCardProps) {
  return (
    <Card
      className={`text-center hover-lift cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-primary-brown bg-primary-brown/5'
          : 'hover:ring-2 hover:ring-pepe-orange/50'
      }`}
      onClick={onSelect}
    >
      <div className="text-5xl sm:text-6xl mb-4 animate-float">{eventType.icon}</div>
      <h3 className="text-xl sm:text-2xl font-bold text-primary-brown mb-2 font-display">
        {eventType.name}
      </h3>
      <p className="text-sm sm:text-base text-charcoal/70 mb-4">
        {eventType.description}
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {eventType.suggestedItems.slice(0, 3).map((item) => (
          <span
            key={item}
            className="text-xs px-2 py-1 bg-cream rounded-full text-light-brown"
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}
