import { ActivityType, GenderType, GoalType } from '../../../core';

export interface IRegister {
  height: number;
  weight: number;
  gender: GenderType;
  goal: GoalType;
  activity: ActivityType;
  age: number;
}
