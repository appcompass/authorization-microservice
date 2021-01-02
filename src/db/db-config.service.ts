import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

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

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.config;
  }

  get config() {
    return {
      logging: this.configService.get('NODE_ENV') === 'production' ? ['error', 'schema', 'warn'] : 'all',
      type: this.configService.get('dbType'),
      host: this.configService.get('dbHost'),
      port: this.configService.get('dbPort'),
      username: this.configService.get('dbUser'),
      password: this.configService.get('dbPassword'),
      database: this.configService.get('dbName'),
      schema: this.configService.get('dbSchema'),
      synchronize: this.configService.get('dbSyncronize'),
      migrationsRun: this.configService.get('dbSyncronize'),
      namingStrategy: new DBNamingStrategy(),
      entities,
      migrations: [`${__dirname}/migrations/*{.js,.ts}`],
      cli: {
        entitiesDir: 'src/db/entities',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'src/db/subscribers'
      }
    } as PostgresConnectionOptions;
  }
}
