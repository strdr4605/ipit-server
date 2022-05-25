import { OperatorType } from "./operator.type";

export interface IQueryCondition {
  field: string;
  operator: OperatorType;
  value: string;
}
