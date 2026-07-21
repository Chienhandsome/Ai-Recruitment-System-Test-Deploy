#!/bin/bash
echo "Stopping RabbitMQ service..."
docker compose stop rabbitmq

if [ $? -eq 0 ]; then
    echo "RabbitMQ container stopped."
else
    echo "Failed to stop RabbitMQ container."
fi
