import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { testCredentials, user } from './test-constants';

jest.setTimeout(600000);

describe('AppController (e2e)', () => {
  let app: INestApplication;
  // let editorToken: string;
  let adminToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    // Login to get access token
    const loginAdmin: any = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'joddhn.dodde12d@example.com',
        password: 'test123',
      });

    adminToken = loginAdmin.body.accessToken;

    // Login to get access token
    const loginEditor: any = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@example.com',
        password: 'user123',
      });

    editorToken = loginEditor.body.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET) - should be protected', () => {
    return request(app.getHttpServer()).get('/health').expect(HttpStatus.OK);
  });

  it('/auth/login (POST) - success', async () => {
    const response: any = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testCredentials.validUser)
      .expect(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('/auth/login (POST) - fail with wrong credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(testCredentials.invalidUser)
      .expect(401);
  });

  it('/auth/logout (POST) - fail with wrong credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `bearer ${adminToken}`)
      .send(testCredentials.validUser)
      .expect(201);
  });

  it('/users (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${adminToken}`)
      .expect(200);
    expect(Array.isArray(response.body));
  });

  it('/users (GET) - should fail without token', () => {
    return request(app.getHttpServer()).get('/users').expect(401);
  });

  it('/users/:id (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toHaveProperty('id', 2);
  });

  it('/users/:id (GET) - fail with invalid usrId', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${user.invalid}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body).toHaveProperty('statusCode', 400);
  });

  it('/users/:id (PATCH) - success', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ firstName: 'John Doe' })
      .expect(200);
    expect(response.body).toHaveProperty('id', 2);
  });

  it('/users/:id (PATCH) - fail with invalid userId', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${user.invalid}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ firstName: 'John Doe' })
      .expect(200);
    expect(response.body).toHaveProperty('statusCode', 404);
  });
});
