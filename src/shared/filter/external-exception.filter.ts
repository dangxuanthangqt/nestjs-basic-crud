import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DefaultExceptionDto } from '../dto/default-exception.dto';

@Catch(HttpException)
export class ExternalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExternalExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const defaultExceptionDto = new DefaultExceptionDto();

    defaultExceptionDto.statusCode = exception.getStatus();
    defaultExceptionDto.message = exception.message;

    const logMessage = `${exception.constructor.name} occurred at ${new Date().toISOString()} - Status: ${defaultExceptionDto.statusCode}, Message: ${defaultExceptionDto.message}`;

    this.logger.error(logMessage);
    // this.logger.error([logMessage, exception.stack]);
    // exception.stack is very long, log it if needed

    response.status(exception.getStatus()).json(defaultExceptionDto);
  }
}
