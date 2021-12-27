import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransferRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository
  ) {}

  async execute({ sender_id, receiver_id, amount, description }: ICreateTransferDTO) {
    const sender = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(receiver_id);

    if(!sender || !receiver) {
      throw new CreateTransferError.UserNotFound();
    }

    const { balance: statementBalance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });
    const transferBalance = await this.transfersRepository.getUserBalance(sender_id)
    if ((statementBalance + transferBalance) < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }
    
    const transfer = await this.transfersRepository.create({
      sender_id, 
      receiver_id,
      amount,
      description
    })
  
    return transfer
  }
}
