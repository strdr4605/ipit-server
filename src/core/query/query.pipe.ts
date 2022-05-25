import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { IQuery } from './query.interface';
import { AppConfig } from '../config';

@Injectable()
export class QueryPipe implements PipeTransform<IQuery> {
  public transform(query: IQuery, { type }: ArgumentMetadata): IQuery {
    if (type === 'query' && query) {
      query.page = query.page ? Number(query.page) : AppConfig.pageParam.page;
      query.size = query.size ? Number(query.size) : AppConfig.pageParam.size;
      query.conditions = [];
      const data = { ...query };
      delete data.page;
      delete data.size;
      delete data.conditions;

      for (const field in data) {
        if (data.hasOwnProperty(field) && data[field].startsWith('_')) {
          const content = data[field].split('(');
          const operator = content[0].substring(1);
          const value = content[1].split(')')[0];
          query.conditions.push({ field, operator, value });
        }
      }
    }
    return query;
  }
}
