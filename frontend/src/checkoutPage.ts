import { CMS_ADMIN_URL, fetchCommonData, submitCheckout } from './api.ts'
import { getCart, getCartTotal, clearCart, updateCartCountBadge } from './cart.ts'

async function initCheckoutPage() {
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

  const items = getCart()
  const itemsContainer = document.getElementById('checkout-items-list')
  const totalContainer = document.getElementById('checkout-total-price')

  if (items.length === 0) {
    window.location.href = '/cart.html'
    return
  }

  if (itemsContainer) {
    itemsContainer.innerHTML = items
      .map(
        (i) => `
        <div class="checkout-mini-item">
          <span class="mini-item-name">
            <span class="mini-item-qty">${i.quantity}x</span>
            <span>${i.name}</span>
          </span>
          <span class="mini-item-price">${i.price * i.quantity} ₴</span>
        </div>
      `,
      )
      .join('')
  }

  if (totalContainer) {
    totalContainer.textContent = `${getCartTotal()} ₴`
  }

  const form = document.getElementById('checkout-form') as HTMLFormElement
  const notif = document.getElementById('checkout-notification')
  const submitBtn = document.getElementById('btn-submit') as HTMLButtonElement

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = 'ОФОРМЛЕННЯ...'
      }

      const name = (document.getElementById('cust-name') as HTMLInputElement).value
      const phone = (document.getElementById('cust-phone') as HTMLInputElement).value
      const email = (document.getElementById('cust-email') as HTMLInputElement).value
      const city = (document.getElementById('cust-city') as HTMLInputElement).value
      const branch = (document.getElementById('cust-branch') as HTMLInputElement).value
      const paymentInput = document.querySelector('input[name="payment"]:checked') as HTMLInputElement
      const paymentMethod = paymentInput ? paymentInput.value : 'card_transfer'

      const orderPayload = {
        customer: { name, phone, email },
        delivery: {
          service: 'nova_poshta',
          city,
          branchOrAddress: branch,
        },
        paymentMethod,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }

      try {
        const res = await submitCheckout(orderPayload)

        if (res.success) {
          clearCart()
          if (notif) {
            notif.innerHTML = `
              <div class="confirmation-card" style="margin-bottom:30px;">
                <div class="order-status-pill">Замовлення створено</div>
                <h2 class="confirmation-title">Дякуємо за замовлення!</h2>
                <p class="confirmation-subtitle">Номер вашого замовлення: <strong style="color:#f0cf7a;">${res.data?.orderNumber || 'GB-1001'}</strong></p>
                <p>Наш менеджер зв'яжеться з вами у Telegram або по телефону для підтвердження відправки.</p>
                <div style="margin-top:24px;">
                  <a href="/index.html" class="btn btn-primary">НА ГОЛОВНУ</a>
                </div>
              </div>
            `
          }
          form.style.display = 'none'
        } else {
          throw new Error(res.error || 'Помилка валідації замовлення')
        }
      } catch (err: any) {
        if (notif) {
          notif.innerHTML = `
            <div class="checkout-error-banner">
              ⚠️ ${err.message || 'Сталася помилка при відправці замовлення. Спробуйте ще раз.'}
            </div>
          `
        }
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.textContent = 'ПІДТВЕРДИТИ ЗАМОВЛЕННЯ'
        }
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', initCheckoutPage)
