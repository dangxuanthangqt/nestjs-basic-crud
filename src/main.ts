import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IEnvConfig } from './interface/env.interface';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService<IEnvConfig>);

  const port = configService.get('app.port', { infer: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được khai báo decorator trong DTO
      forbidNonWhitelisted: true, // Tự động trả về lỗi nếu có trường không được khai decorator báo trong DTO
      transform: true, // Tự động chuyển đổi các đối tượng JSON thành các instanced DTO.
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((error) => {
            return {
              field: error.property,
              error: Object.values(error.constraints as object).join(', '),
            };
          }),
        );
      },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port ?? 3000);
}

void bootstrap();
