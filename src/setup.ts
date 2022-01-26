import { writeFileSync } from 'fs';
import * as Joi from 'joi';
import { firstValueFrom } from 'rxjs';
import { createConnection } from 'typeorm';

import { ClientProxyFactory, Transport } from '@nestjs/microservices';

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

const queryRunner = (query: Function) =>
  import('./db/cli-config').then((config) =>
    createConnection({ ...config, synchronize: false, migrationsRun: false })
      .then((connection) => connection.query(query(config)).then(() => connection.close()))
      .catch(console.log)
  );
const commands = {
  'setup:secrets': async () => {
    const appConfig =
      process.env.APP_CONFIG ||
      JSON.stringify({
        rateLimit: {
          max: 0
        }
      });
    const interServiceTransportConfig =
      process.env.INTERSERVICE_TRANSPORT_CONFIG ||
      JSON.stringify({
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
          queue: 'authorization'
        }
      });
    const dbConfig =
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
      });
    const client = ClientProxyFactory.create(JSON.parse(interServiceTransportConfig));
    const publicKey = await firstValueFrom(client.send<string>('authentication.public-key', {}));
    client.close();
    try {
      writeFileSync(
        '.envrc',
        `
export SERVICE_NAME=authorization
export SERVICE_PORT=3020
export ENV=local
export PUBLIC_KEY=${JSON.stringify(publicKey)}
export APP_CONFIG='${appConfig}'
export INTERSERVICE_TRANSPORT_CONFIG='${interServiceTransportConfig}'
export DB_CONFIG='${dbConfig}'
`
      );
    } catch (error) {
      console.log(error);
    }
  },
  'schema:create': () => queryRunner((config) => `create schema if not exists ${config.schema};`),
  'schema:drop': () => queryRunner((config) => `drop schema if exists ${config.schema} cascade;`),
  'schema:reset': () =>
    queryRunner(
      (config) => `create schema if not exists ${config.schema}; drop schema if exists ${config.schema} cascade;`
    )
};

commands[arg]();
