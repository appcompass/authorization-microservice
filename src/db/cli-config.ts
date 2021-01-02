import { ConfigService } from '../config/config.service';
import { getVaultConfig } from '../config/vault.utils';
import { DBConfigService } from './db-config.service';

export = (async () => new DBConfigService(new ConfigService(await getVaultConfig())))().then(({ config }) => config);
