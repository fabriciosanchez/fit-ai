
import React from 'react';
import Card from '../ui/Card';

interface HabitTrackerProps {
  recommendations: {
    sleep: string;
    hydration: string;
    stressManagement: string;
  };
}

const HabitItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="bg-primary/10 text-primary p-2 rounded-full">
            {icon}
        </div>
        <div>
            <h3 className="font-bold text-secondary">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

const HabitTracker: React.FC<HabitTrackerProps> = ({ recommendations }) => {
  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold mb-4">Lifestyle Habits</h2>
      <div className="space-y-6">
        <HabitItem icon={<SleepIcon />} title="Sleep" description={recommendations.sleep} />
        <HabitItem icon={<WaterDropIcon />} title="Hydration" description={recommendations.hydration} />
        <HabitItem icon={<LeafIcon />} title="Stress Management" description={recommendations.stressManagement} />
      </div>
    </Card>
  );
};

const SleepIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 22h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2Z"/><path d="M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="M4 12a1 1 0 0 1-1-1 4 4 0 0 1 4-4 1 1 0 0 1 1 1 4 4 0 0 1-4 4Z"/></svg>;
const WaterDropIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>;
const LeafIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M11 20A7 7 0 0 1 4 13V8a2 2 0 0 1 2-2h4l2 4l-2 4h4a2 2 0 0 0 2-2v-3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5a7 7 0 0 1-7 7h-1Z"/></svg>;

export default HabitTracker;
