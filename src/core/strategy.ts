import { ActivityType, GenderType, GoalType } from './models';
import { AppConfig } from './config';

export interface IStrategy {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  fromWeight: number;
  toWeight: number;
  fromDate: string;
  toDate: string;
}

const BMRActivityMap: Map<ActivityType, number> = new Map([
  [ActivityType.Sedentary, 1.1],
  [ActivityType.Light, 1.25],
  [ActivityType.Moderate, 1.4],
  [ActivityType.Active, 1.55],
  [ActivityType.SuperActive, 1.7],
  [ActivityType.Extreme, 1.9],
]);

const BMRGoalMap: Map<GoalType, number> = new Map([
  [GoalType.Loss, 0.8],
  [GoalType.Maintain, 1],
  [GoalType.Mass, 1.1],
]);

const ProteinNeedsGramPerKgMap: Map<GoalType, number> = new Map([
  [GoalType.Loss, 1.5],
  [GoalType.Maintain, 1],
  [GoalType.Mass, 2.5],
]);

export class Strategy {
  public static getStrategy(
    height: number,
    weight: number,
    age: number,
    activity: ActivityType,
    goal: GoalType,
    gender: GenderType,
  ): IStrategy {
    // Calculate nutritional information
    let bmr;
    if (gender === GenderType.Female)
      bmr = 655.1 + 9.6 * weight + 1.9 * height - 4.7 * age;
    else bmr = 66.5 + 13.8 * weight + 5 * height - 6.8 * age;
    const tmr = bmr * BMRActivityMap.get(activity) * BMRGoalMap.get(goal);

    const protein = Math.round(weight * ProteinNeedsGramPerKgMap.get(goal));
    const fats = Math.round((tmr * 0.3) / AppConfig.nutrition.fats);

    const caloriesFromProtein = protein * AppConfig.nutrition.protein;
    const caloriesFromFats = fats * AppConfig.nutrition.fats;
    const remaining = tmr - caloriesFromProtein - caloriesFromFats;

    const carbs = Math.round(remaining / AppConfig.nutrition.carbs);

    const calories = Math.round(
      carbs * AppConfig.nutrition.carbs +
        fats * AppConfig.nutrition.fats +
        protein * AppConfig.nutrition.protein,
    );

    // Calculate period of time
    const fromDate = new Date();
    const toDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 30,
    );

    // Predict weight of user in future
    const fromWeight = weight;

    const daysBetween = Math.abs(
      Math.round((toDate.getTime() - fromDate.getTime()) / 1000 / 84600),
    );
    const extraCaloriesPerDay = tmr - tmr / BMRGoalMap.get(goal);
    const extraCaloriesInPeriod = daysBetween * extraCaloriesPerDay;
    const grams = extraCaloriesInPeriod * AppConfig.nutrition.calorieInGrams;

    const toWeight = weight + grams / 1000;

    return {
      protein,
      fats,
      carbs,
      calories,
      fromWeight,
      toWeight,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
    };
  }
}
