import { getConnection } from 'typeorm';

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
  async findPermissionBy(@Payload() payload: Partial<Permission>) {
    return await getConnection().transaction(async (manager) => {
      return await this.permissionsService.findBy(manager, payload);
    });
  }

  @MessagePattern('authorization.role.find-by')
  async findRoleBy(@Payload() payload: Partial<Role>) {
    return await getConnection().transaction(async (manager) => {
      return await this.rolesService.findBy(manager, payload);
    });
  }

  @MessagePattern('authorization.register.roles')
  async registerRoles(@Payload() payload: EventPayload<RegisterRolesPayload[]>) {
    const { data, respondTo } = payload;
    return await getConnection().transaction(async (manager) => {
      await this.rolesService.registerRoles(manager, data);
      if (respondTo) this.messagingService.emit(respondTo, true);
    });
  }

  @MessagePattern('authorization.user.get-permission-names')
  async findByName(@Payload() payload: UserIdPayload) {
    return await getConnection().transaction(async (manager) => {
      return await this.userAuthorizationService.getAllPermissionNames(manager, payload);
    });
  }

  @MessagePattern('authorization.user.get-role-ids')
  async findUserRoles(@Payload() { userId }: UserIdPayload) {
    return await getConnection().transaction(async (manager) => {
      const roles = await this.userAuthorizationService.findAllRoles(manager, userId);
      return roles.map((role) => role.id);
    });
  }

  @MessagePattern('authorization.user.get-permission-ids')
  async findUserPermissions(@Payload() payload: UserIdPayload) {
    return await getConnection().transaction(async (manager) => {
      const permissions = await this.userAuthorizationService.getAllUserPermission(manager, payload);
      return permissions.map((permission) => permission.id);
    });
  }
}
