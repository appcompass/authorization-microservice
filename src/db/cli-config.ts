import { ConfigService } from '../config/config.service';
import { DBConfigService } from './db-config.service';

const dbConfigService = new DBConfigService(new ConfigService());

export = dbConfigService.config;
