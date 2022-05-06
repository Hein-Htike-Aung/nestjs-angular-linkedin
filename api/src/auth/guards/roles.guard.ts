import { User } from '../models/user.class';
import { AuthService } from './../services/auth.service';
import { ROLES_KEY } from './../decorators/roles.decorator';
import { Role } from './../models/role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const reqiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!reqiredRoles) return true;

    const { user }: { user: User } = context.switchToHttp().getRequest();

    return reqiredRoles.some((role) => user.role?.includes(role));
  }
}
