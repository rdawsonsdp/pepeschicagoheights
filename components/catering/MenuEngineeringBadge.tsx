import { CateringProduct } from '@/lib/types';
import { shouldShowBadge, getBadgeText, getClassification } from '@/lib/menu-engineering';
import Badge from '@/components/ui/Badge';

interface MenuEngineeringBadgeProps {
  product: CateringProduct;
  className?: string;
}

export default function MenuEngineeringBadge({ product, className = '' }: MenuEngineeringBadgeProps) {
  if (!shouldShowBadge(product)) return null;

  const classification = getClassification(product);
  const badgeText = getBadgeText(product);
  const variant = classification === 'STAR' ? 'star' : 'puzzle';
  const defaultText = classification === 'STAR' ? 'Most Popular' : 'Hidden Gem';

  return (
    <Badge variant={variant} className={className}>
      {badgeText || defaultText}
    </Badge>
  );
}
