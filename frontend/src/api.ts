import type { CommonData, PageResponse } from './types.ts'

/**
 * Локально Vite проксує API на Payload CMS. У Vercel використовується VITE_API_BASE
 * або прямий продакшен-домен бекенду Payload CMS.
 */
export const API_BASE = (
  import.meta.env.VITE_API_BASE?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:3000' : 'https://practice-report-3-ts.vercel.app')
).replace(/\/+$/, '')

export const CMS_ADMIN_URL = `${API_BASE}/admin`

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
          badge: '3D ЕКСПОЗИЦІЯ',
          title: 'Інтерактивна 3D Вітрина Мініфігурок',
          subtitle:
            'Обертайте фігурку на 360°, масштабуйте та роздивляйтесь деталі зі студійним освітленням',
          models: [
            {
              id: 'golden_ninja',
              name: 'Golden Ninja (Lloyd)',
              subtitle: 'Колекційна серія Ninjago Legacy',
              objPath: '/models/golden_ninja.obj',
              mtlPath: '/models/golden_ninja.mtl',
              tag: 'Ексклюзив ★',
              description:
                'Легендарний Золотий Ніндзя Ллойд у виняткових золотих обладунках із детальним тисненням. Модель з високою деталізацією кожного елемента.',
            },
            {
              id: 'kai_jungle',
              name: 'Kai Jungle Robes',
              subtitle: 'Ninjago: Tournament of Elements',
              objPath: '/models/kai_jungle.obj',
              mtlPath: '/models/kai_jungle.mtl',
              tag: 'Популярне',
              description:
                'Кай у спеціальному бойовому кімоно для джунглів зі стрічками та традиційними вогняними емблемами клану Вогню.',
            },
            {
              id: 'cole_jungle',
              name: 'Cole Jungle Robes',
              subtitle: 'Ninjago: Tournament of Elements',
              objPath: '/models/cole_jungle.obj',
              mtlPath: '/models/cole_jungle.mtl',
              tag: 'Рідкісне',
              description:
                'Коул — майстер стихії Землі в міцному спорядженні для експедицій у тропічні джунглі із захисними накладками.',
            },
          ],
        },
        {
          blockType: 'categoryCards',
          badge: 'НАПРЯМКИ',
          title: 'Оберіть напрям',
          items: [
            {
              title: 'Мініфігурки',
              href: '#',
              image: '/images/figures.jpg',
              isRare: false,
            },
            {
              title: 'Деталі та Зброя',
              href: '#',
              image: '/images/details.jpg',
              isRare: false,
            },
            {
              title: 'Star Wars & Ninjago',
              href: '#',
              image: '/images/starwars_wall.jpg',
              isRare: false,
            },
            {
              title: 'Рідкісні Раритети',
              href: '#',
              image: '/images/LEGO-San-Diego-Comic-Con-Exclusives.jpg',
              isRare: true,
            },
          ],
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
