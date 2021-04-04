import { LoggerOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { AuditPermission } from '../api/entities/audit-permission.entity';
import { AuditRolePermission } from '../api/entities/audit-role-permission.entity';
import { AuditRole } from '../api/entities/audit-role.entity';
import { AuditUserPermission } from '../api/entities/audit-user-permission.entity';
import { AuditUserRole } from '../api/entities/audit-user-role.entity';
import { Permission } from '../api/entities/permission.entity';
import { Role } from '../api/entities/role.entity';
import { UserPermission } from '../api/entities/user-permission.entity';
import { UserRole } from '../api/entities/user-role.entity';
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
