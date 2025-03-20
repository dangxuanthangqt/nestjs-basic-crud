import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import {
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  MeResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UpdateMeRequestDto,
  UpdateMeResponseDto,
} from "../../shared/dto/auth.dto";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";
import { AuthorizationHeader } from "src/shared/decorators/authorization-header.decorator";
import { AuthorizationType } from "src/shared/constants/auth.constant";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @SerializeOptions({ type: CustomInterceptorRequestDto })
  @Post("register")
  async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(body);

    return new RegisterResponseDto(result);
  }

  @Post("login")
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(body);

    return new LoginResponseDto(result);
  }

  @Post("refresh-token")
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const result = await this.authService.refreshToken(body.refreshToken);

    return result;
  }

  @Post("logout")
  async logout(@Body() body: RefreshTokenRequestDto) {
    const result = await this.authService.logout(body.refreshToken);

    return new LogoutResponseDto(result);
  }

  @AuthorizationHeader([AuthorizationType.BEARER])
  @Get("me/:userId")
  async me(@Param("userId", ParseIntPipe) userId: User["id"]) {
    const result = await this.authService.me(userId);

    return new MeResponseDto(result);
  }

  @Put("me/:userId")
  async updateMe(
    @Param("userId", ParseIntPipe) userId: User["id"],
    @Body() body: UpdateMeRequestDto,
  ) {
    const result = await this.authService.updateMe(userId, body);

    return new UpdateMeResponseDto(result);
  }
}
