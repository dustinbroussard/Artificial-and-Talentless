
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

export type HarshnessLevel = 'Mild' | 'Harsh' | 'Cruel';
export type ContentType = 'Insults' | 'Affirmations' | 'Inspirational' | 'Random';

export interface UserPreferences {
  darkMode: boolean;
  contentType: ContentType;
  harshness: HarshnessLevel;
}

export interface UserProfile {
  completed: boolean;
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  education: string;
  employment: string;
  age: number | null;
  maritalStatus: string;
  musicTaste: string[];
  favoriteMedia: string[];
  hobbies: string[];
  humorStyle: string;
  notifications: boolean;
}

interface UserContextType {
  preferences: UserPreferences;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  resetProfile: () => void;
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  contentType: 'Insults',
  harshness: 'Harsh',
};

const defaultProfile: UserProfile = {
  completed: false,
  interests: [],
  strengths: [],
  weaknesses: [],
  education: '',
  employment: '',
  age: null,
  maritalStatus: '',
  musicTaste: [],
  favoriteMedia: [],
  hobbies: [],
  humorStyle: '',
  notifications: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('user-preferences', defaultPreferences);
  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', defaultProfile);
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage<boolean>('is-first-visit', true);

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    setIsFirstVisit(true);
  };

  // Apply dark mode from preferences
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  return (
    <UserContext.Provider value={{
      preferences,
      updatePreferences,
      profile,
      updateProfile,
      resetProfile,
      isFirstVisit,
      setIsFirstVisit
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
