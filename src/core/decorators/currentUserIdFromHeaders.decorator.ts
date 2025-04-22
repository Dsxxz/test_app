import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx = context.switchToHttp().getRequest();
    console.log("ctx", ctx.user);

    return ctx.user;
  },
);
