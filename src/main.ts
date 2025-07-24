import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecurityConfigService } from './config/security-config.service';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);
  const { port } = app.get<SecurityConfigService>(SecurityConfigService);
  await app.listen(port);
  console.log(`Project is running on http://localhost:${port}`);
}
bootstrap();
