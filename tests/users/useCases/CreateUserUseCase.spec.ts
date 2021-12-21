import { InMemoryUsersRepository } from "../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "../../../src/modules/users/useCases/createUser/CreateUserError"
import { CreateUserUseCase } from "../../../src/modules/users/useCases/createUser/CreateUserUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create user use case', () => { 
    beforeAll(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })
    
    it('should create a new user', async () => {
        const user = await createUserUseCase.execute({
            email: 'user@example.com',
            name: 'test',
            password: '123456'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not create a new user if the user already exists', () => {
        expect(async () => {
            await createUserUseCase.execute({
                email: 'user@example.com',
                name: 'test',
                password: '123456'
            })

            await createUserUseCase.execute({
                email: 'user@example.com',
                name: 'test',
                password: '123456'
            })
        }).rejects.toBeInstanceOf(CreateUserError)
    })
})