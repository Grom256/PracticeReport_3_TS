import type { PayloadHandler } from 'payload'

/**
 * Ендпоінт /api/common
 * Згідно з методичкою: повертає загальні дані (хедер, футер, контакти) із Globals
 */
export const commonDataHandler: PayloadHandler = async (req) => {
  try {
    let header = null
    let footer = null

    try {
      header = await (req.payload as any).findGlobal({
        slug: 'header-settings',
      })
      footer = await (req.payload as any).findGlobal({
        slug: 'footer-settings',
      })
    } catch (e) {
      // Fallback якщо база ще не заповнена
    }

    const data = {
      header: header || {
        brandName: 'GROMBRICKS',
        phone: '+380 (67) 123-45-67',
        telegramUrl: 'https://t.me/grombricks',
        navItems: [
          { label: 'ФІГУРКИ', url: '/catalog.html?type=minifigure' },
          { label: 'ДЕТАЛІ', url: '/catalog.html?type=part' },
          { label: 'НАБОРИ', url: '/catalog.html' },
          { label: 'РІДКІСНЕ', url: '/catalog.html?onlyRare=true' },
          { label: 'ПРО НАС', url: '/#about' },
        ],
      },
      footer: footer || {
        description:
          'Фігурки та деталі LEGO для колекціонерів і майстрів. Ретельно відібрані позиції в Україні.',
        email: 'support@grombricks.ua',
        copyright: '© 2026 GromBricks. Всі права захищено. Навчальний проєкт.',
      },
    }

    return Response.json(
      {
        success: true,
        data,
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
        error: error instanceof Error ? error.message : 'Помилка отримання загальних даних',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
