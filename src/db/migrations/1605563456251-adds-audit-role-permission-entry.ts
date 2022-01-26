import { MigrationInterface, QueryRunner } from 'typeorm';

import { AuditAuthAssignmentType } from '../../api/api.types';
import { ConfigService } from '../../config/config.service';
import { dbUserIdVarName } from '../query.utils';

export class addsAuditRolePermissionEntry1605563456251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const config = new ConfigService();
    const { schema } = config.get('DB_CONFIG');
    await queryRunner.query(
      `
          CREATE OR REPLACE FUNCTION ${schema}.adds_audit_role_permission_entry() RETURNS TRIGGER AS
          $BODY$
          DECLARE
            v_change_by text := current_setting('${dbUserIdVarName}', true);
          BEGIN
            IF (v_change_by is null) THEN
              v_change_by := 0;
            END IF;
            IF (TG_OP = 'INSERT') THEN
              INSERT INTO ${schema}.audit_role_permission (role_id, permission_id, change_type, change_by_user_id)
              VALUES (NEW.role_id, NEW.permission_id, '${AuditAuthAssignmentType.assigned}', v_change_by::INTEGER);
              RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
              INSERT INTO ${schema}.audit_role_permission (role_id, permission_id, change_type, change_by_user_id)
              VALUES (OLD.role_id, OLD.permission_id, '${AuditAuthAssignmentType.revoked}', v_change_by::INTEGER);
              RETURN OLD;
            ELSE
              RAISE WARNING '[${schema}.adds_audit_role_permission_entry] - Other action occurred: %, at %',TG_OP,now();
              RETURN NULL;
            END IF;
          EXCEPTION
            WHEN data_exception THEN
              RAISE WARNING '[${schema}.adds_audit_role_permission_entry] - UDF ERROR [DATA EXCEPTION] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN unique_violation THEN
              RAISE WARNING '[${schema}.adds_audit_role_permission_entry] - UDF ERROR [UNIQUE] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
            WHEN OTHERS THEN
              RAISE WARNING '[${schema}.adds_audit_role_permission_entry] - UDF ERROR [OTHER] - SQLSTATE: %, SQLERRM: %',SQLSTATE,SQLERRM;
              RETURN NULL;
          END;
          $BODY$ LANGUAGE PLPGSQL;

          CREATE TRIGGER add_audit_role_permission_entry
            AFTER INSERT OR DELETE
            ON ${schema}.role_permission
            FOR EACH ROW
          EXECUTE PROCEDURE ${schema}.adds_audit_role_permission_entry();
          `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const config = new ConfigService();
    const { schema } = config.get('DB_CONFIG');
    await queryRunner.query(`DROP FUNCTION ${schema}.adds_audit_role_permission_entry() CASCADE`);
  }
}
