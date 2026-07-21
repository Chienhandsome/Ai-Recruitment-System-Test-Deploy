#!/bin/bash
echo "Starting RabbitMQ service via Docker Compose..."
docker compose up -d rabbitmq

if [ $? -eq 0 ]; then
    echo "RabbitMQ container started successfully."
    echo "RabbitMQ Management UI: http://localhost:15672"
else
    echo "Failed to start RabbitMQ container. Please ensure Docker is running."
fi
