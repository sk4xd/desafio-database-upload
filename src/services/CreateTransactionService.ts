import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: string;
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let tmpCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!tmpCategory) {
      tmpCategory = await categoryRepository.save({ title: category });
    }

    const balance = await transactionsRepository.getBalance();
    let result = 0;
    if (type === 'outcome') {
      result = balance.total - value;
    }
    if (result < 0) {
      throw new AppError('Insufficient balance.', 400);
    }
    const transaction = await transactionsRepository.create({
      title,
      type,
      value,
      category_id: tmpCategory.id,
    } as Transaction);

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
