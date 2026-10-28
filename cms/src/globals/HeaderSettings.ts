import type { GlobalConfig } from 'payload'

export const HeaderSettings: GlobalConfig = {
  slug: 'header-settings',
  label: 'Шапка сайту (Header)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      label: 'Назва бренду',
      defaultValue: 'GROMBRICKS',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Контактний телефон',
      defaultValue: '+380 (67) 123-45-67',
    },
    {
      name: 'telegramUrl',
      type: 'text',
      label: 'Telegram-канал',
      defaultValue: 'https://t.me/grombricks',
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Пункти меню',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Текст посилання',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL адреса або якір',
          required: true,
        },
      ],
      defaultValue: [
        { label: 'ПЕРЕВАГИ', url: '#why-us' },
        { label: '3D ВІТРИНА', url: '#models-3d' },
        { label: 'НАПРЯМКИ', url: '#directions' },
        { label: 'ПРО НАС', url: '#about' },
      ],
    },
  ],
}
