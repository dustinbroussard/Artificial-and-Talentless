
import React, { useState, useEffect } from 'react';
import TypewriterText from './TypewriterText';
import FeedbackButtons from './FeedbackButtons';
import { Button } from '@/components/ui/button';
import { useUser, ContentType, HarshnessLevel } from '@/context/UserContext';
import { RefreshCw } from 'lucide-react';

const generateInsult = (
  harshness: HarshnessLevel, 
  profile: any
): string => {
  const insults = {
    Mild: [
      "Your fashion sense is as outdated as a flip phone.",
      "You're about as tech-savvy as my grandmother.",
      "Your jokes land about as well as a paper airplane in a hurricane.",
      "You have the attention span of a goldfish with ADHD.",
      "Your cooking skills could make instant noodles complicated."
    ],
    Harsh: [
      "Your ambition in life is matched only by a sloth on vacation.",
      "Your personality has all the depth of a kiddie pool.",
      "Your decision-making abilities would make a Magic 8-Ball seem reliable.",
      "Your time management skills suggest you believe deadlines are just friendly suggestions.",
      "Your singing voice could be used as an effective animal repellent."
    ],
    Cruel: [
      "Your existence is proof that nature does occasionally make mistakes.",
      "Your life choices read like a 'what not to do' guide for humanity.",
      "Your talents are so hidden, not even you have discovered them yet.",
      "You've set the bar so low it's practically a tripping hazard in hell.",
      "Your personality makes solitary confinement seem like an appealing social opportunity."
    ]
  };

  // Get random insult based on harshness level
  const options = insults[harshness];
  return options[Math.floor(Math.random() * options.length)];
};

const generateAffirmation = (profile: any): string => {
  const affirmations = [
    "You are exactly where you need to be right now.",
    "Your potential is limitless, and you're just getting started.",
    "You have the power to create positive change.",
    "Your unique perspective is valuable and needed.",
    "You are becoming more confident and stronger each day.",
    "You are worthy of all the good things that come to you.",
    "Your courage grows stronger every time you face your fears."
  ];
  
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};

const generateInspirational = (profile: any): string => {
  const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Less, but better. - Dieter Rams"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

const ContentGenerator: React.FC = () => {
  const { preferences, profile } = useUser();
  const [content, setContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateContent = () => {
    setIsLoading(true);
    setIsComplete(false);
    setTimeout(() => {
      let result = "";
      
      switch(preferences.contentType) {
        case 'Insults':
          result = generateInsult(preferences.harshness, profile);
          break;
        case 'Affirmations':
          result = generateAffirmation(profile);
          break;
        case 'Inspirational':
          result = generateInspirational(profile);
          break;
        case 'Random':
          const types: ContentType[] = ['Insults', 'Affirmations', 'Inspirational'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          if (randomType === 'Insults') {
            result = generateInsult(preferences.harshness, profile);
          } else if (randomType === 'Affirmations') {
            result = generateAffirmation(profile);
          } else {
            result = generateInspirational(profile);
          }
          break;
      }
      
      setContent(result);
      setIsLoading(false);
    }, 500);
  };

  // Generate content on first load
  useEffect(() => {
    if (!content) {
      generateContent();
    }
  }, []);

  const handleComplete = () => {
    setIsComplete(true);
  };

  const handleNext = () => {
    generateContent();
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="glass-panel rounded-xl p-6 md:p-8 min-h-[200px] flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        ) : (
          <TypewriterText 
            text={content} 
            className="text-xl md:text-2xl text-center leading-relaxed" 
            onComplete={handleComplete}
          />
        )}
        
        {isComplete && (
          <div className="mt-8 w-full">
            <FeedbackButtons onNext={handleNext} />
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="px-8 button-effect rounded-full bg-background/50 backdrop-blur-sm"
                onClick={handleNext}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;
