export function renderCategoryCardsBlock(): string {
  const categories = [
    {
      title: 'Мініфігурки',
      href: '#',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Деталі та Зброя',
      href: '#',
      image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Star Wars & Ninjago',
      href: '#',
      image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Рідкісні Раритети',
      href: '#',
      image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80',
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
