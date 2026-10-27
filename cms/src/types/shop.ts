/**
 * GromBricks - TypeScript Type Definitions
 * Розділ 2.3. Типізація на TypeScript (Презентаційний лендінг):
 * - Type Aliases (Псевдоніми типів)
 * - Union Types / Discriminated Unions (Дискриміновані об'єднання типів)
 * - Intersection Types (Типи перетину)
 * - Типізація функцій і об'єктів
 * - Типізація клієнт-серверного API обміну
 */

// ==========================================
// 1. TYPE ALIASES (Базові псевдоніми типів)
// ==========================================

export type ID = string | number
export type Slug = string
export type ModelId = 'golden_ninja' | 'kai_jungle' | 'cole_jungle' | string

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

/** Режими керування 3D-вітриною Three.js */
export type ViewerControlMode = 'orbit' | 'autoRotate' | 'static'

// ==========================================
// 2. UNION TYPES (Об'єднання типів)
// ==========================================

/** Дискримінант типів контентних блоків лендінгу (Page Builder) */
export type BlockType =
  | 'hero'
  | 'features'
  | 'modelViewer'
  | 'categoryCards'
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

/** 3D модель мініфігурки для інтерактивного перегляду */
export interface Model3DItem {
  modelId: ModelId
  name: string
  subtitle: string
  tag?: string
  description: string
  objPath: string
  mtlPath: string
  scale?: number
  isFeatured?: boolean
}

export interface ModelViewerBlockData {
  blockType: 'modelViewer'
  id?: string
  badge?: string
  title: string
  subtitle?: string
  models?: Model3DItem[]
}

export interface CategoryCardItem {
  title: string
  image: string
  href?: string
  isRare?: boolean
  badge?: string
}

export interface CategoryCardsBlockData {
  blockType: 'categoryCards'
  id?: string
  badge?: string
  title: string
  items?: CategoryCardItem[]
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
  | { success: true; data: T; message?: string; timestamp?: string }
  | { success: false; error: string; statusCode?: number; timestamp?: string }

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
  name?: string
  title?: string
  slug: Slug
  description?: string
  badgeText?: string
  badge?: string
  icon?: string
  iconName?: string
  order?: number
}

// ==========================================
// 4. INTERSECTION TYPES (Типи перетину)
// ==========================================

/** 3D-модель із розширеними параметрами рендерингу сцени */
export type ModelWithSceneSettings = Model3DItem & {
  initialCameraDistance?: number
  rotationSpeed?: number
  ambientIntensity?: number
}

/** Картка напрямку із таймером активності */
export type FeaturedCategoryCard = CategoryCardItem & {
  featuredUntil?: string
  priorityOrder: number
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

/** Параметри пошуку та вибірки 3D моделей */
export interface ModelFilterOptions {
  tag?: string
  searchQuery?: string
  isFeatured?: boolean
}

/** Сигнатура функції фільтрації 3D моделей у вітрині */
export type FilterModelsFn = (
  models: Model3DItem[],
  options: ModelFilterOptions,
) => Model3DItem[]

/** Сигнатура перемикача активної 3D моделі */
export type SwitchModelHandler = (modelId: string) => Promise<boolean>

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
