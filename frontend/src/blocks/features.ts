import type { FeatureItem, PageBlock } from '../types.ts'

const ICONS_MAP: Record<string, string> = {
  shield: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  `,
  package: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  `,
  truck: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect width="16" height="13" x="1" y="6" rx="2"/>
      <path d="M17 9h4l3 4v6h-7"/>
      <circle cx="6" cy="19" r="2"/>
      <circle cx="18" cy="19" r="2"/>
    </svg>
  `,
  sparkles: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  `,
  check: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  `,
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    icon: 'shield',
    badge: 'АВТЕНТИЧНІСТЬ',
    title: '100% Оригінальність',
    description:
      'Жодних підробок чи копій. Ретельно перевіряємо мікро-гравіювання LEGO, стан шарнірів і яскравість принтів на кожній фігурці.',
  },
  {
    icon: 'package',
    badge: 'БЕЗПЕКА',
    title: 'Колекційне пакування',
    description:
      'Індивідуальні антистатичні зіп-пакети для мініфігурок, пухирчаста плівка та жорсткі коробки. Фігурки приїжджають без жодної мікроподряпини.',
  },
  {
    icon: 'truck',
    badge: 'ЛОГІСТИКА',
    title: 'Швидка відправка',
    description:
      'Щоденні відправлення Новою Поштою та Укрпоштою по всій Україні. Відправляємо в день замовлення, надаємо ТТН протягом 30 хвилин.',
  },
  {
    icon: 'sparkles',
    badge: 'РАРИТЕТИ',
    title: 'Рідкісні ексклюзиви',
    description:
      'Регулярно поповнюємо вітрину фігурками з Comic-Con, закритих серій Star Wars та рідкісними деталями для авторських MOC-проєктів.',
  },
]

function getBadgeByIcon(icon?: string): string {
  switch (icon) {
    case 'shield':
      return 'АВТЕНТИЧНІСТЬ'
    case 'package':
      return 'БЕЗПЕКА'
    case 'truck':
      return 'ЛОГІСТИКА'
    case 'sparkles':
      return 'РАРИТЕТИ'
    case 'check':
      return 'ГАРАНТІЯ'
    default:
      return 'ПЕРЕВАГА'
  }
}

export function renderFeaturesBlock(block?: PageBlock): string {
  const title = block?.title || 'Чому колекціонери обирають GromBricks'
  const subtitle =
    block?.subtitle ||
    'Ми знаємо справжню цінність кожної мініфігурки та гарантуємо музейний стан кожної деталі'

  const items: FeatureItem[] =
    block?.items && Array.isArray(block.items) && block.items.length > 0
      ? block.items
      : DEFAULT_FEATURES

  const cardsHtml = items
    .map((item) => {
      const iconKey = item.icon || 'shield'
      const iconSvg = ICONS_MAP[iconKey] || ICONS_MAP.shield
      const badge = item.badge || getBadgeByIcon(item.icon)

      return `
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            ${iconSvg}
          </div>
          <div class="feature-badge">${badge}</div>
          <h3 class="feature-title">${item.title}</h3>
          <p class="feature-description">${item.description}</p>
        </div>
      `
    })
    .join('')

  return `
    <section class="features-section" id="why-us">
      <div class="features-header">
        <div class="section-label">СТАНДАРТИ ЯКОСТІ</div>
        <h2 class="section-title">${title}</h2>
        <p class="section-subtitle">${subtitle}</p>
      </div>
      <div class="features-grid">
        ${cardsHtml}
      </div>
    </section>
  `
}
