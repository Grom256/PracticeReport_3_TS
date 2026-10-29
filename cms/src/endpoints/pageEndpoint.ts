import type { PayloadHandler } from 'payload'
import { MOCK_HOME_BLOCKS } from '../lib/mockData'

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
      
    }

    const blocks = pageDoc?.layout || MOCK_HOME_BLOCKS

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
