export interface Model3DItem {
  id: string
  name: string
  subtitle: string
  objPath: string
  mtlPath: string
  tag: string
  description: string
}

export interface CategoryCardItem {
  title: string
  image: string
  href?: string
  isRare?: boolean
}

export interface FeatureItem {
  icon?: 'shield' | 'truck' | 'sparkles' | 'package' | 'check' | string
  badge?: string
  title: string
  description: string
}

export interface CommonData {
  header: {
    brandName: string
    phone: string
    telegramUrl: string
    navItems: Array<{ label: string; url: string }>
  }
  footer: {
    description: string
    email: string
    copyright: string
  }
}

export interface PageBlock {
  blockType: string
  id?: string
  [key: string]: any
}

export interface PageResponse {
  path: string
  title: string
  slug: string
  meta?: {
    description?: string
  }
  blocks: PageBlock[]
}
