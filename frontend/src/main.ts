import { CMS_ADMIN_URL, fetchCommonData, fetchPageData, submitCheckout } from './api.ts'
import { renderBlocks } from './blocks/renderBlocks.ts'
import { initThreeViewer } from './blocks/modelViewer.ts'
import {
  addToCart,
  getCart,
  getCartTotal,
  updateCartCountBadge,
  getCartCount,
  clearCart,
  removeFromCart,
} from './cart.ts'

/**
 * Головний скрипт лендінгу (Життєвий цикл запиту за методичкою)
 */
async function init() {
  updateCartCountBadge()

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
      // Примітка: каталог товарів (productGrid) повністю прибрано з лендінгу
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

      setupCartListeners()
      setupModalCart()
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
    <div id="mobile-nav-drawer" class="mobile-nav-drawer" style="display:none;">
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

  toggleBtn.addEventListener('click', () => {
    const isClosed = drawer.style.display === 'none' || !drawer.style.display
    drawer.style.display = isClosed ? 'flex' : 'none'
    const icon = toggleBtn.querySelector('i')
    if (icon) {
      icon.className = isClosed ? 'ri-close-line' : 'ri-menu-line'
    }
  })

  // Закриваємо мобільне меню при кліку на будь-яке посилання
  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      drawer.style.display = 'none'
      const icon = toggleBtn.querySelector('i')
      if (icon) icon.className = 'ri-menu-line'
    })
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

export function setupCartListeners() {
  document.querySelectorAll('.js-add-to-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const el = e.currentTarget as HTMLElement
      addToCart({
        id: el.dataset.id || '',
        name: el.dataset.name || '',
        price: Number(el.dataset.price) || 0,
        sku: el.dataset.sku || '',
        imageUrl: el.dataset.image,
        productType: 'minifigure',
        slug: '',
        condition: 'new',
        stock: Number(el.dataset.stock) || 1,
        isRare: false,
      })
      renderModalCartContent()
    })
  })
}

function setupModalCart() {
  const modal = document.getElementById('cart-modal')
  const openBtn = document.getElementById('open-cart-modal-btn')
  const closeBtn = document.getElementById('close-cart-modal-btn')

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      renderModalCartContent()
      modal.classList.add('open')
    })
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open')
    })
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open')
      }
    })
  }
}

function renderModalCartContent() {
  const body = document.getElementById('modal-cart-body')
  if (!body) return

  const items = getCart()
  if (items.length === 0) {
    body.innerHTML = `
      <div style="text-align:center;padding:40px 10px;">
        <div style="font-size:36px;color:#e6bf55;margin-bottom:12px;">🛍️</div>
        <h3 class="model-card-title" style="font-size:20px;">Кошик порожній</h3>
        <p style="color:#7487a6;margin-bottom:20px;font-size:14px;">Ви ще не додали фігурок або деталей LEGO.</p>
        <a href="#catalog" class="btn btn-primary" onclick="document.getElementById('cart-modal').classList.remove('open')">
          ДО КАТАЛОГУ
        </a>
      </div>
    `
    return
  }

  const itemsHtml = items
    .map(
      (item) => `
      <div class="cart-table-row" style="padding:12px 0;">
        <div class="cart-table-product-cell">
          <div class="cart-item-thumbnail" style="width:50px;height:50px;">
            <img src="${item.imageUrl || ''}" alt="${item.name}" />
          </div>
          <div>
            <div style="font-weight:700;color:#fff;font-size:14px;">${item.name}</div>
            <div style="font-size:12px;color:#7487a6;">${item.price} ₴ × ${item.quantity} шт.</div>
          </div>
        </div>
        <div style="font-weight:700;color:#f0cf7a;">${item.price * item.quantity} ₴</div>
        <div>
          <button class="cart-remove-btn js-modal-remove" data-id="${item.productId}">✕</button>
        </div>
      </div>
    `,
    )
    .join('')

  const total = getCartTotal()

  body.innerHTML = `
    <div style="margin-bottom:20px;">
      ${itemsHtml}
    </div>

    <div class="summary-total-row" style="margin-bottom:24px;">
      <span>Разом до сплати:</span>
      <span class="total-highlight">${total} ₴</span>
    </div>

    <form id="modal-quick-checkout-form" style="display:flex;flex-direction:column;gap:12px;">
      <h4 style="color:#e6bf55;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;font-family:var(--font-heading);">
        Швидке замовлення:
      </h4>
      <input type="text" id="modal-cust-name" class="form-input" required placeholder="Ваше ім'я та прізвище" />
      <input type="tel" id="modal-cust-phone" class="form-input" required value="+380" placeholder="+380XXXXXXXXX" />
      <input type="text" id="modal-cust-city" class="form-input" required placeholder="Місто доставки (Нова Пошта)" />

      <button type="submit" id="modal-submit-btn" class="btn btn-primary" style="margin-top:10px;">
        ПІДТВЕРДИТИ ЗАМОВЛЕННЯ
      </button>
    </form>
    <div id="modal-order-success" style="display:none;margin-top:16px;"></div>
  `

  body.querySelectorAll('.js-modal-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).dataset.id || ''
      removeFromCart(id)
      renderModalCartContent()
    })
  })

  const form = document.getElementById('modal-quick-checkout-form') as HTMLFormElement
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const submitBtn = document.getElementById('modal-submit-btn') as HTMLButtonElement
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'ОФОРМЛЕННЯ...'
      }

      const name = (document.getElementById('modal-cust-name') as HTMLInputElement).value
      const phone = (document.getElementById('modal-cust-phone') as HTMLInputElement).value
      const city = (document.getElementById('modal-cust-city') as HTMLInputElement).value

      try {
        const res = await submitCheckout({
          customer: { name, phone, email: 'client@grombricks.ua' },
          delivery: { service: 'nova_poshta', city, branchOrAddress: 'Відділення №1' },
          paymentMethod: 'card_transfer',
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        })

        if (res.success) {
          clearCart()
          const successBox = document.getElementById('modal-order-success')
          if (successBox) {
            successBox.style.display = 'block'
            successBox.innerHTML = `
              <div class="confirmation-card" style="padding:20px;">
                <h4 style="color:#f0cf7a;margin-bottom:8px;">Замовлення успішно створено!</h4>
                <p style="font-size:13px;color:#cfd6e0;">Номер: <strong>${res.data?.orderNumber || 'GB-1001'}</strong>. Ми зв'яжемось з вами для відправки.</p>
              </div>
            `
          }
          form.style.display = 'none'
        }
      } catch (err: any) {
        alert(err.message || 'Помилка оформлення')
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.textContent = 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'
        }
      }
    })
  }
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
