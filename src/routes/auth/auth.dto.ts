import { Exclude } from 'class-transformer';
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
}
