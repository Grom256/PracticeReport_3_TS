/**
 * GromBricks - TypeScript Type Definitions
 * Розділ 2.3. Типізація на TypeScript (Презентаційний лендінг):
 * - Type Aliases
 * - Union Types (Discriminated Unions)
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

/** Валюта цін */
export type Currency = 'UAH' | 'EUR' | 'USD'

/** Стилістичні варіанти промо-банера */
export type BannerVariant = 'legoYellow' | 'darkBrick' | 'accentRed'

/** Варіанти сортування у вітрині */
export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest'

// ==========================================
// 2. UNION TYPES (Об'єднання типів)
// ==========================================

/** Дискримінант типів контентних блоків (Page Builder) */
export type BlockType =
  | 'hero'
  | 'features'
  | 'modelViewer'
  | 'categoryCards'
  | 'productGrid'
  | 'banner'
  | 'cta'

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

export interface ModelViewerBlockData {
  blockType: 'modelViewer'
  id?: string
  title?: string
  subtitle?: string
}

export interface CategoryCardsBlockData {
  blockType: 'categoryCards'
  id?: string
  title?: string
  subtitle?: string
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
  buttonText?: string
  buttonLink?: string
}

/**
 * Дискриміноване об'єднання (Discriminated Union) блоків лендінгу.
 * Поле 'blockType' слугує спільним дискримінантом для безпечного звуження типів (type narrowing).
 */
export type PageBlockData =
  | HeroBlockData
  | FeaturesBlockData
  | ModelViewerBlockData
  | CategoryCardsBlockData
  | ProductGridBlockData
  | BannerBlockData
  | CtaBlockData

/**
 * Узагальнене дискриміноване об'єднання для представлення життєвого циклу UI
 */
export type UIState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; message?: string }
  | { status: 'error'; error: string }

/**
 * Строгий контракт клієнт-серверного обміну
 */
export type ApiResponse<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; statusCode?: number }

// ==========================================
// 3. БАЗОВІ СУТНОСТІ CMS ТА ВІТРИНИ
// ==========================================

export interface MediaItem {
  id: ID
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  alt?: string
}

export interface Category {
  id: ID
  name: string
  slug: Slug
  description?: string
  badgeText?: string
  icon?: string
  order?: number
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

// ==========================================
// 4. INTERSECTION TYPES (Типи перетину)
// ==========================================

/** Товар із гарантовано розгорнутою (populated) категорією */
export type ProductWithCategory = Product & {
  categoryDetails: Category
}

/** Товар із промо-позначками для першого екрана */
export type FeaturedProduct = Product & {
  badgeText: string
  isHotDeal: boolean
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
// 5. ТИПІЗАЦІЯ ФУНКЦІЙ І ОБ'ЄКТІВ
// ==========================================

/** Параметри фільтрації товарів у вітрині */
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

/** Сигнатура функції фільтрації вітрини */
export type FilterProductsFn = (
  products: Product[],
  options: ProductFilterOptions,
) => Product[]

// ==========================================
// 6. ТИПІЗАЦІЯ ДАНИХ API
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
