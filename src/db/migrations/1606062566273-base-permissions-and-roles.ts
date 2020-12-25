import { Permission } from '../../authorization/entities/permission.entity';
import { Role } from '../../authorization/entities/role.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export const systemPermissions = [
  {
    name: 'authorization.permission.create',
    label: 'Create Permission',
    description: 'Allows creation of permissions',
    system: true
  },
  {
    name: 'authorization.permission.read',
    label: 'Read Permission',
    description: 'Allows viewing of permissions',
    system: true
  },
  {
    name: 'authorization.permission.update',
    label: 'Update Permission',
    description: 'Allows updates to permissions',
    system: true
  },
  {
    name: 'authorization.permission.delete',
    label: 'Delete Permission',
    description: 'Allows deletion of permissions',
    system: true
  },
  {
    name: 'authorization.role.create',
    label: 'Create Role',
    description: 'Allows creation of roles',
    system: true
  },
  {
    name: 'authorization.role.read',
    label: 'Read Role',
    description: 'Allows viewing of roles',
    system: true
  },
  {
    name: 'authorization.role.update',
    label: 'Update Role',
    description: 'Allows updates to roles',
    system: true
  },
  {
    name: 'authorization.role.delete',
    label: 'Delete Role',
    description: 'Allows deletion of roles',
    system: true
  },
  {
    name: 'authorization.modify.user-permission',
    label: 'Modify User Permission Association',
    description: 'Allows granting and revoking of permissions to users',
    system: true
  },
  {
    name: 'authorization.modify.user-role',
    label: 'Modify User Role Association',
    description: 'Allows granting and revoking of roles to users',
    system: true
  },
  {
    name: 'authorization.audit.permission',
    label: 'Audit Permissions',
    description: 'Allows viewing of audit logs for Permissions',
    system: true
  },
  {
    name: 'authorization.audit.role',
    label: 'Audit Roles',
    description: 'Allows viewing of audit logs for Roles',
    system: true
  },
  {
    name: 'authorization.audit.user-permission',
    label: 'Audit User Permissions',
    description: 'Allows viewing of audit logs for User Permissions',
    system: true
  },
  {
    name: 'authorization.audit.user-role',
    label: 'Audit User Roles',
    description: 'Allows viewing of audit logs for User Roles',
    system: true
  },
  {
    name: 'authorization.audit.role-permission',
    label: 'Audit Role Permissions',
    description: 'Allows viewing of audit logs for Role Permissions',
    system: true
  }
];

export class basePermissionsAndRoles1606062566273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionRepo = queryRunner.manager.getRepository(Permission);
    const roleRepo = queryRunner.manager.getRepository(Role);
    const permissions = systemPermissions.map((data) => permissionRepo.create(data));

    const authorizationAdminRole = roleRepo.create({
      name: 'authorization.admin',
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
