import type { PayloadHandler } from 'payload'
import { filterProducts } from '../lib/shopUtils'
import type {
  ApiResponse,
  LegoSeries,
  Product,
  ProductCondition,
  ProductFilterOptions,
  ProductType,
  SortOption,
} from '../types/shop'

/**
 * Пошук і фільтрація каталогу
 * GET /api/products/search
 */
export const productsSearchHandler: PayloadHandler = async (req) => {
  try {
    const url = new URL(req.url || 'http://localhost/api/products/search')
    const searchParams = url.searchParams

    const filterOptions: ProductFilterOptions = {
      searchQuery: searchParams.get('q') || undefined,
      productType: (searchParams.get('type') as ProductType | 'all') || 'all',
      series: (searchParams.get('series') as LegoSeries | 'all') || 'all',
      condition: (searchParams.get('condition') as ProductCondition | 'all') || 'all',
      onlyRare: searchParams.get('onlyRare') === 'true',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: (searchParams.get('sortBy') as SortOption) || 'newest',
    }

    const result = await req.payload.find({
      collection: 'products',
      limit: 200,
      pagination: false,
      where: { isActive: { equals: true } },
    })

    const filtered = filterProducts(result.docs as unknown as Product[], filterOptions)

    const response: ApiResponse<Product[]> = {
      success: true,
      data: filtered,
      message: `Знайдено ${filtered.length} товарів`,
      timestamp: new Date().toISOString(),
    }

    return Response.json(response)
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Помилка пошуку товарів',
      timestamp: new Date().toISOString(),
    }
    return Response.json(errorResponse, { status: 500 })
  }
}
