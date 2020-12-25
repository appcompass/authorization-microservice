# AppCompass Authorization Service

## Description

AppCompass Authorization Service provides authorization resources to a platform that uses this service's interface contract for use.

## First Time Setup

### For Local Development

If you use a tool like direnv to set project env vars, you don't need to run the below command.  However you will need to look at the `.env.example` file for the env vars you need set for the service to run properly.

If you wish to use a dotenv file run the following:

```bash

$ npm run generate:dotenv

```

Then modify the `local.env` file as needed if the default values don't work for you.  Specifically the database connection variables.

Once you have your environment variables set, run the following:

```bash

$ npm install
$ npm run schema:create

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

AppCompass Authorization Service is [MIT licensed](LICENSE).
