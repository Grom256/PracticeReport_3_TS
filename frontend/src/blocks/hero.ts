import type { PageBlock } from '../types.ts'

export function renderHeroBlock(block: PageBlock): string {
  const subheading =
    block.subheading ||
    'Фігурки та деталі LEGO для колекціонерів і майстрів. Ретельно відібрані позиції, які варто мати.'
  const badge = block.badge || 'PREMIUM LEGO COLLECTIBLES'
  const secondaryLink = block.secondaryButtonLink || 'https://t.me/grombricks'

  return `
    <section class="hero-section">
      <img
        src="/images/hero-bg.webp"
        alt=""
        aria-hidden="true"
        class="hero-bg-img"
      />
      <div class="hero-overlay-gradient"></div>

      <div class="hero-content-wrap">
        <div class="hero-text-col">
          <div class="hero-badge-subtitle">${badge}</div>

          <h1 class="hero-heading">
            Фігурки <span class="gold-gradient-text">з характером</span>
          </h1>

          <p class="hero-description">${subheading}</p>

          <div class="hero-actions-row">
            <a href="#why-us" class="btn btn-primary">
              <span>ЧОМУ ОБИРАЮТЬ НАС</span>
              <i class="ri-arrow-down-line"></i>
            </a>
            <a href="#" class="btn btn-secondary js-django-link">
              <i class="ri-store-2-line"></i>
              <span>ПЕРЕЙТИ В МАГАЗИН</span>
              <i class="ri-arrow-right-up-line"></i>
            </a>
            <a href="${secondaryLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i class="ri-telegram-fill"></i>
              <span>TELEGRAM</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `
}
