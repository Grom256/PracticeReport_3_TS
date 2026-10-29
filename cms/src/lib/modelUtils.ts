import type {
  Model3DItem,
  ModelFilterOptions,
  FilterModelsFn,
  Currency,
} from '../types/shop'

export const filterModels: FilterModelsFn = (models, options) => {
  return models.filter((model) => {
    if (options.tag && model.tag && !model.tag.toLowerCase().includes(options.tag.toLowerCase())) {
      return false
    }

    if (options.searchQuery?.trim()) {
      const query = options.searchQuery.toLowerCase().trim()
      const haystack = [model.name, model.subtitle, model.description, model.tag || '']
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }

    if (options.isFeatured !== undefined && model.isFeatured !== options.isFeatured) {
      return false
    }

    return true
  })
}

export function formatPrice(amount: number, currency: Currency = 'UAH'): string {
  const formatted = amount.toLocaleString('uk-UA')
  if (currency === 'EUR') return `€${formatted}`
  if (currency === 'USD') return `$${formatted}`
  return `${formatted} ₴`
}
