import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Permissions } from '../decorators/permissions.decorator';
import { FilterListQuery } from '../dto/filter-list.dto';
import { AuditPermission } from '../entities/audit-permission.entity';
import { AuditRole } from '../entities/audit-role.entity';
import { AuditUserRole } from '../entities/audit-user-role.entity';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AuditLogsService } from '../services/audit-logs.service';

@Controller()
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('audit/permissions')
  @Permissions('authorization.audit')
  @Transaction()
  async listAuditPermissions(
    @Query() query: FilterListQuery<AuditPermission>,
    @TransactionManager() manager: EntityManager
  ) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return this.auditLogsService.findAllAuditPermissions(manager, options);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('audit/roles')
  @Permissions('authorization.audit')
  @Transaction()
  async listAuditRoles(@Query() query: FilterListQuery<AuditRole>, @TransactionManager() manager: EntityManager) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return this.auditLogsService.findAllAuditRoles(manager, options);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('audit/user-permissions')
  @Permissions('authorization.audit')
  @Transaction()
  async listAuditUserPermissions(
    @Query() query: FilterListQuery<AuditPermission>,
    @TransactionManager() manager: EntityManager
  ) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return this.auditLogsService.findAllAuditUserPermissions(manager, options);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('audit/user-roles')
  @Permissions('authorization.audit')
  @Transaction()
  async listAuditUserRoles(
    @Query() query: FilterListQuery<AuditUserRole>,
    @Query('where') where: any,
    @TransactionManager() manager: EntityManager
  ) {
    const { skip, take, order } = query;
    const options = {
      where,
      skip: +skip,
      take: +take,
      order
    };
    return this.auditLogsService.findAllAuditUserRoles(manager, options);
  }
}
