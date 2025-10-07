
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Card from '../ui/Card';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center py-12 animate-fade-in">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isLogin ? 'Sign in to continue your journey.' : 'Join us to start your transformation.'}
          </p>
        </div>
        
        {isLogin ? <LoginForm /> : <SignupForm />}

        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline font-medium">
            {isLogin ? 'Don\'t have an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
