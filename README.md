# AM2D

Сайт архитектурной студии AM2D с портфолио, формой заявки и уведомлениями
в Telegram. Приложение работает на FastAPI, страницы формируются через
Jinja2, а заявки сохраняются в PostgreSQL.

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

Создайте в корне проекта файл `.env`:

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

Файл `.env` содержит секреты и уже исключён из Git. Для пароля базы данных
используйте отдельное стойкое значение.

## Запуск

Соберите образы и запустите сервисы:

```bash
docker compose up -d --build
```

Проверить состояние и посмотреть журналы:

```bash
docker compose ps
docker compose logs -f web bot nginx db
```

При запуске `web` и `bot` ждут успешного healthcheck PostgreSQL. Это важно:
обычный `depends_on` гарантирует только порядок запуска контейнеров, а
`condition: service_healthy` — готовность PostgreSQL принимать подключения.

Остановить проект:

```bash
docker compose down
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