import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as fs from 'fs';
import * as morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';

// api.log
const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(3000);
}
bootstrap();
