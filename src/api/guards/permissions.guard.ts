import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const routePermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!routePermissions) return true;

    const userPermissions = context.getArgs()[0].user.permissions || [];

    return routePermissions.every((routePermission) => userPermissions.includes(routePermission));
  }
}
