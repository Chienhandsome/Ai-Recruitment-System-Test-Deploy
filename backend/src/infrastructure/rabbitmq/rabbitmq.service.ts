import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { RABBITMQ_EXCHANGE } from './rabbitmq.constants';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: AmqpConnectionManager | null = null;
  private channelWrapper: ChannelWrapper | null = null;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private connect() {
    const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL', 'amqp://guest:guest@localhost:5672');

    try {
      this.connection = amqp.connect([rabbitMqUrl], {
        reconnectTimeInSeconds: 5,
        heartbeatIntervalInSeconds: 10,
      });

      this.connection.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Successfully connected to RabbitMQ broker.');
      });

      this.connection.on('disconnect', (params: { err?: Error }) => {
        this.isConnected = false;
        this.logger.warn(`RabbitMQ connection disconnected: ${params?.err?.message || 'Broker unavailable'}`);
      });

      this.channelWrapper = this.connection.createChannel({
        json: true,
        setup: async (channel: any) => {
          await channel.assertExchange(RABBITMQ_EXCHANGE, 'topic', { durable: true });
        },
      });
    } catch (error: any) {
      this.logger.error(`Error initializing RabbitMQ connection: ${error?.message}`);
      this.isConnected = false;
    }
  }

  private async disconnect() {
    if (this.channelWrapper) {
      await this.channelWrapper.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
    this.logger.log('RabbitMQ connection closed.');
  }

  async publishTestMessage(routingKey: string, payload: any): Promise<boolean> {
    if (!this.isConnected || !this.channelWrapper) {
      this.logger.warn('Cannot publish message: RabbitMQ connection is not established.');
      return false;
    }

    try {
      await this.channelWrapper.publish(RABBITMQ_EXCHANGE, routingKey, payload);
      this.logger.log(`Published test message to key '${routingKey}'`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to publish message: ${error?.message}`);
      return false;
    }
  }

  async checkHealth(): Promise<{ service: string; status: string; message?: string }> {
    if (this.isConnected && this.connection?.isConnected()) {
      return {
        service: 'rabbitmq',
        status: 'UP',
      };
    }

    return {
      service: 'rabbitmq',
      status: 'DOWN',
      message: 'RabbitMQ connection is inactive or broker unreachable at localhost:5672',
    };
  }
}
