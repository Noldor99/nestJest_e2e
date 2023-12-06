/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Power } from '../src/entity/power.entity';
import * as supertest from 'supertest';
import CONNECTION from '../src/database/db.connection';
import { PowerModule } from '../src/power/power.module';
import { Hero } from '../src/entity/hero.entity';
import { CreateHeroDto } from 'src/hero/dto/create-hero.dto';
import { HeroModule } from '../src/hero/hero.module';

describe('/hero (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        //@ts-ignore
        TypeOrmModule.forRoot({
          ...CONNECTION,
          entities: [Power, Hero],
          synchronize: true,
        }),
        PowerModule,
        HeroModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/hero (POST)', async () => {
    const createHeroDto: CreateHeroDto = {
      nickname: 'Superman',
      real_name: 'Clark Kent',
      origin_description: 'He was born Kal-El on the planet Krypton...',
      catch_phrase: 'Look, up in the sky',
    };

    const response = await supertest(app.getHttpServer())
      .post('/hero')
      .send(createHeroDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('nickname', createHeroDto.nickname);
  });
});
