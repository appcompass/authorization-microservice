import { Connection, FindManyOptions, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>
  ) {}

  async findAll(options?: FindManyOptions<Permission>): Promise<Permission[]> {
    console.log(options);
    return await this.permissionRepository.find(options);
  }

  async findByName(name: string): Promise<Permission | undefined> {
    return await this.permissionRepository.findOne({ name });
  }

  async save(data: Partial<Permission>) {
    return await this.permissionRepository.save(data);
  }

  async create(data: Partial<Permission>) {
    return await this.connection.transaction(async (entityManager) => await entityManager.insert(Permission, data));
  }

  async update(id: number, data: Partial<Permission>) {
    const { affected } = await this.connection.transaction(
      async (entityManager) =>
        await entityManager.createQueryBuilder().update(Permission).set(data).where('id = :id', { id }).execute()
    );
    return { affected };
  }

  async delete(id: number) {
    const { affected } = await this.connection.transaction(
      async (entityManager) =>
        await entityManager.createQueryBuilder().delete().from(Permission).where('id = :id', { id }).execute()
    );
    return { affected };
  }
}
