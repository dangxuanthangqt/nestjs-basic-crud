import { Body, Controller, Post, SerializeOptions } from '@nestjs/common';
import { RegisterRequestDto, RegisterResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ type: RegisterResponseDto })
  @Post('register')
  register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }
}
