import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager } from 'typeorm';
import {
  ErrorType,
  IQuery,
  LanguageKeys,
  LanguageType,
  QueryHelper,
} from '../../core';
import { HistoryEntity, ProductEntity, UserEntity } from '../../database';
import { IHistory, IHistoryCreate, IHistoryUpdate } from './models';

@Injectable()
export class HistoryService {
  public async getMany(
    query: IQuery,
    userId: number,
    language: LanguageType,
  ): Promise<IHistory[]> {
    return getManager().transaction(async (entityManager) => {
      const qb = entityManager
        .createQueryBuilder(HistoryEntity, 'history')
        .leftJoin('history.author', 'author')
        .andWhere(`author.id = ${userId}`)
        .leftJoin('history.product', 'product')
        .leftJoin('product.name', 'productName')
        .select('history.id', 'id')
        .addSelect('history.createdAt', 'createdAt')
        .addSelect('history.quantity', 'quantity')
        .addSelect(`productName.${LanguageKeys.get(language)}`, 'name')
        .addSelect('product.carbs', 'carbs')
        .addSelect('product.fats', 'fats')
        .addSelect('product.protein', 'protein')
        .addSelect('product.image', 'image')
        .orderBy('history.createdAt', 'DESC');

      QueryHelper.addQuery('history', qb, query, language);
      return await qb.getRawMany();
    });
  }

  public async create(
    request: IHistoryCreate,
    userId: number,
  ): Promise<number> {
    return getManager().transaction(async (entityManager) => {
      const qb = entityManager
        .createQueryBuilder(ProductEntity, 'product')
        .andWhere(`product.id = ${request.productId}`);
      QueryHelper.isAuthorOrPublic('product', qb, userId);

      const product = await qb.getOne();
      if (!product) throw new NotFoundException(ErrorType.NotFoundByMatches);

      const history = new HistoryEntity();

      history.quantity = request.quantity;
      history.product = { id: request.productId } as ProductEntity;
      history.author = { id: userId } as UserEntity;

      const entity = await entityManager.save(HistoryEntity, history);
      return entity.id;
    });
  }

  public async update(
    request: IHistoryUpdate,
    historyId: number,
    userId: number,
  ): Promise<number> {
    return getManager().transaction(async (entityManager) => {
      const history = await entityManager.findOne(HistoryEntity, {
        where: { id: historyId, author: { id: userId } },
      });
      if (!history) throw new NotFoundException(ErrorType.NotFoundByMatches);

      history.quantity = request.quantity;

      const entity = await entityManager.save(history);
      return entity.id;
    });
  }

  public async delete(historyId: number, userId: number): Promise<void> {
    return getManager().transaction(async (entityManager) => {
      const history = await entityManager.findOne(HistoryEntity, {
        where: { id: historyId, author: { id: userId } },
      });
      if (!history) throw new NotFoundException(ErrorType.NotFoundByMatches);

      await entityManager.delete(HistoryEntity, { id: historyId });
    });
  }
}
