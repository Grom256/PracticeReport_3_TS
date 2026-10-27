import { CMS_ADMIN_URL, fetchCommonData, fetchPageData } from './api.ts'
import { renderBlocks } from './blocks/renderBlocks.ts'
import { initThreeViewer } from './blocks/modelViewer.ts'

/**
 * Головний скрипт лендінгу (Життєвий цикл запиту за методичкою)
 */
async function init() {
  // 1. Отримуємо загальні дані (хедер, футер із Globals)
  const common = await fetchCommonData()
  renderHeader(common.header)
  renderFooter(common.footer)

  // 2. Отримуємо блоки для лендінгу
  const mainEl = document.getElementById('app-main')
  if (mainEl) {
    try {
      mainEl.innerHTML = `
        <div class="loading-container">
          <div class="lego-spinner"></div>
          <div class="loading-text">Завантаження GromBricks...</div>
        </div>
      `
      const pageData = await fetchPageData('/')

      // Формуємо чітку послідовність блоків лендінгу за завданням:
      // 1. hero
      // 2. features ("Чому обирають нас")
      // 3. modelViewer (3D вітрина)
      // 4. categoryCards (Напрями)
      // 5. cta (Telegram / підписка)
      const rawBlocks = pageData.blocks || []

      const heroBlock = rawBlocks.find((b) => b.blockType === 'hero') || { blockType: 'hero' }
      const featuresBlock = rawBlocks.find((b) => b.blockType === 'features') || { blockType: 'features' }
      const modelViewerBlock = rawBlocks.find((b) => b.blockType === 'modelViewer') || { blockType: 'modelViewer' }
      const categoryCardsBlock = rawBlocks.find((b) => b.blockType === 'categoryCards') || { blockType: 'categoryCards' }
      const ctaBlock = rawBlocks.find((b) => b.blockType === 'cta') || { blockType: 'cta' }

      const blocks = [
        heroBlock,
        featuresBlock,
        modelViewerBlock,
        categoryCardsBlock,
        ctaBlock,
      ]

      // 3. Динамічний рендеринг блоків у DOM
      mainEl.innerHTML = renderBlocks(blocks)

      // 4. Ініціалізуємо інтерактивну 3D сцену Three.js
      setTimeout(() => {
        initThreeViewer()
      }, 50)

      setupSmoothScrolling()
      setupDjangoLinks()
    } catch (error) {
      mainEl.innerHTML = `
        <div class="error-container">
          <h2 class="error-title">Помилка завантаження</h2>
          <p class="error-message">Не вдалося завантажити лендінг. Перевірте з'єднання з сервером.</p>
        </div>
      `
    }
  }
}

function renderHeader(_header: any) {
  const container = document.getElementById('app-header')
  if (!container) return

  // Лаконічні якірні посилання для швидкої навігації лендінгом
  const navHtml = `
    <a href="#why-us" class="nav-link">ПЕРЕВАГИ</a>
    <a href="#models-3d" class="nav-link">3D ВІТРИНА</a>
    <a href="#directions" class="nav-link">НАПРЯМКИ</a>
    <a href="#about" class="nav-link">ПРО НАС</a>
    <a href="https://t.me/grombricks" target="_blank" rel="noopener noreferrer" class="nav-link nav-link-telegram">
      <i class="ri-telegram-fill"></i> TELEGRAM
    </a>
  `

  container.innerHTML = `
    <div class="header-container">
      <a href="#" class="logo-link" aria-label="GromBricks — головна сторінка">
        <img src="/images/logo.png" class="logo-image" alt="GromBricks" />
        <span class="logo-wordmark" aria-hidden="true"><span>GROM</span><span>BRICKS</span></span>
      </a>

      <nav class="desktop-nav">
        ${navHtml}
      </nav>

      <div class="header-actions">
        <a href="#" class="btn-shop js-django-link" title="Перейти у повноцінний магазин">
          <i class="ri-store-2-line"></i>
          <span>МАГАЗИН</span>
          <i class="ri-arrow-right-up-line"></i>
        </a>
        <button id="mobile-menu-toggle-btn" class="mobile-menu-toggle" aria-label="Відкрити меню навігації">
          <i class="ri-menu-line"></i>
        </button>
      </div>
    </div>

    <!-- Мобільне меню навігації -->
    <div id="mobile-nav-drawer" class="mobile-nav-drawer">
      <a href="#why-us" class="mobile-nav-link">ПЕРЕВАГИ</a>
      <a href="#models-3d" class="mobile-nav-link">3D ВІТРИНА</a>
      <a href="#directions" class="mobile-nav-link">НАПРЯМКИ</a>
      <a href="#about" class="mobile-nav-link">ПРО НАС</a>
      <a href="#" class="mobile-nav-link js-django-link" style="color:var(--gold-light);">
        <i class="ri-store-2-line"></i> МАГАЗИН <i class="ri-arrow-right-up-line"></i>
      </a>
      <a href="https://t.me/grombricks" target="_blank" rel="noopener noreferrer" class="mobile-nav-link" style="color:var(--gold-accent);">
        <i class="ri-telegram-fill"></i> TELEGRAM
      </a>
    </div>
  `

  setupMobileMenu()
}

function setupMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle-btn')
  const drawer = document.getElementById('mobile-nav-drawer')
  if (!toggleBtn || !drawer) return

  const closeMenu = () => {
    drawer.classList.remove('is-open')
    toggleBtn.classList.remove('is-active')
    toggleBtn.setAttribute('aria-expanded', 'false')
    const icon = toggleBtn.querySelector('i')
    if (icon) icon.className = 'ri-menu-line'
  }

  const openMenu = () => {
    drawer.classList.add('is-open')
    toggleBtn.classList.add('is-active')
    toggleBtn.setAttribute('aria-expanded', 'true')
    const icon = toggleBtn.querySelector('i')
    if (icon) icon.className = 'ri-close-line'
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    const isOpen = drawer.classList.contains('is-open')
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  })

  // Закриваємо мобільне меню при кліку на будь-яке посилання
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu()
    })
  })

  // Закриваємо мобільне меню при кліку поза його межами
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open')) {
      const target = e.target as Node
      if (!drawer.contains(target) && !toggleBtn.contains(target)) {
        closeMenu()
      }
    }
  })
}

function renderFooter(footer: any) {
  const container = document.getElementById('app-footer')
  if (!container) return

  container.innerHTML = `
    <div class="footer-container" id="about">
      <div>
        <div class="footer-brand-title">
          GROM<span>BRICKS</span>
        </div>
        <p class="footer-brand-desc">${footer.description}</p>
      </div>

      <div>
        <div class="footer-col-title">НАВІГАЦІЯ</div>
        <ul class="footer-links-list">
          <li><a href="#why-us">Чому обирають нас</a></li>
          <li><a href="#models-3d">3D Експозиція фігурок</a></li>
          <li><a href="#directions">Напрямки LEGO</a></li>
          <li><a href="#" class="js-django-link" style="color:#f0cf7a;">Повноцінний магазин <i class="ri-arrow-right-up-line"></i></a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">ІНФОРМАЦІЯ</div>
        <ul class="footer-links-list">
          <li><a href="#about">Про магазин GromBricks</a></li>
          <li><a href="https://t.me/grombricks" target="_blank" rel="noopener noreferrer">Telegram Спільнота</a></li>
          <li><a href="${CMS_ADMIN_URL}" target="_blank" rel="noopener noreferrer" style="color:#7487a6;">Панель Payload CMS <i class="ri-arrow-right-up-line"></i></a></li>
        </ul>
      </div>

      <div>
        <div class="footer-col-title">ЗВ’ЯЗОК</div>
        <ul class="footer-links-list">
          <li><a href="https://t.me/grombricks" target="_blank" rel="noopener noreferrer" style="color:#e6bf55;"><i class="ri-telegram-fill"></i> @grombricks <i class="ri-arrow-right-line"></i></a></li>
          <li><span style="color:#cfd6e0;"><i class="ri-mail-line"></i> ${footer.email}</span></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div>${footer.copyright}</div>
      <div>Магазин не пов’язаний з компанією LEGO Group. Навчальний проєкт.</div>
    </div>
  `
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const el = e.currentTarget as HTMLElement
      const href = el.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
      }
    })
  })
}

function setupDjangoLinks() {
  document.querySelectorAll('.js-django-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      alert(
        '🔗 Посилання на повноцінний інтернет-магазин буде активовано після його деплою на хостинг!',
      )
    })
  })
}

// Запуск після завантаження DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
