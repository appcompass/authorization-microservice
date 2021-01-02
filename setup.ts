import * as Joi from 'joi';
import * as vault from 'node-vault';
import { createConnection } from 'typeorm';

const arg = process.argv[process.argv.length - 1].trim();
const parsedArg = Object.fromEntries([arg.split(':')]);

const validator = Joi.object({
  generate: Joi.string().valid('secrets'),
  schema: Joi.string().valid('create', 'drop', 'reset')
});

const { error } = validator.validate({ ...parsedArg });

if (error) {
  throw new Error(`validation error: ${error.message}`);
}

const queryRunner = (query) =>
  import('./src/db/cli-config').then((config) =>
    createConnection({ ...config, synchronize: false, migrationsRun: false })
      .then((connection) => connection.query(query(config)).then(() => connection.close()))
      .catch(console.log)
  );

const commands = {
  'generate:secrets': async () => {
    const client = vault({
      token: process.env.VAULT_ADMIN_TOKEN
    });

    await Promise.all([
      client
        .write('secret/service/shared/authorizationServiceHost', {
          value: '0.0.0.0'
        })
        .catch(console.error),
      client
        .write('secret/service/shared/authorizationServicePort', {
          value: 3002
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbType', {
          value: 'postgres'
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbHost', {
          value: process.env.DB_HOST
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbPort', {
          value: process.env.DB_PORT
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbSchema', {
          value: process.env.DB_SCHEMA
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbUser', {
          value: process.env.DB_USER
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbPassword', {
          value: process.env.DB_PASSWORD
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbName', {
          value: process.env.DB_NAME
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/dbSyncronize', {
          value: process.env.DB_SYNCHRONIZE
        })
        .catch(console.error),
      client
        .write('secret/service/authorization/natsQueue', {
          value: 'authorization'
        })
        .catch(console.error)
    ]).then(() => console.log('secrets set'));
  },
  'schema:create': () => queryRunner((config) => `create schema if not exists ${config.schema};`),
  'schema:drop': () => queryRunner((config) => `drop schema if exists ${config.schema} cascade;`),
  'schema:reset': () =>
    queryRunner(
      (config) => `create schema if not exists ${config.schema}; drop schema if exists ${config.schema} cascade;`
    )
};

commands[arg]();
