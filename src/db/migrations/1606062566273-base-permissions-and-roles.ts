import { Permission } from 'src/authorization/entities/permission.entity';
import { Role } from 'src/authorization/entities/role.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export const systemPermissions = [
  {
    name: 'create.permission',
    label: 'Create Permission',
    description: 'Allows creation of permissions',
    system: true
  },
  {
    name: 'read.permission',
    label: 'Read Permission',
    description: 'Allows viewing of permissions',
    system: true
  },
  {
    name: 'update.permission',
    label: 'Update Permission',
    description: 'Allows updates to permissions',
    system: true
  },
  {
    name: 'delete.permission',
    label: 'Delete Permission',
    description: 'Allows deletion of permissions',
    system: true
  },
  {
    name: 'create.role',
    label: 'Create Role',
    description: 'Allows creation of roles',
    system: true
  },
  {
    name: 'read.role',
    label: 'Read Role',
    description: 'Allows viewing of roles',
    system: true
  },
  {
    name: 'update.role',
    label: 'Update Role',
    description: 'Allows updates to roles',
    system: true
  },
  {
    name: 'delete.role',
    label: 'Delete Role',
    description: 'Allows deletion of roles',
    system: true
  },
  {
    name: 'modify.user-permission',
    label: 'Modify User Permission Association',
    description: 'Allows granting and revoking of permissions to users',
    system: true
  },
  {
    name: 'modify.user-role',
    label: 'Modify User Role Association',
    description: 'Allows granting and revoking of roles to users',
    system: true
  }
];

export class basePermissionsAndRoles1606062566273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionRepo = queryRunner.manager.getRepository(Permission);
    const roleRepo = queryRunner.manager.getRepository(Role);
    const permissions = systemPermissions.map((data) => permissionRepo.create(data));

    const authorizationAdminRole = roleRepo.create({
      name: 'authorization-admin',
      label: 'Authorization Admin',
      description: 'Platform Authorization Administrator'
    });

    authorizationAdminRole.permissions = permissions;

    await roleRepo.save(authorizationAdminRole);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Role, {
      name: 'admin'
    });
    const permissions = systemPermissions.map(({ name }) => queryRunner.manager.delete(Permission, { name }));
    await Promise.all(permissions);
  }
}
