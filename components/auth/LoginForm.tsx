
import React, { useState, FormEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Please fill in all fields.');
        return;
    }
    setError('');
    // In a real app, you would validate credentials against a backend.
    // For this demo, we'll simulate a login with any valid-looking email.
    // We'll create a dummy name from the email.
    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
    login({ name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Email"
        id="login-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@example.com"
      />
      <Input
        label="Password"
        id="login-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="••••••••"
      />
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Button type="submit" className="w-full" size="lg">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
