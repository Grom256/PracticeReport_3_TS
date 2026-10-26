import { CMS_ADMIN_URL, fetchCommonData } from './api.ts'
import { getCart, updateCartQuantity, removeFromCart, getCartTotal, updateCartCountBadge } from './cart.ts'

async function initCartPage() {
  updateCartCountBadge()

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

  renderCartContent()
}

function renderCartContent() {
  const container = document.getElementById('cart-content-area')
  if (!container) return

  const items = getCart()

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-container">
        <h3 class="empty-title">Ваш кошик порожній</h3>
        <p class="empty-message">Ви ще не додали жодної фігурки або деталі LEGO.</p>
        <a href="/catalog.html" class="btn btn-primary">ДО КАТАЛОГУ</a>
      </div>
    `
    return
  }

  const rowsHtml = items
    .map(
      (item) => `
      <div class="cart-table-row">
        <div class="cart-table-product-cell">
          <div class="cart-item-thumbnail">
            <img src="${item.imageUrl || 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=100&auto=format&fit=crop&q=80'}" alt="${item.name}" />
          </div>
          <div>
            <div class="cart-table-product-name">${item.name}</div>
            <div class="cart-table-sku">Арт: ${item.sku}</div>
          </div>
        </div>
        <div class="cart-table-price-cell">${item.price} ₴</div>
        <div>
          <div class="quantity-counter">
            <button class="qty-btn js-qty-minus" data-id="${item.productId}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn js-qty-plus" data-id="${item.productId}">+</button>
          </div>
        </div>
        <div class="cart-table-subtotal-cell">${item.price * item.quantity} ₴</div>
        <div>
          <button class="cart-remove-btn js-remove-item" data-id="${item.productId}" title="Видалити">✕</button>
        </div>
      </div>
    `,
    )
    .join('')

  const total = getCartTotal()

  container.innerHTML = `
    <div class="cart-page-grid">
      <div class="cart-items-table-card">
        <div class="cart-table-header">
          <span>Товар</span>
          <span>Ціна</span>
          <span>Кількість</span>
          <span>Сума</span>
          <span></span>
        </div>
        <div class="cart-table-body">
          ${rowsHtml}
        </div>
        <div class="cart-table-footer">
          <a href="/" class="btn-continue-shopping"><i class="ri-arrow-left-line"></i> На головну</a>
        </div>
      </div>

      <div class="cart-summary-card">
        <h3 class="summary-title">Разом до сплати</h3>
        <div class="summary-rows">
          <div class="summary-row">
            <span>Вартість товарів</span>
            <span>${total} ₴</span>
          </div>
          <div class="summary-row">
            <span>Доставка по Україні</span>
            <span>За тарифами перевізника</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-total-row">
            <span>Всього:</span>
            <span class="total-highlight">${total} ₴</span>
          </div>
        </div>
        <a href="/checkout.html" class="btn btn-primary btn-proceed-checkout">
          <span>ОФОРМИТИ ЗАМОВЛЕННЯ</span>
          <i class="ri-arrow-right-line"></i>
        </a>
      </div>
    </div>
  `

  // Слухачі кнопок кількості
  container.querySelectorAll('.js-qty-minus').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id || ''
      const item = items.find((i) => String(i.productId) === id)
      if (item) {
        updateCartQuantity(id, item.quantity - 1)
        renderCartContent()
      }
    })
  })

  container.querySelectorAll('.js-qty-plus').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id || ''
      const item = items.find((i) => String(i.productId) === id)
      if (item) {
        updateCartQuantity(id, item.quantity + 1)
        renderCartContent()
      }
    })
  })

  container.querySelectorAll('.js-remove-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id || ''
      removeFromCart(id)
      renderCartContent()
    })
  })
}

document.addEventListener('DOMContentLoaded', initCartPage)
