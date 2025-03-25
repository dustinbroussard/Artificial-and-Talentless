
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FeedbackButtonsProps {
  onNext: () => void;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ onNext }) => {
  const handleFeedback = (isPositive: boolean) => {
    if (isPositive) {
      toast.success("Thanks for the positive feedback!");
    } else {
      toast.info("We'll try to do better next time!");
    }
    onNext();
  };

  return (
    <div className="flex items-center justify-center space-x-6 mt-8 mb-4">
      <Button
        variant="ghost"
        size="lg"
        className="flex flex-col items-center hover:bg-secondary/50 transition-all duration-300"
        onClick={() => handleFeedback(true)}
      >
        <ThumbsUp className="h-6 w-6 mb-1" />
        <span className="text-xs">Liked it</span>
      </Button>
      
      <Button
        variant="ghost"
        size="lg" 
        className="flex flex-col items-center hover:bg-secondary/50 transition-all duration-300"
        onClick={() => handleFeedback(false)}
      >
        <ThumbsDown className="h-6 w-6 mb-1" />
        <span className="text-xs">Didn't like it</span>
      </Button>
    </div>
  );
};

export default FeedbackButtons;
