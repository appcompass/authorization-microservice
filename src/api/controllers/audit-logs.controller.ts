import { getConnection } from 'typeorm';

import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { unauthorizedResponseOptions, unprocessableEntityResponseOptions } from '../api.contract-shapes';
import { Permissions } from '../decorators/permissions.decorator';
import { FilterListQuery } from '../dto/filter-list.dto';
import { AuditPermission } from '../entities/audit-permission.entity';
import { AuditRole } from '../entities/audit-role.entity';
import { AuditUserRole } from '../entities/audit-user-role.entity';
import { PermissionsGuard } from '../guards/permissions.guard';
import { AuditLogsService } from '../services/audit-logs.service';

@Controller('audit')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class AuditLogsController {
  constructor(private readonly logger: Logger, private readonly auditLogsService: AuditLogsService) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('permissions')
  @Permissions('authorization.audit.permission')
  async listAuditPermissions(@Query() query: FilterListQuery<AuditPermission>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return await getConnection().transaction(async (manager) => {
      return this.auditLogsService.findAllAuditPermissions(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('roles')
  @Permissions('authorization.audit.role')
  async listAuditRoles(@Query() query: FilterListQuery<AuditRole>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return await getConnection().transaction(async (manager) => {
      return this.auditLogsService.findAllAuditRoles(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('user-permissions')
  @Permissions('authorization.audit.user-permission')
  async listAuditUserPermissions(@Query() query: FilterListQuery<AuditPermission>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return await getConnection().transaction(async (manager) => {
      return this.auditLogsService.findAllAuditUserPermissions(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('user-roles')
  @Permissions('authorization.audit.user-role')
  async listAuditUserRoles(@Query() query: FilterListQuery<AuditUserRole>, @Query('where') where: any) {
    const { skip, take, order } = query;
    const options = {
      where,
      skip: +skip,
      take: +take,
      order
    };
    return await getConnection().transaction(async (manager) => {
      return this.auditLogsService.findAllAuditUserRoles(manager, options);
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get('role-permissions')
  @Permissions('authorization.audit.role-permission')
  async listAuditRolePermissions(@Query() query: FilterListQuery<AuditUserRole>, @Query('where') where: any) {
    const { skip, take, order } = query;
    const options = {
      where,
      skip: +skip,
      take: +take,
      order
    };
    return await getConnection().transaction(async (manager) => {
      return this.auditLogsService.findAllAuditRolePermissions(manager, options);
    });
  }
}
