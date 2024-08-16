import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appOptions } from './settings/exception/app.options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  appOptions(app);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
