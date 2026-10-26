import type { CollectionConfig } from 'payload'
import { PageBlocks } from '../blocks'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isPublished', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Назва сторінки',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Шлях сторінки (наприклад: "home" або "about")',
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Опубліковано',
      defaultValue: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      label: 'Блоки сторінки (Page Builder)',
      blocks: PageBlocks,
    },
  ],
}
