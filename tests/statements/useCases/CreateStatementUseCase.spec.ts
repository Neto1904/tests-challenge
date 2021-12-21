import { InMemoryStatementsRepository } from "../../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../../src/modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../../src/modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe('Create statement', () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it('should create a statement', async () => {
        const user = await inMemoryUsersRepository.create({
            email: 'user@example.com',
            name: 'test',
            password: '123456'
        })

        const statement = await createStatementUseCase.execute({
            amount: 1000,
            type: OperationType.DEPOSIT,
            description: 'deposit',
            user_id: user.id as string
        })

        expect(statement).toHaveProperty('id')
    })

    it('should not create a statement for non-existing user', () => {
        expect(async () => {
            await createStatementUseCase.execute({
                amount: 1000,
                type: OperationType.DEPOSIT,
                description: 'deposit',
                user_id: '123456'
            })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    }) 

    it('should not withdraw if user amount is not enough', () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                email: 'user@example.com',
                name: 'test',
                password: '123456'
            })
    
            await createStatementUseCase.execute({
                amount: 1000,
                type: OperationType.DEPOSIT,
                description: 'deposit',
                user_id: user.id as string
            })

            await createStatementUseCase.execute({
                amount: 1200,
                type: OperationType.WITHDRAW,
                description: 'deposit',
                user_id: user.id as string
            })
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    }) 
})