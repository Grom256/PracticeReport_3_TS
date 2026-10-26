import type { PayloadHandler } from 'payload'
import { validateCart } from '../lib/shopUtils'
import type {
  ApiResponse,
  CheckoutApiRequest,
  CheckoutApiResponseData,
  Product,
} from '../types/shop'

/**
 * Оформлення замовлення: перевірка залишків, створення запису, списання зі складу
 * POST /api/orders/checkout
 */
export const orderCheckoutHandler: PayloadHandler = async (req) => {
  try {
    const body: CheckoutApiRequest = (await req.json?.()) || {}
    const { customer, delivery, paymentMethod, items, notes } = body

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return Response.json(
        {
          success: false,
          error: "Заповніть ім'я, email та телефон.",
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    if (!delivery?.service || !delivery?.city || !delivery?.branchOrAddress) {
      return Response.json(
        {
          success: false,
          error: 'Вкажіть службу доставки, місто та відділення.',
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        {
          success: false,
          error: 'Кошик порожній.',
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    const payload = req.payload
    const productsRes = await payload.find({
      collection: 'products',
      limit: 200,
      pagination: false,
    })
    const products = productsRes.docs as unknown as Product[]
    const validation = validateCart(items, products)

    if (!validation.isValid) {
      return Response.json(
        {
          success: false,
          error: validation.errors[0] || 'Кошик містить недоступні товари.',
          details: { errors: validation.errors },
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    const productsMap = new Map(products.map((product) => [String(product.id), product]))
    const orderItems = items.map((item) => {
      const product = productsMap.get(String(item.productId))!
      return {
        product: Number(product.id),
        productName: product.name,
        sku: product.sku,
        unitPrice: product.price,
        quantity: item.quantity,
      }
    })

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    )
    const orderNumber = `GB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        deliveryService: delivery.service,
        deliveryCity: delivery.city,
        deliveryBranch: delivery.branchOrAddress,
        paymentMethod: paymentMethod || 'card_transfer',
        status: 'pending',
        totalAmount,
        items: orderItems,
        notes: notes || '',
      },
    })

    for (const item of items) {
      const product = productsMap.get(String(item.productId))
      if (!product) continue
      await payload.update({
        collection: 'products',
        id: String(product.id),
        data: {
          stock: Math.max(0, product.stock - item.quantity),
        },
      })
    }

    const responseData: ApiResponse<CheckoutApiResponseData> = {
      success: true,
      data: {
        orderId: String(newOrder.id),
        orderNumber,
        totalAmount,
        status: 'pending',
        message: 'Замовлення успішно створено.',
      },
      timestamp: new Date().toISOString(),
    }

    return Response.json(responseData, { status: 201 })
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error:
        error instanceof Error ? error.message : 'Не вдалося створити замовлення. Спробуйте пізніше.',
      timestamp: new Date().toISOString(),
    }
    return Response.json(errorResponse, { status: 500 })
  }
}
