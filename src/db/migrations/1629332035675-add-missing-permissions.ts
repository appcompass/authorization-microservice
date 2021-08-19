import { MigrationInterface, QueryRunner } from 'typeorm';

import { Permission } from '../../api/entities/permission.entity';
import { Role } from '../../api/entities/role.entity';

export const systemPermissions = [
  {
    name: 'authorization.role.list',
    label: 'List Roles',
    description: 'Allows listing of roles',
    system: true
  },
  {
    name: 'authorization.permission.list',
    label: 'List Permission',
    description: 'Allows listing to permissions',
    system: true
  },
  {
    name: 'authorization.user-roles.list',
    label: 'List User Roles',
    description: 'Allows listing of a user roles',
    system: true
  },
  {
    name: 'authorization.user-permissions.list',
    label: 'List User Permissions',
    description: 'Allows listing of a user permissions',
    system: true
  },
  {
    name: 'authorization.user-roles.update',
    label: 'Update User Roles',
    description: 'Allows update of user roles',
    system: true
  },
  {
    name: 'authorization.user-permissions.update',
    label: 'Update User Permissions',
    description: 'Allows update of user permissions',
    system: true
  }
];

export class addMissingPermissions1629332035675 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleRepo = queryRunner.manager.getRepository(Role);
    const { generatedMaps } = await queryRunner.manager.insert(Permission, systemPermissions);

    const permissionIds = generatedMaps.map((row) => row.id);
    const authorizationAdminRole = await roleRepo.findOne({
      name: 'authorization.admin'
    });

    const query = queryRunner.manager.createQueryBuilder().relation(Role, 'permissions').of(authorizationAdminRole);

    await query.add(permissionIds);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissions = systemPermissions.map(({ name }) => queryRunner.manager.delete(Permission, { name }));
    await Promise.all(permissions);
  }
}
