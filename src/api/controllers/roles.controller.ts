import { Request } from 'express';
import { getConnection } from 'typeorm';

import {
  Body,
  ConsoleLogger,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UnprocessableEntityException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { setUser } from '../../db/query.utils';
import { unauthorizedResponseOptions, unprocessableEntityResponseOptions } from '../api.contract-shapes';
import { OrderQuery, PaginatedResponse } from '../api.types';
import { Permissions } from '../decorators/permissions.decorator';
import { IdResponse } from '../dto/id.dto';
import { PermissionIdsPayload } from '../dto/permission-ids.dto';
import { CreateRolePayload } from '../dto/role-create.dto';
import { UpdateRolePayload } from '../dto/role-update.dto';
import { RowsAffectedResponse } from '../dto/rows-affected.dto';
import { SyncResponse } from '../dto/sync-response.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { PermissionsGuard } from '../guards/permissions.guard';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { NotSystemRolePipe } from '../pipes/not-system-role.pipe';
import { QueryOrderPipe } from '../pipes/query-order.pipe';
import { RolesService } from '../services/roles.service';

@Controller('v1/roles')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class RolesController {
  constructor(private readonly logger: ConsoleLogger, private readonly rolesService: RolesService) {
    this.logger.setContext(this.constructor.name);
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Post()
  @Permissions('authorization.role.create')
  async create(@Body() payload: CreateRolePayload, @Req() req: Request): Promise<IdResponse> {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      const { generatedMaps } = await this.rolesService.create(manager, payload);
      const [{ id }] = generatedMaps;

      return { id };
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get()
  @Permissions('authorization.role.list')
  async list(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @Query('order', new DefaultValuePipe(''), QueryOrderPipe) order: OrderQuery<Role>,
    @Query('filter', new DefaultValuePipe('')) filter?: string
  ): Promise<PaginatedResponse<Role>> {
    return await getConnection().transaction(async (manager) => {
      try {
        const { data, total } = await this.rolesService.findAll(manager, { skip, take, order, filter });
        return {
          data,
          pagination: {
            total,
            skip,
            take
          }
        };
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get(':id')
  @Permissions('authorization.role.read')
  async findById(@Param('id') id: number) {
    return await getConnection().transaction(async (manager) => {
      try {
        return await this.rolesService.findBy(manager, { id });
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id')
  @Permissions('authorization.role.update')
  async updateById(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: UpdateRolePayload,
    @Req() req: Request
  ): Promise<RowsAffectedResponse> {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.rolesService.update(manager, id, payload);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Delete(':id')
  @Permissions('authorization.role.delete')
  async deleteById(@Param('id', NotSystemRolePipe) id: number, @Req() req: Request): Promise<RowsAffectedResponse> {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.rolesService.delete(manager, id);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id/permissions/sync')
  @Permissions('authorization.role.update', 'authorization.permission.read')
  async syncPermissions(
    @Param('id', NotSystemRolePipe) id: number,
    @Body(new NoEmptyPayloadPipe()) payload: PermissionIdsPayload,
    @Req() req: Request
  ): Promise<SyncResponse> {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      const { permissionIds } = payload;
      try {
        return await this.rolesService.syncPermissions(manager, id, permissionIds);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get(':id/permissions')
  @Permissions('authorization.role.read', 'authorization.permission.list')
  async getPermissions(
    @Param('id') id: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @Query('order', new DefaultValuePipe(''), QueryOrderPipe) order: OrderQuery<Permission>,
    @Query('filter', new DefaultValuePipe('')) filter?: string
  ): Promise<PaginatedResponse<Permission>> {
    return await getConnection().transaction(async (manager) => {
      try {
        const { data, total } = await this.rolesService.getPermissions(manager, id, { skip, take, order, filter });
        return {
          data,
          pagination: {
            total,
            skip,
            take
          }
        };
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }
}
