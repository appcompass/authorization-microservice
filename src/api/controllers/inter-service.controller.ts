import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MessagingService } from '../../messaging/messaging.service';
import { EventPayload } from '../dto/event-payload.dto';
import { RegisterRolesPayload } from '../dto/register-roles.dto';
import { UserIdPayload } from '../dto/user-id.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
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

  @MessagePattern('authorization.permission.find-by')
  @Transaction()
  async findPermissionBy(@Payload() payload: Partial<Permission>, @TransactionManager() manager: EntityManager) {
    return await this.permissionsService.findBy(manager, payload);
  }

  @MessagePattern('authorization.role.find-by')
  @Transaction()
  async findRoleBy(@Payload() payload: Partial<Role>, @TransactionManager() manager: EntityManager) {
    return await this.rolesService.findBy(manager, payload);
  }

  @MessagePattern('authorization.register.roles')
  @Transaction()
  async registerRoles(
    @Payload() payload: EventPayload<RegisterRolesPayload[]>,
    @TransactionManager() manager: EntityManager
  ) {
    const { data, respondTo } = payload;
    await this.rolesService.registerRoles(manager, data);
    if (respondTo) this.messagingService.emit(respondTo, true);
  }

  @MessagePattern('authorization.user.get-permission-names')
  @Transaction()
  async findByName(@Payload() payload: UserIdPayload, @TransactionManager() manager: EntityManager) {
    return await this.userAuthorizationService.getAllPermissionNames(manager, payload);
  }

  @MessagePattern('authorization.user.get-role-ids')
  @Transaction()
  async findUserRoles(@Payload() { userId }: UserIdPayload, @TransactionManager() manager: EntityManager) {
    const roles = await this.userAuthorizationService.findAllRoles(manager, userId);
    return roles.map((role) => role.id);
  }

  @MessagePattern('authorization.user.get-permission-ids')
  @Transaction()
  async findUserPermissions(@Payload() payload: UserIdPayload, @TransactionManager() manager: EntityManager) {
    const permissions = await this.userAuthorizationService.getAllUserPermission(manager, payload);
    return permissions.map((permission) => permission.id);
  }
}
