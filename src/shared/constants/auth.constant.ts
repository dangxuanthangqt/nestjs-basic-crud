export const REQUEST_USER_KEY = 'user';

export const SECRET_API_KEY = 'x-api-key';

export const AUTHORIZATION_HEADER_KEY = 'authorization_header';

export const AuthorizationType = {
  BEARER: 'Bearer',
  API_KEY: 'ApiKey',
} as const;

export type AuthorizationTypeType =
  (typeof AuthorizationType)[keyof typeof AuthorizationType];

export const CombinedAuthorizationCondition = {
  OR: 'OR',
  AND: 'AND',
} as const;

export type CombinedAuthorizationConditionType =
  (typeof CombinedAuthorizationCondition)[keyof typeof CombinedAuthorizationCondition];

export type AuthorizationHeaderMetadata = {
  authorizationTypes: AuthorizationTypeType[];
  combinedCondition?: CombinedAuthorizationConditionType;
};
