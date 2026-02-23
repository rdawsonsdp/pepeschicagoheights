import { SelectedCateringItem, CateringProduct } from './types';

/** Generate a unique cart key for an item, incorporating variant info */
export function getCartKey(item: SelectedCateringItem): string {
  if (item.selectedVariant) {
    return `${item.product.id}:${item.selectedVariant}`;
  }
  if (item.variantSplit) {
    const splitKey = Object.entries(item.variantSplit)
      .filter(([, v]) => v > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}-${v}`)
      .join('-');
    return `${item.product.id}:${splitKey}`;
  }
  return item.product.id;
}

/** Generate the cart key for an ADD_ITEM payload */
export function getAddCartKey(
  product: CateringProduct,
  selectedVariant?: string,
  variantSplit?: Record<string, number>,
): string {
  if (selectedVariant) {
    return `${product.id}:${selectedVariant}`;
  }
  if (variantSplit) {
    const splitKey = Object.entries(variantSplit)
      .filter(([, v]) => v > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}-${v}`)
      .join('-');
    return `${product.id}:${splitKey}`;
  }
  return product.id;
}

/** Get a human-readable label for a variant selection */
export function getVariantLabel(item: SelectedCateringItem): string | null {
  if (item.selectedVariant && item.product.variants) {
    const option = item.product.variants.options.find(o => o.id === item.selectedVariant);
    return option?.label ?? item.selectedVariant;
  }
  if (item.variantSplit && item.product.variants) {
    return Object.entries(item.variantSplit)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => {
        const option = item.product.variants!.options.find(o => o.id === k);
        return `${v} ${option?.label ?? k}`;
      })
      .join(', ');
  }
  return null;
}
