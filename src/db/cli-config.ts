import { ConfigService } from '../config/config.service';
import { VaultConfig } from '../config/vault.utils';
import { DBConfigService } from './db-config.service';

export = (async () => new DBConfigService(new ConfigService(await new VaultConfig().getServiceConfig())))().then(
  ({ config }) => config
);
