import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TCC API')
    .setDescription('Documentação da API do sistema')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  app.enableCors({
    origin: config.get<string>('FRONTEND_ORIGIN') ?? true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(config.get<number>('APP_PORT') ?? 3000);
}

void bootstrap();
