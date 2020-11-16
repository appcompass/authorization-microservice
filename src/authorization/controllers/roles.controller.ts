import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

import { CreateRolePayload } from '../dto/role-create.dto';
import { SortListQuery } from '../dto/sort-list.dto';
import { RolesService } from '../services/roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(AuthGuard())
  @Post('roles')
  async create(@Body() payload: CreateRolePayload) {
    return this.rolesService.create(payload);
  }

  @UseGuards(AuthGuard())
  @Get('roles')
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

    return this.rolesService.findAll(options);
  }

  @MessagePattern('roles.role.find')
  async findBy(@Payload() name: string) {
    return await this.rolesService.findByName(name);
  }

  @UseGuards(AuthGuard())
  @Delete('roles/:id')
  async delete(@Param('id') id: number) {
    return this.rolesService.delete(id);
  }
}
