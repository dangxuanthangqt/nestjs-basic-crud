import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IJwtPayload } from 'src/interface/jwt.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

const ActiveUser = createParamDecorator(
  (field: keyof IJwtPayload, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request[REQUEST_USER_KEY] as IJwtPayload;

    return field ? user[field] : user;
  },
);

export default ActiveUser;
