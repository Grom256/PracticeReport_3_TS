import { orderCheckoutHandler } from '@/endpoints/orderEndpoints'
import { invokePayloadHandler } from '@/endpoints/invoke'

export async function POST(request: Request) {
  return invokePayloadHandler(orderCheckoutHandler, request)
}
