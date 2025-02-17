import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { EnvModule } from './env.module';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';

const sharedServices = [PrismaService, HashingService, TokenService];

@Global()
@Module({
  imports: [EnvModule, JwtModule],
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
