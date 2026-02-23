// Event Types
export type EventType = 'appetizers' | 'entrees' | 'sides';

// Pricing Types
export type PricingType = 'tray' | 'pan' | 'per-person' | 'per-dozen' | 'per-each' | 'per-container';

// Size options for tray-based pricing
export interface TraySizeOption {
  size: 'small' | 'medium' | 'large';
  price: number;
  servesMin: number;
  servesMax: number;
}

// Size options for pan-based pricing
export interface PanSizeOption {
  size: 'half' | 'full';
  price: number;
  servesMin: number;
  servesMax: number;
}

// Pricing configuration based on type
export interface TrayPricing {
  type: 'tray';
  sizes: TraySizeOption[];
}

export interface PanPricing {
  type: 'pan';
  sizes: PanSizeOption[];
}

export interface PerPersonPricing {
  type: 'per-person';
  pricePerPerson: number;
  minOrder?: number;
}

export interface PerDozenPricing {
  type: 'per-dozen';
  pricePerDozen: number;
  servesPerDozen: number; // typically 12
}

export interface PerEachPricing {
  type: 'per-each';
  priceEach: number;
  minOrder?: number;
}

export interface PerContainerPricing {
  type: 'per-container';
  pricePerContainer: number;
  servesPerContainer: number;
}

export type ProductPricing =
  | TrayPricing
  | PanPricing
  | PerPersonPricing
  | PerDozenPricing
  | PerEachPricing
  | PerContainerPricing;

// Variant types for product options (fillings, flavors, etc.)
export interface VariantOption {
  id: string;
  label: string;
}

export interface VariantConfig {
  label: string;              // "Filling", "Flavor", "Dipping Sauce", "Tortilla"
  options: VariantOption[];
  selectionMode: 'single' | 'split';
  splitTotal?: number;        // For split mode: what quantities must sum to
}

// Budget Range
export interface BudgetRange {
  id: string;
  label: string;
  min: number;
  max: number;
  description: string;
  isCustom?: boolean;
}

// Catering Product with flexible pricing
export interface CateringProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: EventType[];
  pricing: ProductPricing;
  tags?: string[];
  variantId?: string;
  slug?: string;
  inventory?: number;
  variants?: VariantConfig;
}

// Calculated order item (what the customer actually gets)
export interface CalculatedOrderItem {
  product: CateringProduct;
  // For tray/pan items
  selectedSize?: 'small' | 'medium' | 'large' | 'half' | 'full';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  servesMin: number;
  servesMax: number;
  displayText: string; // e.g., "2 Half Pans - serves 20-30"
  itemQuantity: number; // how many of this product the user ordered (1, 2, 3, etc.)
  selectedVariant?: string;
  variantSplit?: Record<string, number>;
  cartKey?: string;
}

// Selected item in the cart (simplified for state)
export interface SelectedCateringItem {
  product: CateringProduct;
  quantity: number;
  selectedVariant?: string;                 // For single mode: option ID
  variantSplit?: Record<string, number>;    // For split mode: { beef: 10, chicken: 15 }
}

// Buyer/Contact information
export interface BuyerInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  eventDate: string;
  eventTime?: string;
  deliveryAddress?: string;
  notes?: string;
}

// Order type selection
export type OrderType = 'build-your-own' | 'packages';

// Catering Package (fixed per-person price)
export interface CateringPackage {
  id: string;
  title: string;
  description: string;
  pricePerPerson: number;
  image: string;
  items: string[];
  categories: EventType[];
  minHeadcount?: number;
  maxHeadcount?: number;
}

// Selected package in the cart
export interface SelectedPackage {
  package: CateringPackage;
  headcount: number;
}

// Main application state
export interface CateringState {
  currentStep: 1 | 2 | 3 | 4;
  eventType: EventType | null;
  budgetRange: BudgetRange | null;
  customBudget: number | null;
  orderType: OrderType | null;
  headcount: number;
  selectedItems: SelectedCateringItem[];
  selectedPackage: CateringPackage | null;
  buyerInfo: BuyerInfo | null;
}

// Action types for reducer
export type CateringAction =
  | { type: 'SET_EVENT_TYPE'; payload: EventType }
  | { type: 'SET_BUDGET_RANGE'; payload: BudgetRange }
  | { type: 'SET_CUSTOM_BUDGET'; payload: number }
  | { type: 'SET_ORDER_TYPE'; payload: OrderType }
  | { type: 'SET_HEADCOUNT'; payload: number }
  | { type: 'ADD_ITEM'; payload: { product: CateringProduct; selectedVariant?: string; variantSplit?: Record<string, number> } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { cartKey: string; quantity: number } }
  | { type: 'CLEAR_ITEMS' }
  | { type: 'SELECT_PACKAGE'; payload: CateringPackage }
  | { type: 'CLEAR_PACKAGE' }
  | { type: 'SET_STEP'; payload: 1 | 2 | 3 | 4 }
  | { type: 'GO_BACK' }
  | { type: 'SET_BUYER_INFO'; payload: BuyerInfo }
  | { type: 'HYDRATE'; payload: CateringState }
  | { type: 'RESET' };

// Event type configuration
export interface EventTypeConfig {
  id: EventType;
  name: string;
  description: string;
  icon: string;
  suggestedItems: string[];
}

// API Response types
export interface ProductsResponse {
  products: CateringProduct[];
  error?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  draftOrderId?: string;
  draftOrderNumber?: string;
  invoiceUrl?: string;
  error?: string;
}
