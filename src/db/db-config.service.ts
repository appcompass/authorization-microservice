import { LoggerOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { AuditPermission } from '../authorization/entities/audit-permission.entity';
import { AuditRolePermission } from '../authorization/entities/audit-role-permission.entity';
import { AuditRole } from '../authorization/entities/audit-role.entity';
import { AuditUserPermission } from '../authorization/entities/audit-user-permission.entity';
import { AuditUserRole } from '../authorization/entities/audit-user-role.entity';
import { Permission } from '../authorization/entities/permission.entity';
import { Role } from '../authorization/entities/role.entity';
import { UserPermission } from '../authorization/entities/user-permission.entity';
import { UserRole } from '../authorization/entities/user-role.entity';
import { ConfigService } from '../config/config.service';
import { DBNamingStrategy } from './naming.strategy';

export const entities: Function[] = [
  AuditPermission,
  AuditRolePermission,
  AuditRole,
  AuditUserPermission,
  AuditUserRole,
  Permission,
  Role,
  UserPermission,
  UserRole
];

@Injectable()
export class DBConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions() {
    return this.config;
  }

  get config() {
    return {
      logging: (this.configService.get('NODE_ENV') === 'production'
        ? ['error', 'schema', 'warn']
        : 'all') as LoggerOptions,
      ...this.configService.get('db'),
      namingStrategy: new DBNamingStrategy(),
      entities,
      migrations: [`${__dirname}/migrations/*{.js,.ts}`],
      cli: {
        entitiesDir: 'src/db/entities',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'src/db/subscribers'
      }
    };
  }
}
