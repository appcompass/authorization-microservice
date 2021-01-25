import * as vault from 'node-vault';

export class VaultConfig {
  private client: vault.client;
  constructor(private serviceName: string = 'authorization') {
    this.client = vault({
      token: process.env.VAULT_TOKEN
    });
  }

  async getServiceUrl(name: string) {
    try {
      const [serviceHost, servicePort] = await Promise.all(
        [`secret/service/shared/${name}ServiceHost`, `secret/service/shared/${name}ServicePort`].map((path) =>
          this.client.read(path).then(({ data }) => data.value)
        )
      );
      return `http://${serviceHost}:${servicePort}`;
    } catch (error) {
      throw Error(error.response.body.warnings);
    }
  }

  async getServiceConfig() {
    try {
      const [
        natsUrl,
        publicKey,
        serviceHost,
        servicePort,
        natsQueue,
        dbType,
        dbHost,
        dbPort,
        dbSchema,
        dbUser,
        dbPassword,
        dbName,
        dbSynchronize
      ] = await Promise.all(
        [
          'secret/service/shared/natsUrl',
          'secret/service/shared/publicKey',
          `secret/service/shared/${this.serviceName}ServiceHost`,
          `secret/service/shared/${this.serviceName}ServicePort`,
          `secret/service/${this.serviceName}/natsQueue`,
          `secret/service/${this.serviceName}/dbType`,
          `secret/service/${this.serviceName}/dbHost`,
          `secret/service/${this.serviceName}/dbPort`,
          `secret/service/${this.serviceName}/dbSchema`,
          `secret/service/${this.serviceName}/dbUser`,
          `secret/service/${this.serviceName}/dbPassword`,
          `secret/service/${this.serviceName}/dbName`,
          `secret/service/${this.serviceName}/dbSynchronize`
        ].map((path) => this.client.read(path).then(({ data }) => data.value))
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
        dbSynchronize
      };
    } catch (error) {
      throw Error(error.response.body.warnings);
    }
  }
}
