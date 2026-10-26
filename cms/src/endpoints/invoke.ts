import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { PayloadHandler } from 'payload'

/** Запускає Payload-ендпоінт з Next.js App Router, щоб шлях не конфліктував із REST колекцій. */
export async function invokePayloadHandler(handler: PayloadHandler, request: Request) {
  const payload = await getPayload({ config: configPromise })
  return handler({
    payload,
    json: () => request.json(),
    url: request.url,
  } as never)
}
