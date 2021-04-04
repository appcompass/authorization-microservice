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
import { CreatePermissionPayload } from '../dto/permission-create.dto';
import { UpdatePermissionPayload } from '../dto/permission-update.dto';
import { Permission } from '../entities/permission.entity';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { PermissionsService } from '../services/permissions.service';

@Controller('permissions')
@ApiBearerAuth()
@ApiUnauthorizedResponse(unauthorizedResponseOptions)
@ApiUnprocessableEntityResponse(unprocessableEntityResponseOptions)
export class PermissionsController {
  constructor(private readonly logger: Logger, private readonly permissionsService: PermissionsService) {
    this.logger.setContext(this.constructor.name);
  }
  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() payload: CreatePermissionPayload, @Req() req: Request) {
    return await getConnection().transaction(async (manager) => {
      await setUser(req.user, manager);
      const { generatedMaps } = await this.permissionsService.create(manager, payload);
      const [{ id }] = generatedMaps;

      return { id };
    });
  }

  @UseGuards(AuthGuard())
  @Get()
  async list(@Query() query: FilterListQuery<Permission>) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };

    return await getConnection().transaction(async (manager) => {
      try {
        return this.permissionsService.findAll(manager, options);
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
        return await this.permissionsService.findBy(manager, { id });
      } catch (error) {
        throw new NotFoundException(error.message);
      }
    });
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  async updateById(
    @Param('id') id: number,
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

  @UseGuards(AuthGuard())
  @Delete(':id')
  async deleteById(@Param('id') id: number, @Req() req: Request) {
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
