import { AuditPermission } from 'src/authorization/entities/audit-permission.entity';
import { AuditRolePermission } from 'src/authorization/entities/audit-role-permission.entity';
import { AuditRole } from 'src/authorization/entities/audit-role.entity';
import { AuditUserPermission } from 'src/authorization/entities/audit-user-permission.entity';
import { AuditUserRole } from 'src/authorization/entities/audit-user-role.entity';
import { ConnectionOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

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

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.config;
  }

  get config() {
    return {
      logging: this.configService.get('NODE_ENV') === 'production' ? ['error', 'schema', 'warn'] : 'all',
      type: this.configService.get('DB_TYPE'),
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      schema: this.configService.get('DB_SCHEMA'),
      synchronize: this.configService.get('DB_SYNCHRONIZE'),
      migrationsRun: this.configService.get('DB_SYNCHRONIZE'),
      namingStrategy: new DBNamingStrategy(),
      entities,
      migrations: [`${__dirname}/migrations/*{.js,.ts}`],
      cli: {
        entitiesDir: 'src/db/entities',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'src/db/subscribers'
      }
    } as ConnectionOptions;
  }
}
