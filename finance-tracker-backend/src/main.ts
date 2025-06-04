import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para todas as origens (ou especifique o localhost:5173 para mais segurança)
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  await app.listen(process.env.PORT ?? 3000);
console.log(`Backend rodando em http://localhost:${process.env.PORT ?? 3000}`);

}
bootstrap();
