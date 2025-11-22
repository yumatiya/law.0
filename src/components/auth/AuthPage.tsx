import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for authentication logic, integrate with supabase or API
    if (email && password) {
      // Simulate successful login
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <label htmlFor="email" className="block mb-2 font-semibold">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="mb-4"
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
          className="mb-6"
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default AuthPage;
