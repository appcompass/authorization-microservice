import { Connection, FindManyOptions, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly connection: Connection,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async findAll(options?: FindManyOptions<Role>): Promise<Role[]> {
    return await this.roleRepository.find(options);
  }

  async findByName(name: string): Promise<Role | undefined> {
    return await this.roleRepository.findOne({ name });
  }

  async save(data: Partial<Role>) {
    return await this.roleRepository.save(data);
  }

  async create(data: Partial<Role>) {
    return await this.connection.transaction(async (entityManager) => await entityManager.insert(Role, data));
  }

  async update(id: number, data: Partial<Role>) {
    const { affected } = await this.connection.transaction(
      async (entityManager) =>
        await entityManager.createQueryBuilder().update(Role).set(data).where('id = :id', { id }).execute()
    );
    return { affected };
  }

  async delete(id: number) {
    const { affected } = await this.connection.transaction(
      async (entityManager) =>
        await entityManager.createQueryBuilder().delete().from(Role).where('id = :id', { id }).execute()
    );
    return { affected };
  }
}
