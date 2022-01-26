import { ConfigService } from '../config/config.service';
import { DBConfigService } from './db-config.service';

export = new DBConfigService(new ConfigService()).config;
