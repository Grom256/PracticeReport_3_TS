import type { PageBlock, Product } from '../types.ts'

export function renderProductCard(p: Product): string {
  const image =
    p.imageUrl ||
    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80'

  return `
    <div class="product-card" data-product-id="${p.id}">
      <div class="product-card-image-wrap">
        <img src="${image}" alt="${p.name}" class="product-card-image" loading="lazy" />
        <div class="product-badges">
          ${p.isRare ? '<span class="badge badge-rare">Рідкісний</span>' : ''}
          <span class="badge ${p.condition === 'new' ? 'badge-new' : 'badge-used'}">
            ${p.condition === 'new' ? 'Новий' : 'Вживаний'}
          </span>
        </div>
      </div>

      <div class="product-card-body">
        ${p.series ? `<div class="product-card-series">${p.series}</div>` : ''}
        <h3 class="product-card-title">${p.name}</h3>

        <div class="product-card-footer">
          <div class="product-card-price">${p.price} ₴</div>
          <a
            href="#"
            class="btn-add-cart js-django-link"
            title="Переглянути в магазині"
          >
            <span>ДЕТАЛЬНІШЕ</span>
          </a>
        </div>
      </div>
    </div>
  `
}

export function renderProductGridBlock(block: PageBlock): string {
  const title = block.title || 'Щойно в наявності'
  const subtitle = block.subtitle || 'Свіжі надходження оригінальних мініфігурок LEGO'
  const products: Product[] = block.products || []

  const cardsHtml =
    products.length > 0
      ? products.map(renderProductCard).join('')
      : '<div class="empty-container"><p class="empty-message">Завантаження товарів...</p></div>'

  return `
    <section class="product-section-wrap" id="catalog">
      <div class="product-section-header">
        <div>
          <div class="section-label">КАТАЛОГ</div>
          <h2 class="section-title">${title}</h2>
          ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
        </div>
        <a href="#" class="view-all-link js-django-link">
          <span>Більше в магазині</span>
          <i class="ri-arrow-right-line"></i>
        </a>
      </div>

      <div class="product-grid" id="home-product-grid">
        ${cardsHtml}
      </div>
    </section>
  `
}
