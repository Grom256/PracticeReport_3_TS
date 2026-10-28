import type { PageBlock } from '../types.ts'

export function renderBannerBlock(block: PageBlock): string {
  const title = block.title || 'Спеціальна пропозиція GromBricks'
  const description = block.description || ''
  const ctaText = block.ctaText || 'Дізнатися більше'
  const ctaLink = block.ctaLink || '#'
  const variant = block.variant || 'legoYellow'

  return `
    <section class="promo-banner-section banner-variant-${variant}">
      <div class="promo-banner-card">
        <div class="promo-banner-content">
          <div class="section-label">СПЕЦІАЛЬНА ПРОПОЗИЦІЯ</div>
          <h2 class="promo-banner-title">${title}</h2>
          ${description ? `<p class="promo-banner-desc">${description}</p>` : ''}
        </div>
        <div class="promo-banner-action">
          <a href="${ctaLink}" class="btn btn-primary js-django-link">
            <span>${ctaText}</span>
            <i class="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>
    </section>
  `
}
