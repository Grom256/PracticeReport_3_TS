import type { PageBlock } from '../types.ts'

export function renderHeroBlock(block: PageBlock): string {
  const heading = block.heading || 'Фігурки з характером'
  const subheading =
    block.subheading ||
    'Фігурки та деталі LEGO для колекціонерів і майстрів. Ретельно відібрані позиції, які варто мати.'
  const badge = block.badge || 'PREMIUM LEGO COLLECTIBLES'
  const primaryText = block.primaryButtonText || 'ЧОМУ ОБИРАЮТЬ НАС'
  const primaryLink = block.primaryButtonLink || '#why-us'
  const secondaryText = block.secondaryButtonText || 'ПЕРЕЙТИ В МАГАЗИН'
  const secondaryLink = block.secondaryButtonLink || '#'
  const imageUrl = block.imageUrl || '/images/hero-bg.webp'

  return `
    <section class="hero-section">
      <img
        src="${imageUrl}"
        alt=""
        aria-hidden="true"
        class="hero-bg-img"
      />
      <div class="hero-overlay-gradient"></div>

      <div class="hero-content-wrap">
        <div class="hero-text-col">
          <div class="hero-badge-subtitle">${badge}</div>

          <h1 class="hero-heading">${heading}</h1>

          <p class="hero-description">${subheading}</p>

          <div class="hero-actions-row">
            <a href="${primaryLink}" class="btn btn-primary">
              <span>${primaryText}</span>
              <i class="ri-arrow-down-line"></i>
            </a>
            <a href="${secondaryLink}" class="btn btn-secondary js-django-link">
              <i class="ri-store-2-line"></i>
              <span>${secondaryText}</span>
              <i class="ri-arrow-right-up-line"></i>
            </a>
            <a href="https://t.me/grombricks" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i class="ri-telegram-fill"></i>
              <span>TELEGRAM</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `
}
