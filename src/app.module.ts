import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './routes/posts/posts.module';
import { AuthModule } from './routes/auth/auth.module';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';

@Module({
  imports: [SharedModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => {
        return new ClassSerializerInterceptor(reflector, {
          excludeExtraneousValues: true,
        });
      },
      inject: [Reflector],
    },
  ],
})
export class AppModule {}
