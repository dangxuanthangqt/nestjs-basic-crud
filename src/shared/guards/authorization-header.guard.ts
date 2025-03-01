import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  AUTHORIZATION_HEADER_KEY,
  AuthorizationHeaderMetadata,
  AuthorizationType,
  CombinedAuthorizationCondition,
} from "../constants/auth.constant";
import { AccessTokenGuard } from "./access-token.guard";
import { ApiKeyGuard } from "./api-key.guard";

@Injectable()
export class AuthorizationHeaderGuard implements CanActivate {
  //   private authorizationTypeMapper: Record<AuthorizationTypeType, CanActivate>;

  private readonly authorizationTypeMapper = {
    [AuthorizationType.BEARER]: this.accessTokenGuard,
    [AuthorizationType.API_KEY]: this.apiKeyGuard,
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    // this.authorizationTypeMapper = {
    //   [AuthorizationType.BEARER]: this.accessTokenGuard,
    //   [AuthorizationType.API_KEY]: this.apiKeyGuard,
    // };
  }

  async canActivate(context: ExecutionContext) {
    const authorizationMetadata = this.reflector.getAllAndOverride<
      AuthorizationHeaderMetadata | undefined
    >(AUTHORIZATION_HEADER_KEY, [context.getHandler(), context.getClass()]);

    if (!authorizationMetadata) {
      return true;
    }

    const {
      authorizationTypes,
      combinedCondition = CombinedAuthorizationCondition.AND, // Default value is AND
    } = authorizationMetadata;

    if (combinedCondition === CombinedAuthorizationCondition.OR) {
      for (const authorizationType of authorizationTypes) {
        const guardInstance = this.authorizationTypeMapper[authorizationType];

        try {
          const canActivate = await guardInstance.canActivate(context);

          if (canActivate) {
            return true;
          }
        } catch {
          continue;
        }
      }

      throw new UnauthorizedException("Authorization header is invalid.");
    }

    if (combinedCondition === CombinedAuthorizationCondition.AND) {
      for (const authorizationType of authorizationTypes) {
        const guardInstance = this.authorizationTypeMapper[authorizationType];

        try {
          await guardInstance.canActivate(context);
        } catch (error) {
          if (error instanceof HttpException) {
            throw new ForbiddenException(error.getResponse());
          }
        }
      }

      return true;
    }

    return true;
  }
}
