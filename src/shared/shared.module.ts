import { Global, Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from './env.module';
import { AccessTokenGuard } from './guards/access-token.guard';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AuthorizationHeaderGuard } from './guards/authorization-header.guard';
import { HashingService } from './services/hashing.service';
import { PrismaService } from './services/prisma.service';
import { TokenService } from './services/token.service';
import { PrismaClientExceptionFilter } from './filter/prisma-exception.filter';
import { LoggerModule } from 'nestjs-pino';
import { loggerFactory } from './utils/setup-logger.utils';
import { ConfigService } from '@nestjs/config';
import { ExternalExceptionFilter } from './filter/external-exception.filter';

const sharedServices: Provider[] = [
  PrismaService,
  HashingService,
  TokenService,
];

const guards: Provider[] = [
  AccessTokenGuard,
  ApiKeyGuard,
  {
    provide: APP_GUARD,
    useClass: AuthorizationHeaderGuard,
  },
]; // AccessTokenGuard & ApiKeyGuard can inject into AuthorizationHeaderGuard, no need to export them

const filters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: PrismaClientExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ExternalExceptionFilter,
  },
];

const loggerModule = LoggerModule.forRootAsync({
  useFactory: loggerFactory,
  inject: [ConfigService],
});

@Global()
@Module({
  imports: [EnvModule, JwtModule, loggerModule],
  providers: [...sharedServices, ...guards, ...filters],
  exports: sharedServices,
})
export class SharedModule {}
