# -*- coding: utf-8 -*-
"""
Rebuild Section 2 to strictly match the teachers' curriculum outline:
2.1. Архітектура та Payload CMS: монорепозиторій, конфігурація Payload (колекції, типи блоків, медіа), хмарна БД та кастомні API-ендпоінти.
2.2. Клієнтська частина та стани UI: асинхронні запити до API, шаблонізація блоків, адаптивна верстка, обробка станів (завантаження / помилка / готовність).
2.3. Типізація на TypeScript: створення типів для структури сторінки та її блоків, використання Type Aliases, Union Types та Intersection Types для опису різних типів даних, типізація функцій і об'єктів, типізація даних, отриманих через API.
2.4. Деплой та контрольний приклад: розгортання проєкту, оформлення репозиторію (README.md), контрольний приклад із скріншотами (редактор в CMS, відвідувач на сайті, обробка помилок).

Maintains the 12-grade exemplar report style (clear explanations, 'why' motivations, student-authored narrative).
"""
import os
import copy
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_margins(cell, top=100, bottom=100, left=130, right=130):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(12)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.first_line_indent = Pt(35.45) # ~1.25 cm
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    return p

def add_paragraph(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.first_line_indent = Pt(35.45)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    return p

def add_bullet(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.first_line_indent = Pt(35.45)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(f"• {text}")
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    return p

def add_placeholder(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.italic = True
    run.font.bold = True
    run.font.color.rgb = RGBColor(0, 51, 102)
    return p

def add_table_title(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Pt(0)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    return p

def add_table(doc, headers, data, col_widths=None):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers), style='Table Grid')
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    hdr_cells = table.rows[0].cells
    for i, header_text in enumerate(headers):
        hdr_cells[i].text = header_text
        set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
        p = hdr_cells[i].paragraphs[0]
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.first_line_indent = Pt(0)
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
            set_cell_margins(row_cells[col_idx], top=80, bottom=80, left=120, right=120)
            p = row_cells[col_idx].paragraphs[0]
            p.paragraph_format.first_line_indent = Pt(0)
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

    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return table

def generate_full_section_2(doc):
    # =========================================================================
    # РОЗДІЛ 2
    # =========================================================================
    add_heading_1(doc, "РОЗДІЛ 2. Розробка Fullstack-застосунку на Payload CMS та TypeScript")

    # -------------------------------------------------------------------------
    # 2.1. Архітектура та Payload CMS
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.1. Архітектура та Payload CMS: монорепозиторій, конфігурація Payload (колекції, типи блоків, медіа), хмарна БД та кастомні API-ендпоінти.")

    add_paragraph(doc, "Під час виконання другого розділу виробничої практики основну увагу було присвячено розробці сучасного повнофункціонального вебзастосунку (Landing Page) для спеціалізованого магазину колекційних фігурок і деталей GromBricks. Головною метою етапу було створення надійної роздільної (decoupled або headless) архітектури, в якій серверна частина на базі безголової системи Payload CMS 3.x надає гнучкий інструментарій для адміністрування даних, а клієнтська вітрина на чистому TypeScript забезпечує миттєве завантаження та інтерактивність.")

    add_paragraph(doc, "Організація кодової бази у форматі монорепозиторію. Для ефективної командної розробки та усунення проблеми синхронізації спільних типів даних проєкт було реалізовано як монорепозиторій за допомогою механізму npm workspaces. Усі компоненти системи розміщено в єдиному сховищі Git під спільним керуванням кореневого файлу package.json:")

    add_bullet(doc, "папка cms/ – бекенд-застосунок на Payload CMS 3.x та Next.js, що керує базами даних, структурою сторінки, автентифікацією адміністраторів і медіаресурсами;")
    add_bullet(doc, "папка frontend/ – презентаційна клієнтська вітрина на чистому Vanilla TypeScript, HTML5 та CSS3 під збиранням інструменту Vite;")
    add_bullet(doc, "спільні скрипти життєвого циклу – у кореневому package.json налаштовано централізовані команди: npm run dev:cms (запуск адмін-панелі на порті 3000), npm run dev:frontend (запуск клієнтського середовища на порті 5173) та npm run build для одночасного складання обох підсистем.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.1: Конфігурація монорепозиторію та робочих просторів package.json]")

    add_paragraph(doc, "Конфігурація Payload CMS та підключення хмарної бази даних. Серцевиною серверної частини є конфігураційний файл cms/src/payload.config.ts. Він об'єднує підключення бази даних, реєструє колекції та глобальні налаштування, ініціалізує візуальний редактор контенту Lexical та керує збіркою типів даних payload-types.ts. Для взаємодії з клієнтським застосунком на рівні конфігурації увімкнено підтримку CORS-запитів (cors: '*').")

    add_paragraph(doc, "Збереження даних у хмарній СУБД Neon PostgreSQL. Оскільки публікація проєкту здійснюється на безсерверній платформі Vercel, де файлова система віртуальних контейнерів є тимчасовою (ефемерною), використання класичних локальних баз даних на кшталт SQLite було б неприпустимим, адже всі дані зникали б після кожного перезапуску. Тому як базу даних було обрано хмарну СУБД Neon PostgreSQL 16. Підключення налаштовано через адаптер @payloadcms/db-postgres із пулінгом підключень PgBouncer та захищеним шифрованим режимом SSL (параметр sslmode=require), що забезпечує стабільність під час сплесків навантаження.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.2: Конфігурація Payload CMS та підключення хмарної бази даних (payload.config.ts)]")

    add_paragraph(doc, "Колекції даних (Collections) та глобальні налаштування (Globals). Для реалізації предметної області інтернет-магазину в Payload CMS налаштовано 6 самостійних колекцій та 2 глобальні сутності:")

    add_bullet(doc, "Products – головний каталог товарів (поля: назва, унікальний артикул sku, тип товару minifigure або part, серія, ціна, залишок на складі stock, прапорець рідкісності isRare, категорія та прив'язка до медіафайлу);")
    add_bullet(doc, "Categories – рубрикатор всесвітів LEGO (Star Wars, Marvel, Ninjago, Classic Space, Parts) з візуальними іконками та бейджами;")
    add_bullet(doc, "Orders – замовлення, оформлені покупцями (номер GB-2026-XXXX, перелік куплених товарів, дані клієнта, служба доставки Нова Пошта / Укрпошта / Meest, сума та статус виконання pending, processing, shipped, delivered, cancelled);")
    add_bullet(doc, "Pages – сторінки сайту, основою яких є поліморфне масив-поле layout (конструктор сторінок Page Builder);")
    add_bullet(doc, "Users – облікові записи користувачів та персоналу з ролями admin, editor та customer із безпечним хешуванням паролів;")
    add_bullet(doc, "Globals (HeaderSettings, FooterSettings) – наскрізні параметри інтерфейсу: контактні телефони, робочі години підтримки, посилання на спільноту в Telegram та копірайт.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.3: Схема колекції Products та визначення полів (Products.ts)]")

    add_paragraph(doc, "Типи блоків контенту (Page Builder Blocks). Для того щоб адміністратор міг самостійно формувати та змінювати послідовність розділів лендінгу без програміста, у каталозі cms/src/blocks/ було розроблено модульні блоки:")

    add_bullet(doc, "HeroBlock – презентаційний перший екран із заголовком, підзаголовком, бейджем «PREMIUM LEGO COLLECTIBLES» та кнопками заклику до дії;")
    add_bullet(doc, "FeaturesBlock – блок конкурентних переваг магазину (оригінальні деталі, швидка доставка, рідкісні екземпляри) з іконками;")
    add_bullet(doc, "ProductGridBlock – динамічна вітрина товарів із можливістю фільтрації за категорією та обмеженням кількості;")
    add_bullet(doc, "BannerBlock – промо-банер для повідомлення про тимчасові акції та знижки;")
    add_bullet(doc, "CallToActionBlock – блок із прямою кнопкою швидкого переходу до Telegram-каналу для консультацій.")

    add_paragraph(doc, "Налаштування медіафайлів та оптимізація через Sharp. Завантаження графічних файлів здійснюється через окрему колекцію Media. На сервері інтегровано бібліотеку високошвидкісної обробки растрових зображень Sharp. Під час завантаження кожної фотографії фігурки чи банера система в автоматичному режимі генерує оптимізовані WebP-копії трьох розмірів: thumbnail (150x150 пікселів для кошика та таблиць), card (400x400 пікселів для карток каталогу) та hero (1200x600 пікселів для широкоформатних банерів). Це у 4–5 разів зменшує обсяг завантажуваного трафіку та прискорює завантаження сайту на мобільних пристроях.")

    add_paragraph(doc, "Кастомні API-ендпоінти сервера GromBricks. Стандартний REST API Payload CMS повертає глибоко вкладені об'єкти з великою кількістю технічних службових полів, що сповільнює роботу клієнта. Для передачі компактних і готових до рендерингу даних було створено набір кастомних серверних маршрутів (Таблиця 2.1).")

    add_table_title(doc, "Таблиця 2.1 - Кастомні API-ендпоінти сервера GromBricks")
    headers_t21 = ["HTTP-метод та URL", "Модуль обробника", "Призначення для лендінгу", "Формат відповіді"]
    data_t21 = [
        ["GET /api/common", "commonEndpoint.ts", "Завантаження наскрізних контактів, телефону та соцмереж шапки й підвалу.", "{ success: true, data: { header, footer } }"],
        ["GET /api/page?path=/", "pageEndpoint.ts", "Отримання структури блоків лендінгу з інтегрованими товарами.", "{ success: true, data: { title, blocks[] } }"],
        ["GET /api/products/search", "searchEndpoint.ts", "Пошук та фільтрація деталей і фігурок за назвою, серією та рідкісністю.", "{ success: true, data: Product[] }"],
        ["POST /api/cart/validate", "cartEndpoints.ts", "Перевірка складських залишків та актуальності цін перед оформленням.", "{ success: true, data: CartValidationResult }"],
        ["POST /api/orders/checkout", "orderEndpoints.ts", "Швидке оформлення замовлення, створення запису в БД та списання залишку stock.", "{ success: true, data: { orderId, orderNumber } }"],
        ["POST /api/seed", "seedEndpoint.ts", "Первинна ініціалізація бази категоріями, товарами та структурою лендінгу.", "{ success: true, message }"]
    ]
    add_table(doc, headers_t21, data_t21, [1.7, 1.4, 2.3, 1.6])

    add_paragraph(doc, "Центральним елементом транзакційної логіки є маршрут POST /api/orders/checkout у файлі orderEndpoints.ts. Він в атомарному режимі перевіряє поточну наявність кожної замовленої позиції в базі даних, автоматично списує відповідну кількість stock, формує замовлення в таблиці Orders і повертає покупцеві згенерований номер. Це повністю запобігає перепродажу дефіцитних фігурок кільком користувачам.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.4: Транзакційне оформлення замовлення у файлі orderEndpoints.ts]")

    # -------------------------------------------------------------------------
    # 2.2. Клієнтська частина та стани UI
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.2. Клієнтська частина та стани UI: асинхронні запити до API, шаблонізація блоків, адаптивна верстка, обробка станів (завантаження / помилка / готовність).")

    add_paragraph(doc, "Клієнтський застосунок (директорія frontend/) розроблено як швидкий інтерактивний лендінг на базі чистого Vanilla TypeScript та модульного стандарту CSS3 під керуванням збирача Vite. Відмова від використання важких клієнтських фреймворків (React, Angular) дозволила отримати критично малий розмір вихідного скрипта, уникнути накладних витрат віртуального DOM і досягти практично миттєвого завантаження головного екрана (показник FCP менше 0.4 секунди).")

    add_paragraph(doc, "Асинхронні запити до API та механізм fallback-даних. Усі мережеві виклики інкапсульовано у службовому модулі frontend/src/api.ts. Взаємодія з бекендом побудована на базі стандарту async/await та нативного браузерного методу fetch(). Особливу увагу приділено стабільності: функції fetchCommonData, fetchPageData та submitCheckout захищено блоками перехоплення помилок try...catch. Якщо сервер тимчасово недоступний або втрачено з'єднання, скрипт непомітно для користувача перемикається на вбудовані резервні дані (fallback). Завдяки цьому вітрина не ламається, а продовжує стабільно відображати структуру сторінки.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.5: Асинхронні запити до API та механізм fallback-даних (api.ts)]")

    add_paragraph(doc, "Шаблонізація блоків на базі патерну «Фабрика шаблонів». Отриманий від сервера масив контенту транслюється в дерево DOM за допомогою модуля renderBlocks.ts. Головна функція renderBlocks послідовно проходить блоками, зчитує маркерне поле blockType та делегує створення розмітки ізольованим функціям-рендерерам:")

    add_bullet(doc, "renderHeroBlock – генерує преміальний перший екран із золотим бейджем та навігаційними кнопками;")
    add_bullet(doc, "renderFeaturesBlock – будує картки переваг із векторними SVG-іконками з пакунка Remix Icon;")
    add_bullet(doc, "renderModelViewerBlock – створює інтерактивний контейнер для 3D-вітрини;")
    add_bullet(doc, "renderCategoryCardsBlock – виводить привабливу візуальну сітку напрямків і всесвітів LEGO;")
    add_bullet(doc, "renderCtaBlock – формує блок швидкого переходу до Telegram-каналу магазину.")

    add_paragraph(doc, "Інтерактивна 3D-вітрина на базі Three.js. Важливим інтерактивним елементом лендінгу стала 3D-вітрина (модуль modelViewer.ts). Використовуючи можливості бібліотеки Three.js, на сторінці ініціалізується WebGL-сцена зі спрямованим світлом і контролером OrbitControls. Відвідувач має змогу за допомогою миші або сенсорного екрана вільно обертати деталізовані 3D-моделі мініфігурок LEGO (Cole, Kai, Golden Ninja) у форматах OBJ/MTL та Collada DAE, роздивляючись принти та аксесуари з будь-якого ракурсу.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.6: Реалізація шаблонізатора сторінки в renderBlocks.ts]")

    add_paragraph(doc, "Адаптивна верстка та фірмова стилістика. Оформлення лендінгу (frontend/src/style.css) реалізовано за допомогою сучасних сіток CSS Grid та гнучких контейнерів Flexbox. Стилістика витримана у вишуканій темній палітрі «космічна цегла» (#05070d, #070b16), що асоціюється з преміальними наборами для дорослих колекціонерів, із яскравими золотими акцентами LEGO (#e6bf55). Завдяки системі медіа-запитів (@media на 1024px, 768px та 480px) сайт бездоганно адаптується до будь-яких екранів: головне меню перетворюється на мобільну шторку (.mobile-nav-drawer), полотно 3D-сцени динамічно підлаштовує розміри, а сітка товарів плавно трансформується у зручну вертикальну стрічку.")

    add_paragraph(doc, "Обробка станів користувацького інтерфейсу (UI States). Для забезпечення якісного користувацького досвіду інтерфейс має чітку візуальну відповідь на всі етапи роботи з даними:")

    add_bullet(doc, "Стан завантаження (Loading) – під час виконання мережевого запиту до CMS відображається плавний анімований спінер у вигляді кубика LEGO (.lego-spinner), що повідомляє про процес отримання даних;")
    add_bullet(doc, "Стан успішної готовності (Ready/Success) – миттєва плавна поява сформованих блоків у DOM з підключенням обробників подій;")
    add_bullet(doc, "Стан порожніх даних (Empty) – у разі відсутності товарів за обраними критеріями пошуку замість порожнього місця показується блок .empty-container зі зрозумілим повідомленням та кнопкою скидання фільтрів;")
    add_bullet(doc, "Стан помилки (Error) – при збоях зв'язку чи помилках заповнення полів виводиться червоний інформативний банер .checkout-error-banner.")

    # -------------------------------------------------------------------------
    # 2.3. Типізація на TypeScript
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.3. Типізація на TypeScript: створення типів для структури сторінки та її блоків, використання Type Aliases, Union Types та Intersection Types для опису різних типів даних, типізація функцій і об'єктів, типізація даних, отриманих через API.")

    add_paragraph(doc, "Використання строгої типізації TypeScript стало ключовим інструментом підвищення стабільності та передбачуваності розробки fullstack-проєкту. На відміну від динамічного JavaScript, система типів гарантує узгодженість структур даних між серверною базою, відповідями API та функціями відображення на клієнті, унеможливлюючи появу помилок на кшталт «Cannot read properties of undefined» безпосередньо на етапі компіляції (файли cms/src/types/shop.ts та frontend/src/types.ts).")

    add_paragraph(doc, "Створення типів для структури сторінки та її блоків. Завдяки TypeScript у коді чітко зафіксовано структуру даних для кожної сторінки та кожного візуального блоку. Загальний опис сторінки описується типом PageData, який містить заголовок, опис, шлях URL та масив поліморфних контентних блоків blocks: PageBlockData[]. Це гарантує, що рендерер ніколи не отримає невідомий або пошкоджений блок.")

    add_paragraph(doc, "Використання псевдонімів типів (Type Aliases). Для підвищення читабельності та захисту від помилок введення рядкових констант у коді створено набір семантичних псевдонімів:")

    add_bullet(doc, "базові типи: export type ID = string | number, export type Slug = string;")
    add_bullet(doc, "класифікація товарів: export type ProductType = 'minifigure' | 'part', export type ProductCondition = 'new' | 'used';")
    add_bullet(doc, "статуси замовлень та логістика: export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled', export type DeliveryService = 'nova_poshta' | 'ukrposhta' | 'meest';")
    add_bullet(doc, "способи розрахунку та валюта: export type PaymentMethod = 'card_transfer' | 'cash_on_delivery', export type Currency = 'UAH'.")

    add_paragraph(doc, "Дискриміновані об'єднання (Discriminated Unions) для структури блоків та станів UI. Однією з найважливіших особливостей типізації стало застосування об'єднань типів зі спільним дискримінантним полем blockType:")

    add_bullet(doc, "PageBlockData – об'єднує всі типи блоків (HeroBlockData | FeaturesBlockData | ModelViewerBlockData | CategoryCardsBlockData | CtaBlockData | ProductGridBlockData). Завдяки цьому компілятор виконує безпечне звуження типів (type narrowing) усередині оператора switch (block.blockType), гарантуючи, що кожна функція отримає саме свій набір полів;")
    add_bullet(doc, "UIState<T> – типізація станів інтерфейсу: { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'empty' } | { status: 'error'; error: string };")
    add_bullet(doc, "ApiResponse<T> – єдиний формат клієнт-серверного обміну: { success: true; data: T } | { success: false; error: string }.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.7: Система типів: Discriminated Unions та стани UI (cms/src/types/shop.ts)]")

    add_paragraph(doc, "Типи перетину (Intersection Types, оператор &) для композиції моделей. Для розширення існуючих типів без дублювання вихідних описів застосовано типи перетину:")

    add_bullet(doc, "ProductWithCategory = Product & { categoryDetails: Category } – поєднує товар із розгорнутим описом його категорії;")
    add_bullet(doc, "CartItem = { productId: ID; quantity: number } & Pick<Product, 'name' | 'slug' | 'sku' | 'price' | 'imageUrl' | 'stock'> – формує легкий знімок позиції кошика;")
    add_bullet(doc, "CartItemWithDetails = CartItem & { product: Product; subtotal: number; isAvailable: boolean } – збагачує товар розрахунковою сумою;")
    add_bullet(doc, "EnrichedOrder = Order & { formattedDate: string; itemsCount: number } – розширює замовлення додатковими полями для адмін-панелі.")

    add_paragraph(doc, "Типізація утилітарних функцій та об'єктів магазину. Усі розрахункові алгоритми зосереджено в окремому модулі cms/src/lib/shopUtils.ts із явно описаними типами сигнатур:")

    add_bullet(doc, "CartValidatorFn – функція validateCart(items, productsPool) перевіряє замовлення на відповідність фактичним залишкам stock і генерує об'єкт звіту CartValidationResult;")
    add_bullet(doc, "PriceCalculatorFn – функція calculateOrderPricing(items, deliveryService) підсумовує вартість і застосовує безкоштовну доставку при сумі замовлення від 1500 грн;")
    add_bullet(doc, "FilterProductsFn – функція filterProducts(products, options) здійснює безпечну фільтрацію за параметрами пошуку, серії та рідкісності.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.8: Типізовані сервісні функції магазину (cms/src/lib/shopUtils.ts)]")

    add_paragraph(doc, "Типізація даних, отриманих через API. Синхронізація клієнта й сервера забезпечується двосторонньо: Payload автоматично експортує повну структуру бази у файл payload-types.ts, а на клієнті для відправки замовлення використовуються суворі типи запиту й відповіді CheckoutApiRequest та CheckoutApiResponseData.")

    # -------------------------------------------------------------------------
    # 2.4. Деплой та контрольний приклад
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.4. Деплой та контрольний приклад: розгортання проєкту, оформлення репозиторію (README.md), контрольний приклад із скріншотами (редактор в CMS, відвідувач на сайті, обробка помилок).")

    add_paragraph(doc, "Хмарне розгортання проєкту (Деплой). Для демонстрації роботи створеного застосунку в реальній мережі було здійснено деплой на платформі Vercel у поєднанні з хмарною базою даних Neon PostgreSQL. З єдиного репозиторію на GitHub у середовищі Vercel сконфігуровано два взаємопов'язані проєкти:")

    add_bullet(doc, "grombricks-cms (Бекенд) – корінь cms/, середовище Next.js; налаштовано змінні оточення DATABASE_URL (з'єднання з Neon через SSL), PAYLOAD_SECRET (ключ сесій) та NEXT_PUBLIC_SERVER_URL;")
    add_bullet(doc, "grombricks-front (Лендінг) – корінь frontend/, директорія збірки dist; змінна VITE_API_BASE вказує на публічну адресу розгорнутої CMS;")
    add_bullet(doc, "хмарна база даних Neon PostgreSQL повністю вирішує проблему ефемерних дисків Vercel, персистентно зберігаючи структуру лендінгу, каталоги товарів та створені замовлення.")

    add_paragraph(doc, "Оформлення репозиторію (README.md). У кореневій папці проєкту підготовлено вичерпну технічну документацію README.md. Вона містить опис системних вимог (Node.js 20.18+, Neon), схему архітектури монорепозиторію, покрокові інструкції з локального запуску за допомогою npm workspaces та порядок первинної ініціалізації бази даних тестовими мініфігурками через POST-запит на /api/seed.")

    add_paragraph(doc, "Контрольний приклад із скріншотами. Працездатність розробленої системи було перевірено за трьома сценаріями контрольного прикладу, які всебічно демонструють можливості CMS-редактора, досвід покупця на вітрині та обробку граничних станів.")

    add_heading_2(doc, "Сценарій 1. Робота адміністратора та редактора контенту в системі Payload CMS")

    add_paragraph(doc, "1. Адміністратор переходить за адресою /admin, проходить автентифікацію та відкриває головний дашборд. У бічному навігаційному меню відображається повний перелік колекцій: Products, Categories, Orders, Pages, Media та Users (Рис. 2.2).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.2: Панель керування Payload CMS: список товарів колекції Products]")

    add_paragraph(doc, "2. У колекції Products відкривається картка фігурки «Дарт Вейдер». Редактор вмикає ознаку ексклюзивності isRare=true та збільшує залишок stock з 5 до 10 одиниць. Зміни негайно фіксуються в хмарній базі даних Neon.")

    add_paragraph(doc, "3. У розділі Pages відкривається домашня сторінка «home». За допомогою блокового конструктора Page Builder змінюється текст заголовка Hero-блоку на «Ексклюзивні мініфігурки LEGO 2026», переставляються блоки та додається акційний промо-банер (Рис. 2.3).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.3: Візуальний конструктор блоків сторінки (Page Builder) у CMS]")

    add_paragraph(doc, "4. У колекції Orders переглядаються нові замовлення. Відкривши детальну картку замовлення клієнта, адміністратор змінює статус із pending на processing, підтверджуючи початок збирання посилки (Рис. 2.4).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.4: Детальний перегляд замовлення та зміна статусу в колекції Orders]")

    add_heading_2(doc, "Сценарій 2. Сценарій взаємодії відвідувача з інтерактивним лендінгом")

    add_paragraph(doc, "1. Відвідувач відкриває головну сторінку лендінгу index.html. За лічені частки секунди ініціалізується інтерактивна 3D-вітрина Three.js. Користувач за допомогою миші обертає деталізовану 3D-модель ніндзя Cole, оглядаючи шолом, зброю та якість принтів під спрямованим світлом (Рис. 2.5).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.5: Головна сторінка магазину GromBricks з інтерактивною 3D-вітриною]")

    add_paragraph(doc, "2. Прокручуючи сторінку, відвідувач переходить до каталогу. У рядку пошуку вводиться запит «Rex» та обирається фільтр за рідкісністю. Каталог миттєво відображає картку колекційного капітана Рекса вартістю 1450 грн (Рис. 2.6).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.6: Каталог товарів із живим пошуком та фільтрацією за параметрами]")

    add_paragraph(doc, "3. Натисканням кнопки «Додати в кошик» фігурка потрапляє до замовлення. У модальному кошику покупець збільшує кількість до 2 одиниць (підсумкова сума 2900 грн), при цьому система повідомляє про безкоштовну доставку (Рис. 2.7).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.7: Сторінка кошика покупця з розрахунком вартості]")

    add_paragraph(doc, "4. Покупець вказує номер телефону, ім'я та обирає відділення Нової Пошти у Львові. Після підтвердження запит відправляється на /api/orders/checkout. Сервер успішно списує дві одиниці зі складу в Neon та показує вікно підтвердження з номером GB-2026-4819 (Рис. 2.8).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.8: Підтвердження успішно створеного замовлення]")

    add_heading_2(doc, "Сценарій 3. Обробка граничних станів та помилок (Error Handling)")

    add_paragraph(doc, "1. Під час відправки мережевих запитів користувач бачить фірмовий анімований індикатор обертання кубика LEGO (.lego-spinner), що повідомляє про процес обробки та запобігає випадковим дублюючим клікам.")

    add_paragraph(doc, "2. У разі введення пошукового запиту, за яким відсутні товари на складі, застосунок не зависає і не залишає порожній простір, а показує зрозуміле повідомлення «Нічого не знайдено» з кнопкою скидання фільтрів (Рис. 2.9).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.9: Стан інтерфейсу при відсутності результатів пошуку в каталозі]")

    add_paragraph(doc, "3. Надійно реалізовано захист від спроби замовлення більшої кількості, ніж є на складі: якщо спробувати замовити 100 одиниць рідкісного шолома при залишку 10 шт., ендпоінт orderEndpoints.ts повертає помилку 400 Bad Request, а інтерфейс виводить червоний банер з попередженням (Рис. 2.10).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.10: Повідомлення про помилку валідації залишків на складі при оформленні]")

    add_paragraph(doc, "4. Забезпечено відмовостійкість клієнтської вітрини: у разі тимчасової відсутності зв'язку з сервером CMS скрипт api.ts автоматично перемикається на вбудований структурований fallback, гарантуючи відображення контенту сторінки.")

    # -------------------------------------------------------------------------
    # Висновок до розділу 2
    # -------------------------------------------------------------------------
    add_heading_2(doc, "Висновок до розділу 2")

    add_paragraph(doc, "У другому розділі звіту спроєктовано та практично реалізовано сучасний презентаційний Fullstack-лендінг інтернет-магазину GromBricks за архітектурою монорепозиторію. Поєднання безголової Payload CMS 3.x та хмарної СУБД Neon PostgreSQL забезпечило зручне керування контентом через блоковий Page Builder і надійне збереження даних у безсерверному середовищі Vercel. Клієнтська вітрина лендінгу, створена на чистому Vanilla TypeScript і збирачі Vite без використання сторонніх громіздких UI-фреймворків, вирізняється надвисокою швидкодією, адаптивністю, наявною інтерактивною 3D-вітриною Three.js та чіткою обробкою станів інтерфейсу (завантаження, успіх, порожнеча, помилка). Завдяки строгій системі типів TypeScript вдалося повністю усунути помилки невідповідності даних між сервером і клієнтом. Успішне тестування трьох контрольних сценаріїв підтвердило стабільність, відмовостійкість та практичну готовність розробленого рішення до реальної експлуатації.")

def update_report_section_2():
    input_path = "ЗВІТ_3_оригінал_до_правок.docx" if os.path.exists("ЗВІТ_3_оригінал_до_правок.docx") else "ЗВІТ_3.docx"
    output_path = "ЗВІТ_3_оновлений.docx"

    print(f"Loading {input_path}...")
    doc = docx.Document(input_path)
    body = doc._body._element

    start_idx = None
    end_idx = None
    for i, child in enumerate(body):
        tag = child.tag.split('}')[-1]
        if tag == 'p':
            p = docx.text.paragraph.Paragraph(child, doc)
            txt = p.text.strip()
            if 'РОЗДІЛ 2.' in txt.upper() or 'РОЗДІЛ 2 ' in txt.upper():
                start_idx = i
            elif start_idx is not None and ('РОЗДІЛ 3.' in txt.upper() or 'РОЗДІЛ 3 ' in txt.upper()):
                end_idx = i
                break

    print(f"Section 2 bounds in body: {start_idx} to {end_idx}")

    temp_doc = docx.Document()
    generate_full_section_2(temp_doc)

    target_element = body[end_idx]

    # Insert all elements from temp_doc before target_element
    for child in temp_doc._body._element:
        new_child = copy.deepcopy(child)
        target_element.addprevious(new_child)

    # Collect old Section 2 elements
    elements_to_delete = []
    current = body[start_idx]
    while current != target_element:
        elements_to_delete.append(current)
        current = current.getnext()

    num_new_elements = len(temp_doc._body._element)
    old_elements = elements_to_delete[:-num_new_elements]
    print(f"Removing {len(old_elements)} old Section 2 elements...")
    for elem in old_elements:
        body.remove(elem)

    print(f"Saving updated document to {output_path}...")
    doc.save(output_path)
    print("Done! Successfully updated ЗВІТ_3.docx")

if __name__ == "__main__":
    update_report_section_2()
