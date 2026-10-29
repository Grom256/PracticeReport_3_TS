import { CMS_ADMIN_URL, DJANGO_SHOP_URL, fetchCommonData, fetchPageData } from './api.ts'
import { renderBlocks } from './blocks/renderBlocks.ts'
import { initThreeViewer } from './blocks/modelViewer.ts'
import type { CommonData } from './types.ts'

let globalCommonData: CommonData | null = null

function getCurrentPageSlug(): string {
  const params = new URLSearchParams(window.location.search)
  const pageParam = params.get('page') || params.get('p')
  if (pageParam) {
    return pageParam.replace(/^\/+|\/+$/g, '')
  }

  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '')
  if (pathname && !pathname.endsWith('.html') && pathname !== 'index') {
    return pathname
  }

  const hash = window.location.hash
  if (hash.startsWith('#/')) {
    return hash.replace(/^#\//, '')
  }

  return 'home'
}

function navigateTo(url: string) {
  if (url.startsWith('#')) {
    const currentSlug = getCurrentPageSlug()
    if (currentSlug !== 'home') {
      window.history.pushState({ slug: 'home' }, '', `/${url}`)
      loadPage('home', url)
      return
    }
    const target = document.querySelector(url)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    return
  }

  let targetSlug = 'home'
  if (url.startsWith('/?') || url.includes('?p=') || url.includes('?page=')) {
    const params = new URLSearchParams(url.split('?')[1] || '')
    targetSlug = params.get('page') || params.get('p') || 'home'
  } else {
    const clean = url.replace(/^\/+|\/+$/g, '')
    targetSlug = clean || 'home'
  }

  const newUrl = targetSlug === 'home' ? '/' : `/?p=${encodeURIComponent(targetSlug)}`
  window.history.pushState({ slug: targetSlug }, '', newUrl)
  loadPage(targetSlug)
}

function handleRouterClick(e: Event) {
  e.preventDefault()
  const el = e.currentTarget as HTMLAnchorElement
  const href = el.getAttribute('href') || '/'
  navigateTo(href)
}

function setupRouterLinks() {
  document.querySelectorAll('a.js-router-link').forEach((link) => {
    link.removeEventListener('click', handleRouterClick)
    link.addEventListener('click', handleRouterClick)
  })
}

