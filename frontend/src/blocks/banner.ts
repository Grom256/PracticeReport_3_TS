import type { PageBlock } from '../types.ts'
import { DJANGO_SHOP_URL } from '../api.ts'

export function renderBannerBlock(block: PageBlock): string {
  const title = block.title || 'Спеціальна пропозиція GromBricks'
  const description = block.description || ''
  const ctaText = block.ctaText || 'Дізнатися більше'
  const rawLink = block.ctaLink?.trim()
  const ctaLink = !rawLink || rawLink === '#' ? DJANGO_SHOP_URL : rawLink
  const variant = block.variant || 'legoYellow'
  const isExternal = ctaLink.startsWith('http')
  const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''

  return `
    <section class="promo-banner-section banner-variant-${variant}">
      <div class="promo-banner-card">
        <div class="promo-banner-content">
          <div class="section-label">СПЕЦІАЛЬНА ПРОПОЗИЦІЯ</div>
          <h2 class="promo-banner-title">${title}</h2>
          ${description ? `<p class="promo-banner-desc">${description}</p>` : ''}
        </div>
        <div class="promo-banner-action">
          <a href="${ctaLink}" ${targetAttr} class="btn btn-primary js-django-link">
            <span>${ctaText}</span>
            <i class="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>
    </section>
  `
}
