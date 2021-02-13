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
      const [publicKey, serviceHost, servicePort, natsUrl, natsQueue, db] = await Promise.all(
        [
          'secret/service/shared/publicKey',
          `secret/service/shared/${this.serviceName}ServiceHost`,
          `secret/service/shared/${this.serviceName}ServicePort`,
          `secret/service/${this.serviceName}/natsUrl`,
          `secret/service/${this.serviceName}/natsQueue`,
          `secret/service/${this.serviceName}/db`
        ].map((path) => this.client.read(path).then(({ data }) => data.value))
      );
      return {
        serviceHost,
        servicePort,
        publicKey,
        natsUrl,
        natsQueue,
        db: JSON.parse(db)
      };
    } catch (error) {
      throw Error(error.error);
    }
  }
}
