import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

import { CreateRolePayload } from '../dto/role-create.dto';
import { SortListQuery } from '../dto/sort-list.dto';
import { PermissionsService } from '../services/permissions.service';

@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(AuthGuard())
  @Post('permissions')
  async create(@Body() payload: CreateRolePayload) {
    return this.permissionsService.create(payload);
  }

  @UseGuards(AuthGuard())
  @Get('permissions')
  async list(@Query() query: SortListQuery) {
    const { skip, take, order: orderStr } = query;
    // TODO: pull this into the DTO (somehow)
    const order = orderStr
      .split(',')
      .map((row) => row.split(':'))
      .reduce((o, [k, v]) => ((o[k.trim().toLocaleLowerCase()] = (v || 'asc').trim().toUpperCase()), o), {});
    const options = {
      skip: +skip,
      take: +take,
      order
    };

    return this.permissionsService.findAll(options);
  }

  @MessagePattern('permissions.permission.find')
  async findBy(@Payload() name: string) {
    return await this.permissionsService.findByName(name);
  }

  @UseGuards(AuthGuard())
  @Delete('permissions/:id')
  async delete(@Param('id') id: number) {
    return this.permissionsService.delete(id);
  }
}
