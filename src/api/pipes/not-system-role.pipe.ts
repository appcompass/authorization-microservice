import { getManager } from 'typeorm';

import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

import { RolesService } from '../services/roles.service';

@Injectable()
export class NotSystemRolePipe implements PipeTransform {
  constructor(protected readonly roleService: RolesService) {}
  async transform(id: number) {
    const role = await getManager().transaction(
      async (manager) => await this.roleService.findBy(manager, { id, system: false })
    );

    if (!role) throw new UnprocessableEntityException(`A none system Role by id: ${id}, doesn't exist.`);
    return id;
  }
}
