import { Brackets, SelectQueryBuilder } from 'typeorm';

import { IQuery } from './query.interface';
import { OperatorType } from './operator.type';
import { LanguageKeys } from '../maps';
import { LanguageType, ProductStatusType } from '../models';

export class QueryHelper {
  public static addQuery(
    repository: string,
    qb: SelectQueryBuilder<any>,
    query: IQuery,
    language: LanguageType,
  ) {
    qb.limit(query.size).offset(query.size * query.page);
    query.conditions.forEach((condition) => {
      switch (condition.operator) {
        case OperatorType.TranslatedContains:
          qb.andWhere(
            `LOWER(${condition.field}.${LanguageKeys.get(language)}) LIKE '%${
              condition.value
            }%'`,
          );
          break;
        case OperatorType.Period:
          const period = `${condition.value} ${condition.field}`;
          const interval = `>= NOW() - INTERVAL '${period}'`;
          qb.andWhere(`${repository}.createdAt ${interval}`);
          break;
        case OperatorType.Order:
          qb.addOrderBy(
            `${repository}.${condition.field}`,
            condition.value as any,
          );
          break;
      }
    });
  }

  public static isAuthorOrPublic(
    repository: string,
    qb: SelectQueryBuilder<any>,
    authorId: number,
  ): void {
    qb.leftJoin(`${repository}.author`, 'author');
    qb.andWhere(
      new Brackets((sQb) => {
        sQb.andWhere(`author.id = ${authorId}`);
        sQb.orWhere(`${repository}.status = :publicStatus`, {
          publicStatus: ProductStatusType.Public,
          privateStatus: ProductStatusType.Private,
        });
      }),
    );
    qb.addSelect(
      `author.id = ${authorId} and ${repository}.status = :privateStatus`,
      'manageable',
    );
    qb.andWhere(`${repository}.status <> :archived`, {
      archived: ProductStatusType.Archived,
    });
  }
}
