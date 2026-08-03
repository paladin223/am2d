# AM2D

![Интерьер проекта AM2D](image.png)

### Ссылка на "зеркало" сайта: [devspot.tech/am2d](https://devspot.tech/am2d/)

Сайт архитектурной студии AM2D с портфолио, формой заявки и уведомлениями
в Telegram. Приложение работает на FastAPI, страницы формируются через
Jinja2, а заявки сохраняются в PostgreSQL.

Telegram: [@am2design](https://t.me/am2design)

## Состав проекта

- `web` — сайт и API на FastAPI (`main.py`);
- `bot` — Telegram-бот и внутренний endpoint для уведомлений (`bot.py`);
- `db` — PostgreSQL с постоянным Docker volume;
- `nginx` — раздача статики, HTTPS и проксирование запросов в `web`;
- `certbot` — получение и продление сертификата Let's Encrypt.

## Требования

- Docker;
- Docker Compose;
- домен, направленный на сервер, и открытые порты `80` и `443`;
- Telegram Bot Token, полученный через [BotFather](https://t.me/BotFather).

## Настройка окружения

Скопируйте пример окружения и при необходимости отредактируйте значения:

```bash
cp .env.example .env
```

Пример содержимого `.env`:

```dotenv
DB_HOST=db
DB_PORT=5432
POSTGRES_USER=am2d
POSTGRES_PASSWORD=change_me
POSTGRES_DB=am2d
DATABASE_URL=postgresql+psycopg://am2d:change_me@db:5432/am2d

TELEGRAM_BOT_TOKEN=your_token
DOMAIN_URL=am2design.ru
DOMAIN_EMAIL=admin@example.com
```

Без заполненного `.env` PostgreSQL не запустится: нужен непустой
`POSTGRES_PASSWORD`. Файл `.env` содержит секреты и уже исключён из Git.

## Локальный запуск

Для разработки достаточно PostgreSQL, сайта и (по желанию) бота.
Nginx и Certbot локально не нужны: сайт будет доступен на `http://localhost:8000`.

1. Создайте `.env` как выше. Значения `DB_HOST=db` и `DATABASE_URL=...@db:5432/...`
   подходят для Docker Compose.
2. Запустите сервисы:

```bash
docker compose up -d --build db web bot
```

3. Откройте сайт: [http://localhost:8000/about](http://localhost:8000/about)

Полезные команды:

```bash
docker compose ps
docker compose logs -f web bot db
docker compose restart web
docker compose down
```

При запуске `web` и `bot` ждут успешного healthcheck PostgreSQL. Это важно:
обычный `depends_on` гарантирует только порядок запуска контейнеров, а
`condition: service_healthy` — готовность PostgreSQL принимать подключения.

Без Docker (если PostgreSQL уже запущен локально):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements/prod.txt
# в .env укажите DB_HOST=localhost
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Для бота отдельно:

```bash
pip install -r requirements/bot.txt
python bot.py
# и в другом терминале:
uvicorn bot:app2 --host 0.0.0.0 --port 8001 --reload
```

## Продакшен-запуск

Полный стек с Nginx и HTTPS:

```bash
docker compose up -d --build
```

Перезапустить весь проект или отдельный сервис:

```bash
docker compose restart
docker compose restart web
```

### Сохранность базы данных

Данные PostgreSQL хранятся в именованном volume `postgres_data`, поэтому
команды `restart`, `stop`, `down` и повторная сборка образов базу не
перезаписывают. При старте приложение вызывает `create_all(checkfirst=True)`:
оно создаёт отсутствующие таблицы, но не удаляет существующие данные.

Не выполняйте следующую команду, если хотите сохранить базу:

```bash
docker compose down -v
```

Флаг `-v` удаляет именованные volumes, включая данные PostgreSQL. Для
продакшена также рекомендуется регулярно создавать резервные копии через
`pg_dump`.

## HTTPS и Certbot

Nginx отдаёт ACME-проверку из `certbot/www`, а сертификаты хранятся в
`certbot/conf`. Проверить продление без изменения действующего сертификата:

```bash
docker compose run --rm certbot renew --dry-run
```

Продлить сертификат и перечитать его в Nginx:

```bash
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```

Certbot обновляет сертификат только тогда, когда срок его действия подходит
к концу. Перезапускать контейнер Certbot постоянно не требуется.

### Автоматическое продление через cron

Cron — системный планировщик Linux: он запускает указанную команду по
расписанию. Откройте crontab пользователя, который управляет Docker:

```bash
crontab -e
```

Добавьте задачу (замените `/path/to/am2d` на путь к проекту):

```cron
17 3 * * * cd /path/to/am2d && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload
```

Она ежедневно запускается в `03:17`. Если сертификат ещё не нужно обновлять,
Certbot завершится без изменений; Nginx безопасно перечитает текущий
сертификат. Дополнительные `.sh`-файлы для этого не нужны.

## Полезные адреса

- `https://am2design.ru/` — главная страница;
- `/prices` — услуги и цены;
- `/about` — информация о студии;
- `/contacts` — контакты;
- `/projects/{name}` — страница проекта;
- `POST /submit` — сохранение заявки и отправка уведомления в Telegram.

## Структура

```text
.
├── main.py                 # FastAPI-приложение
├── bot.py                  # Telegram-бот
├── database.py             # подключение и инициализация PostgreSQL
├── models.py               # SQLAlchemy-модели
├── crud.py                 # операции с заявками
├── pages/                  # Jinja2-шаблоны
├── static/                 # CSS, JavaScript и изображения
├── nginx/nginx.conf        # конфигурация reverse proxy и HTTPS
├── certbot/                # ACME-файлы и сертификаты
├── Dockerfile
├── Dockerfile.bot
└── docker-compose.yaml
```