/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CreatePowerDto } from 'src/power/dto/create-power.dto';
import * as supertest from 'supertest';
import { app } from './test-setup';

describe('/power (e2e)', () => {
  let createdPowerId: number;

  it('/power (POST)', async () => {
    const createPowerDto: CreatePowerDto = { power: 'TestPower', heroId: 1 };

    const response = await supertest(app.getHttpServer())
      .post('/power')
      .send(createPowerDto)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    createdPowerId = response.body.id;
  });

  it('/power/:id (DELETE)', async () => {
    const createPowerDto: CreatePowerDto = { power: 'TestPower', heroId: 1 };

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
