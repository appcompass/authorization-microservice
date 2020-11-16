import { Permission } from 'src/authorization/entities/permission.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class basePermissions1606062566273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(Permission, {
      name: 'create.permission',
      label: 'Create Permission',
      description: 'Allows creation of permissions',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'read.permission',
      label: 'Read Permission',
      description: 'Allows viewing of permissions',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'update.permission',
      label: 'Update Permission',
      description: 'Allows updates to permissions',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'delete.permission',
      label: 'Delete Permission',
      description: 'Allows deletion of permissions',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'create.role',
      label: 'Create Role',
      description: 'Allows creation of roles',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'read.role',
      label: 'Read Role',
      description: 'Allows viewing of roles',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'update.role',
      label: 'Update Role',
      description: 'Allows updates to roles',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'delete.role',
      label: 'Delete Role',
      description: 'Allows deletion of roles',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'create.user-permission',
      label: 'Create User Permission Association',
      description: 'Allows granting of permissions to users',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'delete.user-permission',
      label: 'Delete User Permission Association',
      description: 'Allows revoking of permissions from users',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'create.user-role',
      label: 'Create User Role Association',
      description: 'Allows granting of roles to users',
      system: true
    });
    await queryRunner.manager.save(Permission, {
      name: 'delete.user-role',
      label: 'Delete User Role Association',
      description: 'Allows revoking of roles from users',
      system: true
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Permission, {
      name: 'create.permission'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'read.permission'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'update.permission'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'delete.permission'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'create.role'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'read.role'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'update.role'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'delete.role'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'create.user-permission'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'delete.user-permission'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'create.user-role'
    });
    await queryRunner.manager.delete(Permission, {
      name: 'delete.user-role'
    });
  }
}
