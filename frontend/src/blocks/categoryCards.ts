export function renderCategoryCardsBlock(): string {
  const categories = [
    {
      title: 'Мініфігурки',
      href: '#',
      image: '/images/figures.jpg',
    },
    {
      title: 'Деталі та Зброя',
      href: '#',
      image: '/images/details.jpg',
    },
    {
      title: 'Star Wars & Ninjago',
      href: '#',
      image: '/images/starwars_wall.jpg',
    },
    {
      title: 'Рідкісні Раритети',
      href: '#',
      image: '/images/LEGO-San-Diego-Comic-Con-Exclusives.jpg',
      isRare: true,
    },
  ]

  const cardsHtml = categories
    .map(
      (cat) => `
      <a href="${cat.href}" class="category-card js-django-link ${cat.isRare ? 'rare' : ''}">
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
      <div class="section-label">НАПРЯМКИ</div>
      <h2 class="section-title">Оберіть напрям</h2>
      <div class="category-cards-grid">
        ${cardsHtml}
      </div>
    </section>
  `
}
