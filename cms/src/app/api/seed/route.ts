import { seedDatabaseHandler } from '@/endpoints/seedEndpoint'
import { invokePayloadHandler } from '@/endpoints/invoke'

export async function POST(request: Request) {
  return invokePayloadHandler(seedDatabaseHandler, request)
}
