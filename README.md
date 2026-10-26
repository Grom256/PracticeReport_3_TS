# GromBricks — Монорепозиторій інтернет-магазину LEGO

Навчальний Fullstack-проєкт для звіту з практики:
**Розділ 2. Розробка Fullstack-застосунку на Payload CMS та TypeScript**.

---

## 🏛️ Архітектура монорепозиторію

Згідно з методичними вимогами проєкт розділено на дві незалежні частини:

```text
PractiseReport3_ts/
├── cms/                  # Бекенд: Payload CMS 3.x + TypeScript + Neon PostgreSQL
│   ├── src/
│   │   ├── collections/  # Колекції: Products, Categories, Orders, Pages, Media, Users
│   │   ├── globals/      # Globals: HeaderSettings, FooterSettings (для /api/common)
│   │   ├── endpoints/    # Кастомні ендпоінти: /api/common, /api/page, /api/orders/checkout
│   │   └── payload.config.ts # Конфігурація CMS, CORS, підключення до Neon DB
│   └── package.json
│
└── frontend/             # Фронтенд: Vite + Vanilla TypeScript + HTML5 / CSS3 (Без React!)
    ├── index.html        # Головна сторінка (Hero, Напрямки, Щойно в наявності, Telegram)
    ├── catalog.html      # Каталог з живим пошуком та фільтрами за типом і рідкісністю
    ├── cart.html         # Кошик покупця (збереження у localStorage)
    ├── checkout.html     # Оформлення замовлення (відправка на /api/orders/checkout)
    ├── src/
    │   ├── api.ts        # Запити до /api/common та /api/page з обробкою try...catch
    │   ├── blocks/       # Шаблони блоків (hero, categoryCards, productGrid, cta, features)
    │   ├── blocks/renderBlocks.ts # Шаблонізатор блоків сторінки (відповідно до методички)
    │   ├── cart.ts       # Логіка кошика
    │   └── style.css     # Фірмовий темний дизайн (#05070d, #070b16, золото #e6bf55)
    ├── vite.config.ts    # Збірка Vite (вихід у dist/)
    └── package.json
```

---

## 🚀 Інструкція із запуску

### 1. Встановлення залежностей
```bash
npm install
```

### 2. Бекенд (Payload CMS)
```bash
npm run dev:cms
```
- Адмін-панель: [http://localhost:3000/admin](http://localhost:3000/admin)
- Ендпоінт загальних даних: [http://localhost:3000/api/common](http://localhost:3000/api/common)
- Ендпоінт блоків сторінки: [http://localhost:3000/api/page?path=/](http://localhost:3000/api/page?path=/)

### 3. Фронтенд (Vite + Vanilla TS/HTML)
```bash
npm run dev:frontend
```
- Вітрина магазину: [http://localhost:5173](http://localhost:5173)

---

## ☁️ Деплой та інфраструктура (Vercel + Neon)

1. **База даних:** Хмарна PostgreSQL у **Neon** (`DATABASE_URL`).
2. **Хостинг Vercel:**
   - Для бекенду вказується Root Directory: `cms`.
   - Для фронтенду вказується Root Directory: `frontend` (Output Directory: `dist`).
   - Налаштовано CORS для безпечної взаємодії між доменами.
