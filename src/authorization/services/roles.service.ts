import { EntityManager, FindConditions, FindManyOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { UpdateRolePayload } from '../dto/role-update.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  async findAll(manager: EntityManager, options?: FindManyOptions<Role>): Promise<Role[]> {
    return await manager.getRepository(Role).find(options);
  }

  async findBy(manager: EntityManager, filters: FindConditions<Role>): Promise<Role | undefined> {
    return await manager.getRepository(Role).findOne(filters);
  }

  async create(manager: EntityManager, data: Partial<Role>) {
    return await manager.insert(Role, data);
  }

  async update(manager: EntityManager, id: number, data: Partial<UpdateRolePayload>) {
    const { affected } = await manager.createQueryBuilder().update(Role).set(data).where('id = :id', { id }).execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: number) {
    const { affected } = await manager.createQueryBuilder().delete().from(Role).where('id = :id', { id }).execute();
    return { affected };
  }

  async syncPermissions(manager: EntityManager, id: number, ids: number[]) {
    const query = manager.createQueryBuilder().relation(Role, 'permissions').of(id);
    const existingIds = (await query.loadMany<Permission>()).map((permission) => permission.id);
    const removed = existingIds.filter((id) => !ids.includes(id));
    const added = ids.filter((id) => !existingIds.includes(id));
    const unchanged = ids.filter((id) => existingIds.includes(id));
    await query.addAndRemove(added, removed);

    return {
      removed,
      added,
      unchanged
    };
  }
}
