
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
  // Enhanced insults with more creative content
  const insults = {
    Mild: [
      "Your fashion sense is reminiscent of someone who shops exclusively in the dark with oven mitts on.",
      "You have the technological prowess of someone still trying to program their VCR from 1998.",
      "Your jokes land with all the grace of a penguin attempting a triple backflip.",
      "Your attention span makes goldfish look like they're preparing for PhD dissertations.",
      "Your cooking skills could make instant ramen question its life choices.",
      "You dance like a sloth having an existential crisis.",
      "Your singing voice sounds like what would happen if autotuning software gave up halfway through.",
      "Your handwriting looks like a seismograph during an earthquake.",
      "You run with all the coordination of a newborn giraffe on roller skates."
    ],
    Harsh: [
      "Your ambition in life rivals that of a sloth who's decided even hanging upside down is too much effort.",
      "Your personality has all the depth and complexity of a kiddie pool filled with lukewarm tap water.",
      "Your decision-making skills make Magic 8-Balls seem like strategic planning consultants.",
      "Your time management approach suggests you believe deadlines are merely polite suggestions sent from a parallel universe.",
      "Your singing voice could be weaponized to disperse unwanted crowds or possibly communicate with extraterrestrial life forms.",
      "Your fitness level suggests your primary exercise is reaching for the remote control.",
      "Your organizational skills make a tornado look like a professional filing system.",
      "Your memory functions like a sieve designed specifically to retain only useless trivia and song lyrics from the 90s."
    ],
    Cruel: [
      "Your existence serves as compelling evidence that evolution occasionally takes extended coffee breaks.",
      "Your life choices read like a cautionary tale they'd show to psychology students with the title 'What Not To Do: An Exhaustive Study'.",
      "Your talents are so deeply hidden that not even archaeological expeditions with advanced sonar technology could locate them.",
      "You've set the bar so low it's practically serving as a tripping hazard in the underworld.",
      "Your personality makes extended solitary confinement seem like an appealing social opportunity with fascinating company.",
      "Your creative thinking is so limited it makes a one-way dead-end street look like an intricate maze of possibilities.",
      "Your sense of direction is so poor that you could get lost in an elevator with only two buttons.",
      "Your presence in a room has the remarkable effect of making everyone suddenly remember urgent appointments elsewhere."
    ]
  };

  // Use profile details for more personalized insults if available
  if (profile && profile.interests && profile.interests.length > 0) {
    const interest = profile.interests[Math.floor(Math.random() * profile.interests.length)];
    const personalizedInsults = [
      `Your enthusiasm for ${interest} is matched only by your complete lack of talent in it.`,
      `I've seen toddlers with more aptitude for ${interest} than you've managed to develop.`,
      `Your dedication to ${interest} would be admirable if the results weren't so tragically mediocre.`
    ];
    
    // 40% chance of using a personalized insult if available
    if (Math.random() < 0.4) {
      return personalizedInsults[Math.floor(Math.random() * personalizedInsults.length)];
    }
  }

  // Get random insult based on harshness level
  const options = insults[harshness];
  return options[Math.floor(Math.random() * options.length)];
};

const generateAffirmation = (profile: any): string => {
  const affirmations = [
    "You are exactly where you need to be right now, even if it feels like you're completely lost.",
    "Your potential is limitless, and you're just getting started on this wild journey.",
    "You have the power to create positive change, even when everything seems to be falling apart.",
    "Your unique perspective is valuable and needed in this increasingly conformist world.",
    "You are becoming more confident and stronger each day, even when it doesn't feel like it.",
    "You are worthy of all the good things that come to you, despite what that inner voice might say.",
    "Your courage grows stronger every time you face your fears, no matter how small the step.",
    "The universe conspires in your favor, especially when it seems like it's working against you.",
    "You contain multitudes of brilliance that the world is waiting to witness.",
    "Every challenge you face is just preparing you for something amazing ahead."
  ];
  
  return affirmations[Math.floor(Math.random() * affirmations.length)];
};

const generateInspirational = (profile: any): string => {
  const quotes = [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. - Steve Jobs",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Less, but better. - Dieter Rams",
    "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
    "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change. - Charles Darwin",
    "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
    "What you're thinking is what you're becoming. - Muhammad Ali",
    "Everything you can imagine is real. - Pablo Picasso"
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
    <div className="w-full max-w-4xl px-4">
      <div className="glass-panel rounded-xl p-8 md:p-10 min-h-[300px] flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-60">
            <RefreshCw className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        ) : (
          <TypewriterText 
            text={content} 
            className="text-2xl md:text-3xl text-center leading-relaxed max-w-3xl" 
            onComplete={handleComplete}
          />
        )}
        
        {isComplete && (
          <div className="mt-12 w-full">
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
