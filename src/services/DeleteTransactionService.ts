import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository'
class DeleteTransactionService {
  public async execute(id:string): Promise<void> {
    // TODO

    const transactionsRepository = getCustomRepository(TransactionsRepository)

    const transactionFound = await transactionsRepository.findOne(id);

    if(!transactionFound){
      throw new AppError('Transaction doesn´t exists, try another')
    }

    await transactionsRepository.remove(transactionFound)

    return;

  }
}

export default DeleteTransactionService;
