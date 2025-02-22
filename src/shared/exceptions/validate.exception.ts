/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException } from '@nestjs/common';
import { ErrorDetailDto } from '../dto/error-detail.dto';
import { ErrorMessage } from '../constants/error-message.constant';
import { ErrorCode } from '../constants/error-code.constant';

export class ValidateException extends BadRequestException {
  constructor(
    error: ErrorDetailDto[] | ErrorDetailDto | ErrorCode | string,
    errorMessage?: string,
  ) {
    if (Array.isArray(error)) {
      super(error);
    } else if (error instanceof ErrorDetailDto) {
      super([error]);
    } else {
      const message = errorMessage ? errorMessage : ErrorMessage[error];

      const errorCode: ErrorCode = message
        ? (error as ErrorCode)
        : ErrorCode.VALIDATE_COMMON;
      const detail = {
        errorCode: errorCode,
        errorMessage: message || error,
      };
      super([detail]);
    }
  }
}
