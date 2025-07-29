import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';

type CurrentUser = UserDto;

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<{ user?: CurrentUser }>();
    if (!req.user) {
      throw new Error('User not found. Did you forget to use the AuthGuard?');
    }

    return req.user;
  },
);
