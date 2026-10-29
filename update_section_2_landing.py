# -*- coding: utf-8 -*-
"""
Generate complete, authentic, 100% clean presentational landing page Section 2
for GromBricks Practice Report 3.
Zero store/cart/products remnants.
Dynamic 3D showcase (Three.js) + Page Builder (Payload CMS 3.x) + TypeScript + Neon Postgres.
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
    p.paragraph_format.first_line_indent = Pt(35.45) # 1.25 cm
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
    run.font.color.rgb = RGBColor(90, 90, 90)
    return p

def add_table_title(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.first_line_indent = Pt(35.45)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.5
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
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

def generate_clean_landing_section_2(doc):
    # =========================================================================
    # РОЗДІЛ 2
    # =========================================================================
    add_heading_1(doc, "РОЗДІЛ 2. Розробка Fullstack-застосунку на Payload CMS та TypeScript")

    # -------------------------------------------------------------------------
    # 2.1. Архітектура та Payload CMS
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.1. Архітектура та Payload CMS: монорепозиторій, конфігурація Payload (колекції, типи блоків, медіа), хмарна БД та кастомні API-ендпоінти.")

    add_paragraph(doc, "Під час виконання другого етапу виробничої практики основну увагу було зосереджено на проєктуванні та практичній реалізації сучасного інтерактивного презентаційного лендінгу (Landing Page) для бренду GromBricks, що спеціалізується на ексклюзивних колекційних фігурках і кастомних деталях LEGO. Якщо у першому розділі було розроблено класичний монолітний інтернет-магазин на базі Python та Django, то завдання другого розділу полягало в опануванні кардинально іншого архітектурного підходу — безголової (headless або decoupled) веб-архітектури. У такій системі бекенд керування контентом (Payload CMS 3.x на базі Next.js) та легка презентаційна вітрина на чистому TypeScript під збіркою Vite повністю відокремлені один від одного і взаємодіють виключно через легкий стандартизований REST API.")

    add_paragraph(doc, "Організація кодової бази у форматі монорепозиторію. Для забезпечення злагодженої та синхронної роботи обох підсистем у межах єдиного середовища кодову базу організовано як монорепозиторій за допомогою менеджера пакетів npm та технології npm workspaces. Початкову структуру ініціалізовано командою npm init, а загальний маніфест package.json у кореневій папці містить спільні налаштування, скрипти життєвого циклу та оголошення робочих просторів:")

    add_bullet(doc, "директорія cms/ – серверна частина на Payload CMS 3.x та Next.js, що відповідає за зберігання контенту, автентифікацію адміністраторів, візуальний блоковий конструктор Page Builder та медіафайли;")
    add_bullet(doc, "директорія frontend/ – клієнтська презентаційна вітрина лендінгу на чистому Vanilla TypeScript, HTML5 та CSS3 під керуванням збирача Vite з інтегрованою 3D-вітриною Three.js;")
    add_bullet(doc, "розподіл залежностей – у package.json сторонні бібліотеки чітко розділено на dependencies (пакети, необхідні для безпосередньої роботи додатка у продакшені: payload, @payloadcms/next, @payloadcms/db-postgres, three, sharp) та devDependencies (інструменти компіляції TypeScript, збірки Vite, тайпінги та лінтери, потрібні виключно на етапі розробки);")
    add_bullet(doc, "спільні скрипти життєвого циклу – у секції scripts налаштовано зручні аліаси: npm run dev:cms (запуск адмін-панелі на порті 3000), npm run dev:frontend (запуск клієнтського середовища на порті 5173) та npm run build для компіляції обох частин;")
    add_bullet(doc, "ігнорування службових каталогів – директорію node_modules внесено до файлу .gitignore через її великий обсяг, оскільки всі залежності гарантовано й автоматично встановлюються командою npm install на будь-якому сервері чи комп'ютері розробника.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.1: Конфігурація монорепозиторію та робочих просторів package.json]")

    add_paragraph(doc, "Конфігурація Payload CMS та генерація адмін-панелі. Серцевиною бекенду є конфігураційний файл cms/src/payload.config.ts. На основі програмно описаних у ньому TypeScript-схем адмін-панель Payload CMS генерується повністю автоматично, тому розробнику не потрібно витрачати час на її ручну верстку. Конфігурація реєструє колекції даних, наскрізні налаштування Globals, сучасний візуальний текстовий редактор Lexical, модуль оптимізації графіки Sharp та налаштовує автоматичний експорт TypeScript-типів у файл payload-types.ts. Для безперешкодної взаємодії фронтенду з сервером через різні порти увімкнено крос-доменні політики CORS (cors: '*').")

    add_paragraph(doc, "Хмарна база даних Neon PostgreSQL. Вибір реляційної СУБД був зумовлений специфікою серверлес-деплою на платформу Vercel. Оскільки Vercel функціонує за безсерверною архітектурою та має непостійну файлову систему (ephemeral storage), яка очищається при кожному оновленні чи перезапуску контейнерів, підняти базу даних локально (наприклад, у файлі SQLite) було неможливо — збережені дані втрачалися б. Тому як надійне персистентне сховище було обрано хмарну платформу Neon PostgreSQL 16. Підключення налаштовано через адаптер @payloadcms/db-postgres із пулінгом з'єднань через PgBouncer та обов'язковим SSL-шифруванням (параметр sslmode=require), що забезпечує стабільну роботу системи під час пікових навантажень.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.2: Конфігурація Payload CMS та підключення хмарної бази даних (payload.config.ts)]")

    add_paragraph(doc, "Колекції даних (Collections) та наскрізні налаштування (Globals). Для чистого презентаційного лендінгу з інтерактивною 3D-вітриною структура сутностей у Payload CMS є максимально прозорою та позбавленою зайвих складських таблиць інтернет-магазину:")

    add_bullet(doc, "Pages – центральна колекція керування структурою та наповненням сторінок лендінгу. Її ядром є динамічне поліморфне масив-поле layout (конструктор Page Builder), що дозволяє контент-менеджеру гнучко компонувати сторінку з довільних блоків;")
    add_bullet(doc, "Categories – рубрикатор тематичних напрямків всесвіту LEGO (Star Wars, Marvel Super Heroes, LEGO Ninjago, Classic Castle & Space, Деталі та аксесуари) з описами та бейджами;")
    add_bullet(doc, "Media – централізоване медіасховище для завантаження 3D-моделей (.obj, .mtl), текстур, банерів та промо-фотографій з автоматичною оптимізацією;")
    add_bullet(doc, "Users – захищені облікові записи адміністраторів та редакторів контенту із солінням та хешуванням паролів за сучасними стандартами;")
    add_bullet(doc, "Globals (HeaderSettings, FooterSettings) – наскрізні налаштування сайту (назва бренду, контактний телефон, посилання на офіційний Telegram-канал @grombricks, пункти навігації та копірайт), які винесені в окрему сутність, оскільки вони є глобальними для всього ресурсу.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.3: Схема колекції Pages та блокового конструктора Page Builder (Pages.ts)]")

    add_paragraph(doc, "Типи блоків конструктора сторінок (Page Builder у cms/src/blocks/). Кожен контентний блок лендінгу описано у вигляді незалежної схеми Block, що реєструється у масиві PageBlocks і стає доступною для додавання та редагування в адмін-панелі:")

    add_bullet(doc, "HeroBlock – презентаційний головний екран із бейджем «ПРЕМІАЛЬНІ LEGO КОЛЕКЦІЇ», заголовком, підзаголовком, кнопками швидкої навігації «3D ЕКСПОЗИЦІЯ» та «ПЕРЕВАГИ»;")
    add_bullet(doc, "FeaturesBlock – презентаційний блок ключових переваг магазину GromBricks (100% оригінальність, швидка відправка в день замовлення, рідкісні екземпляри) з векторними іконками;")
    add_bullet(doc, "ModelViewerBlock – центральний блок інтерактивної 3D-вітрини Three.js. Дозволяє адміністратору через адмінку змінювати заголовок, бейдж та керувати масивом 3D-моделей (Golden Ninja Lloyd, Kai Jungle, Cole Jungle), редагуючи назву мініфігурки, підзаголовок серії, тег рідкісності, детальний презентаційний опис та шляхи до файлів геометрії .obj і матеріалів .mtl;")
    add_bullet(doc, "CategoryCardsBlock – презентаційні картки напрямків колекціонування (Мініфігурки, Деталі та Зброя, Star Wars & Ninjago, Рідкісні Раритети) з візуальними бейджами та посиланнями;")
    add_bullet(doc, "BannerBlock – стилізований промо-блок для виведення спеціальних оголошень;")
    add_bullet(doc, "CallToActionBlock – конверсійний блок із закликом підписатися на Telegram-спільноту GromBricks для консультацій та викупу рідкісних деталей.")

    add_paragraph(doc, "Оптимізація графічних матеріалів бібліотекою Sharp. Для обробки зображень у бекенді задіяно бібліотеку Sharp. Під час завантаження медіафайлів сервер автоматично конвертує їх у сучасний стиснутий формат WebP та генерує оптимізовані мініатюри, що суттєво зменшує обсяг мережевого трафіку та прискорює відображення на мобільних пристроях.")

    add_paragraph(doc, "Кастомні API-ендпоінти сервера GromBricks. Стандартний REST API Payload CMS повертає глибоко вкладені службові об'єкти з надлишковими метаданими. Щоб передавати на фронтенд чистий, плоский та максимально оптимізований JSON, було реалізовано спеціалізовані ендпоінти (Таблиця 2.1).")

    add_table_title(doc, "Таблиця 2.1 - Кастомні API-ендпоінти сервера GromBricks")
    headers_t21 = ["HTTP-метод та URL", "Модуль обробника", "Призначення для лендінгу", "Формат відповіді"]
    data_t21 = [
        ["GET /api/common", "commonEndpoint.ts", "Віддача наскрізних контактів, телефону, посилання на Telegram та копірайту з Globals.", "{ success: true, data: { header, footer } }"],
        ["GET /api/page?path=/", "pageEndpoint.ts", "Отримання структури лендінгу з масивом контентних блоків (включаючи 3D-моделі та описи).", "{ success: true, data: { title, blocks[] } }"],
        ["POST /api/seed", "seedEndpoint.ts", "Первинне наповнення бази категоріями та структурою головної сторінки з 3D-моделями у Pages.", "{ success: true, message }"]
    ]
    add_table(doc, headers_t21, data_t21, [1.8, 1.5, 2.3, 1.4])

    add_paragraph(doc, "Головним маршрутом взаємодії є ендпоінт GET /api/page?path=/. Він зчитує з бази Neon конфігурацію документа з колекції Pages, формує масив блоків і повертає готовий JSON-об'єкт для моментального рендерингу клієнтською частиною.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.4: Кастомний ендпоінт віддачі структури сторінки лендінгу (pageEndpoint.ts)]")

    # -------------------------------------------------------------------------
    # 2.2. Клієнтська частина та стани UI
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.2. Клієнтська частина та стани UI: асинхронні запити до API, шаблонізація блоків, адаптивна верстка, обробка станів (завантаження / помилка / готовність).")

    add_paragraph(doc, "Клієнтську частину лендінгу (директорія frontend/) спроєктовано як високопродуктивну презентаційну сторінку. Свідома відмова від важких клієнтських SPA-фреймворків (React чи Vue) на користь чистого Vanilla TypeScript, сучасного HTML5 та модульного CSS3 під керуванням збирача Vite дозволила усунути накладні витрати на віртуальний DOM та забезпечити практично миттєве завантаження першого екрана.")

    add_paragraph(doc, "Життєвий цикл запиту до API (Request Lifecycle). При відкритті сторінки в браузері ініціалізується функція init() у головному скрипті main.ts. Фронтенд надсилає два паралельні асинхронні запити до CMS: GET /api/common (для наповнення шапки та підвалу) та GET /api/page?path=/ (для отримання контенту сторінки). Отримавши масив блоків, клієнтський скрипт пропускає їх через фабрику шаблонів, вставляє готову розмітку в контейнер #app-main та ініціалізує 3D-сцену Three.js.")

    add_paragraph(doc, "Асинхронні запити та механізм fallback-стійкості. Мережеву логіку винесено в модуль frontend/src/api.ts. Взаємодія з сервером реалізована через нативний браузерний fetch() із конструкцією async/await. Усі запити огорнуто в блоки try...catch: у разі відсутності зв'язку з бекендом функція автоматично підхоплює внутрішні статичні fallback-дані з повною структурою блоків та 3D-моделей. Завдяки цьому лендінг ніколи не падає з білим екраном навіть при тимчасовій недоступності серверної бази даних.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.5: Асинхронні запити до API та механізм fallback-даних (api.ts)]")

    add_paragraph(doc, "Шаблонізація блоків (патерн «Фабрика шаблонів»). Динамічне формування розмітки реалізовано у файлі renderBlocks.ts. Функція перебирає масив блоків від API і за полем blockType делегує створення HTML-розмітки відповідним модулям із каталогу blocks/:")

    add_bullet(doc, "renderHeroBlock (hero.ts) – будує перший екран із закликом до дії, бейджем та навігаційними кнопками;")
    add_bullet(doc, "renderFeaturesBlock (features.ts) – формує картки ключових переваг магазину GromBricks з векторними іконками;")
    add_bullet(doc, "renderModelViewerBlock (modelViewer.ts) – створює розмітку інтерактивної 3D-вітрини: контейнер Three.js, навігаційні таби перемикання моделей, бейдж, детальний опис та кнопки дій;")
    add_bullet(doc, "renderCategoryCardsBlock (categoryCards.ts) – будує презентаційні картки напрямків колекціонування;")
    add_bullet(doc, "renderCtaBlock (cta.ts) – формує конверсійний блок підписки на Telegram-канал спільноти.")

    add_paragraph(doc, "Інтерактивна 3D-вітрина на базі Three.js (modelViewer.ts). Головною родзинкою лендінгу є повноцінний 3D-переглядач мініфігурок. Після монтування розмітки в DOM функція initThreeViewer() налаштовує сцену Three.Scene, камеру PerspectiveCamera, антиаліасинг WebGLRenderer та контролер орбітального обертання OrbitControls. Освітлення сцени скомпоновано за принципом триточкового студійного світла (Key Light золотистого відтінку, Fill Light холодного синього та Rim Light контурного підсвічування), що ефектно підкреслює глянцеві та металізовані деталі мініфігурок LEGO. Моделі завантажуються динамічно за допомогою OBJLoader та MTLLoader із центруванням і масштабуванням на п'єдесталі. При кліку на будь-який таб (наприклад, перемиканні з Golden Ninja на Kai чи Cole) скрипт оновлює текстові описи з CMS та плавно перезавантажує відповідну 3D-геометрію.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.6: Реалізація інтерактивної 3D-вітрини Three.js (modelViewer.ts)]")

    add_paragraph(doc, "Адаптивна верстка та дизайн-система. Оформлення лендінгу (frontend/src/style.css) базується на технологіях CSS Grid та Flexbox. Колірна палітра відтворює естетику преміальної космічної цеглини (#05070d, #070b16) із теплими золотими акцентами (#e6bf55, #f0cf7a). Завдяки продуманим медіа-запитам (@media на 1024px, 768px та 480px) сайт бездоганно адаптується до будь-яких екранів: головне меню на мобільних пристроях згортається у плавне бічне меню (.mobile-nav-drawer), 3D-полотно динамічно змінює роздільну здатність через ResizeObserver, а інформаційні блоки вибудовуються у зручний вертикальний потік.")

    add_paragraph(doc, "Обробка станів користувацького інтерфейсу (UI States). Для забезпечення передбачуваності взаємодії інтерфейс має наочний відгук на кожен стан життєвого циклу даних:")

    add_bullet(doc, "Стан завантаження (Loading) – під час асинхронного звернення до API або завантаження важких 3D-файлів OBJ/MTL користувач бачить фірмовий анімований спінер у вигляді обертового кубика LEGO (.lego-spinner);")
    add_bullet(doc, "Стан успішної готовності (Ready/Success) – плавна поява сформованих блоків у DOM з підключенням обробників подій та запуском циклу рендерингу Three.js;")
    add_bullet(doc, "Стан порожніх даних (Empty) – коректне приховування порожніх секцій без порушення загальної сітки сторінки;")
    add_bullet(doc, "Стан помилки (Error) – при виникненні критичного мережевого збою інтерфейс виводить акуратне інформативне повідомлення замість аварійного падіння програми.")

    # -------------------------------------------------------------------------
    # 2.3. Типізація на TypeScript
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.3. Типізація на TypeScript: створення типів для структури сторінки та її блоків, використання Type Aliases, Union Types та Intersection Types для опису різних типів даних, типізація функцій і об'єктів, типізація даних, отриманих через API.")

    add_paragraph(doc, "Статична типізація мови TypeScript стала надійним інструментом забезпечення надійності, передбачуваності та якості роботи застосунку. На відміну від звичайного JavaScript, строга система типів унеможливлює помилки несумісності структур даних ще на етапі написання коду, гарантує інтелектуальне автодоповнення (IntelliSense) і робить взаємодію між сервером та вітриною регламентованою (файли cms/src/types/shop.ts та frontend/src/types.ts).")

    add_paragraph(doc, "Створення типів для структури сторінки та її блоків. Завдяки TypeScript у проєкті чітко типізовано всю структуру лендінгу. Інтерфейс PageResponse описує метадані документа (title, slug, path) та масив blocks: PageBlock[], що унеможливлює передачу некоректного блоку на клієнтську вітрину.")

    add_paragraph(doc, "Використання псевдонімів типів (Type Aliases). Для усунення ненадійних «магічних» рядків і підвищення читабельності коду оголошено семантичні псевдоніми:")

    add_bullet(doc, "базові типи: export type ID = string | number, export type Slug = string;")
    add_bullet(doc, "ідентифікатори 3D-моделей: export type ModelId = 'golden_ninja' | 'kai_jungle' | 'cole_jungle' | string;")
    add_bullet(doc, "тематичні серії всесвіту LEGO: export type LegoSeries = 'Star Wars' | 'Marvel Super Heroes' | 'Ninjago' | 'Classic Space' | 'Castle' | 'Technic';")
    add_bullet(doc, "стилістичні параметри та режими: export type Currency = 'UAH' | 'EUR' | 'USD', export type BannerVariant = 'legoYellow' | 'darkBrick' | 'accentRed', export type ViewerControlMode = 'orbit' | 'autoRotate' | 'static'.")

    add_paragraph(doc, "Дискриміновані об'єднання (Discriminated Unions) для блоків лендінгу та станів UI. Однією з найпотужніших можливостей типізації стало використання об'єднань типів зі спільним дискримінантним полем blockType:")

    add_bullet(doc, "PageBlockData – дискриміноване об'єднання типів усіх контентних блоків: HeroBlockData | FeaturesBlockData | ModelViewerBlockData | CategoryCardsBlockData | BannerBlockData | CtaBlockData. Завдяки спільному маркеру blockType компілятор TypeScript автоматично виконує звуження типу (type narrowing) усередині оператора switch (block.blockType), гарантуючи, що функція рендерингу отримає саме свій набір полів;")
    add_bullet(doc, "UIState<T> – типізація життєвого циклу інтерфейсу: { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'empty'; message?: string } | { status: 'error'; error: string };")
    add_bullet(doc, "ApiResponse<T> – єдиний контракт клієнт-серверного обміну: { success: true; data: T; timestamp?: string } | { success: false; error: string; statusCode?: number; timestamp?: string }.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.7: Система типів: Discriminated Unions та опис блоків лендінгу (shop.ts)]")

    add_paragraph(doc, "Типи перетину (Intersection Types, оператор &) для композиції моделей. Для гнучкого розширення базових описів сутностей без дублювання властивостей застосовано типи перетину:")

    add_bullet(doc, "ModelWithSceneSettings = Model3DItem & { initialCameraDistance?: number; rotationSpeed?: number } – доповнює дані 3D-моделі специфічними налаштуваннями камери та сцени;")
    add_bullet(doc, "FeaturedCategoryCard = CategoryCardItem & { featuredUntil?: string; priorityOrder: number } – розширює картку напрямку пріоритетом відображення;")
    add_bullet(doc, "PageWithBlocks = PageLayout & { lastUpdatedFormatted?: string } – доповнює макет сторінки відформатованою датою оновлення.")

    add_paragraph(doc, "Типізація утилітарних функцій та об'єктів. Модуль modelViewer.ts, renderBlocks.ts та допоміжні сервіси містять суворі сигнатури функцій (наприклад, фільтрація моделей filterModels(models: Model3DItem[], options: ModelFilterOptions): Model3DItem[] та обробник зміни моделі SwitchModelHandler = (modelId: string) => Promise<boolean>), що виключає передачу некоректних аргументів.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.8: Типізовані сервісні функції та інтерфейси 3D-вітрини (modelViewer.ts)]")

    add_paragraph(doc, "Типізація даних, отриманих через API. Система Payload CMS за замовчуванням побудована на TypeScript і підтримує автоматичну синхронізацію типів. За допомогою команди payload generate:types на основі схем колекцій генерується файл payload-types.ts. Дані, отримані з API, суворо відповідають клієнтським інтерфейсам, що забезпечує повну узгодженість без необхідності ручної синхронізації моделей.")

    # -------------------------------------------------------------------------
    # 2.4. Деплой та контрольний приклад
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.4. Деплой та контрольний приклад: розгортання проєкту, оформлення репозиторію (README.md), контрольний приклад із скріншотами (редактор в CMS, відвідувач на сайті, обробка помилок).")

    add_paragraph(doc, "Хмарне розгортання проєкту (Деплой). Для публічної демонстрації роботи лендінгу було налаштовано автоматичне хмарне розгортання на платформі Vercel у зв'язці з базою даних Neon PostgreSQL. Для розгортання монорепозиторію на хостингу Vercel було підключено єдиний GitHub-репозиторій та налаштовано два окремі проєкти:")

    add_bullet(doc, "grombricks-cms (Бекенд) – Root Directory: cms, середовище збірки Next.js; у налаштуваннях середовища Vercel задано змінні оточення (Environment Variables): DATABASE_URL (рядок підключення до Neon із параметром sslmode=require), PAYLOAD_SECRET для захисту сесій та NEXT_PUBLIC_SERVER_URL;")
    add_bullet(doc, "grombricks-front (Лендінг) – Root Directory: frontend, команда збірки npm run build, каталог виходу dist; змінна оточення VITE_API_BASE вказує на публічну адресу розгорнутого бекенду CMS;")
    add_bullet(doc, "безпека конфіденційних даних – локальні файли конфігурації .env не потрапляють у відкритий git-репозиторій, тому всі секретні ключі та адреси БД налаштовуються виключно через зашифровану панель Environment Variables у Vercel.")

    add_paragraph(doc, "Оформлення документації репозиторію (README.md). У кореневій папці монорепозиторію підготовлено чіткий інструктивний файл README.md. Він містить опис системних вимог (Node.js 20.18+, Neon PostgreSQL), структуру каталогів cms/ та frontend/, команди встановлення залежностей npm install, скрипти локального запуску (npm run dev:cms, npm run dev:frontend) та опис виклику службового маршруту POST /api/seed для первинного наповнення бази тестовими даними.")

    add_paragraph(doc, "Контрольний приклад із скріншотами. Працездатність розробленого повнофункціонального лендінгу перевірено за трьома сценаріями контрольного прикладу:")

    add_heading_2(doc, "Сценарій 1. Робота адміністратора та редактора контенту в системі Payload CMS")

    add_paragraph(doc, "1. Адміністратор переходить за адресою /admin, вводить логін і пароль та потрапляє до згенерованої панелі керування. На головному екрані доступний список сутностей: Pages, Categories, Media, Users та Globals (Рис. 2.2).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.2: Панель керування Payload CMS: головний екран сутностей та конструктор Pages]")

    add_paragraph(doc, "2. Редактор відкриває глобальні налаштування Globals (HeaderSettings) та оновлює контактний телефон підтримки і посилання на Telegram-канал спільноти. Завдяки наскрізній природі Globals ці дані миттєво оновлюються у шапці та підвалі вітрини (Рис. 2.3).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.3: Редагування наскрізних контактів у Globals (HeaderSettings)]")

    add_paragraph(doc, "3. Далі контент-менеджер відкриває розділ Pages, обирає документ головної сторінки «home» та переходить до блоку ModelViewerBlock (3D Вітрина моделей). Редактор змінює заголовок вітрини, коригує опис мініфігурки Golden Ninja Lloyd та додає новий бейдж ексклюзивності. Після натискання кнопки «Зберегти» оновлені дані фіксуються у хмарній базі Neon PostgreSQL (Рис. 2.4).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.4: Візуальне керування 3D-моделями та описами у блоці ModelViewerBlock (Pages)]")

    add_heading_2(doc, "Сценарій 2. Сценарій взаємодії відвідувача з інтерактивним лендінгом")

    add_paragraph(doc, "1. Відвідувач відкриває головну сторінку лендінгу у браузері. Завдяки оптимізації Vite сторінка завантажується практично миттєво. На екрані з'являється інтерактивна 3D-вітрина Three.js. За допомогою миші або сенсорного дотику користувач обертає 3D-модель ніндзя Lloyd на 360°, масштабує та роздивляється тиснення на золотих обладунках під студійним світлом (Рис. 2.5).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.5: Головна сторінка GromBricks з інтерактивною 3D-вітриною Three.js]")

    add_paragraph(doc, "2. Користувач перемикає таби моделей на Кая (Kai Jungle) та Коула (Cole Jungle): Three.js плавно завантажує нову 3D-геометрію, а картка інформації миттєво оновлює назву, серію та опис, отримані безпосередньо з CMS (Рис. 2.6).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.6: Динамічне перемикання 3D-моделей ніндзя та оновлення описів з CMS]")

    add_paragraph(doc, "3. Гортаючи сторінку нижче, відвідувач оглядає картки напрямків колекціонування (Star Wars, Ninjago, Раритети) та переходить до блоку Call To Action, де натискає кнопку «Приєднатися в Telegram» для швидкого зв'язку (Рис. 2.7).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.7: Картки напрямків та конверсійний блок Call To Action]")

    add_heading_2(doc, "Сценарій 3. Обробка граничних станів та помилок (Error Handling)")

    add_paragraph(doc, "1. Під час відправки асинхронного запиту до API або завантаження файлів геометрії на екрані з'являється фірмовий анімований індикатор у вигляді обертового кубика LEGO (.lego-spinner), що інформує про завантаження (Рис. 2.8).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.8: Анімація завантаження сторінки та 3D-сцени (LEGO-спінер)]")

    add_paragraph(doc, "2. Перевірка відмовостійкості: при тимчасово вимкненому сервері Payload CMS клієнтський модуль api.ts завдяки блоку try...catch автоматично активує вбудований fallback-набір даних. Лендінг зберігає повну працездатність, відображаючи всі блоки та 3D-сцену замість аварійного падіння (Рис. 2.9).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.9: Відмовостійке відображення лендінгу у fallback-режимі при недоступній CMS]")

    add_paragraph(doc, "3. Робота обробника критичних збоїв: при повній втраті зв'язку застосунок виводить інформативне повідомлення про необхідність перевірки інтернет-з'єднання замість порожнього білого екрана (Рис. 2.10).")

    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.10: Користувацьке повідомлення про помилку з'єднання з сервером]")

    # -------------------------------------------------------------------------
    # Висновок до розділу 2
    # -------------------------------------------------------------------------
    add_heading_2(doc, "Висновок до розділу 2")

    add_paragraph(doc, "У другому розділі звіту спроєктовано та практично реалізовано презентаційний Fullstack-лендінг бренду GromBricks за архітектурою монорепозиторію. Використання безголової Payload CMS 3.x у поєднанні з хмарною СУБД Neon PostgreSQL дозволило створити зручний блоковий конструктор Page Builder для гнучкого керування структурою лендінгу, текстовими описами та параметрами інтерактивної 3D-вітрини через автоматично згенеровану адмін-панель. Клієнтська вітрина на чистому Vanilla TypeScript під збіркою Vite відзначається високою швидкістю завантаження, повною адаптивністю, вражаючою інтерактивною 3D-вітриною Three.js та надійною обробкою життєвого циклу станів інтерфейсу (Loading, Ready, Empty, Error). Застосування комплексної системи типів TypeScript усунуло ризики помилок несумісності даних, а успішне розгортання проєкту на платформі Vercel підтвердило надійність та практичну цінність розробленого рішення.")

def run_update():
    base_file = "ЗВІТ_3_оригінал_до_правок.docx" if os.path.exists("ЗВІТ_3_оригінал_до_правок.docx") else "ЗВІТ_3.docx"
    output_file = "ЗВІТ_3_ФІНАЛ_ЛЕНДІНГ.docx"

    print(f"Loading base document {base_file}...")
    doc = docx.Document(base_file)
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
    generate_clean_landing_section_2(temp_doc)

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

    print(f"Saving clean landing section to {output_file}...")
    doc.save(output_file)
    print(f"Successfully saved {output_file}!")

    # Also try to save to ЗВІТ_3.docx if not locked
    try:
        doc.save("ЗВІТ_3.docx")
        print("Successfully updated ЗВІТ_3.docx as well!")
    except Exception as e:
        print(f"Note: ЗВІТ_3.docx could not be written directly: {e}")

if __name__ == "__main__":
    run_update()
