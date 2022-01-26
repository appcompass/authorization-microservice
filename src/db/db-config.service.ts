import { LoggerOptions } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';
import { DBNamingStrategy } from './naming.strategy';

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
      ...this.configService.get('DB_CONFIG'),
      namingStrategy: new DBNamingStrategy(),
      entities: [`${__dirname}/../**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/migrations/*{.js,.ts}`],
      cli: {
        entitiesDir: 'src/db/entities',
        migrationsDir: 'src/db/migrations',
        subscribersDir: 'src/db/subscribers'
      }
    };
  }
}
