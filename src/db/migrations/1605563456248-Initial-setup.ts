import { MigrationInterface, QueryRunner } from 'typeorm';

import { ConfigService } from '../../config/config.service';

export class initialSetup1605563456248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const config = new ConfigService();
    const { schema } = config.get('DB_CONFIG');
    await queryRunner.query(
      `CREATE TABLE "${schema}"."user_role" ("user_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "auth_user_role_role_id_user_id_pkey" PRIMARY KEY ("user_id", "role_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."roles" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "label" character varying(255) NOT NULL, "description" text NOT NULL, "assignable_by_id" integer, CONSTRAINT "auth_roles_name_unique" UNIQUE ("name"), CONSTRAINT "auth_roles_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."user_permission" ("user_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "auth_user_permission_permission_id_user_id_pkey" PRIMARY KEY ("user_id", "permission_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."permissions" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "label" character varying(255) NOT NULL, "description" text NOT NULL, "system" boolean NOT NULL DEFAULT false, "assignable_by_id" integer, CONSTRAINT "auth_permissions_name_unique" UNIQUE ("name"), CONSTRAINT "auth_permissions_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."audit_permission" ("id" SERIAL NOT NULL, "permission_id" integer NOT NULL, "change_type" character varying(12) NOT NULL, "change_by_user_id" integer NOT NULL, "original_data" jsonb, "new_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "auth_audit_permission_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."audit_role_permission" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "permission_id" integer NOT NULL, "change_type" character varying(12) NOT NULL, "change_by_user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "auth_audit_role_permission_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."audit_role" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "change_type" character varying(12) NOT NULL, "change_by_user_id" integer NOT NULL, "original_data" jsonb, "new_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "auth_audit_role_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."audit_user_permission" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "permission_id" integer NOT NULL, "change_type" character varying(12) NOT NULL, "change_by_user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "auth_audit_user_permission_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."audit_user_role" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "role_id" integer NOT NULL, "change_type" character varying(12) NOT NULL, "change_by_user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "auth_audit_user_role_id_pkey" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."role_permission" ("role_id" integer NOT NULL, "permission_id" integer NOT NULL, CONSTRAINT "auth_role_permission_permission_id_role_id_pkey" PRIMARY KEY ("role_id", "permission_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "auth_role_permission_role_id_index" ON "${schema}"."role_permission" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "auth_role_permission_permission_id_index" ON "${schema}"."role_permission" ("permission_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."user_role" ADD CONSTRAINT "auth_user_role_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."roles" ADD CONSTRAINT "auth_roles_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."user_permission" ADD CONSTRAINT "auth_user_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."permissions" ADD CONSTRAINT "auth_permissions_assignable_by_id_foreign" FOREIGN KEY ("assignable_by_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."role_permission" ADD CONSTRAINT "auth_role_permission_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "${schema}"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."role_permission" ADD CONSTRAINT "auth_role_permission_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "${schema}"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const config = new ConfigService();
    const { schema } = config.get('DB_CONFIG');
    await queryRunner.query(
      `ALTER TABLE "${schema}"."role_permission" DROP CONSTRAINT "auth_role_permission_permission_id_foreign"`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."role_permission" DROP CONSTRAINT "auth_role_permission_role_id_foreign"`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."permissions" DROP CONSTRAINT "auth_permissions_assignable_by_id_foreign"`
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."user_permission" DROP CONSTRAINT "auth_user_permission_permission_id_foreign"`
    );
    await queryRunner.query(`ALTER TABLE "${schema}"."roles" DROP CONSTRAINT "auth_roles_assignable_by_id_foreign"`);
    await queryRunner.query(`ALTER TABLE "${schema}"."user_role" DROP CONSTRAINT "auth_user_role_role_id_foreign"`);
    await queryRunner.query(`DROP INDEX "${schema}"."auth_role_permission_permission_id_index"`);
    await queryRunner.query(`DROP INDEX "${schema}"."auth_role_permission_role_id_index"`);
    await queryRunner.query(`DROP TABLE "${schema}"."role_permission"`);
    await queryRunner.query(`DROP TABLE "${schema}"."audit_user_role"`);
    await queryRunner.query(`DROP TABLE "${schema}"."audit_user_permission"`);
    await queryRunner.query(`DROP TABLE "${schema}"."audit_role"`);
    await queryRunner.query(`DROP TABLE "${schema}"."audit_role_permission"`);
    await queryRunner.query(`DROP TABLE "${schema}"."audit_permission"`);
    await queryRunner.query(`DROP TABLE "${schema}"."permissions"`);
    await queryRunner.query(`DROP TABLE "${schema}"."user_permission"`);
    await queryRunner.query(`DROP TABLE "${schema}"."roles"`);
    await queryRunner.query(`DROP TABLE "${schema}"."user_role"`);
  }
}
