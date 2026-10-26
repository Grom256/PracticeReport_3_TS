import type { Block } from 'payload'

export const CallToActionBlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Заклик до дії (CTA)',
    plural: 'Заклики до дії (CTA)',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок',
      defaultValue: 'Шукаєте рідкісну деталь або фігурку на замовлення?',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис',
      defaultValue:
        'Напишіть нам у Telegram-канал або спільноту колекціонерів GromBricks — ми допоможемо знайти навіть найрідкісніший екземпляр LEGO!',
    },
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      label: 'Текст кнопки',
      defaultValue: 'Зв’язатися в Telegram',
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: true,
      label: 'Посилання кнопки',
      defaultValue: 'https://t.me/grombricks',
    },
  ],
}
