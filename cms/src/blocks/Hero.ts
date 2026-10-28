import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero-банер',
    plural: 'Hero-банери',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Головний заголовок',
      defaultValue: 'GromBricks — Всесвіт колекційних мініфігурок та деталей LEGO',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Підзаголовок / Опис',
      defaultValue:
        'Оригінальні деталі, рідкісні колекційні мініфігурки Star Wars, Marvel, Ninjago та кастомні MOC-елементи з доставкою по Україні.',
    },
    {
      name: 'badge',
      type: 'text',
      label: 'Текстовий бейдж',
      defaultValue: 'ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ',
    },
    {
      name: 'primaryButtonText',
      type: 'text',
      label: 'Текст основної кнопки',
      defaultValue: '3D ЕКСПОЗИЦІЯ',
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Посилання основної кнопки',
      defaultValue: '#models-3d',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Текст додаткової кнопки',
      defaultValue: 'ПЕРЕВАГИ',
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Посилання додаткової кнопки',
      defaultValue: '#why-us',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'URL фонового зображення (або медіа)',
      defaultValue: '/images/hero-bg.webp',
    },
  ],
}
