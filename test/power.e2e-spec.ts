/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Power } from '../src/entity/power.entity';
import { CreatePowerDto } from 'src/power/dto/create-power.dto';
import * as supertest from 'supertest';
import CONNECTION from '../src/database/db.connection';
import { PowerModule } from '../src/power/power.module';

describe('/power (e2e)', () => {
  let app: INestApplication;
  let createdPowerId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        //@ts-ignore
        TypeOrmModule.forRoot({
          ...CONNECTION,
          entities: [Power],
          synchronize: true,
        }),
        PowerModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/power (POST)', async () => {
    const createPowerDto: CreatePowerDto = { power: 'TestPower' };

    const response = await supertest(app.getHttpServer())
      .post('/power')
      .send(createPowerDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    createdPowerId = response.body.id;
  });

  it('/power/:id (DELETE)', async () => {
    const createPowerDto: CreatePowerDto = { power: 'TestPower' };

    const createPowerResponse = await supertest(app.getHttpServer())
      .post('/power')
      .send(createPowerDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(createPowerResponse.status).toBe(201);
    expect(typeof createPowerResponse).toBe('object');
    expect(createPowerResponse.body).toHaveProperty('power');

    const deletePowerResponse = await supertest(app.getHttpServer())
      .delete(`/power/${createPowerResponse.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(deletePowerResponse.status).toBe(200);
    expect(typeof deletePowerResponse.body).toBe('object');
  });
});
