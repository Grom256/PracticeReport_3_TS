import type { GlobalConfig } from 'payload'

export const FooterSettings: GlobalConfig = {
  slug: 'footer-settings',
  label: 'Підвал сайту (Footer)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис компанії',
      defaultValue:
        'Фігурки та деталі LEGO для колекціонерів і майстрів. Ретельно відібрані позиції в Україні.',
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email підтримки',
      defaultValue: 'support@grombricks.ua',
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Копірайт',
      defaultValue: '© 2026 GromBricks. Всі права захищено. Навчальний проєкт.',
    },
  ],
}
