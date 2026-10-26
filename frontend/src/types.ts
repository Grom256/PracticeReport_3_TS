export interface Product {
  id: string | number
  name: string
  slug: string
  sku: string
  productType: 'minifigure' | 'part'
  series?: string
  price: number
  condition: 'new' | 'used'
  stock: number
  isRare: boolean
  imageUrl?: string
  description?: string
  color?: string
  partNumber?: string
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

export interface CartItem {
  productId: string | number
  name: string
  price: number
  sku: string
  imageUrl?: string
  quantity: number
  stock: number
}
