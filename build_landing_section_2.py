# -*- coding: utf-8 -*-
"""
Generate a concise, landing-focused version of Section 2 with lists instead of unnecessary tables.
"""
import os
import io
import docx
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_heading_1(doc, text):
    p = doc.add_paragraph(style='Heading 1')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(10)
    p.paragraph_format.first_line_indent = Inches(0)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph(style='Heading 2')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.first_line_indent = Inches(0.492)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    return p

def add_subheading(doc, text):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.first_line_indent = Inches(0.492)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    return p

def add_paragraph(doc, text):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.first_line_indent = Inches(0.492)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    return p

def add_bullet(doc, text):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    p.paragraph_format.first_line_indent = Inches(0.492)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run("• " + text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    return p

def add_placeholder(doc, text):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(5)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.first_line_indent = Inches(0)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.italic = True
    return p

def add_table_title(doc, text):
    p = doc.add_paragraph(style='Normal')
    p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.first_line_indent = Inches(0)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    return p

def add_table(doc, headers, data, col_widths=None):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers), style='Table Grid')
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=130, right=130)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.first_line_indent = Inches(0)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            r.font.bold = True

    for row_idx, row_data in enumerate(data):
        row_cells = table.rows[row_idx + 1].cells
        for col_idx, cell_value in enumerate(row_data):
            row_cells[col_idx].text = cell_value
            set_cell_margins(row_cells[col_idx], top=80, bottom=80, left=130, right=130)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.first_line_indent = Inches(0)
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            if col_idx == 0:
                p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(11)

    if col_widths:
        for row in table.rows:
            for i, w in enumerate(col_widths):
                row.cells[i].width = Inches(w)

    doc.add_paragraph(style='Normal').paragraph_format.space_after = Pt(3)
    return table

