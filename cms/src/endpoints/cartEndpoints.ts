import type { PayloadHandler } from 'payload'
import { validateCart } from '../lib/shopUtils'
import type { ApiResponse, CartItem, CartValidationResult, Product } from '../types/shop'

/**
 * Перевірка наявності та цін у кошику
 * POST /api/cart/validate
 */
export const cartValidateHandler: PayloadHandler = async (req) => {
  try {
    const body = (await req.json?.()) || {}
    const items: CartItem[] = body.items || []

    const result = await req.payload.find({
      collection: 'products',
      limit: 200,
      pagination: false,
    })

    const validation = validateCart(items, result.docs as unknown as Product[])

    const response: ApiResponse<CartValidationResult> = validation.isValid
      ? {
          success: true,
          data: validation,
          message: 'Кошик успішно валідовано',
          timestamp: new Date().toISOString(),
        }
      : {
          success: false,
          error: 'Виявлено невідповідності у кошику',
          details: { errors: validation.errors },
          timestamp: new Date().toISOString(),
        }

    return Response.json(response, { status: validation.isValid ? 200 : 400 })
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Не вдалося перевірити кошик',
      timestamp: new Date().toISOString(),
    }
    return Response.json(errorResponse, { status: 500 })
  }
}
