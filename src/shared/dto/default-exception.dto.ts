import { HttpStatus } from '@nestjs/common';

export class DefaultExceptionDto {
  statusCode: HttpStatus;

  message: string;
}
