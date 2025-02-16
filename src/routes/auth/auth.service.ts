import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { RegisterRequestDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
  ) {}

  async register(body: RegisterRequestDto) {
    const hashedPassword = this.hashingService.hash(body.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }
}
