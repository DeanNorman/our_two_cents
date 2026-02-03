import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Send } from 'lucide-react';
import { addTransaction } from '../services/api';
import { Category, Transaction } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onTransactionAdded: (transaction: Transaction) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  onTransactionAdded,
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [user, setUser] = useState<'Dean' | 'Abigail'>('Dean');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Option 1: Submit to backend
    try {
      setSaving(true);
      setSaveError(null);

      const created = await addTransaction({
        user,
        category,
        amount: parseFloat(amount),
        merchant,
        note,
      });

      onTransactionAdded(created);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save spend');
      setSaving(false);
      return;
    }
    
    // Option 2: Deep-link to WhatsApp with pre-filled text
    const whatsappMessage = `${category} ${amount} ${merchant}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    // window.open(whatsappUrl, '_blank');
    
    // Reset form and close
    setAmount('');
    setCategory('');
    setMerchant('');
    setNote('');
    setSaving(false);
    onClose();
  };

  const handleWhatsAppQuickAdd = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('help')}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-semibold text-white">Log a spend</h3>
                  <p className="text-xs text-white/50 mt-1">Fastest is WhatsApp — just message the bot.</p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {saveError && (
                  <div className="text-xs text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {saveError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Who
                  </label>
                  <select
                    value={user}
                    onChange={(e) => setUser(e.target.value as 'Dean' | 'Abigail')}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={saving}
                  >
                    <option value="Dean" className="bg-gray-900">Dean</option>
                    <option value="Abigail" className="bg-gray-900">Abigail</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Amount (R)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={saving}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={saving}
                  >
                    <option value="" className="bg-gray-900">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-gray-900">
                        {cat.icon} {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Merchant */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Merchant
                  </label>
                  <input
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="Where did we spend?"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={saving}
                  />
                </div>

                {/* Note (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={saving}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleWhatsAppQuickAdd}
                    className="flex-1 px-4 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 font-medium transition-all flex items-center justify-center gap-2"
                    disabled={saving}
                  >
                    <Send size={18} />
                    Use WhatsApp Bot
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg"
                    disabled={saving}
                  >
                    {saving ? 'Saving…' : 'Save spend'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const FloatingActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 md:bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-2xl flex items-center justify-center text-white z-40 hover:shadow-blue-500/50 transition-shadow"
    >
      <Plus size={28} strokeWidth={2.5} />
    </motion.button>
  );
};
