/**
 * GromBricks - TypeScript Type Definitions
 * Розділ 3.3. Типізація на TypeScript:
 * - Type Aliases
 * - Union Types
 * - Intersection Types
 * - Типізація функцій і об'єктів
 * - Типізація даних, отриманих через API
 */

// ==========================================
// 1. TYPE ALIASES (Базові псевдоніми типів)
// ==========================================

export type ID = string | number
export type Slug = string

/** Тип товару: колекційна мініфігурка або окрема деталь LEGO */
export type ProductType = 'minifigure' | 'part'

/** Стан товару: новий (ідеальний) або вживаний (колекційний) */
export type ProductCondition = 'new' | 'used'

/** Статус життєвого циклу замовлення */
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

/** Служби доставки по Україні */
export type DeliveryService = 'nova_poshta' | 'ukrposhta' | 'meest'

/** Спосіб оплати */
export type PaymentMethod = 'card_transfer' | 'cash_on_delivery'

/** Популярні серії всесвіту LEGO */
export type LegoSeries =
  | 'Star Wars'
  | 'Marvel Super Heroes'
  | 'Harry Potter'
  | 'Ninjago'
  | 'Classic Space'
  | 'Castle'
  | 'Technic'
  | 'City'
  | 'The Lord of the Rings'
  | 'Custom / MOC'

/** Валюта розрахунку */
export type Currency = 'UAH' | 'EUR' | 'USD'

/** Типи промо-варіантів банерів */
export type BannerVariant = 'legoYellow' | 'darkBrick' | 'accentRed'

/** Варіанти сортування в каталозі */
export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest'

// ==========================================
// 2. UNION TYPES (Типи об'єднання)
// ==========================================

/** Дискриміноване об'єднання блоків для гнучкої сторінки (Page Builder) */
export type BlockType = 'hero' | 'productGrid' | 'features' | 'banner' | 'cta'

export interface HeroBlockData {
  blockType: 'hero'
  id?: string
  heading: string
  subheading?: string
  badge?: string
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  imageUrl?: string
}

export interface ProductGridBlockData {
  blockType: 'productGrid'
  id?: string
  title: string
  subtitle?: string
  filterType: 'all' | 'minifigures' | 'parts' | 'rare'
  limit?: number
  showViewAll?: boolean
}

export interface FeatureItem {
  icon: 'shield' | 'truck' | 'sparkles' | 'package' | 'check'
  title: string
  description: string
}

export interface FeaturesBlockData {
  blockType: 'features'
  id?: string
  title: string
  subtitle?: string
  items: FeatureItem[]
}

export interface BannerBlockData {
  blockType: 'banner'
  id?: string
  title: string
  description?: string
  ctaText?: string
  ctaLink?: string
  variant: BannerVariant
}

export interface CtaBlockData {
  blockType: 'cta'
  id?: string
  title: string
  description?: string
  buttonText: string
  buttonLink: string
}

export interface ModelViewerBlockData {
  blockType: 'modelViewer'
  id?: string
}

export interface CategoryCardsBlockData {
  blockType: 'categoryCards'
  id?: string
}

/** Union Type для всіх доступних блоків сторінки */
export type PageBlockData =
  | HeroBlockData
  | ProductGridBlockData
  | FeaturesBlockData
  | BannerBlockData
  | CtaBlockData
  | ModelViewerBlockData
  | CategoryCardsBlockData

/**
 * Union Type для станів завантаження UI:
 * дозволяє безпечно обробляти loading / error / ready / empty стани
 */
export type UIState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; message?: string }
  | { status: 'error'; error: string; code?: string }

/** Уніфікований тип відповіді сервера (Discriminated Union) */
export type ApiResponse<T> =
  | {
      success: true
      data: T
      message?: string
      timestamp: string
    }
  | {
      success: false
      error: string
      code?: string
      details?: Record<string, string[]>
      timestamp: string
    }

// ==========================================
// 3. BASE INTERFACES (Базові сутності даних)
// ==========================================

export interface MediaItem {
  id: ID
  url: string
  alt: string
  width?: number
  height?: number
  mimeType?: string
  filesize?: number
}

