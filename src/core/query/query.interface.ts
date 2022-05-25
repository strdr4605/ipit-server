import { IQueryCondition } from "./query-condition.interface";

export interface IQuery {
  size: number;
  page: number;
  conditions: IQueryCondition[];

  [k: string]: any;
}
