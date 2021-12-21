import { InMemoryUsersRepository } from "../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../src/modules/users/useCases/authenticateUser/AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "../../../src/modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError"
import { CreateUserError } from "../../../src/modules/users/useCases/createUser/CreateUserError"
import { CreateUserUseCase } from "../../../src/modules/users/useCases/createUser/CreateUserUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe('Create user use case', () => { 
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })
    
    it('should authenticate an user', async () => {
        await createUserUseCase.execute({
            email: 'user@example.com',
            name: 'test',
            password: '123456'
        })

        const authorization = await authenticateUserUseCase.execute({ 
            email: 'user@example.com',
            password: '123456'
        })

        expect(authorization).toHaveProperty('token')
    })

     it('should not authenticate an user with incorrect Password', () => {
        expect(async () => {
            await createUserUseCase.execute({
                email: 'user@example.com',
                name: 'test',
                password: '123456'
            })

            await authenticateUserUseCase.execute({ 
                email: 'user@example.com',
                password: '12345'
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    }) 

     it('should not authenticate a non-existing user', () => {
        expect(async () => {   
            await authenticateUserUseCase.execute({ 
                email: 'user@example.com',
                password: '12345'
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    }) 
})