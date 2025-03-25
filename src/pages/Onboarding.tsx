
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, ContentType } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ArrowRight, Info } from 'lucide-react';
import TypewriterText from '@/components/TypewriterText';

interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'text' | 'checkbox' | 'radio';
  options?: string[];
  property: keyof ReturnType<typeof useUser>['profile'] | 'contentType';
  isPreference?: boolean;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, setIsFirstVisit, preferences, updatePreferences } = useUser();
  const [step, setStep] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  const questions: OnboardingQuestion[] = [
    {
      id: 'interests',
      question: 'What are your interests? (comma separated)',
      type: 'text',
      property: 'interests'
    },
    {
      id: 'strengths',
      question: 'What are your strengths? (comma separated)',
      type: 'text',
      property: 'strengths'
    },
    {
      id: 'weaknesses',
      question: 'What are your weaknesses? (comma separated)',
      type: 'text',
      property: 'weaknesses'
    },
    {
      id: 'education',
      question: 'What is your educational background?',
      type: 'radio',
      options: ['High School', 'College', 'Graduate School', 'Self-taught', 'Other'],
      property: 'education'
    },
    {
      id: 'employment',
      question: 'What is your current employment status?',
      type: 'radio',
      options: ['Employed', 'Self-employed', 'Unemployed', 'Student', 'Retired'],
      property: 'employment'
    },
    {
      id: 'humorStyle',
      question: 'How would you describe your sense of humor?',
      type: 'radio',
      options: ['Sarcastic', 'Dry', 'Dark', 'Witty', 'Goofy', 'Slapstick'],
      property: 'humorStyle'
    },
    {
      id: 'contentType',
      question: 'What kind of content would you prefer?',
      type: 'radio',
      options: ['Insults', 'Affirmations', 'Inspirational', 'Random'],
      property: 'contentType',
      isPreference: true
    },
    {
      id: 'notifications',
      question: 'Would you like to receive occasional motivational or humorous reminders?',
      type: 'checkbox',
      property: 'notifications'
    }
  ];

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
      setTypingComplete(false);
    } else {
      // All questions answered
      updateProfile({ completed: true });
      setIsFirstVisit(false);
      navigate('/');
    }
  };

  const handleSkip = () => {
    updateProfile({ completed: true });
    setIsFirstVisit(false);
    navigate('/');
  };

  const handleTypingComplete = () => {
    setTypingComplete(true);
  };

  const handleInputChange = (value: any) => {
    const currentQuestion = questions[step];
    if (currentQuestion) {
      if (currentQuestion.isPreference) {
        // Handle preference properties
        if (currentQuestion.property === 'contentType') {
          updatePreferences({ contentType: value as ContentType });
        }
      } else {
        // Handle profile properties
        if (currentQuestion.type === 'text' && typeof value === 'string') {
          const formattedValue = value.split(',').map(item => item.trim());
          updateProfile({ [currentQuestion.property]: formattedValue });
        } else {
          updateProfile({ [currentQuestion.property]: value });
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/3 -translate-y-1/3 filter blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 filter blur-2xl"></div>
      </div>
      
      <header className="relative z-10 pt-8 pb-6 px-4">
        <div className="container max-w-5xl mx-auto flex justify-center">
          <Logo className="scale-125" />
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-xl glass-panel backdrop-blur-lg border-opacity-30 p-6 md:p-8">
          {step < questions.length ? (
            <>
              <div className="mb-10">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  Step {step + 1} of {questions.length}
                </h2>
                <TypewriterText 
                  text={questions[step].question}
                  className="text-2xl font-medium mb-6"
                  onComplete={handleTypingComplete}
                />
                
                <div className="mt-6 space-y-4">
                  {questions[step].type === 'text' && (
                    <Input 
                      placeholder="Type your answer here..."
                      onChange={(e) => handleInputChange(e.target.value)}
                      disabled={!typingComplete}
                      className="bg-background/50 backdrop-blur-sm"
                    />
                  )}
                  
                  {questions[step].type === 'checkbox' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={questions[step].id} 
                        onCheckedChange={handleInputChange}
                        disabled={!typingComplete}
                      />
                      <Label htmlFor={questions[step].id}>Yes, I'd like that</Label>
                    </div>
                  )}
                  
                  {questions[step].type === 'radio' && questions[step].options && (
                    <RadioGroup 
                      onValueChange={handleInputChange}
                      disabled={!typingComplete}
                      className="space-y-3"
                    >
                      {questions[step].options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${questions[step].id}-${option}`} />
                          <Label htmlFor={`${questions[step].id}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip all
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!typingComplete}
                  className="button-effect"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-medium mb-6">
                <TypewriterText 
                  text="All set! Ready to get started?"
                  onComplete={handleTypingComplete}
                />
              </h2>
              
              <div className="mt-10">
                <Button 
                  onClick={handleNext} 
                  disabled={!typingComplete}
                  size="lg"
                  className="px-10 button-effect"
                >
                  Start using Artificial & Talentless
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        <div className="mt-6 text-center max-w-md text-sm text-muted-foreground">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              All information is optional and stored only on your device. 
              You can reset your data anytime in settings.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