def build_landing_section_2(doc):
    # =========================================================================
    # РОЗДІЛ 2
    # =========================================================================
    add_heading_1(doc, "РОЗДІЛ 2. РОЗРОБКА FULLSTACK-ЗАСТОСУНКУ НА PAYLOAD CMS ТА TYPESCRIPT (ГУСАРОВ, ЮРЧИШИН)")

    # -------------------------------------------------------------------------
    # 2.1. Архітектура та Payload CMS
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.1. Архітектура та Payload CMS: монорепозиторій, конфігурація Payload (колекції, типи блоків, медіа), хмарна БД та кастомні API-ендпоінти.")

    add_paragraph(doc, "Другий етап практики присвячено розробці Fullstack-рішення для інтернет-магазину GromBricks — інтерактивного презентаційного лендінгу (Landing Page) бренду ексклюзивних мініфігурок і деталей LEGO. Архітектура побудована за decoupled-моделлю: бекендом слугує безголова система Payload CMS 3.x на базі Next.js, а клієнтською вітриною — швидкий статичний лендінг на чистому TypeScript і збирачі Vite.")

    add_paragraph(doc, "Для злагодженої роботи кодову базу організовано у форматі монорепозиторію з використанням npm workspaces (корінь package.json):")
    add_bullet(doc, "директорія cms/ — серверна частина на Payload CMS 3.x із Next.js App Router, що керує структурою даних, контентними блоками сторінки, автентифікацією та медіафайлами;")
    add_bullet(doc, "директорія frontend/ — клієнтський презентаційний лендінг на чистому Vanilla TypeScript, HTML5 та CSS3 без важких бібліотек;")
    add_bullet(doc, "централізовані скрипти життєвого циклу: npm run dev:cms (порт 3000), npm run dev:frontend (порт 5173) та спільний npm run build.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.1: Конфігурація монорепозиторію та робочих просторів package.json]")

    add_paragraph(doc, "З огляду на вимоги розгортання в безсерверному середовищі Vercel, де файлова система контейнерів є тимчасовою (ефемерною), використання локальних баз даних (SQLite) призводило б до втрати даних при кожному перезапуску. Тому бекенд підключено до зовнішньої хмарної СУБД Neon PostgreSQL 16. Підключення налаштовано через адаптер @payloadcms/db-postgres із пулінгом з'єднань через PgBouncer та захищеним режимом SSL (ssl: { rejectUnauthorized: false }).")

    add_paragraph(doc, "Конфігурація cms/src/payload.config.ts визначає адмін-панель (/admin), авторизаційну колекцію Users, візуальний редактор Lexical, бібліотеку оптимізації зображень Sharp та вихідний файл типів payload-types.ts. Для безперешкодної взаємодії вітрини лендінгу з бекендом увімкнено дозвіл cross-origin запитів через cors: '*'.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.2: Конфігурація Payload CMS та підключення хмарної бази даних (payload.config.ts)]")

    add_paragraph(doc, "Модель даних охоплює структуровані колекції та глобальні налаштування:")
    add_bullet(doc, "Products — каталог фігурок і деталей LEGO (назва, sku, тип minifigure/part, серія, ціна, залишок stock, ознака рідкісності isRare, категорія, медіа та активність);")
    add_bullet(doc, "Categories — рубрикатор всесвітів LEGO (Star Wars, Marvel, Ninjago, Classic, Parts) із бейджами та іконками;")
    add_bullet(doc, "Orders — збереження замовлень, оформлених через форму швидкого замовлення на лендінгу, із масивом items та службами доставки;")
    add_bullet(doc, "Pages — сторінки сайту, ядром яких є поліморфне поле layout (блоковий конструктор Page Builder);")
    add_bullet(doc, "Media — завантаження зображень з автоматичною генерацією розмірів Sharp (thumbnail, card, hero);")
    add_bullet(doc, "Users — облікові записи з ролями admin, editor, customer;")
    add_bullet(doc, "Globals (HeaderSettings, FooterSettings) — наскрізні контакти, телефон, посилання на Telegram-спільноту та копірайт.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.3: Схема колекції Products та визначення полів (Products.ts)]")

    add_paragraph(doc, "Конструктор контенту лендінгу (директорія cms/src/blocks/) реалізовано у вигляді модульних блоків: HeroBlock (головний банер із закликом до дії), FeaturesBlock (картки переваг для колекціонерів з іконками), ProductGridBlock (динамічна сітка товарів із фільтрацією), BannerBlock (промо-акції зі знижками) та CallToActionBlock (кнопка зв'язку через Telegram).")

    add_paragraph(doc, "Для усунення надлишкової вкладеності стандартного REST API Payload та передачі оптимізованого JSON на лендінг створено кастомні API-ендпоінти:")

    add_table_title(doc, "Таблиця 2.1 - Кастомні API-ендпоінти сервера GromBricks")
    add_table(doc,
              ["HTTP-метод та URL", "Модуль обробника", "Призначення для лендінгу", "Формат відповіді"],
              [
                  ["GET /api/common", "commonEndpoint.ts", "Завантаження наскрізних контактів, телефону та соцмереж шапки й підвалу.", "{ success: true, data: { header, footer } }"],
                  ["GET /api/page?path=/", "pageEndpoint.ts", "Отримання структури блоків лендінгу з інтегрованими товарами.", "{ success: true, data: { title, blocks[] } }"],
                  ["GET /api/products/search", "searchEndpoint.ts", "Пошук та фільтрація деталей і фігурок за назвою, серією та рідкісністю.", "{ success: true, data: Product[] }"],
                  ["POST /api/cart/validate", "cartEndpoints.ts", "Перевірка складських залишків та актуальності цін перед оформленням.", "{ success: true, data: CartValidationResult }"],
                  ["POST /api/orders/checkout", "orderEndpoints.ts", "Швидке оформлення замовлення, створення запису в БД та списання залишку stock.", "{ success: true, data: { orderId, orderNumber } }"],
                  ["POST /api/seed", "seedEndpoint.ts", "Первинна ініціалізація бази категоріями, товарами та структурою лендінгу.", "{ success: true, message }"]
              ],
              col_widths=[1.8, 1.4, 2.3, 1.5])

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.4: Транзакційне оформлення замовлення у файлі orderEndpoints.ts]")

    # -------------------------------------------------------------------------
    # 2.2. Клієнтська частина та стани UI
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.2. Клієнтська частина та стани UI: асинхронні запити до API, шаблонізація блоків, адаптивна верстка, обробка станів (завантаження / помилка / готовність).")

    add_paragraph(doc, "Клієнтську вітрину розроблено як швидкий інтерактивний лендінг (frontend/) на базі чистого Vanilla TypeScript, сучасного стандарту HTML5 та модульного CSS3 під керуванням збирача Vite. Відмова від компонентних реактивних фреймворків (React/Vue) забезпечила миттєве завантаження першого екрана (FCP), відсутність накладних витрат віртуального DOM та прямий контроль над вузлами розмітки.")

    add_paragraph(doc, "Організація клієнтського застосунку спирається на презентаційну сторінку index.html із допоміжними розділами:")
    add_bullet(doc, "index.html — головний інтерактивний лендінг (Hero-екран, переваги для AFOL-колекціонерів, 3D-експозиція фігурок Three.js, картки тематичних напрямків та блок Telegram);")
    add_bullet(doc, "швидке модальне замовлення (modal cart & checkout) — спливаючий кошик для миттєвого оформлення покупки прямо з лендінгу;")
    add_bullet(doc, "catalog.html, cart.html, checkout.html — додаткові сторінки розширеного каталогу та повнорозмірного кошика.")

    add_paragraph(doc, "Мережевий шар винесено в сервісний модуль frontend/src/api.ts. Запити виконуються асинхронно через нативний fetch (async/await) до базової адреси VITE_API_BASE. Усі мережеві виклики (fetchCommonData, fetchPageData, submitCheckout) загорнуто в блоки try...catch із поверненням заздалегідь структурованих резервних даних (fallback). Це гарантує безперебійне відображення лендінгу навіть за умов тимчасової відсутності зв'язку з CMS.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.5: Асинхронні запити до API та механізм fallback-даних (api.ts)]")

    add_paragraph(doc, "Шаблонізація контенту побудована на патерні «Фабрика шаблонів» у модулі frontend/src/blocks/renderBlocks.ts. Функція renderBlocks послідовно обробляє масив блоків, отриманий від /api/page, та відповідно до властивості blockType делегує генерацію HTML-розмітки ізольованим модулям:")
    add_bullet(doc, "renderHeroBlock — формує іміджевий головний екран із бейджем «PREMIUM LEGO COLLECTIBLES» та кнопками переходу;")
    add_bullet(doc, "renderFeaturesBlock — виводить картки переваг магазину з SVG-іконками з бібліотеки Remix Icon;")
    add_bullet(doc, "renderModelViewerBlock — створює контейнер для інтерактивної 3D-вітрини;")
    add_bullet(doc, "renderCategoryCardsBlock — відображає візуальні картки тематичних лінійок LEGO;")
    add_bullet(doc, "renderCtaBlock — верстає секцію підписки на офіційний Telegram-канал.")

    add_paragraph(doc, "Ключовим елементом лендінгу є інтеграція бібліотеки Three.js (модуль modelViewer.ts). Вона ініціалізує WebGL-сцену зі спрямованим освітленням, орбітальним керуванням OrbitControls (обертання мишею та жестами) і відображає деталізовані 3D-моделі мініфігурок LEGO (Kai, Cole, Golden Ninja) у форматах OBJ/MTL та Collada DAE з плавним перемиканням.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.6: Реалізація шаблонізатора сторінки в renderBlocks.ts]")

    add_paragraph(doc, "Адаптивна верстка (frontend/src/style.css) реалізована на базі CSS Grid та Flexbox у фірмовій темній палітрі космічної цегли (#05070d, #070b16) із золотими акцентами LEGO (#e6bf55, #ffd700). Завдяки системі медіа-запитів (@media на 1024px, 768px, 480px) інтерфейс плавно адаптується до мобільних екранів: навігація перемикається на мобільну шторку (.mobile-nav-drawer), 3D-сцена підлаштовує розміри полотна Canvas, а картки блоків шикуються в ергономічний вертикальний потік.")

    add_paragraph(doc, "Життєвий цикл UI на лендінгу передбачає обробку чотирьох станів інтерфейсу:")
    add_bullet(doc, "Стан завантаження (Loading) — показ анімованого індикатора обертання кубика LEGO (.lego-spinner) та тексту очікування під час запиту до API;")
    add_bullet(doc, "Стан готовності (Ready/Success) — динамічне наповнення DOM згенерованими блоками та підключення слухачів подій;")
    add_bullet(doc, "Стан порожніх даних (Empty) — показ блоку .empty-container з інформативним повідомленням і кнопкою скидання фільтрів;")
    add_bullet(doc, "Стан помилки (Error) — виведення адаптивного банера .checkout-error-banner та блокування повторної відправки форми.")

    # -------------------------------------------------------------------------
    # 2.3. Типізація на TypeScript
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.3. Типізація на TypeScript: створення типів для структури сторінки та її блоків, використання Type Aliases, Union Types та Intersection Types для опису різних типів даних, типізація функцій і об'єктів, типізація даних, отриманих через API.")

    add_paragraph(doc, "Статична типізація мови TypeScript є основою надійності fullstack-архітектури GromBricks. Вона гарантує узгодженість контрактів між схемою бази даних, бекенд-ендпоінтами та вітриною лендінгу (файли cms/src/types/shop.ts та frontend/src/types.ts).")

    add_paragraph(doc, "Для усунення ненадійних рядкових констант створено набір псевдонімів типів (Type Aliases):")
    add_bullet(doc, "базові ідентифікатори: export type ID = string | number, export type Slug = string;")
    add_bullet(doc, "типи та стани товарів: export type ProductType = 'minifigure' | 'part', export type ProductCondition = 'new' | 'used';")
    add_bullet(doc, "бізнес-статуси та логістика: export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled', export type DeliveryService = 'nova_poshta' | 'ukrposhta' | 'meest', export type PaymentMethod = 'card_transfer' | 'cash_on_delivery';")
    add_bullet(doc, "параметри відображення: export type LegoSeries, export type Currency = 'UAH', export type SortOption.")

    add_paragraph(doc, "Поліморфізм контентних блоків лендінгу та станів UI описано через дискриміновані об'єднання (Discriminated Unions):")
    add_bullet(doc, "PageBlockData — дискриміноване об'єднання блоків HeroBlockData | FeaturesBlockData | ModelViewerBlockData | CategoryCardsBlockData | CtaBlockData | ProductGridBlockData за спільним полем blockType. Це дозволяє компілятору звужувати типи (type narrowing) усередині оператора switch (block.blockType);")
    add_bullet(doc, "UIState<T> — типізація станів інтерфейсу: { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'empty' } | { status: 'error'; error: string };")
    add_bullet(doc, "ApiResponse<T> — строгий контракт відповіді API: { success: true; data: T } | { success: false; error: string }.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.7: Система типів: Discriminated Unions та стани UI (cms/src/types/shop.ts)]")

    add_paragraph(doc, "Типи перетину (Intersection Types, оператор &) застосовано для композиції моделей:")
    add_bullet(doc, "ProductWithCategory = Product & { categoryDetails: Category } — гарантує наявність даних розгорнутої категорії;")
    add_bullet(doc, "CartItem = { productId: ID; quantity: number } & Pick<Product, 'name' | 'slug' | 'sku' | 'price' | 'imageUrl' | 'stock'> — формує знімок товару в кошику без надлишкових полів;")
    add_bullet(doc, "CartItemWithDetails = CartItem & { product: Product; subtotal: number; isAvailable: boolean } — містить розрахункові величини для рендерингу;")
    add_bullet(doc, "EnrichedOrder = Order & { formattedDate: string; itemsCount: number } — розширене замовлення для відображення.")

    add_paragraph(doc, "Утилітарний модуль cms/src/lib/shopUtils.ts містить строго типізовані сервісні функції:")
    add_bullet(doc, "CartValidatorFn — функція validateCart(items, productsPool) порівнює кількість товару з наявним складським балансом stock і формує звіт CartValidationResult;")
    add_bullet(doc, "PriceCalculatorFn — функція calculateOrderPricing(items, deliveryService) розраховує проміжну вартість і вартість доставки (безкоштовно при замовленні від 1500 грн);")
    add_bullet(doc, "FilterProductsFn — функція filterProducts(products, options) реалізує безпечний багатофакторний відбір за комплексним об'єктом опцій ProductFilterOptions.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.8: Типізовані сервісні функції магазину (cms/src/lib/shopUtils.ts)]")

    add_paragraph(doc, "Типізація взаємодії з API синхронізується з обох боків: бекенд генерує точний опис таблиць бази даних у файлі payload-types.ts, а вітрина використовує типізовані контракти передачі даних DTO (CheckoutApiRequest та CheckoutApiResponseData).")

    # -------------------------------------------------------------------------
    # 2.4. Деплой та контрольний приклад
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.4. Деплой та контрольний приклад: розгортання проєкту, оформлення репозиторію (README.md), контрольний приклад із скріншотами (редактор в CMS, відвідувач на сайті, обробка помилок).")

    add_paragraph(doc, "Хмарне розгортання проєкту реалізовано у зв'язці сервісів Neon та Vercel. З єдиного репозиторію GitHub у панелі Vercel сконфігуровано два взаємопов'язані сервіси:")
    add_bullet(doc, "grombricks-cms (Бекенд) — коренева папка cms, платформа Next.js. Налаштовано змінні середовища DATABASE_URL (підключення до Neon PostgreSQL з sslmode=require), PAYLOAD_SECRET (ключ сесій) та NEXT_PUBLIC_SERVER_URL;")
    add_bullet(doc, "grombricks-front (Лендінг) — коренева папка frontend, команда збірки npm run build, каталог виходу dist. Головна змінна VITE_API_BASE вказує на публічну адресу бекенду CMS;")
    add_bullet(doc, "зовнішня СУБД Neon PostgreSQL повністю вирішує проблему ефемерної файлової системи Vercel, зберігаючи контент і замовлення персистентно.")

    add_paragraph(doc, "Файл README.md у корені репозиторію містить повну інженерну документацію: системні вимоги (Node.js 20.18+, Neon), схему монорепозиторію, покрокові інструкції з локального запуску (npm install, npm run dev:cms, npm run dev:frontend), початкового наповнення через /api/seed та конфігурації деплою.")

    add_paragraph(doc, "Працездатність Fullstack-рішення перевірено за трьома сценаріями контрольного прикладу:")

    add_subheading(doc, "Сценарій 1. Робота адміністратора та редактора контенту в системі Payload CMS")
    add_paragraph(doc, "1. Вхід в адмін-панель за адресою /admin. Перегляд панелі зі списком колекцій: Products, Categories, Orders, Pages, Media, Users.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.2: Панель керування Payload CMS: список товарів колекції Products]")

    add_paragraph(doc, "2. Редагування товару «Дарт Вейдер» у колекції Products: встановлення позначки рідкісності isRare=true та зміна залишку stock з 5 на 10 одиниць із фіксацією в базі Neon.")
    add_paragraph(doc, "3. Налаштування структури лендінгу в колекції Pages (документ «home»): редагування заголовка Hero-блоку на «Ексклюзивні мініфігурки LEGO 2026» та зміна порядку блоків у Page Builder.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.3: Візуальний конструктор блоків сторінки (Page Builder) у CMS]")

    add_paragraph(doc, "4. Оновлення контактів підтримки в Globals (HeaderSettings) та переведення статусу нового замовлення клієнта в колекції Orders з pending у processing.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.4: Детальний перегляд замовлення та зміна статусу в колекції Orders]")

    add_subheading(doc, "Сценарій 2. Сценарій взаємодії відвідувача з інтерактивним лендінгом")
    add_paragraph(doc, "1. Відкриття головної сторінки лендінгу index.html. Асинхронне завантаження блоків та ініціалізація 3D-сцени Three.js. Відвідувач взаємодіє з інтерактивною 3D-моделлю ніндзя Cole, обертаючи її мишею.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.5: Головна сторінка магазину GromBricks з інтерактивною 3D-вітриною]")

    add_paragraph(doc, "2. Перегляд тематичних блоків лендінгу, перехід до каталогу та фільтрація деталей за пошуком «Rex» і рідкісністю. Відображення картки капітана Рекса (1450 грн).")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.6: Каталог товарів із живим пошуком та фільтрацією за параметрами]")

    add_paragraph(doc, "3. Додавання фігурки до кошика з лендінгу (синхронізація в localStorage, лічильник стає 1). Відкриття модального кошика або сторінки cart.html зі зміною кількості до 2 шт. (сума 2900 грн).")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.7: Сторінка кошика покупця з розрахунком вартості]")

    add_paragraph(doc, "4. Швидке оформлення замовлення: введення імені, телефону, вибір Нової Пошти у Львові. Відправка запиту на /api/orders/checkout, автоматичне списання 2 одиниць зі складу та генерація номера GB-2026-4819.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.8: Підтвердження успішно створеного замовлення]")

    add_subheading(doc, "Сценарій 3. Обробка граничних станів та помилок (Error Handling)")
    add_paragraph(doc, "1. Візуалізація стану завантаження через фірмовий спінер обертання кубика LEGO (.lego-spinner) під час асинхронних запитів.")
    add_paragraph(doc, "2. Стан порожньої видачі при пошуку відсутнього артикула з виведенням повідомлення «Нічого не знайдено».")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.9: Стан інтерфейсу при відсутності результатів пошуку в каталозі]")

    add_paragraph(doc, "3. Серверний захист від перепродажу: при спробі замовити 100 одиниць рідкісного шолома при залишку 10 шт. ендпоінт повертає 400 Bad Request, а інтерфейс виводить червоний банер помилки.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.10: Повідомлення про помилку валідації залишків на складі при оформленні]")

    add_paragraph(doc, "4. Відмовостійкість: при вимкненому бекенді скрипт api.ts автоматично перемикається на вбудований fallback, забезпечуючи повноцінне відображення структури лендінгу.")

    # -------------------------------------------------------------------------
    # Висновок до розділу 2
    # -------------------------------------------------------------------------
    add_subheading(doc, "Висновок до розділу 2")
    add_paragraph(doc, "У другому розділі звіту спроєктовано та реалізовано презентаційний Fullstack-лендінг інтернет-магазину GromBricks за архітектурою монорепозиторію. Поєднання безголової Payload CMS 3.x та хмарної СУБД Neon PostgreSQL забезпечило гнучке керування контентом через блоковий Page Builder і надійне збереження даних у безсерверному середовищі Vercel. Клієнтська вітрина лендінгу, створена на чистому Vanilla TypeScript і збирачі Vite без сторонніх UI-фреймворків, вирізняється високою швидкодією, адаптивністю, наявною інтерактивною 3D-вітриною Three.js та строгою обробкою життєвого циклу станів інтерфейсу. Комплексна типізація TypeScript усунула ризики помилок невідповідності даних. Контрольний приклад підтвердив стабільну взаємодію CMS-редактора, відвідувача вітрини та системи валідації.")

