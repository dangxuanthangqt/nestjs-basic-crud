import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length } from "class-validator";
import { IsPasswordMatch } from "src/shared/decorators/match-password.decorator";

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20, { message: "Password must be between 8 and 20 characters." })
  password: string;

  @IsString()
  @IsPasswordMatch("password")
  confirmPassword: string;

  @IsString()
  name: string;
}

export class RegisterResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CustomInterceptorRequestDto {
  @Type(() => RegisterResponseDto)
  data: RegisterResponseDto;
}

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20, { message: "Password must be between 8 and 20 characters." })
  password: string;
}

export class LoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenRequestDto {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  constructor(partial: Partial<RefreshTokenResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LogoutRequestDto {
  @IsString()
  refreshToken: string;
}

export class LogoutResponseDto {
  @Expose()
  message: string;

  constructor(partial: Partial<LogoutResponseDto>) {
    Object.assign(this, partial);
  }
}

export class MeResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  posts: {
    id: number;
    title: string;
    content: string;
  }[];

  constructor(partial: Partial<MeResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UpdateMeRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}

export class UpdateMeResponseDto extends RegisterResponseDto {}
