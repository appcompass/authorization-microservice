import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '../config/config.service';
import { DBConfigService } from './db-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: DBConfigService
    })
  ],
  providers: [],
  exports: []
})
export class DBModule {}
