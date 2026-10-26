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
          label: 'URL адреса',
          required: true,
        },
      ],
      defaultValue: [
        { label: 'ФІГУРКИ', url: '/catalog.html?type=minifigure' },
        { label: 'ДЕТАЛІ', url: '/catalog.html?type=part' },
        { label: 'НАБОРИ', url: '/catalog.html' },
        { label: 'РІДКІСНЕ', url: '/catalog.html?onlyRare=true' },
        { label: 'ПРО НАС', url: '/#about' },
      ],
    },
  ],
}
