import type { PayloadHandler } from 'payload'

export const commonDataHandler: PayloadHandler = async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

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
    }

    const data = {
      header: header || {
        brandName: 'GROMBRICKS',
        phone: '+380 (67) 123-45-67',
        telegramUrl: 'https://t.me/grombricks',
        navItems: [
          { label: 'ПЕРЕВАГИ', url: '#why-us' },
          { label: '3D ВІТРИНА', url: '#models-3d' },
          { label: 'НАПРЯМКИ', url: '#directions' },
          { label: 'ПРО НАС', url: '#about' },
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
        headers: corsHeaders,
      },
    )
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка отримання загальних даних',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