async function loadPage(slug: string, targetAnchor?: string) {
  const mainEl = document.querySelector<HTMLElement>('#app-main')
  if (!mainEl) return

  const isHome = slug === 'home' || slug === ''

  mainEl.innerHTML = `
    <div class="loading-container">
      <div class="lego-spinner"></div>
      <div class="loading-text">Завантаження GromBricks...</div>
    </div>
  `

  try {
    const pageData = await fetchPageData(isHome ? '/' : slug)
    const brandName = globalCommonData?.header?.brandName || 'GromBricks'

    document.title = isHome ? pageData.title : `${pageData.title} | ${brandName}`

    const breadcrumbsHtml = !isHome
      ? `
        <div class="page-breadcrumbs">
          <a href="/" class="breadcrumb-back-btn js-router-link">
            <i class="ri-arrow-left-line"></i>
            <span>На головну</span>
          </a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">${pageData.title}</span>
        </div>
      `
      : ''

    const blocksHtml = renderBlocks(pageData.blocks || [])

    mainEl.innerHTML = `
      ${breadcrumbsHtml}
      ${blocksHtml}
    `

    const has3D = (pageData.blocks || []).some(
      (b) => b.blockType === 'modelViewer' || (b as any).type === 'modelViewer',
    )
    if (has3D) {
      setTimeout(() => {
        initThreeViewer()
      }, 50)
    }

    setupSmoothScrolling()
    setupDjangoLinks()
    setupRouterLinks()

    const anchor = targetAnchor || window.location.hash
    if (anchor && isHome) {
      const targetEl = document.querySelector(anchor)
      if (targetEl) {
        setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth' }), 100)
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error: any) {
    const isNotFound = error?.status === 404 || error?.message?.includes('не знайдено')
    if (isNotFound) {
      document.title = 'Сторінку не знайдено (404) | GromBricks'
      mainEl.innerHTML = `
        <div class="not-found-section">
          <div class="not-found-card">
            <div class="not-found-code">404</div>
            <h2 class="not-found-title">Сторінку не знайдено</h2>
            <p class="not-found-desc">
              Сторінка <strong>"${slug}"</strong> ще не створена в базі даних Payload CMS або знаходиться в чернетках.
              Ви можете створити або відредагувати її в адмін-панелі.
            </p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
              <a href="/" class="btn btn-primary js-router-link">
                <i class="ri-arrow-left-line"></i>
                <span>Повернутися на головну</span>
              </a>
              <a href="${CMS_ADMIN_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <i class="ri-settings-3-line"></i>
                <span>Адмін-панель CMS</span>
                <i class="ri-arrow-right-up-line"></i>
              </a>
            </div>
          </div>
        </div>
      `
    } else {
      mainEl.innerHTML = `
        <div class="error-container">
          <h2 class="error-title">Помилка завантаження</h2>
          <p class="error-message">Не вдалося завантажити сторінку. Перевірте з'єднання з сервером або спробуйте пізніше.</p>
        </div>
      `
    }

    setupRouterLinks()
  }
}

function renderHeader(header: CommonData['header']) {
  const container = document.querySelector<HTMLElement>('#app-header')
  if (!container) return

  const navItems =
    header && Array.isArray(header.navItems) && header.navItems.length > 0
      ? header.navItems
      : [
          { label: 'ПЕРЕВАГИ', url: '#why-us' },
          { label: '3D ВІТРИНА', url: '#models-3d' },
          { label: 'НАПРЯМКИ', url: '#directions' },
          { label: 'ПРО НАС', url: '#about' },
        ]

  const telegramUrl = header?.telegramUrl || 'https://t.me/grombricks'
  const currentSlug = getCurrentPageSlug()

  const navHtml = navItems
    .map((item) => {
      const isAnchor = item.url.startsWith('#')
      const isExternal = item.url.startsWith('http')
      const targetHref = isAnchor && currentSlug !== 'home' ? `/${item.url}` : item.url
      const linkClass = !isAnchor && !isExternal ? 'nav-link js-router-link' : 'nav-link'
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''

      return `<a href="${targetHref}" class="${linkClass}" ${targetAttr}>${item.label}</a>`
    })
    .join('')

  const mobileNavHtml = navItems
    .map((item) => {
      const isAnchor = item.url.startsWith('#')
      const isExternal = item.url.startsWith('http')
      const targetHref = isAnchor && currentSlug !== 'home' ? `/${item.url}` : item.url
      const linkClass =
        !isAnchor && !isExternal ? 'mobile-nav-link js-router-link' : 'mobile-nav-link'
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''

      return `<a href="${targetHref}" class="${linkClass}" ${targetAttr}>${item.label}</a>`
    })
    .join('')

  container.innerHTML = `
    <div class="header-container">
      <a href="/" class="logo-link js-router-link" aria-label="GromBricks — головна сторінка">
        <img src="/images/logo.png" class="logo-image" alt="GromBricks" />
        <span class="logo-wordmark" aria-hidden="true"><span>GROM</span><span>BRICKS</span></span>
      </a>

      <nav class="desktop-nav">
        ${navHtml}
        <a href="${telegramUrl}" target="_blank" rel="noopener noreferrer" class="nav-link nav-link-telegram">
          <i class="ri-telegram-fill"></i> TELEGRAM
        </a>
      </nav>

      <div class="header-actions">
        <a href="${DJANGO_SHOP_URL}" target="_blank" rel="noopener noreferrer" class="btn-shop js-django-link" title="Перейти у повноцінний магазин">
          <i class="ri-store-2-line"></i>
          <span>МАГАЗИН</span>
          <i class="ri-arrow-right-up-line"></i>
        </a>
        <button id="mobile-menu-toggle-btn" class="mobile-menu-toggle" aria-label="Відкрити меню навігації">
          <i class="ri-menu-line"></i>
        </button>
      </div>
    </div>

    <div id="mobile-nav-drawer" class="mobile-nav-drawer">
      ${mobileNavHtml}
      <a href="${DJANGO_SHOP_URL}" target="_blank" rel="noopener noreferrer" class="mobile-nav-link js-django-link" style="color:var(--gold-light);">
        <i class="ri-store-2-line"></i> МАГАЗИН <i class="ri-arrow-right-up-line"></i>
      </a>
      <a href="${telegramUrl}" target="_blank" rel="noopener noreferrer" class="mobile-nav-link" style="color:var(--gold-accent);">
        <i class="ri-telegram-fill"></i> TELEGRAM
      </a>
    </div>
  `

  setupMobileMenu()
  setupRouterLinks()
}

function setupMobileMenu() {
  const toggleBtn = document.querySelector<HTMLElement>('#mobile-menu-toggle-btn')
  const drawer = document.querySelector<HTMLElement>('#mobile-nav-drawer')
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

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu()
    })
  })

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open')) {
      const target = e.target as Node
      if (!drawer.contains(target) && !toggleBtn.contains(target)) {
        closeMenu()
      }
    }
  })
}

function renderFooter(footer: CommonData['footer']) {
  const container = document.querySelector<HTMLElement>('#app-footer')
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
          <li><a href="${DJANGO_SHOP_URL}" target="_blank" rel="noopener noreferrer" class="js-django-link" style="color:#f0cf7a;">Повноцінний магазин <i class="ri-arrow-right-up-line"></i></a></li>
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
  document.querySelectorAll<HTMLAnchorElement>('.js-django-link').forEach((link) => {
    const currentHref = link.getAttribute('href')
    if (!currentHref || currentHref === '#') {
      link.href = DJANGO_SHOP_URL
    }
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  })
}

async function init() {
  globalCommonData = await fetchCommonData()
  renderHeader(globalCommonData.header)
  renderFooter(globalCommonData.footer)

  window.addEventListener('popstate', () => {
    loadPage(getCurrentPageSlug())
  })

  const initialSlug = getCurrentPageSlug()
  loadPage(initialSlug)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
