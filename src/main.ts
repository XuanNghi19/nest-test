import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // tu dong loai bo cac thuoc tinh khong co trong dto
      transform: true, // tu dong chuyen doi kieu du lieu (vd: string -> number)
    }),
  );

  // dung de kich hoat @Exclude
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Api Swagger')
    .setDescription('Api describe')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const docment = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, docment);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
