import { EntityManager, FindManyOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { AuditPermission } from '../entities/audit-permission.entity';
import { AuditRole } from '../entities/audit-role.entity';
import { AuditUserPermission } from '../entities/audit-user-permission.entity';
import { AuditUserRole } from '../entities/audit-user-role.entity';

@Injectable()
export class AuditLogsService {
  async findAllAuditPermissions(
    manager: EntityManager,
    options?: FindManyOptions<AuditPermission>
  ): Promise<AuditPermission[]> {
    return await manager.getRepository(AuditPermission).find(options);
  }

  async findAllAuditRoles(manager: EntityManager, options?: FindManyOptions<AuditRole>): Promise<AuditRole[]> {
    return await manager.getRepository(AuditRole).find(options);
  }

  async findAllAuditUserPermissions(
    manager: EntityManager,
    options?: FindManyOptions<AuditUserPermission>
  ): Promise<AuditUserPermission[]> {
    return await manager.getRepository(AuditUserPermission).find(options);
  }
  // findByIds
  async findAllAuditUserRoles(
    manager: EntityManager,
    options?: FindManyOptions<AuditUserRole>
  ): Promise<AuditUserRole[]> {
    return await manager.getRepository(AuditUserRole).find(options);
  }
}
