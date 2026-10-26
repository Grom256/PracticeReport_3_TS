import type { PayloadHandler } from 'payload'
import { MOCK_HOME_BLOCKS, MOCK_PRODUCTS } from '../lib/mockData'

/**
 * Ендпоінт /api/page?path=
 * Згідно з методичкою: повертає чисті плоскі дані сторінки з масивом блоків
 * замість занадто складної структури стандартного REST API Payload CMS.
 */
export const pageDataHandler: PayloadHandler = async (req) => {
  try {
    const url = new URL(req.url || '', 'http://localhost')
    const pathParam = url.searchParams.get('path') || '/'
    const slug = pathParam === '/' ? 'home' : pathParam.replace(/^\//, '')

    let pageDoc: any = null
    try {
      const pagesRes = await req.payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (pagesRes.docs.length > 0) {
        pageDoc = pagesRes.docs[0]
      }
    } catch (e) {
      // Fallback
    }

    // Отримуємо актуальні товари для блоку productGrid
    let productsList: any[] = []
    try {
      const prodRes = await req.payload.find({
        collection: 'products',
        where: { isActive: { equals: true } },
        limit: 12,
      })
      if (prodRes.docs.length > 0) {
        productsList = prodRes.docs
      }
    } catch (e) {
      // Fallback
    }

    if (productsList.length === 0) {
      productsList = MOCK_PRODUCTS
    }

    // Якщо сторінка знайдена в БД — беремо її блоки, інакше моковий набір
    const blocks = pageDoc?.layout || MOCK_HOME_BLOCKS

    // Формуємо чистий плоский JSON для фронтенду
    const pageResponse = {
      path: pathParam,
      title: pageDoc?.title || (slug === 'home' ? 'Головна сторінка' : slug),
      slug,
      meta: {
        description:
          'GromBricks — ексклюзивні та оригінальні мініфігурки і деталі LEGO для колекціонерів.',
      },
      blocks: blocks.map((b: any) => {
        // Якщо блок типу productGrid — додаємо до нього чистий масив товарів
        if (b.blockType === 'productGrid') {
          return {
            ...b,
            products: productsList,
          }
        }
        return b
      }),
    }

    return Response.json(
      {
        success: true,
        data: pageResponse,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка завантаження сторінки',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
