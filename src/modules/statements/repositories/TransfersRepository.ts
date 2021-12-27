import { getRepository, Repository } from "typeorm";

import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "./ITransferRepository";

export class TransfersRepository implements ITransfersRepository {
  private repository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Transfer);
  }
  async create({
    sender_id,
    amount,
    description,
    receiver_id
  }: ICreateTransferDTO): Promise<Transfer> {
    const transfer = this.repository.create({
      sender_id,
      amount,
      description,
      receiver_id
    });

    return this.repository.save(transfer);
  }

  async getUserBalance(user_id: string): Promise<number> {
    const transfers = await this.repository.find({where: [{sender_id: user_id}, {receiver_id: user_id}]})
    let balance = 0
    transfers.forEach(transfer => {
        if(transfer.sender_id === user_id) {
            balance -= transfer.amount
        } else if(transfer.receiver_id === user_id){
            balance += transfer.amount
        }
    })
    return balance
  }
}
