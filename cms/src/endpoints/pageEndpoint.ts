import type { PayloadHandler } from 'payload'
import { MOCK_HOME_BLOCKS } from '../lib/mockData'

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
      // Fallback до мокових даних при відсутності запису
    }

    // Якщо сторінка знайдена в БД — беремо її блоки, інакше моковий набір лендінгу
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
      blocks,
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
