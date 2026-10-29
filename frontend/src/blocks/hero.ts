import type { PageBlock } from '../types.ts'
import { DJANGO_SHOP_URL } from '../api.ts'

export function renderHeroBlock(block: PageBlock): string {
  const heading = block.heading || 'ЕКСКЛЮЗИВНІ ФІГУРКИ ТА ДЕТАЛІ LEGO'
  const subheading =
    block.subheading ||
    'Колекційні мініфігурки Star Wars, Ninjago, Marvel та унікальні будівельні деталі в Україні. Перевірена якість та оригінал.'

  const rawBadge = block.badge || 'ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ'
  const badge = rawBadge.replace(/^[🧱🔥✨\s]+/, '').trim()

  const primaryText = block.primaryButtonText || '3D ЕКСПОЗИЦІЯ'
  const primaryLink = block.primaryButtonLink || '#models-3d'
  const secondaryText = block.secondaryButtonText || 'ПЕРЕВАГИ'
  const rawSecondaryLink = block.secondaryButtonLink || '#why-us'
  const imageUrl = block.imageUrl || '/images/hero-bg.webp'

  const primaryLower = primaryText.toLowerCase()
  const primaryLeadingIcon =
    primaryLower.includes('3d') || primaryLower.includes('модел') || primaryLower.includes('експозиц')
      ? 'ri-cube-line'
      : primaryLower.includes('переваг')
      ? 'ri-shield-star-line'
      : 'ri-arrow-down-line'

  const secondaryLower = secondaryText.toLowerCase()
  const isSecondaryAnchor = rawSecondaryLink.startsWith('#')
  const isSecondaryDjango =
    !isSecondaryAnchor && (rawSecondaryLink === '#' || secondaryLower.includes('магазин'))
  const secondaryLink = isSecondaryDjango ? DJANGO_SHOP_URL : rawSecondaryLink
  const secondaryClass = `btn btn-secondary ${isSecondaryDjango ? 'js-django-link' : ''}`
  const isExternalSecondary = secondaryLink.startsWith('http')
  const secondaryTargetAttr = isExternalSecondary ? 'target="_blank" rel="noopener noreferrer"' : ''

  const secondaryLeadingIcon = secondaryLower.includes('переваг')
    ? 'ri-shield-star-line'
    : secondaryLower.includes('3d')
    ? 'ri-cube-line'
    : secondaryLower.includes('магазин')
    ? 'ri-store-2-line'
    : 'ri-sparkling-line'

  const secondaryTrailingIcon = isSecondaryAnchor ? 'ri-arrow-down-line' : 'ri-arrow-right-up-line'

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
              <i class="${primaryLeadingIcon}"></i>
              <span>${primaryText}</span>
              <i class="ri-arrow-down-line"></i>
            </a>
            <a href="${secondaryLink}" ${secondaryTargetAttr} class="${secondaryClass}">
              <i class="${secondaryLeadingIcon}"></i>
              <span>${secondaryText}</span>
              <i class="${secondaryTrailingIcon}"></i>
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
