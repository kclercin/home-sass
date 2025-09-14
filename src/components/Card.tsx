import React from 'react';

interface CardProps {
  children: React.ReactNode;
  level?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  level = 'md', 
  className = '' 
}) => {
  const getShadowClass = (level: string) => {
    switch (level) {
      case 'none':
        return 'shadow-none';
      case 'sm':
        return 'shadow-sm';
      case 'md':
        return 'shadow-md';
      case 'lg':
        return 'shadow-lg';
      case 'xl':
        return 'shadow-xl';
      case '2xl':
        return 'shadow-2xl';
      default:
        return 'shadow-md';
    }
  };

  const baseClasses = 'w-full bg-white/40 backdrop-blur-md rounded-xl border border-white/30 p-6 shadow-lg';
  const shadowClass = getShadowClass(level);
  
  return (
    <div className={`${baseClasses} ${shadowClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
