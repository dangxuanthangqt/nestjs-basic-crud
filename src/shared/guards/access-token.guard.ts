import {
  CanActivate,
  ExecutionContext,
  // GoneException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { REQUEST_USER_KEY } from "../constants/auth.constant";
import { TokenService } from "../services/token.service";
import { TokenExpiredError } from "@nestjs/jwt";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(AccessTokenGuard.name);
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers["authorization"];

    if (authorization && authorization.startsWith("Bearer ")) {
      const accessToken = authorization.split(" ")[1];
      console.log("accessToken", accessToken);
      try {
        const decodedAccessToken =
          await this.tokenService.verifyAccessToken(accessToken);
        console.log("decodedAccessToken", decodedAccessToken);
        request[REQUEST_USER_KEY] = decodedAccessToken;

        return true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException("Access token has expired.");
        }

        throw new UnauthorizedException("Access token is invalid.");
      }
    }

    throw new UnauthorizedException("Access token is missing.");
  }
}
