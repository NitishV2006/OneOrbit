
import React, { useState } from 'react';
import { Button } from './Button';
import { NewUser } from '../types';
import { resizeImage } from '../lib/utils';

interface SignUpProps {
  onSignup: (newUser: NewUser) => Promise<boolean>;
}

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2E1YjRmYyI+CiAgPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6bTAgMTRjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+Cjwvc3ZnPg==';

export const SignUp: React.FC<SignUpProps> = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);
  const [avatarPreview, setAvatarPreview] = useState<string>(defaultAvatar);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedBase64 = await resizeImage(file, 256);
        setAvatarUrl(resizedBase64);
        setAvatarPreview(resizedBase64);
      } catch (error) {
        console.error("Error resizing image:", error);
        setError("Failed to process image. Please try another one.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
    }
    setError('');
    setLoading(true);
    const success = await onSignup({ username, password, avatarUrl });
    if (!success) {
      setError('Username might already be taken.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      {error && <p className="text-danger text-center font-semibold">{error}</p>}
      
       <div className="flex flex-col items-center space-y-2">
            <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-4 border-border-default" />
            <label htmlFor="avatar-upload" className="cursor-pointer text-sm text-primary hover:underline">
                Upload a photo
            </label>
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
        </div>

      <div>
        <label
          htmlFor="username-signup"
          className="block text-sm font-medium text-text-secondary"
        >
          Username
        </label>
        <div className="mt-1">
          <input
            id="username-signup" name="username" type="text"
            required value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password-signup"
          className="block text-sm font-medium text-text-secondary"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password-signup" name="password" type="password"
            required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-bg-primary border border-border-default rounded-lg focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full !mt-6" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  );
};