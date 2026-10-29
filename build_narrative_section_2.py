# -*- coding: utf-8 -*-
"""
Generate a student-friendly, well-explained narrative version of Section 2.
Includes general explanations, gentle transitions ('вода' / пояснення простими словами),
maintains the landing page focus, keeps lists instead of excessive tables,
and uses proper academic formatting (Times New Roman 14, 1.5 spacing, indents).
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

def build_narrative_section_2(doc):
    # =========================================================================
    # РОЗДІЛ 2
    # =========================================================================
    add_heading_1(doc, "РОЗДІЛ 2. РОЗРОБКА FULLSTACK-ЗАСТОСУНКУ НА PAYLOAD CMS ТА TYPESCRIPT (ГУСАРОВ, ЮРЧИШИН)")

    # -------------------------------------------------------------------------
    # 2.1. Архітектура та Payload CMS
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.1. Архітектура та Payload CMS: монорепозиторій, конфігурація Payload (колекції, типи блоків, медіа), хмарна БД та кастомні API-ендпоінти.")

    add_paragraph(doc, "У сучасній веб-розробці успіх комерційного проєкту залежить не лише від наявності великої бази товарів, а й від того, наскільки якісно та привабливо бренд презентує себе в мережі інтернет. Для інтернет-магазину GromBricks, що спеціалізується на колекційних фігурках і деталях LEGO, виникла потреба створити сучасний інтерактивний лендінг (Landing Page). Головна мета такої презентаційної сторінки — справити сильне перше враження на потенційного клієнта, наочно продемонструвати унікальні експонати, розповісти про переваги магазину та спонукати до швидкої покупки.")

    add_paragraph(doc, "Під час розробки було застосовано розділений (decoupled або headless) архітектурний підхід. У класичних веб-сайтах панель керування та зовнішній вигляд сторінок часто тісно переплетені в єдиний моноліт. Це створює труднощі: щоб змінити звичайний банер або текст на сторінці, доводиться переписувати код самого сайту. У нашому проєкті функції чітко розділені на дві незалежні частини: серверна частина на базі Payload CMS бере на себе керування даними та надає зручну панель адміністрування, а клієнтська частина є швидкою автономною вітриною-лендінгом. Зв'язок між ними відбувається через мережеві запити (API). Завдяки цьому контент-менеджер може у будь-який момент змінити заголовок, поміняти місцями блоки чи додати нову фігурку в панелі керування, і ці зміни миттєво з'являться на лендінгу без перезавантаження чи втручання програмістів.")

    add_paragraph(doc, "Для зручності командної роботи над проєктом було обрано структуру монорепозиторію. Це підхід, за якого весь вихідний код — як серверний, так і клієнтський — зберігається в одному спільному каталозі під єдиним контролем версій Git. За допомогою механізму npm workspaces у кореневому файлі package.json визначено дві робочі зони: папку cms (сервер) та папку frontend (клієнт). Це дозволяє програмістові запускати весь проєкт за допомогою єдиних зрозумілих команд із терміналу (npm run dev:cms, npm run dev:frontend) та синхронно оновлювати спільні типи даних.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.1: Конфігурація монорепозиторію та робочих просторів package.json]")

    add_paragraph(doc, "Важливим кроком стало правильне обрання бази даних для збереження інформації. Зазвичай у навчальних проєктах використовують локальні файлові бази, наприклад SQLite. Проте наш проєкт створювався з розрахунком на розгортання на сучасному безкоштовному хмарному хостингу Vercel. Особливістю цього хостингу є так звана ефемерна (тимчасова) файлова система: щоразу, коли сервер засинає чи оновлюється, всі локальні файли безповоротно зникають. Якби ми залишили локальну базу даних, усі створені товари та замовлення покупців стиралися б при кожному перезапуску. Щоб гарантувати надійне збереження контенту, сервер підключено до зовнішньої хмарної бази даних Neon PostgreSQL. Вона працює цілодобово в захищеній хмарі, здійснює автоматичне шифрування з'єднань (SSL) та гарантує цілісність усіх записів.")

    add_paragraph(doc, "Головний файл конфігурації сервера cms/src/payload.config.ts налаштовує роботу всієї системи керування контентом. У ньому підключається зручний візуальний редактор текстів Lexical, вказується посилання на хмарну базу Neon, реєструється автентифікація користувачів адмінки та вмикається графічна бібліотека Sharp. Робота бібліотеки Sharp є вкрай важливою для швидкодії сайту: коли менеджер завантажує важку фотографію фігурки LEGO, Sharp автоматично оптимізує її, зменшує розмір та створює кілька копій (маленьку мініатюру для списку та великий банер для головного екрана). Це забезпечує швидке відкриття сторінки навіть на смартфонах із повільним інтернетом. Також у конфігурації дозволено крос-доменні запити (CORS), щоб вітрина лендінгу могла вільно запитувати дані із сервера.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.2: Конфігурація Payload CMS та підключення хмарної бази даних (payload.config.ts)]")

    add_paragraph(doc, "Уся інформація в системі розділена на логічні розділи — колекції (Collections) та глобальні налаштування (Globals):")
    add_bullet(doc, "Products (Товари) — містить каталог мініфігурок і деталей LEGO із зазначенням назви, унікального артикула (SKU), ціни у гривнях, стану (новий чи колекційний вживаний), наявного залишку на складі, фотографії та спеціальної позначки рідкісності (isRare);")
    add_bullet(doc, "Categories (Категорії) — тематичний рубрикатор, що дозволяє групувати асортимент за всесвітами (Star Wars, Marvel, Ninjago, Classic Space, окремі деталі);")
    add_bullet(doc, "Orders (Замовлення) — фіксує покупки, здійснені відвідувачами лендінгу, зберігає номер замовлення (формату GB-2026-XXXX), ПІБ клієнта, телефон, адресу та обрану службу доставки (Нова Пошта, Укрпошта чи Meest);")
    add_bullet(doc, "Pages (Сторінки) — забезпечує роботу візуального конструктора сторінок, де кожен документ складається з динамічного набору блоків;")
    add_bullet(doc, "Media (Зображення) — сховище завантажених файлів з автоматичним стисненням та генерацією розмірів;")
    add_bullet(doc, "Users (Користувачі) — захищені облікові записи адміністраторів і редакторів магазину;")
    add_bullet(doc, "Globals (HeaderSettings, FooterSettings) — наскрізні параметри сайту, такі як телефон гарячої лінії, посилання на офіційний Telegram-канал магазину та текст авторських прав.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.3: Схема колекції Products та визначення полів (Products.ts)]")

    add_paragraph(doc, "Для наповнення нашого презентаційного лендінгу було створено модульний конструктор (Page Builder у папці cms/src/blocks/). Працюючи в ньому, адміністратор сайту може збирати структуру лендінгу подібно до конструктора LEGO з окремих готових кубиків-блоків:")
    add_bullet(doc, "HeroBlock — головний привітальний екран із яскравим зображенням, гаслом бренду, бейджем «100% Оригінал LEGO®» та кнопками переходу до покупок;")
    add_bullet(doc, "FeaturesBlock — блок переваг, що розповідає відвідувачу про дбайливе пакування, оригінальність деталей та швидку відправку;")
    add_bullet(doc, "ProductGridBlock — вітрина товарів, де можна обрати показ новинок або ексклюзивних рідкісних екземплярів;")
    add_bullet(doc, "BannerBlock — акційний банер зі знижками на обрані серії;")
    add_bullet(doc, "CallToActionBlock — блок мотивації приєднатися до Telegram-каналу для пошуку рідкісних фігурок під індивідуальне замовлення.")

    add_paragraph(doc, "За замовчуванням система Payload CMS повертає дуже складну та надмірно детальну технічну інформацію через стандартний API. Щоб не перевантажувати мережу та зробити передачу даних максимально швидкою і простою для клієнтської вітрини, на бекенді було написано власні кастомні точки входу (API-ендпоінти). Вони беруть дані з бази, очищують їх від зайвих службових полів і віддають на лендінг у компактному, готовому до відображення форматі:")

    add_table_title(doc, "Таблиця 2.1 - Кастомні API-ендпоінти сервера GromBricks")
    add_table(doc,
              ["HTTP-метод та URL", "Модуль обробника", "Призначення для лендінгу", "Формат відповіді"],
              [
                  ["GET /api/common", "commonEndpoint.ts", "Завантаження контактів, телефонів та посилань шапки й підвалу.", "{ success: true, data: { header, footer } }"],
                  ["GET /api/page?path=/", "pageEndpoint.ts", "Отримання структури блоків лендінгу з інтегрованими товарами.", "{ success: true, data: { title, blocks[] } }"],
                  ["GET /api/products/search", "searchEndpoint.ts", "Пошук та фільтрація деталей і фігурок за назвою, серією та рідкісністю.", "{ success: true, data: Product[] }"],
                  ["POST /api/cart/validate", "cartEndpoints.ts", "Перевірка складських залишків та актуальності цін перед оформленням.", "{ success: true, data: CartValidationResult }"],
                  ["POST /api/orders/checkout", "orderEndpoints.ts", "Швидке оформлення замовлення, створення запису в БД та списання залишку stock.", "{ success: true, data: { orderId, orderNumber } }"],
                  ["POST /api/seed", "seedEndpoint.ts", "Початкове автоматичне наповнення бази категоріями, товарами та блоками.", "{ success: true, message }"]
              ],
              col_widths=[1.8, 1.4, 2.3, 1.5])

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.4: Транзакційне оформлення замовлення у файлі orderEndpoints.ts]")

    # -------------------------------------------------------------------------
    # 2.2. Клієнтська частина та стани UI
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.2. Клієнтська частина та стани UI: асинхронні запити до API, шаблонізація блоків, адаптивна верстка, обробка станів (завантаження / помилка / готовність).")

    add_paragraph(doc, "Клієнтська частина проєкту є обличчям нашого магазину. Оскільки перед нами стояло завдання створити презентаційний лендінг, головною вимогою до нього була абсолютна швидкість та плавність роботи. Сучасні відвідувачі не люблять чекати завантаження сторінки, тому було прийнято свідоме рішення відмовитися від важких фреймворків на зразок React або Angular. Лендінг розроблено на чистому TypeScript, стандартній розмітці HTML5 та модульних стилях CSS3 під керуванням сучасного інструменту швидкої збірки Vite. Завдяки цьому сайт важить лічені кілобайти, миттєво відкривається у будь-якому браузері та не перевантажує процесор пристрою.")

    add_paragraph(doc, "Основною точкою входу є головна сторінка index.html. Вона спроєктована таким чином, щоб провести користувача зрозумілим та цікавим шляхом:")
    add_bullet(doc, "перший екран (Hero) захоплює увагу яскравою презентацією колекційних новинок;")
    add_bullet(doc, "блок переваг пояснює, чому покупці можуть довіряти магазину GromBricks (гарантія оригінальності LEGO, захисне пакування для колекціонерів, швидка відправка);")
    add_bullet(doc, "інтерактивна 3D-експозиція дозволяє покрутити моделі мініфігурок у реальному часі;")
    add_bullet(doc, "картки тематичних напрямків знайомлять з асортиментом всесвітів Star Wars, Marvel, Ninjago та окремих деталей;")
    add_bullet(doc, "форма швидкого модального замовлення дозволяє придбати обраний екземпляр прямо на лендінгу за кілька секунд, вказавши лише ім'я, телефон та місто доставки;")
    add_bullet(doc, "додаткові сторінки (каталог catalog.html, кошик cart.html та оформлення checkout.html) дозволяють за потреби детально вивчити весь каталог магазину.")

    add_paragraph(doc, "Взаємодія лендінгу із сервером відбувається асинхронно у фоновому режимі (модуль frontend/src/api.ts). Коли людина відкриває сайт, сторінка не зависає в очікуванні відповіді. За допомогою нативної функції fetch браузер надсилає запит до CMS і, отримавши відповідь, оновлює вміст екрана. Усі запити захищені конструкціями try...catch. Це означає, що навіть якщо інтернет тимчасово зникне або сервер буде перезавантажуватися, сайт не покаже «білий екран смерті». Спрацює механізм аварійних резервних даних (fallback), і відвідувач все одно зможе побачити контакти, основні банери та інформацію про магазин.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.5: Асинхронні запити до API та механізм fallback-даних (api.ts)]")

    add_paragraph(doc, "Шаблонізація контенту побудована за модульним принципом у файлі renderBlocks.ts. Коли сервер надсилає список блоків сторінки, спеціальна функція розпізнає тип кожного блоку (blockType) та генерує відповідну красиву розмітку. Це схоже на роботу автоматичної виробничої лінії: якщо прийшов блок переваг — малюються картки з іконками щита та вантажівки; якщо блок заклику до дії — верстається помітна кнопка зв'язку з Telegram-каналом.")

    add_paragraph(doc, "Особливою гордістю нашого лендінгу є вбудована 3D-вітрина мініфігурок, створена на базі бібліотеки Three.js (модуль modelViewer.ts). Колекціонери LEGO дуже прискіпливо ставляться до стану фігурок, тому можливість покрутити тривимірну модель героя на екрані за допомогою мишки або пальця на смартфоні, роздивитися принти з усіх боків та змінити персонажа (наприклад, перемкнутися між героями Cole, Kai та Golden Ninja) робить лендінг по-справжньому сучасним та захоплюючим.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.6: Реалізація шаблонізатора сторінки в renderBlocks.ts]")

    add_paragraph(doc, "Зовнішній вигляд лендінгу оформили у фірмовому преміальному стилі (файл style.css). Поєднання глибокого темного фону космосу (#05070d) із золотими акцентами LEGO (#e6bf55) підкреслює рідкісність та ексклюзивність представлених колекцій. Верстка є повністю адаптивною завдяки використанню сучасної сітки CSS Grid та медіа-запитів. На великих екранах комп'ютерів контент розміщується у кілька колонок, а на екранах смартфонів сайт автоматично перебудовується у зручну вертикальну стрічку: з'являється компактне меню-шторка (бургер), кнопки стають більшими для легкого натискання пальцем, а 3D-модель підлаштовує розмір під екран телефону.")

    add_paragraph(doc, "Щоб інтерфейс сайту був «живим» і зрозумілим, у ньому реалізовано обробку чотирьох життєвих станів користувацького інтерфейсу (UI States):")
    add_bullet(doc, "Стан завантаження (Loading) — поки дані летять із сервера, відвідувач бачить акуратну анімацію обертання кубика LEGO (.lego-spinner) із підписом «Завантаження GromBricks...». Завдяки цьому людина розуміє, що процес іде, і не клікає хаотично по екрану;")
    add_bullet(doc, "Стан успішної готовності (Success) — як тільки дані отримано, на екрані плавно з'являються красиві блоки або картки товарів, до яких миттєво підключаються кнопки замовлення;")
    add_bullet(doc, "Стан порожнього результату (Empty) — якщо користувач ввів у пошук назву деталі, якої немає в наявності, сайт не залишає порожнє місце, а виводить дружнє повідомлення з пропозицією скинути фільтри або переглянути інші цікаві пропозиції;")
    add_bullet(doc, "Стан виникнення помилки (Error) — у разі збою в мережі з'являється зрозуміле повідомлення українською мовою з поясненням, що пішло не так, а кнопки замовлення тимчасово блокуються, щоб клієнт випадково не створив дублікат заявки.")

    # -------------------------------------------------------------------------
    # 2.3. Типізація на TypeScript
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.3. Типізація на TypeScript: створення типів для структури сторінки та її блоків, використання Type Aliases, Union Types та Intersection Types для опису різних типів даних, типізація функцій і об'єктів, типізація даних, отриманих через API.")

    add_paragraph(doc, "У класичній мові JavaScript часто виникає ситуація, коли через випадкову оддруківку у назві властивості (наприклад, написавши `prce` замість `price`) сайт перестає працювати або показує покупцеві порожнє вікно замість вартості товару. При цьому інтерпретатор JavaScript не попереджає про помилку заздалегідь — вона виявляється вже безпосередньо у відвідувача сайту. Саме для того, щоб повністю усунути такі неприємні ситуації, у нашому Fullstack-проєкті застосовано мову TypeScript.")

    add_paragraph(doc, "TypeScript додає до стандартного JavaScript строгий контроль типів даних. Можна провести аналогію: якщо JavaScript дозволяє складати докупи будь-які деталі, навіть якщо вони не підходять, то TypeScript працює як суворий контролер, який на етапі написання коду перевіряє сумісність кожного елемента. Усі правила та структури даних нашого магазину описано у файлах cms/src/types/shop.ts та frontend/src/types.ts.")

    add_paragraph(doc, "Насамперед було створено псевдоніми типів (Type Aliases). Це дозволяє замінити ненадійні довільні рядки зрозумілими фіксованими значеннями:")
    add_bullet(doc, "ID = string | number — узагальнений ідентифікатор запису, що може бути рядком або числом;")
    add_bullet(doc, "ProductType = 'minifigure' | 'part' — товар може бути виключно цілою фігуркою або окремою деталлю;")
    add_bullet(doc, "ProductCondition = 'new' | 'used' — стан товару фіксується як новий або колекційний вживаний;")
    add_bullet(doc, "OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' — строго зафіксований перелік етапів обробки замовлення від надходження до вручення покупцеві;")
    add_bullet(doc, "DeliveryService = 'nova_poshta' | 'ukrposhta' | 'meest' — дозволений перелік поштових операторів;")
    add_bullet(doc, "PaymentMethod, LegoSeries, Currency, SortOption — правила вибору способу оплати, тематичної серії та валюти розрахунку.")

    add_paragraph(doc, "Для опису блоків нашого лендінгу та станів екрана використано типи об'єднання (Union Types) та техніку дискримінованих об'єднань (Discriminated Unions). Їхня суть у тому, що об'єкт може набувати однієї з кількох чітко визначених форм:")
    add_bullet(doc, "PageBlockData — дискриміноване об'єднання блоків нашого лендінгу (HeroBlockData | FeaturesBlockData | ModelViewerBlockData | CategoryCardsBlockData | CtaBlockData | ProductGridBlockData). Кожен блок має обов'язкову спільну мітку blockType. Завдяки цьому компілятор чітко знає, які саме поля доступні для редагування у кожному блоці, і під час виклику оператора switch автоматично підказує розробникові потрібні властивості;")
    add_bullet(doc, "UIState<T> — типізація стану інтерфейсу ({ status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'empty' } | { status: 'error'; error: string }), що унеможливлює спробу прочитати дані, коли вони ще не завантажилися;")
    add_bullet(doc, "ApiResponse<T> — строгий контракт відповіді сервера, який гарантує, що при успіху повертаються дані, а при збої — зрозумілий текст помилки.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.7: Система типів: Discriminated Unions та стани UI (cms/src/types/shop.ts)]")

    add_paragraph(doc, "Для створення похідних сутностей без зайвого дублювання коду застосовано типи перетину (Intersection Types, оператор &):")
    add_bullet(doc, "ProductWithCategory = Product & { categoryDetails: Category } — бере опис товару та додає до нього розгорнуту інформацію про категорію, до якої він належить;")
    add_bullet(doc, "CartItem = { productId: ID; quantity: number } & Pick<Product, 'name' | 'slug' | 'sku' | 'price' | 'imageUrl' | 'stock'> — формує компактний знімок товару в кошику, беручи тільки найважливіші поля;")
    add_bullet(doc, "CartItemWithDetails = CartItem & { product: Product; subtotal: number; isAvailable: boolean } — додає до товару в кошику проміжну розраховану вартість;")
    add_bullet(doc, "EnrichedOrder = Order & { formattedDate: string; itemsCount: number } — розширює замовлення відформатованою датою для зручного перегляду.")

    add_paragraph(doc, "У сервісному модулі cms/src/lib/shopUtils.ts було строго типізовано всі допоміжні функції інтернет-магазину:")
    add_bullet(doc, "validateCart — функція перевірки вмісту кошика перед покупкою. Вона порівнює, скільки штук фігурок хоче купити користувач, із тим, скільки їх фактично залишилося на складі у базі даних, і формує зрозумілий звіт про наявність;")
    add_bullet(doc, "calculateOrderPricing — функція калькулятора, що підраховує загальну суму та автоматично робить доставку безкоштовною, якщо клієнт зробив замовлення на суму понад 1500 грн;")
    add_bullet(doc, "filterProducts — функція розумного пошуку, яка відбирає товари за текстом, серією, станом та діапазоном цін.")

    add_placeholder(doc, "[ВСТАВИТИ ЗОБРАЖЕННЯ ЛІСТИНГУ 2.8: Типізовані сервісні функції магазину (cms/src/lib/shopUtils.ts)]")

    add_paragraph(doc, "Нарешті, типізація забезпечує повне взаєморозуміння між сервером і клієнтом. Команда генерації типів Payload CMS автоматично перетворює структуру бази даних у файл payload-types.ts, а для оформлення замовлення використовуються чіткі контракти CheckoutApiRequest та CheckoutApiResponseData. Це гарантує, що клієнтська частина передає саме ті дані, які очікує отримати сервер.")

    # -------------------------------------------------------------------------
    # 2.4. Деплой та контрольний приклад
    # -------------------------------------------------------------------------
    add_heading_2(doc, "2.4. Деплой та контрольний приклад: розгортання проєкту, оформлення репозиторію (README.md), контрольний приклад із скріншотами (редактор в CMS, відвідувач на сайті, обробка помилок).")

    add_paragraph(doc, "Завершальним етапом роботи над Fullstack-застосунком стало його практичне розгортання (деплой) у мережі інтернет та всебічна перевірка працездатності за допомогою контрольного прикладу. Сучасна програма вважається завершеною лише тоді, коли вона опублікована на надійному сервері та доступна користувачам цілодобово.")

    add_paragraph(doc, "Для хмарного розміщення було обрано зв'язку сервісів Vercel та Neon:")
    add_bullet(doc, "хмарна база даних Neon PostgreSQL 16 забезпечує постійне зберігання інформації із захищеним шифруванням з'єднання (sslmode=require);")
    add_bullet(doc, "хостинг Vercel автоматично бере вихідний код із нашого репозиторію GitHub і створює два пов'язаних веб-сервіси: перший (grombricks-cms) відповідає за роботу сервера Next.js та панелі адміністрування, а другий (grombricks-front) публікує наш статичний промо-лендінг;")
    add_bullet(doc, "змінні середовища (DATABASE_URL, PAYLOAD_SECRET, VITE_API_BASE) зв'язують обидві частини системи між собою, усуваючи проблему тимчасової файлової системи та забезпечуючи стабільну роботу.")

    add_paragraph(doc, "У корені проєкту було створено вичерпну технічну документацію у файлі README.md. Вона складена таким чином, щоб будь-який інший розробник міг завантажити репозиторій, прочитати покрокову інструкцію, встановити необхідні програми та успішно запустити лендінг і CMS на своєму робочому місці за допомогою стандартних команд npm install та npm run dev.")

    add_paragraph(doc, "Для підтвердження повної готовності розробленого Fullstack-лендінгу було проведено детальне тестування трьох практичних сценаріїв контрольного прикладу:")

    add_subheading(doc, "Сценарій 1. Робота адміністратора та редактора контенту в системі Payload CMS")
    add_paragraph(doc, "1. Адміністратор переходить за адресою /admin, вводить логін та пароль і потрапляє у головне меню панелі керування. Тут відображаються доступні колекції: товари, категорії, замовлення, сторінки та користувачі.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.2: Панель керування Payload CMS: список товарів колекції Products]")

    add_paragraph(doc, "2. У колекції Products відкривається картка фігурки «Дарт Вейдер». Адміністратор вмикає позначку рідкісності isRare=true та збільшує кількість на складі з 5 до 10 одиниць. Зміни негайно фіксуються у хмарній базі Neon.")
    add_paragraph(doc, "3. У розділі Pages відкривається головна сторінка лендінгу «home». За допомогою візуального конструктора блоків редактор змінює текст заголовка Hero-банера на «Ексклюзивні мініфігурки LEGO 2026», переміщує блок переваг вище та зберігає оновлення.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.3: Візуальний конструктор блоків сторінки (Page Builder) у CMS]")

    add_paragraph(doc, "4. У глобальних налаштуваннях HeaderSettings оновлюються контакти підтримки, а у списку замовлень Orders нове замовлення клієнта переводиться зі статусу «нове» (pending) у статус «комплектується» (processing).")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.4: Детальний перегляд замовлення та зміна статусу в колекції Orders]")

    add_subheading(doc, "Сценарій 2. Сценарій взаємодії відвідувача з інтерактивним лендінгом")
    add_paragraph(doc, "1. Відвідувач відкриває головну сторінку index.html. Браузер плавно підвантажує блоки сторінки та ініціалізує 3D-вітрину Three.js. Користувач мишкою або пальцем обертає деталізовану 3D-модель ніндзя Cole, розглядаючи елементи костюма.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.5: Головна сторінка магазину GromBricks з інтерактивною 3D-вітриною]")

    add_paragraph(doc, "2. Відвідувач знайомиться з перевагами магазину, переглядає тематичні напрямки та переходить до каталогу. У пошуковому рядку вводить слово «Rex» і позначає галочку «Рідкісні ексклюзиви». Лендінг миттєво знаходить колекційну мініфігурку капітана Рекса за ціною 1450 грн.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.6: Каталог товарів із живим пошуком та фільтрацією за параметрами]")

    add_paragraph(doc, "3. Натиснувши кнопку «В кошик», покупець бачить оновлення лічильника в шапці з 0 на 1. Відкривши спливаючий кошик, він збільшує кількість до 2 штук, при цьому сума автоматично перераховується до 2900 грн.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.7: Сторінка кошика покупця з розрахунком вартості]")

    add_paragraph(doc, "4. У формі швидкого оформлення замовлення клієнт заповнює своє ім'я («Олександр Мельник»), номер телефону та обирає доставку Новою Поштою до міста Львів. Після натискання кнопки «Підтвердити замовлення» сервер перевіряє залишок, списує 2 одиниці зі складу та генерує номер замовлення GB-2026-4819. Кошик очищується, а клієнт бачить повідомлення з подякою.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.8: Підтвердження успішно створеного замовлення]")

    add_subheading(doc, "Сценарій 3. Обробка граничних станів та помилок (Error Handling)")
    add_paragraph(doc, "1. При повільному інтернет-з'єднанні на сторінці акуратно крутиться фірмовий спінер у вигляді кубика LEGO (.lego-spinner), показуючи, що сторінка завантажується.")
    add_paragraph(doc, "2. Якщо покупець увів пошуковий запит за неіснуючим артикулом, замість порожнього місця з'являється інформативне повідомлення «Нічого не знайдено» з порадою перевірити правильність написання.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.9: Стан інтерфейсу при відсутності результатів пошуку в каталозі]")

    add_paragraph(doc, "3. Якщо покупець спробує замовити 100 одиниць рідкісного шолома Мандалорця, коли на складі є лише 10, сервер надійно заблокує операцію і поверне помилку. На екрані з'явиться червоне попередження про недостатній залишок, що захищає магазин від перепродажу.")
    add_placeholder(doc, "[ВСТАВИТИ РИСУНОК 2.10: Повідомлення про помилку валідації залишків на складі при оформленні]")

    add_paragraph(doc, "4. Якщо сервер CMS тимчасово вимкнено або зник зв'язок, модуль api.ts автоматично підставляє резервні дані (fallback). Завдяки цьому відвідувач все одно бачить гарний лендінг, контакти та може зв'язатися з магазином через Telegram.")

    # -------------------------------------------------------------------------
    # Висновок до розділу 2
    # -------------------------------------------------------------------------
    add_subheading(doc, "Висновок до розділу 2")
    add_paragraph(doc, "У другому розділі звіту було успішно спроєктовано та створено сучасний презентаційний Fullstack-лендінг інтернет-магазину GromBricks на основі монорепозиторію, безголової системи Payload CMS 3.x, хмарної бази даних Neon PostgreSQL та клієнтської вітрини на чистому TypeScript і збирачі Vite.")

    add_paragraph(doc, "Застосування розділеної архітектури дозволило поєднати зручність адміністрування контенту через візуальний блоковий конструктор Page Builder та максимальну швидкість відкриття сторінок для покупців. Інтеграція хмарної бази даних Neon повністю вирішила проблему збереження інформації у безсерверному середовищі Vercel, а кастомні API-ендпоінти забезпечили швидкий та легкий обмін даними. Використання чистого TypeScript без важких сторонніх бібліотек дозволило створити легку, адаптивну вітрину з вражаючою інтерактивною 3D-моделлю Three.js, зручним модальним оформленням замовлень та надійним контролем помилок. Результати тестування контрольного прикладу підтвердили стабільність, зручність та повну відповідність розробленого лендінгу всім поставленим вимогам навчальної практики.")

if __name__ == '__main__':
    src_user_upload = r'C:\Users\vitai\.gemini\antigravity\brain\85df3c14-278b-43f5-ae1e-2ffdec46da01\.user_uploaded\media_1793085605805_620abf0d.docx'
    dst_root = r'd:\PracticeReport_3_TS\Звіт_з_практики_Розділ_1_і_2.docx'
    dst_docs = r'd:\PracticeReport_3_TS\docs\Звіт_з_практики_Розділ_1_і_2.docx'
    dst_landing = r'd:\PracticeReport_3_TS\Звіт_з_практики_Розділ_1_і_2_landing.docx'

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

    # Build the narrative Section 2
    build_narrative_section_2(doc)
    print(f"Total paragraphs now: {len(doc.paragraphs)}")
    print(f"Total tables now: {len(doc.tables)}")

    # Save to docs folder
    os.makedirs(os.path.dirname(dst_docs), exist_ok=True)
    doc.save(dst_docs)
    print(f"Saved successfully to: {dst_docs}")

    # Save to root files with fallback
    try:
        doc.save(dst_root)
        print(f"Saved successfully to: {dst_root}")
    except PermissionError:
        print(f"File {dst_root} is locked by Word.")

    try:
        doc.save(dst_landing)
        print(f"Saved successfully to: {dst_landing}")
    except PermissionError:
        print(f"File {dst_landing} is locked by Word.")

    # Sync back to uploaded file
    try:
        doc.save(src_user_upload)
        print(f"Synced back to user upload path: {src_user_upload}")
    except Exception as e:
        print(f"Could not sync to user upload: {e}")

    print("Narrative-rich Section 2 generated successfully!")
