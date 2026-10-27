import type { Block } from 'payload'

export const ModelViewerBlock: Block = {
  slug: 'modelViewer',
  labels: {
    singular: '3D Вітрина моделей',
    plural: '3D Вітрини моделей',
  },
  fields: [
    {
      name: 'badge',
      type: 'text',
      label: 'Бейдж секції',
      defaultValue: '3D ЕКСПОЗИЦІЯ',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Заголовок секції',
      defaultValue: 'Інтерактивна 3D Вітрина Мініфігурок',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Підзаголовок секції',
      defaultValue:
        'Обертайте фігурку на 360°, масштабуйте та роздивляйтесь деталі зі студійним освітленням',
    },
    {
      name: 'models',
      type: 'array',
      label: 'Список 3D моделей',
      minRows: 1,
      fields: [
        {
          name: 'modelId',
          type: 'text',
          required: true,
          label: 'Ідентифікатор моделі (slug)',
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Назва мініфігурки',
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          label: 'Серія / Підзаголовок',
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Тег (напр. Ексклюзив, Популярне, Рідкісне)',
          defaultValue: 'Колекційне',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Детальний опис для вітрини',
        },
        {
          name: 'objPath',
          type: 'text',
          required: true,
          label: 'Шлях до файлу .obj',
        },
        {
          name: 'mtlPath',
          type: 'text',
          required: true,
          label: 'Шлях до файлу .mtl',
        },
      ],
    },
  ],
}
