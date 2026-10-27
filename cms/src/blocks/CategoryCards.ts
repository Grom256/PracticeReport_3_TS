import type { Block } from 'payload'

export const CategoryCardsBlock: Block = {
  slug: 'categoryCards',
  labels: {
    singular: 'Картки напрямків',
    plural: 'Картки напрямків',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Бейдж секції',
      defaultValue: 'НАПРЯМКИ',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок секції',
      defaultValue: 'Оберіть напрям',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Картки напрямків',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Назва напрямку',
        },
        {
          name: 'image',
          type: 'text',
          required: true,
          label: 'Шлях до зображення',
        },
        {
          name: 'href',
          type: 'text',
          label: 'Посилання',
          defaultValue: '#',
        },
        {
          name: 'isRare',
          type: 'checkbox',
          label: 'Виділити як рідкісне / раритет',
          defaultValue: false,
        },
      ],
    },
  ],
}
