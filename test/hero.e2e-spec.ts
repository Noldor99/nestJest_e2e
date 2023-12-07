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
import { UpdateHeroDto } from 'src/hero/dto/update-hero.dto';

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

  const createHeroDto: CreateHeroDto = {
    nickname: 'Superman',
    real_name: 'Clark Kent',
    origin_description: 'He was born Kal-El on the planet Krypton...',
    catch_phrase: 'Look, up in the sky',
  };

  it('/hero (POST)', async () => {
    const response = await supertest(app.getHttpServer())
      .post('/hero')
      .send(createHeroDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('nickname', createHeroDto.nickname);
  });

  it('/hero/pagination (GET)', async () => {
    const response = await supertest(app.getHttpServer())
      .get('/hero/pagination')
      .query({ page: 1, limit: 4 });

    expect(response.status).toBe(200);
    expect(response.body.heroes).toBeDefined();
    expect(Array.isArray(response.body.heroes)).toBe(true);
    expect(response.body.total).toBeDefined();
    expect(typeof response.body.total).toBe('number');
  });

  it('/hero/search (GET)', async () => {
    const query = 'super';
    const response = await supertest(app.getHttpServer()).get(
      `/hero/search?query=${query}`,
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/hero/:id (GET)', async () => {
    const heroId = 1;

    const response = await supertest(app.getHttpServer()).get(
      `/hero/${heroId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('/hero/:id (PUT)', async () => {
    const updateHeroDto: UpdateHeroDto = { real_name: 'NewName' };

    const createHero = await supertest(app.getHttpServer())
      .post('/hero')
      .send(createHeroDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const response = await supertest(app.getHttpServer())
      .put(`/hero/${createHero.body.id}`)
      .send(updateHeroDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.real_name).toBe(updateHeroDto.real_name);
  });

  it('/hero/:id (DELETE)', async () => {
    const createHero = await supertest(app.getHttpServer())
      .post('/hero')
      .send(createHeroDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    const response = await supertest(app.getHttpServer())
      .delete(`/hero/${createHero.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});
