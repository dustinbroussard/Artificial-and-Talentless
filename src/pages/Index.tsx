
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import ContentGenerator from '@/components/ContentGenerator';
import TypewriterText from '@/components/TypewriterText';

const Index: React.FC = () => {
  const { isFirstVisit, profile } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isFirstVisit && !profile.completed) {
      navigate('/onboarding');
    }
  }, [isFirstVisit, profile.completed, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/3 -translate-y-1/3 filter blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 translate-y-1/2 filter blur-2xl"></div>
      </div>
      
      <Navbar />
      
      <main className="flex-1 relative z-10 pt-24 pb-10 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary backdrop-blur-sm">
              Artificial & Talentless
            </span>
          </div>
          <h1 className="font-typewriter text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
            <TypewriterText 
              text="Human-like responses with artificial intelligence." 
              delay={50}
            />
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            A minimal AI experience with a nostalgic typewriter effect that delivers content tailored just for you.
          </p>
        </div>
        
        <ContentGenerator />
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Artificial & Talentless. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
