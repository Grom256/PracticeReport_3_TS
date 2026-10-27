import type {
  Product,
  ProductFilterOptions,
  Currency,
  FilterProductsFn,
} from '../types/shop'

export const filterProducts: FilterProductsFn = (products, options) => {
  return products
    .filter((product) => {
      if (!product.isActive) return false

      if (options.searchQuery?.trim()) {
        const query = options.searchQuery.toLowerCase().trim()
        const haystack = [product.name, product.sku, product.series, product.description]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }

      if (options.productType && options.productType !== 'all' && product.productType !== options.productType) {
        return false
      }

      if (options.series && options.series !== 'all' && product.series !== options.series) {
        return false
      }

      if (options.condition && options.condition !== 'all' && product.condition !== options.condition) {
        return false
      }

      if (options.onlyRare && !product.isRare) return false
      if (options.minPrice !== undefined && product.price < options.minPrice) return false
      if (options.maxPrice !== undefined && product.price > options.maxPrice) return false

      return true
    })
    .sort((a, b) => {
      switch (options.sortBy) {
        case 'price_asc':
          return a.price - b.price
        case 'price_desc':
          return b.price - a.price
        case 'name_asc':
          return a.name.localeCompare(b.name, 'uk')
        case 'name_desc':
          return b.name.localeCompare(a.name, 'uk')
        default:
          return 0
      }
    })
}

export function formatPrice(amount: number, currency: Currency = 'UAH'): string {
  const formatted = amount.toLocaleString('uk-UA')
  if (currency === 'EUR') return `€${formatted}`
  if (currency === 'USD') return `$${formatted}`
  return `${formatted} ₴`
}
