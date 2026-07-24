import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configure Global Prefix
  app.setGlobalPrefix('api');

  // 2. Configure ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 3. Enable CORS for the configured frontend origins
  const defaultCorsOrigins = [
    'https://ai-recruitment-system-test-deploy.vercel.app',
    'https://ai-recruitment-system-test-deploy-1.vercel.app',
    'http://localhost:3000',
  ];
  const configuredCorsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const corsOrigins = [
    ...new Set([...defaultCorsOrigins, ...configuredCorsOrigins]),
  ];
  const vercelPreviewOriginPattern =
    /^https:\/\/ai-recruitment-system-test-deploy-[a-z0-9-]+\.vercel\.app$/;

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      const isAllowed =
        !origin ||
        corsOrigins.includes(origin) ||
        vercelPreviewOriginPattern.test(origin);

      callback(null, isAllowed);
    },
    credentials: true,
  };

  app.enableCors(corsOptions);

  // 4. Setup Swagger at /api/docs
  const config = new DocumentBuilder()
    .setTitle('AI Recruitment API')
    .setDescription('API documentation for the AI Recruitment System')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? process.env.BACKEND_PORT ?? 3001;
  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}/api`);
  console.log(
    `API documentation available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
