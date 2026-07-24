import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { SupabaseStorageService } from './infrastructure/supabase/supabase-storage.service';
import { RabbitMQService } from './infrastructure/rabbitmq/rabbitmq.service';
import { Public } from './modules/auth/decorators/public.decorator';

@ApiTags('System')
@Public()
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    private readonly supabaseStorageService: SupabaseStorageService,
    private readonly rabbitMqService: RabbitMQService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'System-wide health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated infrastructure and service status details',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'UP' },
        services: {
          type: 'object',
          properties: {
            backend: { type: 'string', example: 'UP' },
            supabaseDatabase: { type: 'string', example: 'UP' },
            supabaseStorage: { type: 'string', example: 'UP' },
            rabbitmq: { type: 'string', example: 'UP' },
            aiService: { type: 'string', example: 'UP' },
          },
        },
      },
    },
  })
  async getHealth() {
    // 1. Backend Service status
    const backendStatus = 'UP';

    // 2. Supabase PostgreSQL (Prisma) status
    const dbHealth = await this.prismaService.checkHealth();

    // 3. Supabase Storage status
    const storageHealth = await this.supabaseStorageService.checkHealth();

    // 4. RabbitMQ status
    const rabbitHealth = this.rabbitMqService.checkHealth();

    // 5. AI Service status check (HTTP fetch)
    let aiServiceStatus = 'DOWN';
    const aiServiceUrl = this.configService.get<string>(
      'AI_SERVICE_URL',
      'http://localhost:8000',
    );
    try {
      const response = await fetch(`${aiServiceUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        aiServiceStatus = 'UP';
      }
    } catch {
      aiServiceStatus = 'DOWN';
    }

    const services = {
      backend: backendStatus,
      supabaseDatabase: dbHealth.status,
      supabaseStorage: storageHealth.status,
      rabbitmq: rabbitHealth.status,
      aiService: aiServiceStatus,
    };

    const isAllUp = Object.values(services).every((s) => s === 'UP');
    const overallStatus = isAllUp ? 'UP' : 'DEGRADED';

    return {
      status: overallStatus,
      services,
    };
  }
}
