import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { RabbitMQService } from './infrastructure/rabbitmq/rabbitmq.service';
import { SupabaseStorageService } from './infrastructure/supabase/supabase-storage.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: {} },
        { provide: SupabaseStorageService, useValue: {} },
        { provide: RabbitMQService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "be hello"', () => {
      expect(appController.getHello()).toBe('be hello');
    });
  });
});
