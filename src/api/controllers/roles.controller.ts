import { Request } from 'express';
import { getConnection } from 'typeorm';

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
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
import { FilterListQuery } from '../dto/filter-list.dto';
import { IdResponse } from '../dto/id.dto';
import { PermissionIdsPayload } from '../dto/permission-ids.dto';
import { CreateRolePayload } from '../dto/role-create.dto';
import { UpdateRolePayload } from '../dto/role-update.dto';
import { RowsAffectedResponse } from '../dto/rows-affected.dto';
import { SyncResponse } from '../dto/sync-response.dto';
import { Role } from '../entities/role.entity';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { RolesService } from '../services/roles.service';

@Controller('roles')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class RolesController {
  constructor(private readonly logger: Logger, private readonly rolesService: RolesService) {
    this.logger.setContext(this.constructor.name);
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() payload: CreateRolePayload, @Req() req: Request): Promise<IdResponse> {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      const { generatedMaps } = await this.rolesService.create(manager, payload);
      const [{ id }] = generatedMaps;

      return { id };
    });
  }

  @UseGuards(AuthGuard())
  @Get()
  async list(@Query() query: FilterListQuery<Role>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };

    return await getConnection().transaction(async (manager) => {
      try {
        return this.rolesService.findAll(manager, options);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  async findById(@Param('id') id: number) {
    return await getConnection().transaction(async (manager) => {
      try {
        return await this.rolesService.findBy(manager, { id });
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard())
  @Put(':id')
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

  @UseGuards(AuthGuard())
  @Delete(':id')
  async deleteById(@Param('id') id: number, @Req() req: Request): Promise<RowsAffectedResponse> {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.rolesService.delete(manager, id);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard())
  @Put(':id/permissions/sync')
  async syncPermissions(
    @Param('id') id: number,
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
}
