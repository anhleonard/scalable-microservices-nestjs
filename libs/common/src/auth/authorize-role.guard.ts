import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();

      const currentRole = request?.user?.role;

      if (allowedRoles.includes(currentRole)) return true;

      throw new UnauthorizedException('Sorry, you are not authorized.');
    }
  }

  const guard = mixin(RolesGuardMixin);
  return guard;
};
