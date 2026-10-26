import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'badge', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Назва категорії',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Унікальний ідентифікатор у посиланні (наприклад, star-wars)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис категорії',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Бейдж (наприклад: "Хіт", "Новинка", "Топ")',
    },
    {
      name: 'iconName',
      type: 'text',
      label: 'Ідентифікатор іконки (опціонально)',
    },
  ],
}
