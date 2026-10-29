export type ID = string | number
export type Slug = string
export type ModelId = 'golden_ninja' | 'kai_jungle' | 'cole_jungle' | string

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

export type Currency = 'UAH' | 'EUR' | 'USD'

export type BannerVariant = 'legoYellow' | 'darkBrick' | 'accentRed'

export type ViewerControlMode = 'orbit' | 'autoRotate' | 'static'

export type BlockType =
  | 'hero'
  | 'features'
  | 'modelViewer'
  | 'categoryCards'
  | 'banner'
  | 'cta'
  | 'text'

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

export interface TextBlockData {
  blockType: 'text'
  id?: string
  isActive?: boolean
  anchor?: string
  badge?: string
  title: string
  subtitle?: string
  content: string
  highlightBox?: string
}

export type PageBlockData =
  | HeroBlockData
  | FeaturesBlockData
  | ModelViewerBlockData
  | CategoryCardsBlockData
  | BannerBlockData
  | CtaBlockData
  | TextBlockData

export type UIState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; message?: string }
  | { status: 'error'; error: string }

export type ApiResponse<T> =
  | { success: true; data: T; message?: string; timestamp?: string }
  | { success: false; error: string; statusCode?: number; timestamp?: string }

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

export type ModelWithSceneSettings = Model3DItem & {
  initialCameraDistance?: number
  rotationSpeed?: number
  ambientIntensity?: number
}

export type FeaturedCategoryCard = CategoryCardItem & {
  featuredUntil?: string
  priorityOrder: number
}

export interface PageLayout {
  id: ID
  title: string
  slug: Slug
  layout: PageBlockData[]
}

export type PageWithBlocks = PageLayout & {
  lastUpdatedFormatted?: string
}

export interface ModelFilterOptions {
  tag?: string
  searchQuery?: string
  isFeatured?: boolean
}

export type FilterModelsFn = (
  models: Model3DItem[],
  options: ModelFilterOptions,
) => Model3DItem[]

export type SwitchModelHandler = (modelId: string) => Promise<boolean>

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
