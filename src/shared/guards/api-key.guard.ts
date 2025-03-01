import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { IEnvConfig } from "src/interface/env.interface";
import { SECRET_API_KEY } from "../constants/auth.constant";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService<IEnvConfig>) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const headerApiKey = request.headers[SECRET_API_KEY];
    const secretApiKey = this.configService.get("app.secretApiKey", {
      infer: true,
    });

    if (headerApiKey === secretApiKey) {
      return true;
    }

    throw new UnauthorizedException("API key is invalid.");
  }
}
