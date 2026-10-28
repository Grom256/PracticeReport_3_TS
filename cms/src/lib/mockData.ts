import type { Category, PageBlockData } from '../types/shop'

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-star-wars',
    title: 'Star Wars',
    slug: 'star-wars',
    description: 'Мініфігурки та деталі далекої-далекої галактики: джедаї, ситхи, клони, дроїди.',
    badge: 'Хіт',
    iconName: 'sword',
  },
  {
    id: 'cat-marvel',
    title: 'Marvel Super Heroes',
    slug: 'marvel',
    description: 'Месники, Людина-Павук, Залізна Людина та суперлиходії всесвіту Marvel.',
    badge: 'Популярне',
    iconName: 'shield',
  },
  {
    id: 'cat-ninjago',
    title: 'LEGO Ninjago',
    slug: 'ninjago',
    description: 'Майстри Кружитцу, ніндзя, дракони та унікальна колекційна зброя.',
    badge: 'Новинки',
    iconName: 'zap',
  },
  {
    id: 'cat-classic',
    title: 'Classic Castle & Space',
    slug: 'classic',
    description: 'Вінтажні лицарі, космонавти 80-х та рідкісні ретро-деталі.',
    badge: 'Рідкісне',
    iconName: 'castle',
  },
  {
    id: 'cat-parts',
    title: 'Деталі та аксесуари',
    slug: 'parts',
    description: 'Окремі цеглинки, шоломи, лазерні мечі, плащі та елементи для MOC.',
    badge: 'Деталі',
    iconName: 'box',
  },
]

export const MOCK_HOME_BLOCKS: PageBlockData[] = [
  {
    blockType: 'hero',
    heading: 'GromBricks — Всесвіт колекційних мініфігурок та деталей LEGO',
    subheading:
      'Оригінальні деталі, рідкісні фігурки Star Wars, Marvel, Ninjago та кастомні елементи для ваших MOC-проєктів з доставкою по всій Україні.',
    badge: 'ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ',
    primaryButtonText: '3D ЕКСПОЗИЦІЯ',
    primaryButtonLink: '#models-3d',
    secondaryButtonText: 'ПЕРЕВАГИ',
    secondaryButtonLink: '#why-us',
    imageUrl: '/images/hero-bg.webp',
  },
  {
    blockType: 'features',
    title: 'Чому колекціонери обирають GromBricks',
    subtitle: 'Ми знаємо справжню цінність кожної мініфігурки та гарантуємо музейний стан кожної деталі',
    items: [
      {
        icon: 'shield',
        title: '100% Оригінальність',
        description: 'Перевіряємо гравіювання та стан кожної деталі. Жодних копій чи підробок.',
      },
      {
        icon: 'package',
        title: 'Колекційне пакування',
        description: 'Індивідуальні зіп-пакети, захист від пилу та надійна амортизація під час перевезення.',
      },
      {
        icon: 'truck',
        title: 'Швидка відправка',
        description: 'Нова Пошта та Укрпошта по всій Україні. Відправлення в день замовлення.',
      },
      {
        icon: 'sparkles',
        title: 'Рідкісні знахідки',
        description: 'Ексклюзивні фігурки з Comic-Con, старих наборів та лімітованих серій.',
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
        objPath: '/models/golden_ninja.obj',
        mtlPath: '/models/golden_ninja.mtl',
        tag: 'Ексклюзив ★',
        description:
          'Легендарний Золотий Ніндзя Ллойд у виняткових золотих обладунках із детальним тисненням. Модель з високою деталізацією кожного елемента.',
      },
      {
        modelId: 'kai_jungle',
        name: 'Kai Jungle Robes',
        subtitle: 'Ninjago: Tournament of Elements',
        objPath: '/models/kai_jungle.obj',
        mtlPath: '/models/kai_jungle.mtl',
        tag: 'Популярне',
        description:
          'Кай у спеціальному бойовому кімоно для джунглів зі стрічками та традиційними вогняними емблемами клану Вогню.',
      },
      {
        modelId: 'cole_jungle',
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
        image: '/images/figures.jpg',
        href: '#',
      },
      {
        title: 'Деталі та Зброя',
        image: '/images/details.jpg',
        href: '#',
      },
      {
        title: 'Star Wars & Ninjago',
        image: '/images/starwars_wall.jpg',
        href: '#',
      },
      {
        title: 'Рідкісні Раритети',
        image: '/images/LEGO-San-Diego-Comic-Con-Exclusives.jpg',
        href: '#',
        isRare: true,
      },
    ],
  },
  {
    blockType: 'cta',
    title: 'Шукаєте особливу фігурку або деталь під MOC?',
    description:
      'Напишіть нам у Telegram-спільноту GromBricks! Ми допоможемо знайти навіть найрідкісніший екземпляр за каталожним номером.',
    buttonText: 'Приєднатися до Telegram',
    buttonLink: 'https://t.me/grombricks',
  },
]
