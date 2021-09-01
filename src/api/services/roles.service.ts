import { ConfigService } from 'src/config/config.service';
import { EntityManager, FindConditions, In, ObjectLiteral } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { FilterAllQuery, ResultsAndTotal } from '../api.types';
import { RegisterRolesPayload } from '../dto/register-roles.dto';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(private readonly configService: ConfigService) {}

  async findAll(manager: EntityManager, options: FilterAllQuery<Role>): Promise<ResultsAndTotal<Role>> {
    const { skip, take, order, filter } = options;
    const params = { filter: `%${filter}%` };
    const baseQuery = manager.createQueryBuilder().select('r').from(Role, 'r');
    const query = (
      filter ? baseQuery.where('r.name LIKE :filter or r.label LIKE :filter or r.description LIKE :filter') : baseQuery
    ).setParameters(params);
    const [data, total] = await Promise.all([query.skip(skip).take(take).orderBy(order).getMany(), query.getCount()]);
    return { data, total };
  }

  async findAllWhere(manager: EntityManager, where: ObjectLiteral): Promise<Role[]> {
    return await manager.createQueryBuilder().select('r').from(Role, 'r').where(where).getMany();
  }

  async findBy(manager: EntityManager, filters: FindConditions<Role>): Promise<Role | undefined> {
    return await manager.getRepository(Role).findOne(filters);
  }

  async create(manager: EntityManager, data: Partial<Role>) {
    return await manager.insert(Role, data);
  }

  async update(manager: EntityManager, id: number, data: Partial<Role>) {
    const { affected } = await manager.createQueryBuilder().update(Role).set(data).where('id = :id', { id }).execute();
    return { affected };
  }

  async delete(manager: EntityManager, id: number) {
    const { affected } = await manager.createQueryBuilder().delete().from(Role).where('id = :id', { id }).execute();
    return { affected };
  }

  async getPermissions(manager: EntityManager, id: number, options?: FilterAllQuery<Permission>) {
    const { schema } = this.configService.get('db');
    const { skip, take, order, filter } = options;
    const params = { id, filter: `%${filter}%` };
    const query = manager
      .createQueryBuilder()
      .select('p')
      .from(Permission, 'p')
      .where(
        `exists (select 1 from ${schema}.role_permission rp where rp.role_id = :id and rp.permission_id = p.id)` +
          (filter ? 'and (p.name LIKE :filter or p.label LIKE :filter or p.description LIKE :filter)' : '')
      )
      .setParameters(params);

    const [data, total] = await Promise.all([query.skip(skip).take(take).orderBy(order).getMany(), query.getCount()]);
    return { data, total };
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

  async registerRoles(manager: EntityManager, payload: RegisterRolesPayload[]) {
    for (let index = 0; index < payload.length; index++) {
      await this.registerRole(manager, payload[index]);
    }
  }

  async registerRole(manager: EntityManager, payload: RegisterRolesPayload) {
    const { permissions, ...roleData } = payload;
    const roleId = await this.findOrCreateRoleId(manager, roleData);
    const permissionIds = await this.findOrCreatePermissionIds(manager, permissions);
    await this.syncPermissions(manager, roleId, permissionIds);
  }

  async findOrCreatePermissionIds(manager: EntityManager, payload: Partial<Role>[]) {
    const where = { name: In(payload.map(({ name }) => name)) };
    const foundPermissions = await manager.getRepository(Permission).find({ where });
    const foundNames = foundPermissions.map((permission) => permission.name);
    const foundIds = foundPermissions.map((permission) => permission.id);
    const permissionsToCreate = payload.filter(({ name }) => !foundNames.includes(name));
    const { generatedMaps } = await manager.insert(Permission, permissionsToCreate);
    const createdIds: number[] = generatedMaps.map(({ id }) => id);
    return [...foundIds, ...createdIds];
  }

  async findOrCreateRoleId(manager: EntityManager, { name, label, description }: Partial<Role>) {
    const role = await this.findBy(manager, { name });
    if (role) return role.id;

    const {
      generatedMaps: [{ id }]
    } = await manager.insert(Role, {
      name,
      label,
      description
    });

    return id;
  }
}
