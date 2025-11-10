
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5';

  const variantClasses = {
    primary: 'bg-primary hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-secondary hover:bg-amber-500 focus:ring-amber-400',
    success: 'bg-success hover:bg-green-600 focus:ring-green-500',
    danger: 'bg-danger hover:bg-red-600 focus:ring-red-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
