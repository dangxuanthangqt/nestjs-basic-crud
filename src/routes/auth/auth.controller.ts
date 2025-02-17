import { Body, Controller, Post } from '@nestjs/common';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @SerializeOptions({ type: CustomInterceptorRequestDto })
  @Post('register')
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(body);

    return new RegisterResponseDto(result);
  }

  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(body);

    return new LoginResponseDto(result);
  }
}
