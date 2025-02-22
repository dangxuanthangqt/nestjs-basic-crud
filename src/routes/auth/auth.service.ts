import {
  // ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import {} from // isRecordToUpdateNotFoundPrismaError,
// isUniqueConstraintPrismaError,
'src/shared/utils/prisma-error';
import {
  LoginRequestDto,
  LogoutResponseDto,
  RegisterRequestDto,
  UpdateMeRequestDto,
} from '../../shared/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterRequestDto) {
    const hashedPassword = this.hashingService.hash(body.password);

    // This error is catch by the global prisma exception filter

    // try {
    //   const user = await this.prismaService.user.create({
    //     data: {
    //       email: body.email,
    //       name: body.name,
    //       password: hashedPassword,
    //     },
    //   });

    //   return user;
    // } catch (error) {
    //   if (isUniqueConstraintPrismaError(error)) {
    //     throw new ConflictException('Email already exists.');
    //   }

    //   throw error;
    // }

    const user = await this.prismaService.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
    });

    return user;
  }

  async login(body: LoginRequestDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email not found.');
    }

    const isPasswordMatch = this.hashingService.compare(
      body.password,
      user.password,
    );

    if (!isPasswordMatch) {
      // Điều này có nghĩa là server đã hiểu được nội dung của request (ví dụ, cú pháp JSON hợp lệ), nhưng không thể xử lý được dữ liệu đó do các lỗi về validation hoặc các quy tắc nghiệp vụ không được thoả mãn.
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ]);
    }

    const tokens = await this.generateTokens({ userId: user.id });

    return tokens;
  }

  async generateTokens(payload: { userId: User['id'] }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);

    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      const tokens = await this.generateTokens({
        userId,
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async logout(refreshToken: string): Promise<LogoutResponseDto> {
    try {
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      return {
        message: 'Logout successfully.',
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async me(userId: User['id']) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        email: true,
        name: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async updateMe(userId: User['id'], body: UpdateMeRequestDto) {
    // const requestedEmail = body.email;

    // if (requestedEmail) {
    //   const userWithRequestedEmail = await this.prismaService.user.findUnique({
    //     where: {
    //       email: requestedEmail,
    //     },
    //   });

    //   if (userWithRequestedEmail) {
    //     throw new ConflictException('Email to update already existing.');
    //   }
    // }

    // try {
    //   const user = await this.prismaService.user.update({
    //     where: {
    //       id: userId,
    //     },
    //     data: {
    //       ...body,
    //     },
    //   });

    //   return user;
    // } catch (error) {
    //   if (isRecordToUpdateNotFoundPrismaError(error)) {
    //     throw new NotFoundException('User not found to update.');
    //   }

    //   throw new NotFoundException();
    // }

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
      },
    });

    return user;
  }
}
