import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { EnvModule } from './env.module';
import { HashingService } from './services/hashing.service';

const sharedServices = [PrismaService, HashingService];

@Global()
@Module({
  imports: [EnvModule],
  providers: sharedServices,
  exports: sharedServices,
})
export class SharedModule {}
