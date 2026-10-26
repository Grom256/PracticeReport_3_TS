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
      defaultValue: '🔥 100% Оригінал LEGO®',
    },
    {
      name: 'primaryButtonText',
      type: 'text',
      label: 'Текст основної кнопки',
      defaultValue: 'Перейти до каталогу',
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Посилання основної кнопки',
      defaultValue: '/catalog',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Текст додаткової кнопки',
      defaultValue: 'Рідкісні фігурки',
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Посилання додаткової кнопки',
      defaultValue: '/catalog?onlyRare=true',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'URL фонового зображення (або медіа)',
      defaultValue: '/images/hero-bg.webp',
    },
  ],
}
