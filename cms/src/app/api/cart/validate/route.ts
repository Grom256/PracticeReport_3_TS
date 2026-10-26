import { cartValidateHandler } from '@/endpoints/cartEndpoints'
import { invokePayloadHandler } from '@/endpoints/invoke'

export async function POST(request: Request) {
  return invokePayloadHandler(cartValidateHandler, request)
}
