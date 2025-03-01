import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { ServerResponse } from "http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const host = context.switchToHttp();

    const response = host.getResponse<T>() as ServerResponse;

    return next
      .handle()
      .pipe(map((data: T) => ({ data, statusCode: response.statusCode })));
  }
}
