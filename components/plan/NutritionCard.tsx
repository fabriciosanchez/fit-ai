
import React, { useState } from 'react';
import type { DailyNutrition } from '../../types';

interface NutritionCardProps {
  nutritionPlan: DailyNutrition[];
}

const NutritionCard: React.FC<NutritionCardProps> = ({ nutritionPlan }) => {
  const [selectedDay, setSelectedDay] = useState(nutritionPlan[0]?.day || 'Monday');

  const activeDayData = nutritionPlan.find(d => d.day === selectedDay);

  return (
    <div>
      <div className="flex space-x-1 rounded-lg bg-neutral p-1 mb-4 overflow-x-auto">
        {nutritionPlan.map(day => (
          <button
            key={day.day}
            onClick={() => setSelectedDay(day.day)}
            className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${selectedDay === day.day ? 'bg-white text-primary shadow' : 'text-gray-600 hover:bg-white/50'}`}
          >
            {day.day.substring(0,3)}
          </button>
        ))}
      </div>
      {activeDayData && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6 bg-neutral p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Calories</p>
              <p className="font-bold text-xl text-primary">{activeDayData.totalCalories}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Protein</p>
              <p className="font-bold text-xl text-secondary">{activeDayData.macronutrients.protein}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbs</p>
              <p className="font-bold text-xl text-secondary">{activeDayData.macronutrients.carbs}g</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fats</p>
              <p className="font-bold text-xl text-secondary">{activeDayData.macronutrients.fats}g</p>
            </div>
          </div>
          <div className="space-y-4">
            {activeDayData.meals.map((meal, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-secondary">{meal.name}</h4>
                  <p className="text-sm text-gray-500">~{meal.calories} kcal</p>
                </div>
                <p className="text-gray-600 text-sm mt-1">{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionCard;
