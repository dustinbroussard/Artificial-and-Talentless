
import React from 'react';
import { BrainCog } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative mr-2 bg-secondary dark:bg-secondary/40 p-2 rounded-md shadow-sm">
        <BrainCog className="w-6 h-6 text-primary dark:text-primary" />
        <div className="absolute inset-0 border border-black/10 dark:border-white/10 rounded-md"></div>
      </div>
      <div className="font-typewriter text-lg tracking-tight text-primary dark:text-primary">
        A&T
      </div>
    </div>
  );
};

export default Logo;
