import type { CommonData, PageResponse } from './types.ts'

const rawApiBase = import.meta.env.VITE_API_BASE?.trim()
export const API_BASE = (
  (rawApiBase && !rawApiBase.includes('grombricks-cms') ? rawApiBase : '') ||
  (import.meta.env.DEV ? 'http://localhost:3000' : 'https://practice-report-3-ts.vercel.app')
).replace(/\/+$/, '')

export const CMS_ADMIN_URL = 'https://practice-report-3-ts.vercel.app/admin'
export const DJANGO_SHOP_URL = 'https://grombricks.onrender.com/'

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

export async function fetchPageData(path: string = '/'): Promise<PageResponse> {
  const isHome = path === '/' || path === 'home' || path === ''
  try {
    const res = await fetch(
      `${API_BASE}/api/page?path=${encodeURIComponent(path)}`,
    )
    if (res.status === 404) {
      const json = await res.json().catch(() => null)
      const err = new Error(json?.error || 'Сторінку не знайдено')
      ;(err as any).status = 404
      throw err
    }
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    if (!json.success || !json.data) {
      throw new Error(json?.error || 'Помилка отримання даних сторінки')
    }
    return json.data
  } catch (error: any) {
    if (error?.status === 404 || (!isHome && error?.message?.includes('не знайдено'))) {
      throw error
    }
    if (isHome) {
      console.warn('Fallback page data for home:', error)
      return {
        path: '/',
        slug: 'home',
        title: 'GromBricks — Колекційні мініфігурки LEGO',
        blocks: [
          {
            blockType: 'hero',
            badge: 'ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ',
            heading: 'ЕКСКЛЮЗИВНІ ФІГУРКИ ТА ДЕТАЛІ LEGO',
            subheading:
              'Колекційні мініфігурки Star Wars, Ninjago, Marvel та унікальні будівельні деталі в Україні. Перевірена якість та оригінал.',
            primaryButtonText: 'ЧОМУ ОБИРАЮТЬ НАС',
            primaryButtonLink: '#why-us',
            secondaryButtonText: 'ПЕРЕЙТИ В МАГАЗИН',
            secondaryButtonLink: '#',
          },
          {
            blockType: 'features',
            title: 'Чому колекціонери обирають GromBricks',
            subtitle: 'Ми знаємо справжню цінність кожної мініфігурки та гарантуємо музейний стан кожної деталі',
            items: [
              {
                icon: 'shield',
                badge: 'АВТЕНТИЧНІСТЬ',
                title: '100% Оригінальність',
                description: 'Жодних підробок чи копій. Ретельно перевіряємо мікро-гравіювання LEGO, стан шарнірів і яскравість принтів на кожній фігурці.',
              },
              {
                icon: 'package',
                badge: 'БЕЗПЕКА',
                title: 'Колекційне пакування',
                description: 'Індивідуальні антистатичні зіп-пакети для мініфігурок, пухирчаста плівка та жорсткі коробки. Фігурки приїжджають без жодної мікроподряпини.',
              },
              {
                icon: 'truck',
                badge: 'ЛОГІСТИКА',
                title: 'Швидка відправка',
                description: 'Щоденні відправлення Новою Поштою та Укрпоштою по всій Україні. Відправляємо в день замовлення, надаємо ТТН протягом 30 хвилин.',
              },
              {
                icon: 'sparkles',
                badge: 'РАРИТЕТИ',
                title: 'Рідкісні ексклюзиви',
                description: 'Регулярно поповнюємо вітрину фігурками з Comic-Con, закритих серій Star Wars та рідкісними деталями для авторських MOC-проєктів.',
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
                href: DJANGO_SHOP_URL,
                image: '/images/figures.jpg',
                isRare: false,
              },
              {
                title: 'Деталі та Зброя',
                href: DJANGO_SHOP_URL,
                image: '/images/details.jpg',
                isRare: false,
              },
              {
                title: 'Star Wars & Ninjago',
                href: DJANGO_SHOP_URL,
                image: '/images/starwars_wall.jpg',
                isRare: false,
              },
              {
                title: 'Рідкісні Раритети',
                href: DJANGO_SHOP_URL,
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
    throw error
  }
}
