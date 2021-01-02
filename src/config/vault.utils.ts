import * as vault from 'node-vault';

export const getVaultConfig = async () => {
  const client = vault({
    token: process.env.VAULT_TOKEN
  });
  try {
    const [
      serviceHost,
      servicePort,
      natsUrl,
      publicKey,
      natsQueue,
      dbType,
      dbHost,
      dbPort,
      dbSchema,
      dbUser,
      dbPassword,
      dbName,
      dbSyncronize
    ] = await Promise.all(
      [
        'secret/service/shared/authorizationServiceHost',
        'secret/service/shared/authorizationServicePort',
        'secret/service/shared/natsUrl',
        'secret/service/shared/publicKey',
        'secret/service/authorization/natsQueue',
        'secret/service/authorization/dbType',
        'secret/service/authorization/dbHost',
        'secret/service/authorization/dbPort',
        'secret/service/authorization/dbSchema',
        'secret/service/authorization/dbUser',
        'secret/service/authorization/dbPassword',
        'secret/service/authorization/dbName',
        'secret/service/authorization/dbSyncronize'
      ].map((path) => client.read(path).then(({ data }) => data.value))
    );
    return {
      serviceHost,
      servicePort,
      natsUrl,
      publicKey,
      natsQueue,
      dbType,
      dbHost,
      dbPort,
      dbSchema,
      dbUser,
      dbPassword,
      dbName,
      dbSyncronize
    };
  } catch (error) {
    throw Error(error.response.body.warnings);
  }
};
