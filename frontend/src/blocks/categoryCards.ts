import type { PageBlock, CategoryCardItem } from '../types.ts'

const DEFAULT_CATEGORIES: CategoryCardItem[] = [
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
]

export function renderCategoryCardsBlock(block?: PageBlock): string {
  const badge = block?.badge || 'НАПРЯМКИ'
  const title = block?.title || 'Оберіть напрям'
  const categories: CategoryCardItem[] =
    block?.items && Array.isArray(block.items) && block.items.length > 0
      ? block.items
      : DEFAULT_CATEGORIES

  const cardsHtml = categories
    .map(
      (cat) => `
      <a href="${cat.href || '#'}" class="category-card js-django-link ${cat.isRare ? 'rare' : ''}">
        <div class="category-card-bg-wrap">
          <img src="${cat.image}" alt="${cat.title}" class="category-card-img" loading="lazy" />
        </div>
        <div class="category-card-content">
          <div class="category-card-title">${cat.title}</div>
          <div class="category-card-cta">
            <span>ДИВИТИСЬ</span>
            <i class="ri-arrow-right-line"></i>
          </div>
        </div>
      </a>
    `,
    )
    .join('')

  return `
    <section class="category-direction-section" id="directions">
      <div class="section-label">${badge}</div>
      <h2 class="section-title">${title}</h2>
      <div class="category-cards-grid">
        ${cardsHtml}
      </div>
    </section>
  `
}
