import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Pages } from './collections/Pages'

import { HeaderSettings } from './globals/HeaderSettings'
import { FooterSettings } from './globals/FooterSettings'

import { commonDataHandler } from './endpoints/commonEndpoint'
import { pageDataHandler } from './endpoints/pageEndpoint'
import { productsSearchHandler } from './endpoints/searchEndpoint'
import { seedDatabaseHandler } from './endpoints/seedEndpoint'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: '*',
  csrf: [],
  collections: [Users, Media, Categories, Products, Pages],
  globals: [HeaderSettings, FooterSettings],
  endpoints: [
    {
      path: '/common',
      method: 'get',
      handler: commonDataHandler,
    },
    {
      path: '/page',
      method: 'get',
      handler: pageDataHandler,
    },
    {
      path: '/products/search',
      method: 'get',
      handler: productsSearchHandler,
    },
    {
      path: '/seed',
      method: 'post',
      handler: seedDatabaseHandler,
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'grombricks-super-secret-key-32chars!!',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@127.0.0.1:5432/grombricks_db',
      ssl:
        process.env.DATABASE_URL &&
        (process.env.DATABASE_URL.includes('neon.tech') ||
          process.env.DATABASE_URL.includes('sslmode=require'))
          ? { rejectUnauthorized: false }
          : false,
    },
  }),
  sharp,
})
