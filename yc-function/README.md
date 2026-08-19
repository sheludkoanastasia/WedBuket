# Cloud Function (Yandex)

Файл `index.js` — код функции `yclients-api`.

## Обновить после смены логики

1. [Cloud Functions](https://console.yandex.cloud) → `yclients-api`
2. **Создать версию**
3. Вставить содержимое `index.js` (точка входа `index.handler`)
4. Env не трогать
5. Сохранить версию

Доп. поля записи YCLIENTS (`custom_fields`):  
`event_type`, `venue`, `extras`, `bouquet`, `budget`, `refs`
