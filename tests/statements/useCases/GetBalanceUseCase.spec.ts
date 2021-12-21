import { InMemoryStatementsRepository } from "../../../src/modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../../src/modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../../src/modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../../../src/modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../../../src/modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../src/modules/users/repositories/in-memory/InMemoryUsersRepository";


let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe('Get balance', () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    })

    it('should get a statement', async () => {
        const user = await inMemoryUsersRepository.create({
            email: 'user@example.com',
            name: 'test',
            password: '123456'
        })

        const statement = await getBalanceUseCase.execute({
            user_id: user.id as string
        })
        expect(statement).toHaveProperty('balance')
    })

    it('should not create a statement for non-existing user', () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: '123456'
            })
        }).rejects.toBeInstanceOf(GetBalanceError)
    })  
})