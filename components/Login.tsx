
import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface LoginProps {
  onLogin: (username: string, password?: string) => Promise<boolean>;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await onLogin(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
        {error && <p className="text-danger text-center font-semibold">{error}</p>}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-text-secondary"
        >
          Username
        </label>
        <div className="mt-1">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-text-secondary"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};
