import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api Swagger')
    .setDescription('Api describe')
    .setVersion('1.0')
    .build();

  const docment = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, docment);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
