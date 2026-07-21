import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private connection;
    private channelWrapper;
    private isConnected;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private disconnect;
    publishTestMessage(routingKey: string, payload: any): Promise<boolean>;
    checkHealth(): Promise<{
        service: string;
        status: string;
        message?: string;
    }>;
}
