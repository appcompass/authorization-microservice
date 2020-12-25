import { createConnection } from 'typeorm';
import * as Joi from 'joi';

const arg = process.argv[process.argv.length - 1].trim();
const parsedArg = Object.fromEntries([arg.split(':')]);

const validator = Joi.object({
  schema: Joi.string().valid('create', 'drop', 'reset')
});

const { error } = validator.validate({ ...parsedArg });

if (error) {
  throw new Error(`validation error: ${error.message}`);
}

const commands = {
  'schema:create': (config) => `create schema if not exists ${config.schema};`,
  'schema:drop': (config) => `drop schema if exists ${config.schema} cascade;`,
  'schema:reset': (config) => `${commands['schema:drop'](config)} ${commands['schema:create'](config)}`
};

(() =>
  import('./src/db/cli-config').then((config) =>
    createConnection({ ...config, synchronize: false, migrationsRun: false })
      .then((connection) => connection.query(commands[arg](config)).then(() => connection.close()))
      .catch(console.log)
  ))();
