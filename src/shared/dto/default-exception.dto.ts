import { HttpStatus } from '@nestjs/common';
import { ErrorMessage } from '../constants/error-message.constant';

export class DefaultExceptionDto {
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  message?: string = ErrorMessage[HttpStatus.INTERNAL_SERVER_ERROR];
}
