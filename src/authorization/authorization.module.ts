import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DBConfigService, entities } from '../db/db-config.service';
import { MessagingModule } from '../messaging/messaging.module';
import { PermissionsController } from './controllers/permissions.controller';
import { RolesController } from './controllers/roles.controller';
import { PermissionsService } from './services/permissions.service';
import { RolesService } from './services/roles.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OrderQueryValidator } from './validators/order-query-string.validator';
import { RoleExistsValidator } from './validators/role-exists.validator';
import { SameAsValidator } from './validators/same-as.validator';

@Module({
  imports: [TypeOrmModule.forFeature(entities), MessagingModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [PermissionsController, RolesController],
  providers: [
    JwtStrategy,
    DBConfigService,
    PermissionsService,
    RolesService,
    PermissionsService,
    SameAsValidator,
    RoleExistsValidator,
    OrderQueryValidator
  ],
  exports: [TypeOrmModule, PermissionsService, RolesService]
})
export class RolesModule {}
