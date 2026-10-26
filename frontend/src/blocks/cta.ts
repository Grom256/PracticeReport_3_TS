import type { PageBlock } from '../types.ts'

export function renderCtaBlock(block: PageBlock): string {
  const title = block.title || 'Першими бачите новинки'
  const description =
    block.description ||
    'Підпишіться на канал: ексклюзивні релізи, розіграші та швидкий викуп рідкісних деталей.'
  const buttonText = block.buttonText || 'ПЕРЕЙТИ В КАНАЛ'
  const buttonLink = block.buttonLink || 'https://t.me/grombricks'

  return `
    <section class="telegram-callout-section">
      <div class="telegram-callout-card">
        <!-- Фонова емблема бренду -->
        <img src="/images/logo.png" class="cta-bg-logo" alt="" aria-hidden="true" />

        <div class="telegram-callout-text">
          <div class="section-label" style="color:var(--gold-light);">GROMBRICKS / УКРАЇНА</div>
          <h2 class="telegram-callout-title">${title}</h2>
          <p class="telegram-callout-desc">${description}</p>
          <a
            href="${buttonLink}"
            target="_blank"
            rel="noopener noreferrer"
            class="telegram-callout-link"
          >
            <span>${buttonText}</span>
            <i class="ri-arrow-right-line"></i>
          </a>
        </div>
        <div class="telegram-callout-action">
          <a
            href="#"
            class="btn btn-primary js-django-link"
          >
            <span>ЗНАЙТИ СВОЮ</span>
            <i class="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>
    </section>
  `
}
