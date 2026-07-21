# PowerShell Script to start RabbitMQ container using Docker Compose
Write-Host "Starting RabbitMQ service via Docker Compose..." -ForegroundColor Green
docker compose up -d rabbitmq

if ($LASTEXITCODE -eq 0) {
    Write-Host "RabbitMQ container started successfully." -ForegroundColor Green
    Write-Host "RabbitMQ Management UI: http://localhost:15672" -ForegroundColor Cyan
} else {
    Write-Host "Failed to start RabbitMQ container. Please ensure Docker Desktop is running." -ForegroundColor Red
}
