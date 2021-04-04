import { Request, Response } from 'express';
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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { setUser } from '../../db/query.utils';
import { FilterListQuery } from '../dto/filter-list.dto';
import { CreatePermissionPayload } from '../dto/permission-create.dto';
import { UpdatePermissionPayload } from '../dto/permission-update.dto';
import { Permission } from '../entities/permission.entity';
import { NoEmptyPayloadPipe } from '../pipes/no-empty-payload.pipe';
import { PermissionsService } from '../services/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(AuthGuard())
  @Post()
  @Transaction()
  async create(
    @Body() payload: CreatePermissionPayload,
    @Req() req: Request,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    const { generatedMaps } = await this.permissionsService.create(manager, payload);
    const [{ id }] = generatedMaps;

    return { id };
  }

  @UseGuards(AuthGuard())
  @Get()
  @Transaction()
  async list(@Query() query: FilterListQuery<Permission>, @TransactionManager() manager: EntityManager) {
    const { skip, take, order } = query;
    const options = {
      skip: +skip,
      take: +take,
      order
    };
    return this.permissionsService.findAll(manager, options);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  @Transaction()
  async findById(@Param('id') id: number, @Res() res: Response, @TransactionManager() manager: EntityManager) {
    const response = await this.permissionsService.findBy(manager, { id });
    const statusCode = response ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    res.status(statusCode).send(response);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  @Transaction()
  async updateById(
    @Param('id') id: number,
    @Body(new NoEmptyPayloadPipe()) payload: UpdatePermissionPayload,
    @Req() req: Request,
    @Res() res: Response,
    @TransactionManager() manager: EntityManager
  ) {
    await setUser(req.user, manager);
    const { affected } = await this.permissionsService.update(manager, id, payload);
    const statusCode = affected ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    res.status(statusCode).send();
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
    const { affected } = await this.permissionsService.delete(manager, id);
    const status = affected ? HttpStatus.OK : HttpStatus.NOT_FOUND;
    res.status(status).send();
  }
}
