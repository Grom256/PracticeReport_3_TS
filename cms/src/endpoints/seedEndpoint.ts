import type { PayloadHandler } from 'payload'

/**
 * Ендпоінт початкового наповнення бази даних тестовими даними GromBricks
 * POST /api/seed
 */
export const seedDatabaseHandler: PayloadHandler = async (req) => {
  const payload = req.payload

  try {
    // 1. Створюємо або знаходимо базові категорії
    const categoriesData = [
      {
        title: 'Star Wars',
        slug: 'star-wars',
        description: 'Мініфігурки та деталі далекої-далекої галактики: джедаї, ситхи, клони, дроїди.',
        badge: 'Хіт',
      },
      {
        title: 'Marvel Super Heroes',
        slug: 'marvel',
        description: 'Месники, Людина-Павук, Залізна Людина та суперлиходії всесвіту Marvel.',
        badge: 'Популярне',
      },
      {
        title: 'LEGO Ninjago',
        slug: 'ninjago',
        description: 'Майстри Кружитцу, ніндзя, дракони та унікальна колекційна зброя.',
        badge: 'Новинки',
      },
      {
        title: 'Classic Castle & Space',
        slug: 'classic',
        description: 'Вінтажні лицарі, космонавти 80-х та рідкісні ретро-деталі.',
        badge: 'Рідкісне',
      },
      {
        title: 'Деталі та аксесуари',
        slug: 'parts',
        description: 'Окремі цеглинки, шоломи, лазерні мечі, плащі та елементи для MOC.',
        badge: 'Деталі',
      },
    ]

    const createdCategories: Record<string, number> = {}

    for (const cat of categoriesData) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        createdCategories[cat.slug] = Number(existing.docs[0].id)
      } else {
        const doc = await payload.create({
          collection: 'categories',
          data: cat,
        })
        createdCategories[cat.slug] = Number(doc.id)
      }
    }

    // 2. Створюємо товари
    const productsData = [
      {
        name: 'Дарт Вейдер (Arm Printing, Spongy Cape)',
        slug: 'darth-vader-arm-printing',
        sku: 'SW-VADER-ARM',
        productType: 'minifigure' as const,
        series: 'Star Wars' as const,
        price: 850,
        condition: 'new' as const,
        stock: 5,
        isRare: true,
        category: createdCategories['star-wars'],
        imageUrl: '/images/vader.webp',
        description:
          'Ексклюзивна мініфігурка Дарта Вейдера з детальним принтом на руках та тканинним плащем нового зразка.',
        isActive: true,
      },
      {
        name: 'Люк Скайвокер (Беспін, Світловий меч)',
        slug: 'luke-skywalker-bespin',
        sku: 'SW-LUKE-BESPIN',
        productType: 'minifigure' as const,
        series: 'Star Wars' as const,
        price: 590,
        condition: 'new' as const,
        stock: 8,
        isRare: false,
        category: createdCategories['star-wars'],
        imageUrl: '/images/luke.webp',
        description:
          'Люк Скайвокер у костюмі з Хмарного міста Беспін із синім світловим мечем.',
        isActive: true,
      },
      {
        name: 'Клон-капітан Рекс (Phase 2, Pauldron)',
        slug: 'captain-rex-phase-2',
        sku: 'SW-REX-P2',
        productType: 'minifigure' as const,
        series: 'Star Wars' as const,
        price: 1450,
        condition: 'new' as const,
        stock: 3,
        isRare: true,
        category: createdCategories['star-wars'],
        imageUrl: '/images/rex.webp',
        description:
          'Культова колекційна фігурка Капітана Рекса у броні Фази 2 з індивідуальними принтами та наплічником.',
        isActive: true,
      },
      {
        name: 'Людина-Павук (Integrated Suit)',
        slug: 'spider-man-integrated-suit',
        sku: 'MV-SPIDEY-INT',
        productType: 'minifigure' as const,
        series: 'Marvel Super Heroes' as const,
        price: 420,
        condition: 'new' as const,
        stock: 12,
        isRare: false,
        category: createdCategories['marvel'],
        imageUrl: '/images/spiderman.webp',
        description: 'Людина-павук в інтегрованому костюмі із золотими вставками з кіновсесвіту Marvel.',
        isActive: true,
      },
      {
        name: 'Залізна Людина Mark 85',
        slug: 'iron-man-mk85',
        sku: 'MV-IRONMAN-85',
        productType: 'minifigure' as const,
        series: 'Marvel Super Heroes' as const,
        price: 720,
        condition: 'new' as const,
        stock: 6,
        isRare: true,
        category: createdCategories['marvel'],
        imageUrl: '/images/ironman.webp',
        description: 'Тоні Старк у фінальній броні Mark 85 із двостороннім шоломом та енергетичними бластерами.',
        isActive: true,
      },
      {
        name: 'Лицар Чорного Сокола (Black Falcon)',
        slug: 'black-falcon-knight',
        sku: 'CST-FALCON-01',
        productType: 'minifigure' as const,
        series: 'Castle' as const,
        price: 380,
        condition: 'new' as const,
        stock: 15,
        isRare: false,
        category: createdCategories['classic'],
        imageUrl: '/images/knight.webp',
        description: 'Класичний лицар Чорного Сокола зі щитом, мечем та срібним шоломом.',
        isActive: true,
      },
      {
        name: 'Лазерний меч (Транс-Червоний клинок + Металеве руківʼя)',
        slug: 'lightsaber-trans-red',
        sku: 'PART-SABER-RED',
        productType: 'part' as const,
        series: 'Star Wars' as const,
        price: 65,
        condition: 'new' as const,
        stock: 45,
        isRare: false,
        category: createdCategories['parts'],
        color: 'Trans-Red / Metallic',
        partNumber: '30374 / 64567',
        imageUrl: '/images/saber-red.webp',
        description: 'Оригінальний світловий меч ситха. Хромоване/металеве руківʼя та яскравий прозоро-червоний клинок.',
        isActive: true,
      },
      {
        name: 'Шолом Мандалорця (Beskar Silver)',
        slug: 'mandalorian-helmet-beskar',
        sku: 'PART-HELMET-MANDO',
        productType: 'part' as const,
        series: 'Star Wars' as const,
        price: 180,
        condition: 'new' as const,
        stock: 10,
        isRare: true,
        category: createdCategories['parts'],
        color: 'Metallic Silver',
        partNumber: '67037',
        imageUrl: '/images/mando-helmet.webp',
        description: 'Оригінальний шолом Діна Джаріна з якісним принтом візора у кольорі Beskar Silver.',
        isActive: true,
      },
    ]

    for (const prod of productsData) {
      const existing = await payload.find({
        collection: 'products',
        where: { sku: { equals: prod.sku } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'products',
          data: prod,
        })
      }
    }

    // 3. Створюємо головну сторінку з динамічними блоками (Pages)
    const existingHomePage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })

    if (existingHomePage.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Головна сторінка GromBricks',
          slug: 'home',
          isPublished: true,
          layout: [
            {
              blockType: 'hero',
              heading: 'Всесвіт оригінальних мініфігурок та деталей LEGO',
              subheading:
                'Ексклюзивні фігурки Star Wars, Marvel, Ninjago та класичні деталі для ваших MOC-творінь. Доставка по всій Україні.',
              badge: '✨ Нові надходження жовтня',
              primaryButtonText: 'Перейти до каталогу',
              primaryButtonLink: '/catalog',
              secondaryButtonText: 'Рідкісні екземпляри',
              secondaryButtonLink: '/catalog?onlyRare=true',
              imageUrl: '/images/hero-bg.webp',
            },
            {
              blockType: 'features',
              title: 'Переваги магазину GromBricks',
              subtitle: 'Ми дбаємо про кожну деталь вашої колекції',
              items: [
                {
                  icon: 'shield',
                  title: '100% Оригінал LEGO®',
                  description: 'Ретельна перевірка логотипів та стану кожного елемента.',
                },
                {
                  icon: 'sparkles',
                  title: 'Рідкісні фігурки',
                  description: 'Колекційні видання з Comic-Con, старих наборів та обмежених тиражів.',
                },
                {
                  icon: 'package',
                  title: 'Дбайливе пакування',
                  description: 'Індивідуальні пакети, картонні коробки та захист від подряпин.',
                },
                {
                  icon: 'truck',
                  title: 'Швидка доставка',
                  description: 'Нова Пошта та Укрпошта по всій Україні з трек-номером.',
                },
              ],
            },
            {
              blockType: 'banner',
              title: 'Знижка 15% на серію Star Wars!',
              description:
                'Зберіть власну армію клонів або замовте легендарного Дарта Вейдера за спеціальною ціною.',
              ctaText: 'Дивитися пропозиції',
              ctaLink: '/catalog?series=Star+Wars',
              variant: 'legoYellow',
            },
            {
              blockType: 'productGrid',
              title: 'Популярні фігурки та деталі',
              subtitle: 'Найкращі пропозиції нашого магазину',
              filterType: 'all',
              limit: 8,
              showViewAll: true,
            },
            {
              blockType: 'cta',
              title: 'Не знайшли потрібної деталі?',
              description:
                'Ми допоможемо замовити рідкісну деталь або фігурку за офіційним LEGO Design ID. Приєднуйтесь до нашого Telegram-каналу!',
              buttonText: 'Приєднатися до спільноти',
              buttonLink: 'https://t.me/grombricks',
            },
          ],
        },
      })
    }

    return Response.json({
      success: true,
      message: 'Базу даних успішно наповнено початковими даними GromBricks.',
      categoriesCount: categoriesData.length,
      productsCount: productsData.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Помилка наповнення бази даних',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
