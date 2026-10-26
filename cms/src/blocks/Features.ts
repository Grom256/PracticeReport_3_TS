import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Блок переваг',
    plural: 'Блоки переваг',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок блоку',
      defaultValue: 'Чому обирають GromBricks',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Підзаголовок',
      defaultValue: 'Надійний сервіс для фанатів та AFOL-спільноти LEGO',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Список переваг',
      minRows: 1,
      maxRows: 6,
      defaultValue: [
        {
          icon: 'shield',
          title: '100% Оригінал LEGO®',
          description: 'Жодних підробок — перевіряємо стан та маркування кожної деталі.',
        },
        {
          icon: 'sparkles',
          title: 'Рідкісні колекційні мініфігурки',
          description: 'Унікальні фігурки Star Wars, Marvel та класичні набори минулих років.',
        },
        {
          icon: 'package',
          title: 'Надійне колекційне пакування',
          description: 'Кожна фігурка пакується в індивідуальний зіп-пакет та пухирчасту плівку.',
        },
        {
          icon: 'truck',
          title: 'Швидка доставка по Україні',
          description: 'Відправка Новою Поштою та Укрпоштою в день замовлення або на наступний.',
        },
      ],
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: 'Іконка',
          options: [
            { label: 'Щит (Оригінальність)', value: 'shield' },
            { label: 'Іскри (Ексклюзив)', value: 'sparkles' },
            { label: 'Коробка (Пакування)', value: 'package' },
            { label: 'Вантажівка (Доставка)', value: 'truck' },
            { label: 'Галочка (Гарантія)', value: 'check' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Назва переваги',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Опис переваги',
        },
      ],
    },
  ],
}
