import React, { createContext, useContext, useState, useCallback } from 'react';

export type PhaseNumber = 1 | 2 | 3 | 4;

export interface PhaseInfo {
  number: PhaseNumber;
  name: string;
  tagline: string;
  description: string;
}

export const PHASES: Record<PhaseNumber, PhaseInfo> = {
  1: {
    number: 1,
    name: 'Discovery',
    tagline: 'Just Track, Don\'t Judge',
    description: 'Build the habit of logging every purchase. No budgets, no warnings — just observe.',
  },
  2: {
    number: 2,
    name: 'Understanding',
    tagline: 'Name Your Money',
    description: 'Understand your patterns. See where money goes, what\'s fixed vs flexible.',
  },
  3: {
    number: 3,
    name: 'Confidence',
    tagline: 'Shared Decisions',
    description: 'Set budgets together. Make spending decisions based on real data.',
  },
  4: {
    number: 4,
    name: 'Goals',
    tagline: 'Save for What Matters',
    description: 'Save intentionally for specific future goals while maintaining your budget.',
  },
};

interface PhaseContextValue {
  phase: PhaseNumber;
  phaseInfo: PhaseInfo;
  setPhase: (phase: PhaseNumber) => void;
  isPhaseUnlocked: (requiredPhase: PhaseNumber) => boolean;
}

const STORAGE_KEY = 'our_two_cents_phase';

function loadPhase(): PhaseNumber {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (parsed >= 1 && parsed <= 4) return parsed as PhaseNumber;
    }
  } catch {
    // localStorage unavailable
  }
  return 1;
}

function savePhase(phase: PhaseNumber) {
  try {
    localStorage.setItem(STORAGE_KEY, String(phase));
  } catch {
    // localStorage unavailable
  }
}

const PhaseContext = createContext<PhaseContextValue | null>(null);

export const PhaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhaseState] = useState<PhaseNumber>(loadPhase);

  const setPhase = useCallback((newPhase: PhaseNumber) => {
    setPhaseState(newPhase);
    savePhase(newPhase);
  }, []);

  const isPhaseUnlocked = useCallback(
    (requiredPhase: PhaseNumber) => phase >= requiredPhase,
    [phase]
  );

  const value: PhaseContextValue = {
    phase,
    phaseInfo: PHASES[phase],
    setPhase,
    isPhaseUnlocked,
  };

  return <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>;
};

export function usePhase(): PhaseContextValue {
  const ctx = useContext(PhaseContext);
  if (!ctx) {
    throw new Error('usePhase must be used within a PhaseProvider');
  }
  return ctx;
}
