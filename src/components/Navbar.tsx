
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Logo from './Logo';
import { Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SettingsModal from './SettingsModal';

const Navbar: React.FC = () => {
  const { preferences, updatePreferences } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleDarkMode = () => {
    updatePreferences({ darkMode: !preferences.darkMode });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="container max-w-5xl mx-auto px-4 flex justify-between items-center">
        <Logo />
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full w-9 h-9 hover:bg-secondary/80"
          >
            {preferences.darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-full w-9 h-9 hover:bg-secondary/80"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
        
        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </div>
    </nav>
  );
};

export default Navbar;
