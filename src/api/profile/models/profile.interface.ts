import { ActivityType, GenderType, GoalType, IStrategy } from '../../../core';

export interface IProfile {
  id: number;
  email: string;
  avatar: number;
  age: number;
  height: number;
  weight: number;
  goal: GoalType;
  gender: GenderType;
  activity: ActivityType;
  strategy: IStrategy;
}
