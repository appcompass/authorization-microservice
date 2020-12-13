import { Request, Response } from 'express';
import { MessagingService } from 'src/messaging/messaging.service';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

import { setUser } from '../../db/query.utils';
import { EventPayload } from '../dto/event-payload.dto';
import { FilterListQuery } from '../dto/filter-list.dto';
import { RegisterRolesPayload } from '../dto/register-roles.dto';
import { CreateRolePayload } from '../dto/role-create.dto';
import { UpdateRolePayload } from '../dto/role-update.dto';
import { SyncRolePermissionsPayload } from '../dto/sync-role-permissions.dto';
import { Role } from '../entities/role.entity';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { RolesService } from '../services/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly messagingService: MessagingService, private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard())
  @Post()
  @Transaction()
  async create(@Body() payload: CreateRolePayload, @Req() req: Request, @TransactionManager() manager: EntityManager) {
    await setUser(req.user, manager);
    const { generatedMaps } = await this.rolesService.create(manager, payload);
    const [{ id }] = generatedMaps;

    return { id };
  }

  @UseGuards(AuthGuard())
  @Get()
  @Transaction()
  async list(@Query() query: FilterListQuery<Role>, @TransactionManager() manager: EntityManager) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };

    return this.rolesService.findAll(manager, options);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  @Transaction()
  async findById(@Param('id') id: number, @Res() res: Response, @TransactionManager() manager: EntityManager) {
    const response = await this.rolesService.findBy(manager, { id });
    const statusCode = response ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    res.status(statusCode).send(response);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  @Transaction()
  async updateById(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: UpdateRolePayload,
    @Req() req: Request,
    @Res() res: Response,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    try {
      const { affected } = await this.rolesService.update(manager, id, payload);
      const statusCode = affected ? HttpStatus.OK : HttpStatus.NOT_FOUND;
      res.status(statusCode).send();
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  @Transaction()
  async deleteById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    const { affected } = await this.rolesService.delete(manager, id);
    const status = affected ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    res.status(status).send();
  }

  @UseGuards(AuthGuard())
  @Put(':id/permissions/sync')
  @Transaction()
  async syncPermissions(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: SyncRolePermissionsPayload,
    @Req() req: Request,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    const { permissionIds } = payload;
    try {
      return await this.rolesService.syncPermissions(manager, id, permissionIds);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @MessagePattern('roles.role.findByName')
  @Transaction()
  async findBy(@Payload() name: string, @TransactionManager() manager: EntityManager) {
    return await this.rolesService.findBy(manager, { name });
  }

  @EventPattern('authorization.register.roles')
  @Transaction()
  async registerRoles(
    @Payload() payload: EventPayload<RegisterRolesPayload[]>,
    @TransactionManager() manager: EntityManager
  ) {
    const { data, respondTo } = payload;
    await this.rolesService.registerRoles(manager, data);
    if (respondTo) this.messagingService.emit(respondTo, true);
  }
}
