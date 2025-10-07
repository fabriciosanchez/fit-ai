
import React from 'react';
import { useApp } from './hooks/useApp';
import AuthPage from './components/auth/AuthPage';
import AssessmentWizard from './components/assessment/AssessmentWizard';
import PlanDashboard from './components/plan/PlanDashboard';
import Header from './components/ui/Header';

const App: React.FC = () => {
  const { user, plan, assessmentCompleted } = useApp();

  const renderContent = () => {
    if (!user) {
      return <AuthPage />;
    }
    if (!assessmentCompleted) {
      return <AssessmentWizard />;
    }
    return <PlanDashboard />;
  };

  return (
    <div className="min-h-screen bg-neutral text-text font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
