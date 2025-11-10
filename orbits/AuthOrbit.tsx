
import React, { useState } from 'react';
import { Login } from '../components/Login';
import { SignUp } from '../components/SignUp';
import { NewUser } from '../types';

interface AuthOrbitProps {
  onLogin: (username: string, password?: string) => Promise<boolean>;
  onSignup: (newUser: NewUser) => Promise<boolean>;
}

export const AuthOrbit: React.FC<AuthOrbitProps> = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-secondary p-8 rounded-2xl shadow-2xl border border-border-default/50">
           <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Welcome to OneOrbit</h1>
                <p className="text-text-secondary mt-2">
                    {isLoginView ? "Sign in to continue your journey." : "Create an account to get started."}
                </p>
            </div>

          {isLoginView ? (
            <Login onLogin={onLogin} />
          ) : (
            <SignUp onSignup={onSignup} />
          )}

           <div className="mt-6 text-center">
                <button
                    onClick={() => setIsLoginView(!isLoginView)}
                    className="text-sm font-semibold text-primary hover:underline"
                >
                    {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
