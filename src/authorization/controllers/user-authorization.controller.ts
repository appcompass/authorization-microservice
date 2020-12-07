import { Request } from 'express';
import { setUser } from 'src/db/query.utils';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import { Body, Controller, Get, Param, Put, Req, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

import { GetUserPermissionNamesPayload } from '../dto/get-user-permission-names.dto';
import { SyncUserPermissionsPayload } from '../dto/sync-user-permissions.dto';
import { SyncUserRolesPayload } from '../dto/sync-user-roles.dto';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { UserAuthorizationService } from '../services/user-authorization.service';

@Controller('user')
export class UserAuthorizationController {
  constructor(private readonly userAuthorizationService: UserAuthorizationService) {}
  @UseGuards(AuthGuard())
  @Get(':id/roles')
  @Transaction()
  async listUserRoles(@Param('id') id: number, @TransactionManager() manager: EntityManager) {
    return this.userAuthorizationService.findAllRoles(manager, id);
  }

  @UseGuards(AuthGuard())
  @Get(':id/permissions')
  @Transaction()
  async listUserPermissions(@Param('id') id: number, @TransactionManager() manager: EntityManager) {
    return this.userAuthorizationService.findAllPermissions(manager, id);
  }

  @UseGuards(AuthGuard())
  @Put(':id/roles/sync')
  @Transaction()
  async syncUserRoles(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: SyncUserRolesPayload,
    @Req() req: Request,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    const { roleIds } = payload;
    try {
      return await this.userAuthorizationService.syncRoles(manager, id, roleIds);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @UseGuards(AuthGuard())
  @Put(':id/permissions/sync')
  @Transaction()
  async syncUserPermissions(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: SyncUserPermissionsPayload,
    @Req() req: Request,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    const { permissionIds } = payload;
    try {
      return await this.userAuthorizationService.syncPermissions(manager, id, permissionIds);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @MessagePattern('authorization.user.get-permissions')
  @Transaction()
  async findByName(@Payload() payload: GetUserPermissionNamesPayload, @TransactionManager() manager: EntityManager) {
    return await this.userAuthorizationService.getAllPermissionNames(manager, payload);
  }
}
