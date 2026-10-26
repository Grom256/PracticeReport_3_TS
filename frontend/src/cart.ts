import type { CartItem, Product } from './types.ts'

const STORAGE_KEY = 'grombricks_cart_v1'

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    updateCartCountBadge()
  } catch (e) {
    console.error('Помилка збереження кошика:', e)
  }
}

export function addToCart(product: Product, quantity: number = 1): void {
  const cart = getCart()
  const existing = cart.find((i) => String(i.productId) === String(product.id))

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      imageUrl: product.imageUrl,
      quantity,
      stock: product.stock,
    })
  }

  saveCart(cart)
  showCartToast(`"${product.name}" додано до кошика!`)
}

export function updateCartQuantity(productId: string | number, quantity: number): void {
  let cart = getCart()
  if (quantity <= 0) {
    cart = cart.filter((i) => String(i.productId) !== String(productId))
  } else {
    const item = cart.find((i) => String(i.productId) !== String(productId))
    if (item) item.quantity = quantity
  }
  saveCart(cart)
}

export function removeFromCart(productId: string | number): void {
  const cart = getCart().filter((i) => String(i.productId) !== String(productId))
  saveCart(cart)
}

export function clearCart(): void {
  saveCart([])
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function getCartCount(): number {
  return getCart().reduce((count, item) => count + item.quantity, 0)
}

export function updateCartCountBadge(): void {
  const count = getCartCount()
  document.querySelectorAll('.cart-count-badge').forEach((el) => {
    el.textContent = String(count)
  })
}

function showCartToast(message: string): void {
  let toast = document.getElementById('cart-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'cart-toast'
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0b1630;
      border: 1px solid #e6bf55;
      color: #f0cf7a;
      padding: 14px 22px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      z-index: 1000;
      transition: opacity 0.3s ease;
    `
    document.body.appendChild(toast)
  }
  toast.textContent = message
  toast.style.opacity = '1'
  setTimeout(() => {
    if (toast) toast.style.opacity = '0'
  }, 2500)
}
