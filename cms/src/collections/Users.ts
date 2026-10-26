import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'createdAt'],
  },
  auth: true,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: "Повне ім'я",
      defaultValue: 'Адміністратор GromBricks',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      label: 'Роль користувача в системі',
      options: [
        { label: 'Адміністратор (Повний доступ)', value: 'admin' },
        { label: 'Редактор контенту (Керування каталогом)', value: 'editor' },
        { label: 'Клієнт магазину', value: 'customer' },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
    },
  ],
}
