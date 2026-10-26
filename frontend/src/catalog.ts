import { CMS_ADMIN_URL, fetchCommonData, fetchProducts } from './api.ts'
import { renderProductCard } from './blocks/productGrid.ts'
import { updateCartCountBadge } from './cart.ts'
import { setupCartListeners } from './main.ts'

async function initCatalog() {
  updateCartCountBadge()

  // 1. Хедер та футер
  const common = await fetchCommonData()
  const headerContainer = document.getElementById('app-header')
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="header-container">
        <a href="/index.html" class="logo-link" aria-label="GromBricks — головна сторінка">
          <img src="/images/logo.png" class="logo-image" alt="GromBricks" />
          <span class="logo-wordmark" aria-hidden="true"><span>GROM</span><span>BRICKS</span></span>
        </a>
        <nav class="desktop-nav">
          ${common.header.navItems.map((i) => `<a href="${i.url}" class="nav-link">${i.label}</a>`).join('')}
          <a href="${CMS_ADMIN_URL}" target="_blank" class="admin-nav-link">CMS ADMIN</a>
        </nav>
        <div class="header-actions">
          <a href="/cart.html" class="btn-gold-outline">КОШИК · <span class="cart-count-badge">0</span></a>
        </div>
      </div>
    `
  }

  // 2. Фільтри зі стрічки URL
  const params = new URLSearchParams(window.location.search)
  let currentType = params.get('type') || 'all'
  let onlyRare = params.get('onlyRare') === 'true'
  let searchQuery = params.get('q') || ''

  const searchInput = document.getElementById('search-input') as HTMLInputElement
  const rareCheckbox = document.getElementById('rare-checkbox') as HTMLInputElement
  const typeTabs = document.querySelectorAll('.type-tab')

  if (searchInput) searchInput.value = searchQuery
  if (rareCheckbox) rareCheckbox.checked = onlyRare

  typeTabs.forEach((tab) => {
    if (tab.getAttribute('data-type') === currentType) {
      typeTabs.forEach((t) => t.classList.remove('active'))
      tab.classList.add('active')
    }
    tab.addEventListener('click', (e) => {
      typeTabs.forEach((t) => t.classList.remove('active'))
      const target = e.currentTarget as HTMLElement
      target.classList.add('active')
      currentType = target.getAttribute('data-type') || 'all'
      loadFiltered()
    })
  })

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value
      loadFiltered()
    })
  }

  if (rareCheckbox) {
    rareCheckbox.addEventListener('change', () => {
      onlyRare = rareCheckbox.checked
      loadFiltered()
    })
  }

  async function loadFiltered() {
    const grid = document.getElementById('catalog-grid')
    if (!grid) return

    grid.innerHTML = `
      <div class="loading-container">
        <div class="lego-spinner"></div>
        <div class="loading-text">Пошук товарів...</div>
      </div>
    `

    const queryObj: Record<string, string> = {}
    if (currentType !== 'all') queryObj.type = currentType
    if (onlyRare) queryObj.onlyRare = 'true'
    if (searchQuery) queryObj.q = searchQuery

    const products = await fetchProducts(queryObj)

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-container">
          <h3 class="empty-title">Нічого не знайдено</h3>
          <p class="empty-message">За вашим запитом не знайдено жодної позиції LEGO.</p>
        </div>
      `
    } else {
      grid.innerHTML = products.map(renderProductCard).join('')
      setupCartListeners()
    }
  }

  loadFiltered()
}

document.addEventListener('DOMContentLoaded', initCatalog)
