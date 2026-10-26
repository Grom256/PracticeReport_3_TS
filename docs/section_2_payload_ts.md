# Розділ 2. Fullstack-застосунок GromBricks

## Архітектура

GromBricks — навчальний інтернет-магазин колекційних LEGO-мініфігурок і деталей. Проєкт має структуру монорепозиторію з двома незалежними застосунками:

```text
PractiseReport3_ts/
├── cms/                # Payload CMS 3.x + Next.js + TypeScript + PostgreSQL
│   └── src/
│       ├── collections/ # Products, Categories, Orders, Pages, Media, Users
│       ├── globals/     # HeaderSettings і FooterSettings
│       ├── endpoints/   # Кастомні API-маршрути
│       └── blocks/      # Схеми блоків конструктора сторінок
└── frontend/            # Vite + Vanilla TypeScript + HTML/CSS
    └── src/
        ├── blocks/      # Шаблони блоків сторінки
        └── api.ts       # HTTP-запити до CMS
```

CMS і вітрина запускаються окремо. Такий поділ дає змогу незалежно розгортати адміністративну частину та статичний фронтенд на Vercel. Дані зберігаються у зовнішній PostgreSQL-базі Neon, оскільки файлова система Vercel є тимчасовою.

## Payload CMS та дані

Конфігурація `cms/src/payload.config.ts` підключає адаптер `@payloadcms/db-postgres`, редактор Lexical, обробку медіафайлів Sharp та колекції `Products`, `Categories`, `Orders`, `Pages`, `Media` і `Users`.

Наскрізні частини вітрини винесено до Globals: `HeaderSettings` та `FooterSettings`. Сторінки зберігають масив блоків у полі `layout`. Блоки Hero, Features, ProductGrid, Banner і CallToAction описані кодом, тому після оновлення схеми автоматично доступні в адмін-панелі Payload.

## API та динамічний рендеринг

Для фронтенду передбачено спрощені API-маршрути:

- `GET /api/common` — дані хедера й футера з Globals;
- `GET /api/page?path=/` — метадані сторінки та плоский масив блоків;
- `GET /api/products/search` — пошук і фільтрація товарів;
- `POST /api/cart/validate` — перевірка кошика;
- `POST /api/orders/checkout` — оформлення замовлення;
- `POST /api/seed` — одноразове початкове наповнення тестовими даними.

Вітрина виконує запити через `fetch` у `frontend/src/api.ts`. Помилки обробляються через `try...catch`. Файл `frontend/src/blocks/renderBlocks.ts` перебирає масив `blocks`, визначає `blockType` та викликає відповідний шаблон. Згенерований HTML вставляється в DOM.

## Локальний запуск

Потрібен Node.js 20.18 або новіший та доступна PostgreSQL-база. Скопіюйте `cms/.env.example` у `cms/.env` і заповніть `DATABASE_URL` та `PAYLOAD_SECRET`.

```bash
npm install
npm run dev:cms
```

В іншому терміналі:

```bash
npm run dev:frontend
```

CMS доступна за `http://localhost:3000/admin`, а фронтенд — за `http://localhost:5173`. Vite у режимі розробки проксіює запити `/api` на CMS.

## Розгортання

Для Vercel створюються два проєкти з одного GitHub-репозиторію:

1. **CMS:** Root Directory — `cms`; змінні `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`.
2. **Frontend:** Root Directory — `frontend`, Output Directory — `dist`; змінна `VITE_API_BASE` дорівнює URL CMS.

На CMS у Neon використовується `DATABASE_URL` із параметром `sslmode=require`. У Payload налаштовано CORS для взаємодії фронтенду й CMS на різних доменах. Після розгортання можна виконати один POST-запит до `/api/seed`, щоб додати демонстраційні товари.
