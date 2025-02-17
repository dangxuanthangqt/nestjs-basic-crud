import { Exclude, Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}

export class RegisterResponseDto {
  id: number;
  email: string;
  name: string;

  @Exclude()
  password: string;

  createdAt: Date;
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
  password: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
