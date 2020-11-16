import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './authorization/authorization.module';
import { ConfigModule } from './config/config.module';
import { DBModule } from './db/db.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [ConfigModule, DBModule, RolesModule, MessagingModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
