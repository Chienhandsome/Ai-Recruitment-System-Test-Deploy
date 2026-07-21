import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { SupabaseStorageService } from './infrastructure/supabase/supabase-storage.service';
import { RabbitMQService } from './infrastructure/rabbitmq/rabbitmq.service';
export declare class AppController {
    private readonly appService;
    private readonly prismaService;
    private readonly supabaseStorageService;
    private readonly rabbitMqService;
    private readonly configService;
    constructor(appService: AppService, prismaService: PrismaService, supabaseStorageService: SupabaseStorageService, rabbitMqService: RabbitMQService, configService: ConfigService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        services: {
            backend: string;
            supabaseDatabase: string;
            supabaseStorage: string;
            rabbitmq: string;
            aiService: string;
        };
    }>;
}
