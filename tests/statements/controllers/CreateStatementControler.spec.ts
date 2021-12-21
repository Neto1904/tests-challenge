import console from 'console'
import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { app } from '../../../src/app'


let connection: Connection

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should create a new statement', async () => {
     await request(app)
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        name: 'test',
        password: '123456'
      })

      const {body: { token }} = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: 'user@example.com',
        password: '123456'
      })

      const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'Deposit'
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.status).toBe(201) 
  })

})
