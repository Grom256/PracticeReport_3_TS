import type { Block } from 'payload'

export const BannerBlock: Block = {
  slug: 'banner',
  labels: {
    singular: 'Промо-банер',
    plural: 'Промо-банери',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок банера',
      defaultValue: 'Знижка -15% на всі мініфігурки серії Star Wars!',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис акції / спеціальної пропозиції',
      defaultValue:
        'Поповніть свою армію клонів або джедаїв за вигідною ціною до кінця місяця.',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки',
      defaultValue: 'Переглянути серію Star Wars',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Посилання',
      defaultValue: '/catalog?series=Star+Wars',
    },
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'legoYellow',
      label: 'Колірний стиль банера',
      options: [
        { label: 'LEGO Жовтий', value: 'legoYellow' },
        { label: 'Темний цегляний', value: 'darkBrick' },
        { label: 'Акцентний Червоний', value: 'accentRed' },
      ],
    },
  ],
}
