import { EntityManager, FindConditions, FindManyOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  async findAll(manager: EntityManager, options?: FindManyOptions<Permission>): Promise<Permission[]> {
    return await manager.getRepository(Permission).find(options);
  }

  async findBy(manager: EntityManager, filters: FindConditions<Permission>): Promise<Permission | undefined> {
    return await manager.getRepository(Permission).findOne(filters);
  }

  async create(manager: EntityManager, data: Partial<Permission>) {
    return await manager.insert(Permission, data);
  }

  async update(manager: EntityManager, id: number, data: Partial<Permission>) {
    const { affected } = await manager
      .createQueryBuilder()
      .update(Permission)
      .set(data)
      .where('id = :id', { id })
      .execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: number) {
    const { affected } = await manager
      .createQueryBuilder()
      .delete()
      .from(Permission)
      .where('id = :id', { id })
      .execute();
    return { affected };
  }
}
