
import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import WorkoutCard from './WorkoutCard';
import NutritionCard from './NutritionCard';
import HabitTracker from './HabitTracker';
import ChatAgent from '../chat/ChatAgent';
import Loader from '../ui/Loader';

const PlanDashboard: React.FC = () => {
  const { plan, user, isLoading } = useApp();
  const [activeTab, setActiveTab] = useState('workout');

  if (isLoading && !plan) {
    return <Card><Loader message="Loading your dashboard..." /></Card>;
  }

  if (!plan) {
    return <Card><p>No plan available. Please complete the assessment.</p></Card>;
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary">{plan.title}</h1>
        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">{plan.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('workout')} className={`${activeTab === 'workout' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Workout Plan
                        </button>
                        <button onClick={() => setActiveTab('nutrition')} className={`${activeTab === 'nutrition' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Nutrition Guide
                        </button>
                    </nav>
                </div>
                <div className="pt-6">
                    {activeTab === 'workout' && <WorkoutCard workoutPlan={plan.workoutPlan} />}
                    {activeTab === 'nutrition' && <NutritionCard nutritionPlan={plan.nutritionPlan} />}
                </div>
            </Card>
        </div>
        <div className="space-y-6">
          <HabitTracker recommendations={plan.lifestyleRecommendations} />
        </div>
      </div>
      <ChatAgent />
    </div>
  );
};

export default PlanDashboard;
