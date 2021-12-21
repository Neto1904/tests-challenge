import console from 'console'
import request from 'supertest'
import { Connection, createConnection, getConnectionOptions } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { app } from '../../../src/app'


let connection: Connection

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it('should create a new user', async () => {
     const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'user@example.com',
        name: 'test',
        password: '123456'
      })

    expect(response.status).toBe(201) 
  })

  it('should not create a new user if the user already exists', async () => {
    await request(app)
    .post('/api/v1/users')
    .send({
      email: 'user@example.com',
      name: 'test',
      password: '123456'
    })

    const response = await request(app)
    .post('/api/v1/users')
    .send({
      email: 'user@example.com',
      name: 'test',
      password: '123456'
    })

    expect(response.status).toBe(400)
 })
})
