import { InMemoryStatementsRepository } from "../../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../src/modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "../../../src/modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../../src/modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe('Get statement operation', () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    })

    it('should get a statement operation', async () => {
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

        const operation = await getStatementOperationUseCase.execute({
            statement_id: statement.id as string,
            user_id: user.id as string
        })

        expect(operation).toHaveProperty('id')
    })

     it('should not get a statement for non-existing user', () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                statement_id: 'id',
                user_id: 'id'
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })  

    it('should not get a statement for non-existing statement', () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                email: 'user@example.com',
                name: 'test',
                password: '123456'
            })
            await getStatementOperationUseCase.execute({
                statement_id: 'id',
                user_id: user.id as string
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    }) 
})