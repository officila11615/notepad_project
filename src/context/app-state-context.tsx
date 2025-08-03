
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppStateContextType {
  isBackgroundGlowing: boolean;
  setIsBackgroundGlowing: (isGlowing: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [isBackgroundGlowing, setIsBackgroundGlowing] = useState(false);

  return (
    <AppStateContext.Provider value={{ isBackgroundGlowing, setIsBackgroundGlowing }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

    