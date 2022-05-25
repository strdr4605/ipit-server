import { AuthGuard } from '@nestjs/passport';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { ErrorType, IJwt, RoleType } from './models';
import { Tracker } from './tracker';

export class AuthUserGuard extends AuthGuard('jwt') {
  public handleRequest(err: any, user: IJwt): any {
    if (!user) throw new UnauthorizedException();
    if (user.role === RoleType.BLOCKED) {
      throw new UnauthorizedException(ErrorType.AuthBlocked);
    }

    if (user.role === RoleType.DELETED) {
      throw new UnauthorizedException(ErrorType.AuthDeleted);
    }

    if (![RoleType.ADMIN, RoleType.USER].includes(user.role)) {
      throw new ForbiddenException(ErrorType.AuthInvalidRole);
    }

    Tracker.Instance.publish(user.id);

    return user;
  }
}
