
import React, { useState } from 'react';
import type { DailyWorkout } from '../../types';

interface WorkoutCardProps {
  workoutPlan: DailyWorkout[];
}

const AccordionItem: React.FC<{ day: DailyWorkout; isOpen: boolean; onClick: () => void }> = ({ day, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button onClick={onClick} className="w-full flex justify-between items-center py-4 text-left">
        <div className="flex items-center gap-4">
            <span className={`font-bold text-lg ${isOpen ? 'text-primary' : 'text-secondary'}`}>{day.day}</span>
            <span className="text-sm text-gray-500">{day.focus}</span>
        </div>
        <svg className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 px-2 animate-fade-in">
          <ul className="space-y-3">
            {day.exercises.map((exercise, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-md bg-neutral">
                <span className="font-medium text-gray-800">{exercise.name}</span>
                <span className="text-sm text-gray-600">{exercise.sets} sets x {exercise.reps} reps, {exercise.rest} rest</span>
              </li>
            ))}
          </ul>
          {day.notes && <p className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">{day.notes}</p>}
        </div>
      )}
    </div>
  );
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workoutPlan }) => {
  const [openDay, setOpenDay] = useState<string | null>(workoutPlan[0]?.day || null);

  const handleToggle = (day: string) => {
    setOpenDay(openDay === day ? null : day);
  };

  return (
    <div>
      {workoutPlan.map(day => (
        <AccordionItem key={day.day} day={day} isOpen={openDay === day.day} onClick={() => handleToggle(day.day)} />
      ))}
    </div>
  );
};

export default WorkoutCard;
