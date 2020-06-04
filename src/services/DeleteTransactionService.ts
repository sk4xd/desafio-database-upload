import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transactions from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionRepository = getRepository(Transactions);
    const transactionToBeDeleted = await transactionRepository.findOne({
      where: { id },
    });
    if (!transactionToBeDeleted) {
      throw new AppError('This transaction does not exist', 400);
    }

    await transactionRepository.delete(transactionToBeDeleted.id);
  }
}

export default DeleteTransactionService;
