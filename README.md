# АСТ-Карьерные решения

Корпоративный B2B-сайт официального дилера Henan Liming Heavy Industry. Проект подготовлен для автоматического деплоя в GitHub Pages из репозитория `ast-site`.

## Публикация

1. Создайте на GitHub репозиторий с именем `ast-site`.
2. Загрузите все файлы проекта в ветку `main`, включая скрытую папку `.github`.
3. Откройте `Settings → Pages` в репозитории.
4. В поле `Source` выберите `GitHub Actions`.
5. Откройте вкладку `Actions` и дождитесь завершения workflow `Deploy ast-site to GitHub Pages`.

После успешного деплоя сайт будет доступен по адресу:

```text
https://ИМЯ-ПОЛЬЗОВАТЕЛЯ.github.io/ast-site/
```

Каждый последующий push в `main` автоматически пересобирает и публикует сайт.

## Локальный запуск

Требуется Node.js 20 или новее.

```bash
npm ci
npm run dev
```

Производственная проверка:

```bash
npm run build
npm run preview
```

## Структура

- `src/App.tsx` — маршрутизация приложения.
- `src/pages` — страницы сайта.
- `src/components` — UI и интерактивные модули.
- `src/data` — каталог оборудования и запчастей.
- `src/assets` — локальные медиа и резервные изображения.
- `.github/workflows/deploy-pages.yml` — автоматическая публикация GitHub Pages.

Сайт использует hash-маршруты (`#/catalog`, `#/parts`), поэтому работает в подпапке `/ast-site/` без серверных перенаправлений. Производственная сборка создаёт единый `dist/index.html`; workflow также создаёт `404.html`, `.nojekyll`, `robots.txt` и `sitemap.xml`.