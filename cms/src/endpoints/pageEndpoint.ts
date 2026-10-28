import type { PayloadHandler } from 'payload'
import { MOCK_HOME_BLOCKS } from '../lib/mockData'

/**
 * Ендпоінт /api/page?path=
 * Згідно з методичкою: повертає чисті плоскі дані сторінки з масивом блоків
 * замість занадто складної структури стандартного REST API Payload CMS.
 */
export const pageDataHandler: PayloadHandler = async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  try {
    const url = new URL(req.url || '', 'http://localhost')
    const pathParam = url.searchParams.get('path') || '/'
    const cleanPath = pathParam.trim()
    const rawSlug = cleanPath.replace(/^\/+|\/+$/g, '')
    const slug = !rawSlug || rawSlug === '/' ? 'home' : rawSlug

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
      // Fallback до мокових даних при відсутності запису в базі даних
    }

    // Перевірка: якщо сторінка в чернетках (не опублікована)
    if (pageDoc && pageDoc.isPublished === false) {
      return Response.json(
        {
          success: false,
          notFound: true,
          error: `Сторінка "${pageDoc.title || slug}" знята з публікації`,
          timestamp: new Date().toISOString(),
        },
        { status: 404, headers: corsHeaders },
      )
    }

    // Якщо сторінка не знайдена і це не головна сторінка — повертаємо 404
    if (!pageDoc && slug !== 'home') {
      return Response.json(
        {
          success: false,
          notFound: true,
          error: `Сторінку "${slug}" не знайдено`,
          timestamp: new Date().toISOString(),
        },
        { status: 404, headers: corsHeaders },
      )
    }

    // Якщо сторінка знайдена в БД — беремо її блоки, інакше для головної — моковий набір лендінгу
    const blocks = pageDoc?.layout || (slug === 'home' ? MOCK_HOME_BLOCKS : [])

    // Формуємо чистий плоский JSON для фронтенду
    const pageResponse = {
      path: pathParam,
      title: pageDoc?.title || (slug === 'home' ? 'GromBricks — Колекційні мініфігурки LEGO' : slug),
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
        headers: corsHeaders,
      },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка завантаження сторінки',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
