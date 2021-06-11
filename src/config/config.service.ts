import * as Joi from 'joi';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { ClientOptions } from '@nestjs/microservices';

import { VaultConfig } from './vault.utils';

export type EnvConfig = Record<string, string>;

export interface AppConfig {
  rateLimit: {
    windowMs?: number;
    max?: number;
    message?: string;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
  };
}
export interface ValidConfig {
  NODE_ENV: string;
  npm_package_name: string;
  npm_package_gitHead: string;
  npm_package_version: string;
  serviceHost: string;
  servicePort: number;
  publicKey: string;
  appConfig: AppConfig;
  interServiceTransportConfig: ClientOptions;
  db: PostgresConnectionOptions;
}

export class ConfigService {
  private config: ValidConfig;
  public vault: VaultConfig;
  private schema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string().default('local'),
    npm_package_name: Joi.string(),
    npm_package_gitHead: Joi.string(),
    npm_package_version: Joi.string(),
    serviceHost: Joi.string(),
    servicePort: Joi.number(),
    publicKey: Joi.string(),
    appConfig: Joi.object(),
    interServiceTransportConfig: Joi.object(),
    db: Joi.object()
  }).options({ stripUnknown: true });

  async setConfigFromVault() {
    this.vault = new VaultConfig(process.env.npm_package_name);
    const config: EnvConfig = await this.vault.getServiceConfig();
    this.config = this.validate({ ...process.env, ...config });

    return this;
  }

  private validate(config: EnvConfig): ValidConfig {
    const { error, value } = this.schema.validate(config);

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return value;
  }

  public get<K extends keyof ValidConfig>(key: K): ValidConfig[K] {
    return this.config[key];
  }
}
