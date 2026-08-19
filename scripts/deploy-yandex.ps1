# Деплой dist/ в Yandex Object Storage (AWS-совместимый API)
#
# Один раз:
# 1. Установите AWS CLI: https://aws.amazon.com/cli/
# 2. Создайте статический ключ доступа сервисного аккаунта с ролью
#    storage.editor (или storage.uploader) на бакет
# 3. Задайте переменные окружения (PowerShell):
#    $env:YC_BUCKET = "имя-бакета"
#    $env:AWS_ACCESS_KEY_ID = "..."
#    $env:AWS_SECRET_ACCESS_KEY = "..."
#    $env:AWS_DEFAULT_REGION = "ru-central1"
#
# Запуск из корня проекта:
#    npm run build
#    .\scripts\deploy-yandex.ps1

$ErrorActionPreference = "Stop"

$Bucket = $env:YC_BUCKET
if (-not $Bucket) {
  Write-Error "Задайте YC_BUCKET (имя бакета Object Storage)"
}

$Endpoint = "https://storage.yandexcloud.net"
$Dist = Join-Path $PSScriptRoot "..\dist"

if (-not (Test-Path $Dist)) {
  Write-Error "Нет папки dist. Сначала: npm run build"
}

Write-Host "Sync $Dist -> s3://$Bucket ..."
aws s3 sync $Dist "s3://$Bucket/" --endpoint-url $Endpoint --delete

Write-Host "Готово. Website URL смотрите в консоли бакета (Хостинг статического сайта)."
