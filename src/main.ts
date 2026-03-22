import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //para poner el prefijo api en nuestra url
  app.setGlobalPrefix('api/v2')

  // configuracion de globales
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions:{
      enableImplicitConversion: true
    }
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
