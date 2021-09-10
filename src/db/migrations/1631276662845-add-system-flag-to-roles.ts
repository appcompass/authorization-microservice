import { MigrationInterface, QueryRunner } from 'typeorm';

import { ConfigService } from '../../config/config.service';

export class addSystemFlagToRoles1631276662845 implements MigrationInterface {
  name = 'addSystemFlagToRoles1631276662845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const config = await new ConfigService().setConfigFromVault();
    const { schema } = config.get('db');
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_role" DROP CONSTRAINT "auth_user_role_role_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."roles" DROP CONSTRAINT "auth_roles_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_permission" DROP CONSTRAINT "auth_user_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."permissions" DROP CONSTRAINT "auth_permissions_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission" DROP CONSTRAINT "auth_role_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission" DROP CONSTRAINT "auth_role_permission_role_id_foreign"
    `);
    await queryRunner.query(`
      DROP INDEX "${schema}"."auth_role_permission_role_id_index"
    `);
    await queryRunner.query(`
      DROP INDEX "${schema}"."auth_role_permission_permission_id_index"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."roles"
      ADD "system" boolean NOT NULL DEFAULT false
    `);
    await queryRunner.query(`
      CREATE INDEX "role_permission_role_id_index" ON "${schema}"."role_permission" ("role_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "role_permission_permission_id_index" ON "${schema}"."role_permission" ("permission_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_role"
      ADD CONSTRAINT "user_role_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."roles"
      ADD CONSTRAINT "roles_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_permission"
      ADD CONSTRAINT "user_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."permissions"
      ADD CONSTRAINT "permissions_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission"
      ADD CONSTRAINT "role_permission_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission"
      ADD CONSTRAINT "role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`update "${schema}"."roles" set "system" = True where "name" = 'authorization.admin'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const config = await new ConfigService().setConfigFromVault();
    const { schema } = config.get('db');
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission" DROP CONSTRAINT "role_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission" DROP CONSTRAINT "role_permission_role_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."permissions" DROP CONSTRAINT "permissions_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_permission" DROP CONSTRAINT "user_permission_permission_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."roles" DROP CONSTRAINT "roles_assignable_by_id_foreign"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_role" DROP CONSTRAINT "user_role_role_id_foreign"
    `);
    await queryRunner.query(`
      DROP INDEX "${schema}"."role_permission_permission_id_index"
    `);
    await queryRunner.query(`
      DROP INDEX "${schema}"."role_permission_role_id_index"
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."roles" DROP COLUMN "system"
    `);
    await queryRunner.query(`
      CREATE INDEX "auth_role_permission_permission_id_index" ON "${schema}"."role_permission" ("permission_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "auth_role_permission_role_id_index" ON "${schema}"."role_permission" ("role_id")
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission"
      ADD CONSTRAINT "auth_role_permission_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."role_permission"
      ADD CONSTRAINT "auth_role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."permissions"
      ADD CONSTRAINT "auth_permissions_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_permission"
      ADD CONSTRAINT "auth_user_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."roles"
      ADD CONSTRAINT "auth_roles_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "${schema}"."user_role"
      ADD CONSTRAINT "auth_user_role_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }
}
