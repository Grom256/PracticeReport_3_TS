import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'productType', 'series', 'price', 'stock', 'isRare', 'isActive'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Назва товару',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'Артикул (SKU)',
      admin: {
        description: 'Унікальний артикул товару (наприклад, SW-VADER-01 або PART-3001-RED)',
      },
    },
    {
      name: 'productType',
      type: 'select',
      required: true,
      defaultValue: 'minifigure',
      label: 'Тип товару',
      options: [
        { label: 'Мініфігурка LEGO', value: 'minifigure' },
        { label: 'Окрема деталь LEGO', value: 'part' },
      ],
    },
    {
      name: 'series',
      type: 'select',
      label: 'Серія / Всесвіт LEGO',
      options: [
        { label: 'Star Wars', value: 'Star Wars' },
        { label: 'Marvel Super Heroes', value: 'Marvel Super Heroes' },
        { label: 'Harry Potter', value: 'Harry Potter' },
        { label: 'Ninjago', value: 'Ninjago' },
        { label: 'Classic Space', value: 'Classic Space' },
        { label: 'Castle', value: 'Castle' },
        { label: 'Technic', value: 'Technic' },
        { label: 'City', value: 'City' },
        { label: 'The Lord of the Rings', value: 'The Lord of the Rings' },
        { label: 'Custom / MOC', value: 'Custom / MOC' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Ціна (грн)',
    },
    {
      name: 'condition',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Стан товару',
      options: [
        { label: 'Новий (ідеальний)', value: 'new' },
        { label: 'Вживаний (колекційний)', value: 'used' },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 0,
      label: 'Залишок на складі (шт)',
    },
    {
      name: 'isRare',
      type: 'checkbox',
      label: 'Рідкісний / Ексклюзивний товар',
      defaultValue: false,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Категорія',
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      label: 'Зображення (Upload)',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Пряме посилання на фото (URL)',
      admin: {
        description: 'Шлях до локального або віддаленого фото (/images/... або https://...)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Детальний опис',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Колір (для окремих деталей)',
    },
    {
      name: 'partNumber',
      type: 'text',
      label: 'Офіційний Lego Element / Design ID',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Відображати в каталозі (Активний)',
      defaultValue: true,
    },
  ],
}
