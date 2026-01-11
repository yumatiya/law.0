import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      // Placeholder for registration logic
      console.log('Registering user:', email);
    } else {
      // Placeholder for login logic
      console.log('Logging in user:', email);
    }
    // Simulate successful authentication
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form
        onSubmit={handleAuth}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? 'Register' : 'Sign In'}
        </h2>

        {error && (
          <p className="mb-4 text-red-600 font-semibold" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="email" className="block mb-2 font-semibold">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
          placeholder="you@example.com"
          className="mb-4"
          autoComplete="email"
        />

        <label htmlFor="password" className="block mb-2 font-semibold">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Your password"
          className={isRegister ? 'mb-4' : 'mb-6'}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          minLength={6}
        />

        {isRegister && (
          <>
            <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
              className="mb-6"
              autoComplete="new-password"
              minLength={6}
            />
          </>
        )}

        <Button type="submit" className="w-full" aria-label={isRegister ? 'Register' : 'Sign In'}>
          {isRegister ? 'Register' : 'Sign In'}
        </Button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-indigo-600 underline hover:text-indigo-800 focus:outline-none"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Create an account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
