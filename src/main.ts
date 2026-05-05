import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.getHttpAdapter().getInstance().set('trust proxy', true);
    app.enableCors(); // Added CORS for frontend compatibility
    await app.init();
  }
  return app;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(async (nestApp) => {
    const PORT = process.env.PORT || 3002;
    await nestApp.listen(PORT);
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless
export default async (req: any, res: any) => {
  const nestApp = await bootstrap();
  const instance = nestApp.getHttpAdapter().getInstance();
  return instance(req, res);
};