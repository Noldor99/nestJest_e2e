/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CONNECTION_TEST from '../src/database/db.connection';
import { Power } from '../src/entity/power.entity';
import { PowerModule } from '../src/power/power.module';
import { Hero } from '../src/entity/hero.entity';
import { HeroModule } from '../src/hero/hero.module';
import { FilesModule } from '../src/files/files.module';

let app: INestApplication;

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      //@ts-ignore
      TypeOrmModule.forRoot({
        ...CONNECTION_TEST,
        entities: [Power, Hero],
        synchronize: true,
      }),
      PowerModule,
      HeroModule,
      FilesModule,
    ],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

export { app };
