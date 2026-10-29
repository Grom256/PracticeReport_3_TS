import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { PayloadHandler } from 'payload'

export async function invokePayloadHandler(handler: PayloadHandler, request: Request) {
  const payload = await getPayload({ config: configPromise })
  return handler({
    payload,
    json: () => request.json(),
    url: request.url,
  } as never)
}
