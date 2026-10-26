import { productsSearchHandler } from '@/endpoints/searchEndpoint'
import { invokePayloadHandler } from '@/endpoints/invoke'

export async function GET(request: Request) {
  return invokePayloadHandler(productsSearchHandler, request)
}
