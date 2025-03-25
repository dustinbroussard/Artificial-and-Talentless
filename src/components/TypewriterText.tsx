
import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 40,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const index = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset typing when text changes
  useEffect(() => {
    index.current = 0;
    setDisplayText('');
    setIsTyping(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text]);

  // Handle typing effect
  useEffect(() => {
    if (!isTyping) return;

    const type = () => {
      if (index.current < text.length) {
        setDisplayText(prev => prev + text.charAt(index.current));
        index.current += 1;
        timeoutRef.current = setTimeout(type, delay);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    timeoutRef.current = setTimeout(type, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay, isTyping, onComplete]);

  return (
    <div className={`typewriter-container ${className}`}>
      <span className="typewriter-text">{displayText}</span>
      {isTyping && <span className="cursor-blink" aria-hidden="true"></span>}
    </div>
  );
};

export default TypewriterText;
