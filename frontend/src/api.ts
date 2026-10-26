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
          { label: 'ФІГУРКИ', url: '/catalog.html?type=minifigure' },
          { label: 'ДЕТАЛІ', url: '/catalog.html?type=part' },
          { label: 'НАБОРИ', url: '/catalog.html' },
          { label: 'РІДКІСНЕ', url: '/catalog.html?onlyRare=true' },
          { label: 'ПРО НАС', url: '/#about' },
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
 * Згідно з методичкою: чистий JSON для динамічного рендерингу блоків
 */
export async function fetchPageData(path: string = '/'): Promise<PageResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/page?path=${encodeURIComponent(path)}`)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    return json.data
  } catch (error) {
    console.warn('Fallback page data:', error)
    return {
      path,
      title: 'Головна сторінка',
      slug: 'home',
      blocks: [
        {
          blockType: 'hero',
          heading: 'Фігурки з характером',
          subheading:
            'Фігурки та деталі LEGO для колекціонерів і майстрів. Ретельно відібрані позиції, які варто мати.',
          badge: 'PREMIUM LEGO COLLECTIBLES',
          secondaryButtonText: 'TELEGRAM-КАНАЛ',
          secondaryButtonLink: 'https://t.me/grombricks',
        },
        {
          blockType: 'features',
          title: 'Чому колекціонери обирають GromBricks',
          subtitle:
            'Ми знаємо справжню цінність кожної мініфігурки та гарантуємо музейний стан кожної деталі',
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
 * Пошук та фільтрація товарів у каталозі (/api/products/search)
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

/**
 * Оформлення замовлення (/api/orders/checkout)
 */
export async function submitCheckout(orderData: any) {
  const res = await fetch(`${API_BASE}/api/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })
  return res.json()
}
