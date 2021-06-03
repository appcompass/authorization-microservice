import * as Joi from 'joi';
import * as vault from 'node-vault';
import { createConnection } from 'typeorm';

import { Transport } from '@nestjs/microservices';

const arg = process.argv[process.argv.length - 1].trim();
const parsedArg = Object.fromEntries([arg.split(':')]);

const validator = Joi.object({
  schema: Joi.string().valid('create', 'drop', 'reset'),
  setup: Joi.string().valid('secrets')
});

const { error } = validator.validate({ ...parsedArg });

if (error) {
  throw new Error(`validation error: ${error.message}`);
}

const queryRunner = (query) =>
  import('./db/cli-config').then((config) =>
    createConnection({ ...config, synchronize: false, migrationsRun: false })
      .then((connection) => connection.query(query(config)).then(() => connection.close()))
      .catch(console.log)
  );

const commands = {
  'setup:secrets': async () => {
    const client = vault({
      token: process.env.VAULT_TOKEN
    });

    return await Promise.all(
      [
        { key: 'secret/service/shared/authorizationServiceHost', value: '0.0.0.0' },
        { key: 'secret/service/shared/authorizationServicePort', value: process.env.SERVICE_PORT || 3020 },
        {
          key: 'secret/service/authorization/natsUrl',
          value: process.env.SERVICE_NATS_URL || 'nats://localhost:4222'
        },
        {
          key: 'secret/service/authorization/interServiceTransportConfig',
          value:
            process.env.INTERSERVICE_TRANSPORT_CONFIG ||
            JSON.stringify({
              transport: Transport.NATS,
              options: {
                url: 'nats://localhost:4222',
                queue: 'authorization'
              }
            })
        },
        {
          key: 'secret/service/authorization/db',
          value:
            process.env.DB_CONFIG ||
            JSON.stringify({
              type: 'postgres',
              host: process.env.DB_HOST || '127.0.0.1',
              port: process.env.DB_PORT || 5432,
              username: process.env.DB_USER || 'postgres',
              password: process.env.DB_PASSWORD || '',
              schema: 'auth',
              database: process.env.DB_NAME || 'appcompass',
              synchronize: process.env.DB_SYNCHRONIZE || false,
              migrationsRun: true
            })
        }
      ].map(({ key, value }) => client.write(key, { value }))
    ).then(() => console.log('key pair secrets and config set'));
  },
  'schema:create': () => queryRunner((config) => `create schema if not exists ${config.schema};`),
  'schema:drop': () => queryRunner((config) => `drop schema if exists ${config.schema} cascade;`),
  'schema:reset': () =>
    queryRunner(
      (config) => `create schema if not exists ${config.schema}; drop schema if exists ${config.schema} cascade;`
    )
};

commands[arg]();
