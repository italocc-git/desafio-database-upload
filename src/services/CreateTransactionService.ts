import AppError from '../errors/AppError';
import {getCustomRepository , getRepository} from 'typeorm'
import Transaction from '../models/Transaction';
import Category from '../models/Category'
import TransactionRepository from '../repositories/TransactionsRepository'
interface Request {
  title : string;
  value : number ;
  type : 'income' | 'outcome';
  category : string;
}

class CreateTransactionService {
  public async execute({title,value,type,category}:Request): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionRepository)
    const categoryRepository = getRepository(Category)

    let categoryAlreadyInserted = await categoryRepository.findOne({where :{title : category}})

    if(!categoryAlreadyInserted){
      categoryAlreadyInserted = categoryRepository.create({
        title : category
      })
    }
    await categoryRepository.save(categoryAlreadyInserted)

    const {total} = await transactionRepository.getBalance();

    if(type === 'outcome' && value > total){
      throw new AppError('You don´t have money enough in your bank account')
    }

    const transaction = transactionRepository.create ({
      title,
      value,
      type,
      category : categoryAlreadyInserted
    });

    await transactionRepository.save(transaction)

    return transaction;

  }
}

export default CreateTransactionService;