export interface Category {
  id: ID
  title: string
  slug: Slug
  description?: string
  badge?: string
  iconName?: string
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: ID
  name: string
  slug: Slug
  sku: string
  productType: ProductType
  series?: LegoSeries | string
  price: number
  condition: ProductCondition
  stock: number
  isRare: boolean
  category: ID | Category
  images?: MediaItem | string | null
  imageUrl?: string
  description?: string
  color?: string
  partNumber?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  id?: ID
  product: ID | Product
  productName: string
  sku: string
  unitPrice: number
  quantity: number
  imageUrl?: string
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
}

export interface DeliveryInfo {
  service: DeliveryService
  city: string
  branchOrAddress: string
}

export interface Order {
  id: ID
  orderNumber: string
  customer: CustomerInfo
  delivery: DeliveryInfo
  paymentMethod: PaymentMethod
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt?: string
}

/** Знімок товару, який зберігається в кошику */
export type CartItemSnapshot = Pick<
  Product,
  'name' | 'slug' | 'sku' | 'price' | 'imageUrl' | 'stock'
>

/** Позиція кошика: id + кількість, перетнуті зі знімком товару */
export type CartItem = {
  productId: ID
  quantity: number
} & CartItemSnapshot

// ==========================================
// 4. INTERSECTION TYPES (Типи перетину)
// ==========================================

/** Товар із гарантовано розгорнутою (populated) категорією */
export type ProductWithCategory = Product & {
  categoryDetails: Category
}

/** Елемент кошика з повною інформацією про товар та сумою */
export type CartItemWithDetails = CartItem & {
  product: Product
  subtotal: number
  isAvailable: boolean
  hasEnoughStock: boolean
}

/** Розширене замовлення з форматованими атрибутами для інтерфейсу */
export type EnrichedOrder = Order & {
  formattedDate: string
  itemsCount: number
  isShipped: boolean
}

/** Сторінка з набором динамічних блоків */
export interface PageLayout {
  id: ID
  title: string
  slug: Slug
  layout: PageBlockData[]
}

export type PageWithBlocks = PageLayout & {
  lastUpdatedFormatted?: string
}

// ==========================================
// 5. ТИПІЗАЦІЯ ФУНКЦІЙ І ОБ'ЄКТІВ (Functions & Objects)
// ==========================================

/** Параметри фільтрації товарів у каталозі */
export interface ProductFilterOptions {
  searchQuery?: string
  productType?: ProductType | 'all'
  series?: LegoSeries | 'all' | string
  condition?: ProductCondition | 'all'
  categorySlug?: string
  onlyRare?: boolean
  minPrice?: number
  maxPrice?: number
  sortBy?: SortOption
}

/** Результат розрахунку вартості замовлення */
export interface PriceCalculationResult {
  itemsSubtotal: number
  deliveryFee: number
  discountAmount: number
  total: number
  currency: Currency
}

/** Результат валідації кошика */
export interface CartValidationResult {
  isValid: boolean
  items: Array<{
    productId: ID
    productName: string
    requestedQuantity: number
    availableStock: number
    isAvailable: boolean
    currentPrice: number
  }>
  errors: string[]
}

/** Сигнатура функції валідації кошика */
export type CartValidatorFn = (
  items: Array<{ productId: ID; quantity: number }>,
  productsPool: Product[],
) => CartValidationResult

/** Сигнатура функції розрахунку вартості */
export type PriceCalculatorFn = (
  items: CartItemWithDetails[],
  deliveryService: DeliveryService,
) => PriceCalculationResult

/** Сигнатура функції фільтрації каталогу */
export type FilterProductsFn = (
  products: Product[],
  options: ProductFilterOptions,
) => Product[]

// ==========================================
// 6. ТИПІЗАЦІЯ ДАНИХ API (Payload & Custom Endpoints)
// ==========================================

/** Уніфікована відповідь колекцій Payload CMS */
export interface PayloadDocsResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

/** Тіло запиту на створення замовлення (Checkout API) */
export interface CheckoutApiRequest {
  customer: CustomerInfo
  delivery: DeliveryInfo
  paymentMethod: PaymentMethod
  items: Array<{
    productId: ID
    quantity: number
  }>
  notes?: string
}

/** Тіло відповіді Checkout API */
export interface CheckoutApiResponseData {
  orderId: ID
  orderNumber: string
  totalAmount: number
  status: OrderStatus
  message: string
}
