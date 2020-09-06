import { Router } from 'express';
import { getCustomRepository } from 'typeorm'
import multer from 'multer';
 import TransactionsRepository from '../repositories/TransactionsRepository';
 import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
 import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload'


const upload = multer(uploadConfig)

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find({relations: ['category']});
  const balance = await transactionRepository.getBalance()

  return response.status(200).json({transactions,balance})
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const {title,value,type,category} = request.body;

  const transactionService = new CreateTransactionService();

  const transaction = await transactionService.execute({
    title,
    value,
    type,
    category
  })

  return response.status(200).json(transaction)

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const {id} = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute(id)
  return response.status(204).send();
});

transactionsRouter.post('/import',
 upload.single('file') ,
  async (request, response) => {
  // TODO
    const importTransactions = new ImportTransactionsService();
    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions)
});

export default transactionsRouter;
