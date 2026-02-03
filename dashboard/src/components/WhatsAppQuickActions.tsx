import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, MessageCircle, ExternalLink } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

interface QuickAction {
  label: string;
  command: string;
  helper?: string;
}

interface WhatsAppQuickActionsProps {
  actions?: QuickAction[];
}

export const WhatsAppQuickActions: React.FC<WhatsAppQuickActionsProps> = ({ actions }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const quickActions = useMemo<QuickAction[]>(() => {
    return (
      actions ?? [
        { label: 'Log a spend', command: 'groceries 350 woolworths', helper: 'Category + amount + place' },
        { label: 'Check balances', command: 'balance', helper: 'All categories' },
        { label: 'House goal', command: 'goal', helper: 'Deposit progress' },
        { label: 'Dining status', command: 'dining balance', helper: 'One category' },
      ]
    );
  }, [actions]);

  const openWhatsApp = (text: string) => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyText = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(text);
        window.setTimeout(() => setCopied(null), 1500);
        return;
      }
    } catch {
      // fall through
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    setCopied(text);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <GlassCard className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-green-300" />
          <h3 className="text-lg font-semibold text-white">WhatsApp Quick Commands</h3>
        </div>
        <button
          onClick={() => openWhatsApp('help')}
          className="text-xs text-green-300 hover:text-green-200 transition-colors"
        >
          Open help →
        </button>
      </div>

      <div className="space-y-2">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.command}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-xl bg-white/5 border border-white/10 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/90">{action.label}</p>
                {action.helper && (
                  <p className="text-xs text-white/50 mt-0.5">{action.helper}</p>
                )}
                <p className="mt-2 font-mono text-xs text-white/80 bg-black/20 border border-white/10 rounded-lg px-2 py-1 inline-block">
                  {action.command}
                </p>
                {copied === action.command && (
                  <p className="text-xs text-green-300 mt-2">Copied</p>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => openWhatsApp(action.command)}
                  className="px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-200 text-xs font-medium transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  Open
                </button>
                <button
                  onClick={() => copyText(action.command)}
                  className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Copy size={14} />
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-white/40 mt-4">
        No friction. Log it in WhatsApp, and we stay aligned.
      </p>
    </GlassCard>
  );
};
