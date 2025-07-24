import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecurityConfigService } from './config/security-config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get<SecurityConfigService>(SecurityConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(port);
  console.log(`Project is running on http://localhost:${port}`);
}
bootstrap();
