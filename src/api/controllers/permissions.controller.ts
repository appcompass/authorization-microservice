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
import { CreatePermissionPayload } from '../dto/permission-create.dto';
import { UpdatePermissionPayload } from '../dto/permission-update.dto';
import { Permission } from '../entities/permission.entity';
import { PermissionsGuard } from '../guards/permissions.guard';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { NotSystemPermissionPipe } from '../pipes/not-system-permission.pipe';
import { QueryOrderPipe } from '../pipes/query-order.pipe';
import { PermissionsService } from '../services/permissions.service';

@Controller('v1/permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class PermissionsController {
  constructor(private readonly logger: ConsoleLogger, private readonly permissionsService: PermissionsService) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard(), PermissionsGuard)
  @Post()
  @Permissions('authorization.permission.create')
  async create(@Body() payload: CreatePermissionPayload, @Req() req: Request) {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      const { generatedMaps } = await this.permissionsService.create(manager, payload);
      const [{ id }] = generatedMaps;

      return { id };
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Get()
  @Permissions('authorization.permission.list')
  async list(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take: number,
    @Query('order', new DefaultValuePipe(''), QueryOrderPipe) order: OrderQuery<Permission>,
    @Query('filter', new DefaultValuePipe('')) filter?: string
  ): Promise<PaginatedResponse<Permission>> {
    return await getConnection().transaction(async (manager) => {
      try {
        const { data, total } = await this.permissionsService.findAll(manager, { skip, take, order, filter });
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
  @Permissions('authorization.permission.read')
  async findById(@Param('id') id: number) {
    return await getConnection().transaction(async (manager) => {
      try {
        return await this.permissionsService.findOne(manager, { id });
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Put(':id')
  @Permissions('authorization.permission.update')
  async updateById(
    @Param('id', NotSystemPermissionPipe) id: number,
    @Body(new NoEmptyPayloadPipe()) payload: UpdatePermissionPayload,
    @Req() req: Request
  ) {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.permissionsService.update(manager, id, payload);
      } catch (error) {
        throw new UnprocessableEntityException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard(), PermissionsGuard)
  @Delete(':id')
  @Permissions('authorization.permission.delete')
  async deleteById(@Param('id', NotSystemPermissionPipe) id: number, @Req() req: Request) {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      try {
        return await this.permissionsService.delete(manager, id);
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }
}
