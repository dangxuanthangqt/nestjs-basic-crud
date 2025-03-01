import { SetMetadata } from "@nestjs/common";
import {
  AUTHORIZATION_HEADER_KEY,
  AuthorizationTypeType,
  CombinedAuthorizationConditionType,
} from "../constants/auth.constant";

export const AuthorizationHeader = (
  authorizationTypes: AuthorizationTypeType[],
  combinedCondition?: CombinedAuthorizationConditionType,
) =>
  SetMetadata(AUTHORIZATION_HEADER_KEY, {
    authorizationTypes,
    combinedCondition,
  });
