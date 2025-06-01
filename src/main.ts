import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { parse } from 'yaml';
import { readFile } from 'node:fs/promises';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docConfig = await readFile('doc/api.yaml', 'utf8');
  const swaggerDocument = parse(docConfig);
  SwaggerModule.setup('/doc', app, swaggerDocument);
  await app.listen(4000);
}
bootstrap();
