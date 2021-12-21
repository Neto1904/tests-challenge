import { InMemoryUsersRepository } from "../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../src/modules/users/useCases/createUser/CreateUserUseCase"
import { ShowUserProfileError } from "../../../src/modules/users/useCases/showUserProfile/ShowUserProfileError"
import { ShowUserProfileUseCase } from "../../../src/modules/users/useCases/showUserProfile/ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase

describe('Create user use case', () => { 
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })
    
    it('should show user profile', async () => {
        const createdUser = await createUserUseCase.execute({
            email: 'user@example.com',
            name: 'test',
            password: '123456'
        })
        
        const user = await showUserProfileUseCase.execute( createdUser.id as string )

        expect(user.id).toEqual(createdUser.id)
    })
    

    it('should not show user profile if user does not exists',  () => {
        expect(async () => {
            await showUserProfileUseCase.execute('id')
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})