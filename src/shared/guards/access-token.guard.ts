import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { REQUEST_USER_KEY } from "../constants/auth.constant";
import { TokenService } from "../services/token.service";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers["authorization"];

    if (authorization && authorization.startsWith("Bearer ")) {
      const accessToken = authorization.split(" ")[1];

      try {
        const decodedAccessToken =
          await this.tokenService.verifyAccessToken(accessToken);

        request[REQUEST_USER_KEY] = decodedAccessToken;

        return true;
      } catch {
        throw new ForbiddenException("Access token is invalid.");
      }
    }

    throw new ForbiddenException("Access token is missing.");
  }
}
