import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { IEnvConfig } from "src/interface/env.interface";
import { IJwtPayload } from "src/interface/jwt.interface";

type UserId = User["id"];

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService<IEnvConfig>,
    private readonly jwtService: JwtService,
  ) {}

  signAccessToken(payload: { userId: UserId }) {
    const secret = this.configService.get("app.accessTokenSecret", {
      infer: true,
    });

    const expiresIn = this.configService.get("app.accessTokenExpiresIn", {
      infer: true,
    });

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
      algorithm: "HS256",
    });
  }

  signRefreshToken(payload: { userId: UserId }) {
    const secret = this.configService.get("app.refreshTokenSecret", {
      infer: true,
    });

    const expiresIn = this.configService.get("app.refreshTokenExpiresIn", {
      infer: true,
    });

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
      algorithm: "HS256",
    });
  }

  verifyAccessToken(token: string): Promise<IJwtPayload> {
    const secret = this.configService.get("app.accessTokenSecret", {
      infer: true,
    });

    return this.jwtService.verifyAsync(token, {
      secret,
    });
  }

  verifyRefreshToken(token: string): Promise<IJwtPayload> {
    const secret = this.configService.get("app.refreshTokenSecret", {
      infer: true,
    });

    return this.jwtService.verifyAsync(token, {
      secret,
    });
  }
}
