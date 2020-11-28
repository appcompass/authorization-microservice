import { existsQuery } from 'src/db/query.utils';
import { EntityManager, In } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { UserPermission } from '../entities/user-permission.entity';
import { UserRole } from '../entities/user-role.entity';

@Injectable()
export class UserAuthorizationService {
  async findAllRoles(manager: EntityManager, userId: number): Promise<Role[]> {
    return await manager
      .getRepository(Role)
      .createQueryBuilder('role')
      .where(
        existsQuery(
          manager
            .getRepository(UserRole)
            .createQueryBuilder('user_role')
            .where('user_role.user_id = :userId and user_role.role_id = role.id')
        )
      )
      .setParameter('userId', userId)
      .getMany();
  }

  async findAllPermissions(manager: EntityManager, userId: number): Promise<Permission[]> {
    return await manager
      .getRepository(Permission)
      .createQueryBuilder('permission')
      .where(
        existsQuery(
          manager
            .getRepository(UserPermission)
            .createQueryBuilder('user_permission')
            .where('user_permission.user_id = :userId and user_permission.permission_id = permission.id')
        )
      )
      .setParameter('userId', userId)
      .getMany();
  }

  async syncRoles(manager: EntityManager, userId: number, ids: number[]) {
    const existingIds = (await manager.getRepository(UserRole).find({ where: { userId } })).map(
      (userRole) => userRole.roleId
    );
    const removed = existingIds.filter((id) => !ids.includes(id));
    const added = ids.filter((id) => !existingIds.includes(id));
    const unchanged = ids.filter((id) => existingIds.includes(id));

    if (removed.length)
      await manager
        .createQueryBuilder()
        .delete()
        .from(UserRole)
        .where({ userId, roleId: In(removed) })
        .execute();
    if (added.length)
      await manager.insert(
        UserRole,
        added.map((roleId) => ({ roleId, userId }))
      );
    return {
      removed,
      added,
      unchanged
    };
  }

  async syncPermissions(manager: EntityManager, userId: number, ids: number[]) {
    const existingIds = (await manager.getRepository(UserPermission).find({ where: { userId } })).map(
      (userPermission) => userPermission.permissionId
    );
    const removed = existingIds.filter((id) => !ids.includes(id));
    const added = ids.filter((id) => !existingIds.includes(id));
    const unchanged = ids.filter((id) => existingIds.includes(id));

    if (removed.length)
      await manager
        .createQueryBuilder()
        .delete()
        .from(UserPermission)
        .where({ userId, permissionId: In(removed) })
        .execute();
    if (added.length)
      await manager.insert(
        UserPermission,
        added.map((permissionId) => ({ permissionId, userId }))
      );
    return {
      removed,
      added,
      unchanged
    };
  }
}
