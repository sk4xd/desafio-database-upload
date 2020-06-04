import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await getRepository(Transaction).find();
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(function (total, transaction: Transaction) {
        return total + transaction.value;
      }, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(function (total, transaction: Transaction) {
        return total + transaction.value;
      }, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    } as Balance;
  }
}

export default TransactionsRepository;
