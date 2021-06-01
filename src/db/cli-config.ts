import { ConfigService } from '../config/config.service';
import { DBConfigService } from './db-config.service';

export = (async () => new DBConfigService(await new ConfigService().setConfigFromVault()))().then(
  ({ config }) => config
);
