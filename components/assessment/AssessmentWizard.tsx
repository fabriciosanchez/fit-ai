
import React, { useState } from 'react';
import type { AssessmentData, Goal, ActivityLevel, Gender } from '../../types';
import { useApp } from '../../hooks/useApp';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const steps = [
    { id: 1, title: 'Your Goal' },
    { id: 2, title: 'Your Profile' },
    { id: 3, title: 'Your Lifestyle' },
    { id: 4, title: 'Confirmation' },
];

const AssessmentWizard: React.FC = () => {
    const { submitAssessment, isLoading, error, user } = useApp();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<Partial<AssessmentData>>({
        goal: 'lose_weight',
        gender: 'male',
        activityLevel: 'sedentary',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'sleepHours' || name === 'waterIntake' ? Number(value) : value }));
    };
    
    const handleSelectChange = <T,>(name: keyof AssessmentData, value: T) => {
        setFormData(prev => ({...prev, [name]: value}));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleSubmit = () => {
        submitAssessment(formData as AssessmentData);
    };

    const progress = (currentStep / steps.length) * 100;

    if (isLoading) {
        return <Card className="text-center animate-fade-in"><Loader message="Crafting your personalized plan... This might take a moment." /></Card>;
    }

    if (error) {
        return <Card className="text-center animate-fade-in">
            <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <Button onClick={prevStep} className="mt-4">Go Back</Button>
        </Card>;
    }

    return (
        <div className="max-w-3xl mx-auto animate-slide-in-up">
            <Card>
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        <span className="text-base font-medium text-primary">Step {currentStep} of {steps.length}</span>
                        <span className="text-sm font-medium text-primary">{steps[currentStep-1].title}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {currentStep === 1 && <Step1 data={formData} onSelect={handleSelectChange} />}
                {currentStep === 2 && <Step2 data={formData} onChange={handleChange} onSelect={handleSelectChange} />}
                {currentStep === 3 && <Step3 data={formData} onChange={handleChange} />}
                {currentStep === 4 && <Step4 data={formData} />}

                <div className="mt-8 flex justify-between">
                    <Button onClick={prevStep} disabled={currentStep === 1} variant="secondary">Back</Button>
                    {currentStep < steps.length ? (
                        <Button onClick={nextStep}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit}>Generate My Plan</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

const OptionCard: React.FC<{title: string; description: string; selected: boolean; onClick: () => void; icon: React.ReactNode}> = ({ title, description, selected, onClick, icon }) => (
    <div onClick={onClick} className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-400'}`}>
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <h3 className="font-bold text-lg text-secondary">{title}</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
        </div>
    </div>
);

const Step1: React.FC<{data: Partial<AssessmentData>, onSelect: <T,>(name: keyof AssessmentData, value: T) => void}> = ({ data, onSelect }) => (
    <div>
        <h2 className="text-2xl font-bold text-center mb-6">What's Your Primary Goal?</h2>
        <div className="space-y-4">
            <OptionCard title="Lose Weight" description="Focus on burning fat and improving health." selected={data.goal === 'lose_weight'} onClick={() => onSelect('goal', 'lose_weight')} icon={<ScaleIcon />} />
            <OptionCard title="Gain Muscle" description="Build strength and increase lean muscle mass." selected={data.goal === 'gain_muscle'} onClick={() => onSelect('goal', 'gain_muscle')} icon={<MuscleIcon />} />
            <OptionCard title="Both" description="A balanced approach to lose fat and build muscle." selected={data.goal === 'both'} onClick={() => onSelect('goal', 'both')} icon={<TransformIcon />}/>
        </div>
    </div>
);

const Step2: React.FC<{data: Partial<AssessmentData>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, onSelect: <T,>(name: keyof AssessmentData, value: T) => void}> = ({ data, onChange, onSelect }) => (
    <div>
        <h2 className="text-2xl font-bold text-center mb-6">Tell Us About Yourself</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <div className="flex gap-2">
                    {(['male', 'female', 'other'] as Gender[]).map(g => (
                        <button key={g} type="button" onClick={() => onSelect('gender', g)} className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${data.gender === g ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{g.charAt(0).toUpperCase() + g.slice(1)}</button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                     <input type="number" name="age" value={data.age || ''} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 25"/>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                     <input type="number" name="height" value={data.height || ''} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 175"/>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                     <input type="number" name="weight" value={data.weight || ''} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 80"/>
                </div>
            </div>
        </div>
    </div>
);

const Step3: React.FC<{data: Partial<AssessmentData>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void}> = ({ data, onChange }) => (
     <div>
        <h2 className="text-2xl font-bold text-center mb-6">Your Daily Habits</h2>
        <div className="space-y-6">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                 <select name="activityLevel" value={data.activityLevel} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                     <option value="sedentary">Sedentary (little to no exercise)</option>
                     <option value="lightly_active">Lightly Active (exercise 1-2 days/week)</option>
                     <option value="moderately_active">Moderately Active (exercise 3-5 days/week)</option>
                     <option value="very_active">Very Active (exercise 6-7 days/week)</option>
                 </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preference</label>
                 <input type="text" name="dietaryPreference" value={data.dietaryPreference || ''} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., Omnivore, Vegetarian, Vegan"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Sleep (hours/night)</label>
                     <input type="number" name="sleepHours" value={data.sleepHours || ''} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 7"/>
                </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Daily Water (liters)</label>
                     <input type="number" name="waterIntake" value={data.waterIntake || ''} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 2"/>
                </div>
            </div>
        </div>
    </div>
);


const Step4: React.FC<{data: Partial<AssessmentData>}> = ({ data }) => (
    <div>
        <h2 className="text-2xl font-bold text-center mb-6">Ready to Forge Your Path?</h2>
        <p className="text-center text-gray-600 mb-6">Please confirm your details below. The AI will use this to create a plan uniquely for you.</p>
        <div className="bg-neutral p-4 rounded-lg space-y-2">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                    <span className="font-semibold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-secondary">{String(value).replace('_', ' ')}</span>
                </div>
            ))}
        </div>
    </div>
);

// Icons
const ScaleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M16 16.5a2.5 2.5 0 0 0-3.5-3.5l-8 8a2.5 2.5 0 0 0 3.5 3.5l8-8Z"/><path d="m21 5-8-3-8 3 8 3 8-3Z"/><path d="M10 22V12"/><path d="m7 12-5.1 1.9a1 1 0 0 0-.9 1.4L3 22"/><path d="m17 12 5.1 1.9a1 1 0 0 1 .9 1.4L21 22"/></svg>;
const MuscleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M8 20a2 2 0 0 0 2-2h4a2 2 0 0 0 2 2Z"/><path d="M5 18a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2Z"/><path d="M12 2a2.5 2.5 0 0 1 2.5 2.5V14a2.5 2.5 0 0 1-5 0V4.5A2.5 2.5 0 0 1 12 2Z"/><path d="M9.5 9.5a2.5 2.5 0 0 0-5 0V16a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2Z"/><path d="M14.5 9.5a2.5 2.5 0 0 1 5 0V16a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2Z"/></svg>;
const TransformIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M21 12a9 9 0 1 0-9.72 8.97"/><path d="M16.5 9.5 19 7l-2.5-2.5"/><path d="M12 18.5a6 6 0 1 0 0-12"/></svg>;

export default AssessmentWizard;
