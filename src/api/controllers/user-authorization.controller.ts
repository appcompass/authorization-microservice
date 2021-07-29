import { Request } from 'express';
import { getConnection } from 'typeorm';

import { Body, ConsoleLogger, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { setUser } from '../../db/query.utils';
import { unauthorizedResponseOptions, unprocessableEntityResponseOptions } from '../api.contract-shapes';
import { PermissionIdsPayload } from '../dto/permission-ids.dto';
import { SyncResponse } from '../dto/sync-response.dto';
import { SyncUserRolesPayload } from '../dto/sync-user-roles.dto';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { UserAuthorizationService } from '../services/user-authorization.service';

@Controller('user')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class UserAuthorizationController {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly userAuthorizationService: UserAuthorizationService
  ) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard())
  @Get(':id/roles')
  async listUserRoles(@Param('id') id: number) {
    return await getConnection().transaction(async (manager) => {
      return this.userAuthorizationService.findAllRoles(manager, id);
    });
  }

  @UseGuards(AuthGuard())
  @Get(':id/permissions')
  async listUserPermissions(@Param('id') id: number) {
    return await getConnection().transaction(async (manager) => {
      return this.userAuthorizationService.findUserPermissions(manager, id);
    });
  }

  @UseGuards(AuthGuard())
  @Put(':id/roles/sync')
  async syncUserRoles(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: SyncUserRolesPayload,
    @Req() req: Request
  ): Promise<SyncResponse> {
    const { roleIds } = payload;
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      return await this.userAuthorizationService.syncRoles(manager, id, roleIds);
    });
  }

  @UseGuards(AuthGuard())
  @Put(':id/permissions/sync')
  async syncUserPermissions(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: PermissionIdsPayload,
    @Req() req: Request
  ): Promise<SyncResponse> {
    const { permissionIds } = payload;
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      return await this.userAuthorizationService.syncPermissions(manager, id, permissionIds);
    });
  }
}
