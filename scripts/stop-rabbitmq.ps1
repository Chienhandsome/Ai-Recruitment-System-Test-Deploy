# PowerShell Script to stop RabbitMQ container
Write-Host "Stopping RabbitMQ service..." -ForegroundColor Yellow
docker compose stop rabbitmq

if ($LASTEXITCODE -eq 0) {
    Write-Host "RabbitMQ container stopped." -ForegroundColor Green
} else {
    Write-Host "Failed to stop RabbitMQ container." -ForegroundColor Red
}
