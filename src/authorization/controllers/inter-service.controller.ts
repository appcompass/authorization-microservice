import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import { Body, Controller, Logger, Post } from '@nestjs/common';

import { MessagingService } from '../../messaging/messaging.service';
import { EventPayload } from '../dto/event-payload.dto';
import { GetUserPermissionNamesPayload } from '../dto/get-user-permission-names.dto';
import { RegisterRolesPayload } from '../dto/register-roles.dto';
import { PermissionsService } from '../services/permissions.service';
import { RolesService } from '../services/roles.service';
import { UserAuthorizationService } from '../services/user-authorization.service';

@Controller()
export class InterServiceController {
  constructor(
    private readonly logger: Logger,
    private readonly messagingService: MessagingService,
    private readonly permissionsService: PermissionsService,
    private readonly rolesService: RolesService,
    private readonly userAuthorizationService: UserAuthorizationService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  // @UseGuards(AuthGuard('api'))
  @Post('permissions.permission.findByName')
  @Transaction()
  async findPermissionByName(@Body() name: string, @TransactionManager() manager: EntityManager) {
    return await this.permissionsService.findBy(manager, { name });
  }

  // @UseGuards(AuthGuard('api'))
  @Post('roles.role.findByName')
  @Transaction()
  async findBy(@Body() name: string, @TransactionManager() manager: EntityManager) {
    return await this.rolesService.findBy(manager, { name });
  }

  // @UseGuards(AuthGuard('api'))
  @Post('authorization.register.roles')
  @Transaction()
  async registerRoles(
    @Body() payload: EventPayload<RegisterRolesPayload[]>,
    @TransactionManager() manager: EntityManager
  ) {
    const { data, respondTo } = payload;
    await this.rolesService.registerRoles(manager, data);
    if (respondTo) this.messagingService.emit(respondTo, true);
  }

  // @UseGuards(AuthGuard('api'))
  @Post('authorization.user.get-permissions')
  @Transaction()
  async findByName(@Body() payload: GetUserPermissionNamesPayload, @TransactionManager() manager: EntityManager) {
    return await this.userAuthorizationService.getAllPermissionNames(manager, payload);
  }
}
