import type { PayloadHandler } from 'payload'

/**
 * Ендпоінт початкового наповнення бази даних тестовими даними GromBricks
 * POST /api/seed
 */
export const seedDatabaseHandler: PayloadHandler = async (req) => {
  const payload = req.payload

  try {
    // 1. Створюємо або знаходимо базові категорії напрямків
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

    for (const cat of categoriesData) {
      const existing = await payload.find({
        collection: 'categories',
        where: { slug: { equals: cat.slug } },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'categories',
          data: cat,
        })
      }
    }

    // 2. Створюємо головну сторінку лендінгу з динамічними блоками (Pages)
    const existingHomePage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
      limit: 1,
    })

    const homePageLayout = [
      {
        blockType: 'hero',
        heading: 'ЕКСКЛЮЗИВНІ ФІГУРКИ ТА ДЕТАЛІ LEGO',
        subheading:
          'Колекційні мініфігурки Star Wars, Ninjago, Marvel та унікальні будівельні деталі в Україні. Перевірена якість та оригінал.',
        badge: 'ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ',
        primaryButtonText: '3D ЕКСПОЗИЦІЯ',
        primaryButtonLink: '#models-3d',
        secondaryButtonText: 'ПЕРЕВАГИ',
        secondaryButtonLink: '#why-us',
        imageUrl: '/images/hero-bg.webp',
      },
      {
        blockType: 'features',
        title: 'Чому обирають GromBricks',
        subtitle: 'Ми знаємо справжню цінність кожної мініфігурки та гарантуємо музейний стан кожної деталі',
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
            modelId: 'golden_ninja',
            name: 'Golden Ninja (Lloyd)',
            subtitle: 'Колекційна серія Ninjago Legacy',
            tag: 'Ексклюзив ★',
            description:
              'Легендарний Золотий Ніндзя Ллойд у виняткових золотих обладунках із детальним тисненням. Модель з високою деталізацією кожного елемента.',
            objPath: '/models/golden_ninja.obj',
            mtlPath: '/models/golden_ninja.mtl',
          },
          {
            modelId: 'kai_jungle',
            name: 'Kai Jungle Robes',
            subtitle: 'Ninjago: Tournament of Elements',
            tag: 'Популярне',
            description:
              'Кай у спеціальному бойовому кімоно для джунглів зі стрічками та традиційними вогняними емблемами клану Вогню.',
            objPath: '/models/kai_jungle.obj',
            mtlPath: '/models/kai_jungle.mtl',
          },
          {
            modelId: 'cole_jungle',
            name: 'Cole Jungle Robes',
            subtitle: 'Ninjago: Tournament of Elements',
            tag: 'Рідкісне',
            description:
              'Коул — майстер стихії Землі в міцному спорядженні для експедицій у тропічні джунглі із захисними накладками.',
            objPath: '/models/cole_jungle.obj',
            mtlPath: '/models/cole_jungle.mtl',
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
            image: '/images/figures.jpg',
            href: 'https://grombricks.onrender.com/',
            isRare: false,
          },
          {
            title: 'Деталі та Зброя',
            image: '/images/details.jpg',
            href: 'https://grombricks.onrender.com/',
            isRare: false,
          },
          {
            title: 'Star Wars & Ninjago',
            image: '/images/starwars_wall.jpg',
            href: 'https://grombricks.onrender.com/',
            isRare: false,
          },
          {
            title: 'Рідкісні Раритети',
            image: '/images/LEGO-San-Diego-Comic-Con-Exclusives.jpg',
            href: 'https://grombricks.onrender.com/',
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
    ]

    if (existingHomePage.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Головна сторінка GromBricks',
          slug: 'home',
          isPublished: true,
          layout: homePageLayout as any,
        },
      })
    } else {
      await payload.update({
        collection: 'pages',
        id: existingHomePage.docs[0].id,
        data: {
          layout: homePageLayout as any,
        },
      })
    }

    return Response.json({
      success: true,
      message: 'Базу даних успішно наповнено початковими даними лендінгу GromBricks.',
      categoriesCount: categoriesData.length,
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
