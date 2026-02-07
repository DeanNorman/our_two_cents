import React from 'react';
import { usePhase, PhaseNumber } from '../contexts/PhaseContext';

interface PhaseGateProps {
  minPhase: PhaseNumber;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PhaseGate: React.FC<PhaseGateProps> = ({ minPhase, children, fallback = null }) => {
  const { isPhaseUnlocked } = usePhase();

  if (!isPhaseUnlocked(minPhase)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
