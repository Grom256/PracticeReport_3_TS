import type {
  Product,
  CartItem,
  CartItemWithDetails,
  ProductFilterOptions,
  PriceCalculationResult,
  DeliveryService,
  Currency,
  CartValidatorFn,
  PriceCalculatorFn,
  FilterProductsFn,
} from '../types/shop'

export const validateCart: CartValidatorFn = (items, productsPool) => {
  const result = {
    isValid: true,
    items: [] as ReturnType<CartValidatorFn>['items'],
    errors: [] as string[],
  }

  const productsMap = new Map(productsPool.map((product) => [String(product.id), product]))

  for (const item of items) {
    const product = productsMap.get(String(item.productId))

    if (!product) {
      result.isValid = false
      result.errors.push(`Товар з ідентифікатором ${item.productId} не знайдено в каталозі.`)
      continue
    }

    const currentStock = Number(product.stock) || 0
    const isAvailable = product.isActive && currentStock > 0
    const hasEnoughStock = isAvailable && currentStock >= item.quantity

    if (!isAvailable) {
      result.isValid = false
      result.errors.push(`Товар "${product.name}" наразі закінчився на складі.`)
    } else if (!hasEnoughStock) {
      result.isValid = false
      result.errors.push(
        `Недостатній залишок для "${product.name}": у наявності ${currentStock} шт., у кошику ${item.quantity} шт.`,
      )
    }

    result.items.push({
      productId: String(product.id),
      productName: product.name,
      requestedQuantity: item.quantity,
      availableStock: currentStock,
      isAvailable: hasEnoughStock,
      currentPrice: product.price,
    })
  }

  return result
}

export const calculateOrderPricing: PriceCalculatorFn = (items, deliveryService) => {
  const itemsSubtotal = items.reduce((acc, item) => acc + item.subtotal, 0)

  let deliveryFee = 80
  if (deliveryService === 'ukrposhta') deliveryFee = 50
  if (deliveryService === 'meest') deliveryFee = 65
  if (itemsSubtotal >= 1500) deliveryFee = 0

  const result: PriceCalculationResult = {
    itemsSubtotal,
    deliveryFee,
    discountAmount: 0,
    total: itemsSubtotal + deliveryFee,
    currency: 'UAH',
  }

  return result
}

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

export function toCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    quantity,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    price: product.price,
    imageUrl: product.imageUrl,
    stock: product.stock,
  }
}

export function withCartDetails(item: CartItem): CartItemWithDetails {
  return {
    ...item,
    product: {
      id: item.productId,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      productType: 'minifigure',
      price: item.price,
      condition: 'new',
      stock: item.stock,
      isRare: false,
      category: '',
      imageUrl: item.imageUrl,
      isActive: true,
    },
    subtotal: item.price * item.quantity,
    isAvailable: item.stock > 0,
    hasEnoughStock: item.stock >= item.quantity,
  }
}

export function formatPrice(amount: number, currency: Currency = 'UAH'): string {
  const formatted = amount.toLocaleString('uk-UA')
  if (currency === 'EUR') return `€${formatted}`
  if (currency === 'USD') return `$${formatted}`
  return `${formatted} ₴`
}
