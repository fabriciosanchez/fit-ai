
export interface User {
  name: string;
  email: string;
}

export type Goal = 'lose_weight' | 'gain_muscle' | 'both';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';

export interface AssessmentData {
  goal: Goal;
  gender: Gender;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  dietaryPreference: string;
  sleepHours: number;
  waterIntake: number; // in liters
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface DailyWorkout {
  day: string;
  focus: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Meal {
    name: string;
    description: string;
    calories: number;
}

export interface DailyNutrition {
    day: string;
    meals: Meal[];
    totalCalories: number;
    macronutrients: {
        protein: number;
        carbs: number;
        fats: number;
    };
}

export interface FitnessPlan {
  title: string;
  summary: string;
  workoutPlan: DailyWorkout[];
  nutritionPlan: DailyNutrition[];
  lifestyleRecommendations: {
    sleep: string;
    hydration: string;
    stressManagement: string;
  };
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}
