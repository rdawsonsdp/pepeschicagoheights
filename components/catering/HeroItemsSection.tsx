import Image from 'next/image';
import { CateringProduct } from '@/lib/types';
import { getHeroItems, getBadgeText } from '@/lib/menu-engineering';
import { getDisplayPrice, getPricingTypeLabel } from '@/lib/pricing';
import { siteConfig } from '@/lib/site-config';
import Badge from '@/components/ui/Badge';

interface HeroItemsSectionProps {
  products: CateringProduct[];
  mode?: 'browse' | 'order';
}

export default function HeroItemsSection({ products, mode = 'browse' }: HeroItemsSectionProps) {
  const config = (siteConfig as any).menuEngineering;
  if (!config?.enabled) return null;

  const maxItems = config.maxHeroItems ?? 3;
  const heroItems = getHeroItems(products, maxItems);
  if (heroItems.length === 0) return null;

  const title = config.heroSectionTitle ?? 'MOST POPULAR';
  const subtitle = config.heroSectionSubtitle ?? '';

  return (
    <div className="mb-10 sm:mb-14">
      <div className="text-center mb-6">
        <h2 className="font-oswald text-2xl sm:text-3xl text-pepe-dark tracking-wider">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted mt-1 font-crimson italic">{subtitle}</p>
        )}
      </div>
      <div className={`grid gap-4 sm:gap-6 ${
        heroItems.length === 1
          ? 'grid-cols-1 max-w-md mx-auto'
          : heroItems.length === 2
            ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {heroItems.map((product) => (
          <div
            key={product.id}
            className="bg-pepe-warm-white rounded-2xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-shadow border-2 border-pepe-gold/30"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="star">
                  {getBadgeText(product) || 'Most Popular'}
                </Badge>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h3 className="font-oswald text-lg sm:text-xl text-pepe-dark mb-1 tracking-wide">
                {product.title}
              </h3>
              <p className="text-sm text-pepe-charcoal/70 mb-3 line-clamp-3 font-merriweather">
                {product.menuEngineering?.enhancedDescription || product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-oswald text-pepe-red text-lg">
                  {getDisplayPrice(product)}
                </span>
                <span className="text-[10px] text-muted/70 uppercase">
                  {getPricingTypeLabel(product)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
