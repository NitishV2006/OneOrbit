import React from 'react';

// Fix: Extend React.HTMLAttributes<HTMLDivElement> to allow passing standard div props like onClick.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, ...props }) => {
  return (
    <div className={`bg-bg-secondary p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border-default/50 ${className}`} {...props}>
      {title && <h3 className="text-lg font-bold text-text-primary mb-4">{title}</h3>}
      {children}
    </div>
  );
};