if __name__ == '__main__':
    src_user_upload = r'C:\Users\vitai\.gemini\antigravity\brain\85df3c14-278b-43f5-ae1e-2ffdec46da01\.user_uploaded\media_1793085605805_620abf0d.docx'
    dst_docs = r'd:\PracticeReport_3_TS\docs\Звіт_з_практики_Розділ_1_і_2.docx'
    landing_file = r'd:\PracticeReport_3_TS\Звіт_з_практики_Розділ_1_і_2_landing.docx'
    dst_root = r'd:\PracticeReport_3_TS\Звіт_з_практики_Розділ_1_і_2.docx'
    alt_root = r'd:\PracticeReport_3_TS\Звіт_з_практики_Розділ_1_і_2_скорочений.docx'

    with open(src_user_upload, 'rb') as f:
        buf = io.BytesIO(f.read())

    doc = docx.Document(buf)
    body = doc._body._body
    elements = list(body)
    
    # Paragraph 152 is the last paragraph of Section 1
    p152 = doc.paragraphs[152]._p
    idx_p152 = elements.index(p152)

    # Remove all elements after p152 except sectPr to restore clean Section 1
    for el in elements[idx_p152 + 1:]:
        if not el.tag.endswith('sectPr'):
            body.remove(el)

    print(f"Cleaned up to Section 1: {len(doc.paragraphs)} paragraphs remain.")

    # Build the landing-focused Section 2
    build_landing_section_2(doc)
    print(f"Total paragraphs now: {len(doc.paragraphs)}")
    print(f"Total tables now: {len(doc.tables)}")

    # Save to docs folder
    os.makedirs(os.path.dirname(dst_docs), exist_ok=True)
    doc.save(dst_docs)
    print(f"Saved successfully to: {dst_docs}")

    # Save to landing-specific file
    doc.save(landing_file)
    print(f"Saved successfully to: {landing_file}")

    # Try to save to alt_root
    try:
        doc.save(alt_root)
        print(f"Saved successfully to: {alt_root}")
    except PermissionError:
        print(f"File {alt_root} is locked by Word.")

    # Try to save to dst_root
    try:
        doc.save(dst_root)
        print(f"Saved successfully to: {dst_root}")
    except PermissionError:
        print(f"File {dst_root} is locked by Word.")

    # Sync back to uploaded file
    try:
        doc.save(src_user_upload)
        print(f"Synced back to user upload path: {src_user_upload}")
    except Exception as e:
        print(f"Could not sync to user upload: {e}")

    print("Landing-focused Section 2 generated successfully!")
