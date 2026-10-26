import type { Block } from 'payload'

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: {
    singular: 'Сітка товарів',
    plural: 'Сітки товарів',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок секції',
      defaultValue: 'Популярні фігурки та нові надходження',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Підзаголовок секції',
      defaultValue: 'Вибір наших колекціонерів цього тижня',
    },
    {
      name: 'filterType',
      type: 'select',
      required: true,
      defaultValue: 'all',
      label: 'Тип вибірки товарів',
      options: [
        { label: 'Всі товари', value: 'all' },
        { label: 'Тільки мініфігурки', value: 'minifigures' },
        { label: 'Тільки окремі деталі', value: 'parts' },
        { label: 'Рідкісні ексклюзиви', value: 'rare' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Кількість товарів для показу',
      defaultValue: 8,
      min: 2,
      max: 24,
    },
    {
      name: 'showViewAll',
      type: 'checkbox',
      label: 'Показувати кнопку "Дивитися всі"',
      defaultValue: true,
    },
  ],
}
