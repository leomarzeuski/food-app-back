import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as express from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // app.enableCors({
  //   origin: process.env.NODE_ENV === 'production'
  //     ? [process.env.FRONTEND_URL || 'https://food-app-front.vercel.app'] 
  //     : ['http://localhost:3000'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true, 
  // });
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();