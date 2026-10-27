import type { CommonData, PageResponse, Product } from './types.ts'

/**
 * Локально Vite проксує API на Payload CMS. У Vercel задай VITE_API_BASE
 * (наприклад, https://grombricks-cms.vercel.app), бо фронтенд і CMS мають
 * різні домени.
 */
export const API_BASE = (
  import.meta.env.VITE_API_BASE?.trim() || ''
).replace(/\/+$/, '')

export const CMS_ADMIN_URL = `${API_BASE || (import.meta.env.DEV ? 'http://localhost:3000' : '')}/admin`

/**
 * Отримання наскрізних даних сайту (/api/common)
 * Відповідає вимогам методички: хедер, футер, телефон, соцмережі із Globals
 */
export async function fetchCommonData(): Promise<CommonData> {
  try {
    const res = await fetch(`${API_BASE}/api/common`)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    return json.data
  } catch (error) {
    console.warn('Fallback common data:', error)
    return {
      header: {
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
      footer: {
        description:
          'Фігурки та деталі LEGO для колекціонерів і майстрів. Ретельно відібрані позиції в Україні.',
        email: 'support@grombricks.ua',
        copyright: '© 2026 GromBricks. Всі права захищено. Навчальний проєкт.',
      },
    }
  }
}

/**
 * Отримання сторінки та її блоків (/api/page?path=...)
 * Відповідає вимогам методички: віддача контенту через конструктор блоків
 */
export async function fetchPageData(path: string = '/'): Promise<PageResponse> {
  try {
    const res = await fetch(
      `${API_BASE}/api/page?path=${encodeURIComponent(path)}`,
    )
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    return json.data
  } catch (error) {
    console.warn('Fallback page data:', error)
    return {
      path,
      slug: 'home',
      title: 'GromBricks — Колекційні мініфігурки LEGO',
      blocks: [
        {
          blockType: 'hero',
          badge: 'ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ',
          heading: 'ЕКСКЛЮЗИВНІ ФІГУРКИ ТА ДЕТАЛІ LEGO',
          subheading:
            'Колекційні мініфігурки Star Wars, Ninjago, Marvel та унікальні будівельні деталі в Україні. Перевірена якість та оригінал.',
          primaryButtonText: '3D ЕКСПОЗИЦІЯ',
          primaryButtonLink: '#models-3d',
          secondaryButtonText: 'ПЕРЕВАГИ',
          secondaryButtonLink: '#why-us',
        },
        {
          blockType: 'features',
          title: 'Чому обирають GromBricks',
          items: [
            {
              icon: 'shield',
              title: '100% Оригінал',
              description: 'Тільки аутентичні деталі LEGO без підробок.',
            },
            {
              icon: 'truck',
              title: 'Швидка відправка',
              description: 'Відправлення в день замовлення по всій Україні.',
            },
            {
              icon: 'sparkles',
              title: 'Рідкісні екземпляри',
              description: 'Фігурки з раритетних та ексклюзивних наборів.',
            },
          ],
        },
        {
          blockType: 'modelViewer',
        },
        {
          blockType: 'categoryCards',
        },
        {
          blockType: 'cta',
          title: 'Першими бачите новинки',
          description:
            'Підпишіться на канал: ексклюзивні релізи, розіграші та швидкий викуп рідкісних деталей.',
          buttonText: 'ПРИЄДНАТИСЯ В TELEGRAM',
          buttonLink: 'https://t.me/grombricks',
        },
      ],
    }
  }
}

/**
 * Пошук та фільтрація товарів для вітрини (/api/products/search)
 */
export async function fetchProducts(params: Record<string, string> = {}): Promise<Product[]> {
  try {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${API_BASE}/api/products/search?${query}`)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Помилка завантаження товарів:', error)
    return []
  }
}
