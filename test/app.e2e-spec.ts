import * as request from 'supertest';

import { ConsoleLogger, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AppServiceMock } from './app.service.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  process.env.npm_package_gitHead = 'test';
  process.env.npm_package_version = '0.0.0';

  beforeEach(async () => {
    const AppServiceProvider = {
      provide: AppService,
      useClass: AppServiceMock
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppServiceProvider, ConsoleLogger]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/status (GET)', () =>
    request(app.getHttpServer()).get('/status').expect(200).expect({
      gitHash: 'testGitHash',
      serviceName: 'testServiceName',
      version: 'testVersion'
    }));
});
