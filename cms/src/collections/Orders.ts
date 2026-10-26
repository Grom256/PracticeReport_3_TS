import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'totalAmount', 'deliveryService', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true, // дозволяє створювати замовлення з фронтенду
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Номер замовлення',
      admin: {
        description: 'Унікальний ідентифікатор замовлення (наприклад, GB-2026-1042)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'customerName',
          type: 'text',
          required: true,
          label: "Ім'я та прізвище клієнта",
        },
        {
          name: 'customerEmail',
          type: 'email',
          required: true,
          label: 'Електронна пошта',
        },
        {
          name: 'customerPhone',
          type: 'text',
          required: true,
          label: 'Номер телефону',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'deliveryService',
          type: 'select',
          required: true,
          defaultValue: 'nova_poshta',
          label: 'Служба доставки',
          options: [
            { label: 'Нова Пошта (відділення/поштомат)', value: 'nova_poshta' },
            { label: 'Укрпошта (стандарт)', value: 'ukrposhta' },
            { label: 'Meest Пошта', value: 'meest' },
          ],
        },
        {
          name: 'deliveryCity',
          type: 'text',
          required: true,
          label: 'Місто / населений пункт',
        },
        {
          name: 'deliveryBranch',
          type: 'text',
          required: true,
          label: 'Номер відділення або адреса',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          defaultValue: 'card_transfer',
          label: 'Спосіб оплати',
          options: [
            { label: 'Переказ на картку / IBAN (Реквізити)', value: 'card_transfer' },
            { label: 'Оплата при отриманні (Накладений платіж)', value: 'cash_on_delivery' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          label: 'Статус замовлення',
          options: [
            { label: 'Очікує підтвердження', value: 'pending' },
            { label: 'В обробці / комплектується', value: 'processing' },
            { label: 'Відправлено', value: 'shipped' },
            { label: 'Доставлено / Виконано', value: 'delivered' },
            { label: 'Скасовано', value: 'cancelled' },
          ],
        },
        {
          name: 'totalAmount',
          type: 'number',
          required: true,
          min: 0,
          label: 'Загальна сума (грн)',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Склад замовлення (товари та фіксовані ціни)',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Товар із каталогу',
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          label: 'Назва товару на момент покупки',
        },
        {
          name: 'sku',
          type: 'text',
          label: 'Артикул SKU',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
          label: 'Ціна за одиницю на момент замовлення (грн)',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          label: 'Кількість (шт)',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Коментар клієнта до замовлення',
    },
  ],
}
