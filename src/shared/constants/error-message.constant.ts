import { ErrorCode } from './error-code.constant';

export const ErrorMessage = {
  400: 'Bad Request.',
  401: 'Unauthorized.',
  403: 'Forbidden.',
  404: 'Not Found.',
  422: 'Unprocessable Content.',
  500: 'Internal server error.',

  [ErrorCode.VALIDATE_COMMON]: 'Validate Common',
  // TODO: Add more error message
} as const;
