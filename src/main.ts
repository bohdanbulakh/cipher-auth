import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecurityConfigService } from './config/security-config.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get<SecurityConfigService>(SecurityConfigService);

  const config = new DocumentBuilder()
    .setTitle('Cipher Auth API')
    .setDescription('Documentation of CIPHER AUTH API')
    .addCookieAuth('access_token')
    .build();

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Project is running on http://localhost:${port}/api`);
}
bootstrap();
