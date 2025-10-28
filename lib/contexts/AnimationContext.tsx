'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  heroComplete: boolean;
  setHeroComplete: (complete: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [heroComplete, setHeroComplete] = useState(false);

  return (
    <AnimationContext.Provider value={{ heroComplete, setHeroComplete }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}