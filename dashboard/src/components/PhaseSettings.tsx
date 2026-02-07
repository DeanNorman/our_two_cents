import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Lock, Unlock, Sparkles, X } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { usePhase, PHASES, PhaseNumber } from '../contexts/PhaseContext';

interface PhaseSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhaseSettings: React.FC<PhaseSettingsProps> = ({ isOpen, onClose }) => {
  const { phase, setPhase } = usePhase();
  const [confirmingPhase, setConfirmingPhase] = useState<PhaseNumber | null>(null);

  useEffect(() => {
    if (!isOpen) setConfirmingPhase(null);
  }, [isOpen]);

  const handlePhaseSelect = (targetPhase: PhaseNumber) => {
    if (targetPhase === phase) return;
    setConfirmingPhase(targetPhase);
  };

  const confirmPhaseChange = () => {
    if (confirmingPhase !== null) {
      setPhase(confirmingPhase);
      setConfirmingPhase(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg backdrop-blur-xl bg-gray-900/90 border border-white/20 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Our Journey</h2>
                <p className="text-sm text-white/60">Advance when you're both ready</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
              >
                <X size={18} className="text-white/70" />
              </button>
            </div>

            <div className="space-y-3">
              {([1, 2, 3, 4] as PhaseNumber[]).map((phaseNum) => {
                const info = PHASES[phaseNum];
                const isCurrent = phase === phaseNum;
                const isUnlocked = phase >= phaseNum;
                const isNext = phaseNum === phase + 1;

                return (
                  <button
                    key={phaseNum}
                    onClick={() => handlePhaseSelect(phaseNum)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-500/20 border-blue-500/40 ring-2 ring-blue-500/30'
                        : isUnlocked
                        ? 'bg-white/10 border-white/20 hover:bg-white/15'
                        : isNext
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 border-dashed'
                        : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={phaseNum > phase + 1}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCurrent
                          ? 'bg-blue-500/30'
                          : isUnlocked
                          ? 'bg-green-500/20'
                          : 'bg-white/10'
                      }`}>
                        {isCurrent ? (
                          <Sparkles size={18} className="text-blue-300" />
                        ) : isUnlocked ? (
                          <Unlock size={18} className="text-green-300" />
                        ) : isNext ? (
                          <ChevronRight size={18} className="text-white/50" />
                        ) : (
                          <Lock size={18} className="text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white/50">Phase {phaseNum}</span>
                          {isCurrent && (
                            <span className="text-xs font-medium text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white mt-0.5">{info.name}: {info.tagline}</p>
                        <p className="text-xs text-white/50 mt-1">{info.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {confirmingPhase !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20"
                >
                  <p className="text-sm text-white/80 mb-3">
                    {confirmingPhase > phase ? (
                      <>
                        Ready to move to <strong>Phase {confirmingPhase}: {PHASES[confirmingPhase].name}</strong>?
                        {' '}Make sure you've both discussed this during a Weekly Recon.
                      </>
                    ) : (
                      <>
                        Go back to <strong>Phase {confirmingPhase}: {PHASES[confirmingPhase].name}</strong>?
                        {' '}This will hide features from later phases (nothing is lost).
                      </>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmPhaseChange}
                      className="px-4 py-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 border border-blue-500/30 text-white text-sm font-medium transition-all"
                    >
                      {confirmingPhase > phase ? 'Yes, advance' : 'Yes, go back'}
                    </button>
                    <button
                      onClick={() => setConfirmingPhase(null)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/70 text-sm font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-white/30 mt-4 text-center">
              You can always go back. Features are hidden, never deleted.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PhaseBadge: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { phase, phaseInfo } = usePhase();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all"
    >
      <Sparkles size={14} className="text-blue-300" />
      <span className="text-xs font-medium text-blue-200">
        Phase {phase}: {phaseInfo.name}
      </span>
    </button>
  );
};
