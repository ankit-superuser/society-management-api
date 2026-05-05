import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      
    }),
  );
app.getHttpAdapter().getInstance().set('trust proxy', true);
  const PORT = process.env.PORT || 3002;
  await app.listen(PORT);

  console.log(`Server running on port ${PORT}`);
}
bootstrap();