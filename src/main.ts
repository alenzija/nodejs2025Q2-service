import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const docConfig = await readFile('doc/api.yaml', 'utf8');
  const swaggerDocument = parse(docConfig);
  SwaggerModule.setup('/doc', app, swaggerDocument);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
