import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Trash2 } from 'lucide-react';
import { updateTransaction, deleteTransaction } from '../services/api';
import { Category, Transaction } from '../types';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onUpdated: (transaction: Transaction) => void;
  onDeleted: (id: number) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  categories,
  onClose,
  onUpdated,
  onDeleted,
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [user, setUser] = useState<'Dean' | 'Abigail'>('Dean');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<'updated' | 'deleted' | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const isOpen = transaction !== null;

  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setCategory(transaction.category);
      setMerchant(transaction.merchant || '');
      setNote(transaction.note || '');
      setUser(transaction.user as 'Dean' | 'Abigail');
      setError(null);
      setSuccess(null);
      setConfirmDelete(false);
      setSaving(false);
      setDeleting(false);
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  }, [transaction]);

  const handleClose = () => {
    setConfirmDelete(false);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;

    try {
      setSaving(true);
      setError(null);

      const updated = await updateTransaction(transaction.id, {
        user,
        category,
        amount: parseFloat(amount),
        merchant,
        note,
      });

      setSuccess('updated');
      onUpdated(updated);

      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to update');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      setDeleting(true);
      setError(null);

      await deleteTransaction(transaction.id);

      setSuccess('deleted');
      onDeleted(transaction.id);

      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const selectedCat = categories.find(c => c.id === category);
  const hasChanges = transaction && (
    String(transaction.amount) !== amount ||
    transaction.category !== category ||
    (transaction.merchant || '') !== merchant ||
    (transaction.note || '') !== note ||
    transaction.user !== user
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          >
            <div className="w-full max-w-md backdrop-blur-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden relative">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-3">
                <h3 className="text-lg font-semibold text-white">Edit Transaction</h3>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={handleClose}
                  className="p-2 -mr-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={18} className="text-white/60" />
                </button>
              </div>

              {/* Success overlay */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        success === 'deleted' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      {success === 'deleted' ? (
                        <Trash2 size={28} className="text-white" />
                      ) : (
                        <Check size={32} className="text-white" strokeWidth={3} />
                      )}
                    </motion.div>
                    <p className="text-white font-semibold">
                      {success === 'deleted' ? 'Deleted' : 'Updated!'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleUpdate} className="px-6 pb-6 space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Who — toggle pills */}
                <div className="flex gap-2">
                  {(['Dean', 'Abigail'] as const).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setUser(name)}
                      disabled={saving || deleting}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        user === name
                          ? name === 'Dean'
                            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30 shadow-lg shadow-blue-500/10'
                            : 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-white border border-pink-400/30 shadow-lg shadow-pink-500/10'
                          : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                        name === 'Dean' ? 'from-blue-500 to-purple-500' : 'from-pink-500 to-rose-500'
                      } flex items-center justify-center text-[10px] text-white font-bold`}>
                        {name[0]}
                      </div>
                      {name}
                    </button>
                  ))}
                </div>

                {/* Amount */}
                <div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-white/40">R</span>
                    <input
                      ref={amountRef}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-2xl font-bold text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                      required
                      disabled={saving || deleting}
                    />
                  </div>
                </div>

                {/* Category — visual grid */}
                <div>
                  <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        disabled={saving || deleting}
                        className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-center transition-all ${
                          category === cat.id
                            ? 'bg-white/15 border border-white/25 shadow-lg'
                            : 'bg-white/5 border border-transparent hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span className={`text-[10px] font-medium leading-tight ${
                          category === cat.id ? 'text-white' : 'text-white/50'
                        }`}>
                          {cat.displayName}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Merchant + Note */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                      Where
                    </label>
                    <input
                      type="text"
                      value={merchant}
                      onChange={(e) => setMerchant(e.target.value)}
                      placeholder="Woolworths"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                      disabled={saving || deleting}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">
                      Note
                    </label>
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
                      disabled={saving || deleting}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  {/* Delete */}
                  {!confirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      disabled={saving || deleting}
                      className="px-4 py-3 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/40 hover:text-red-400 transition-all flex items-center justify-center"
                      title="Delete transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {deleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </motion.button>
                  )}

                  {/* Save */}
                  <button
                    type="submit"
                    disabled={saving || deleting || !amount || !category || !hasChanges}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      saving || deleting || !amount || !category || !hasChanges
                        ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : !hasChanges ? (
                      'No changes'
                    ) : (
                      <>
                        {selectedCat ? `Save R${amount || '0'} to ${selectedCat.displayName}` : 'Save Changes'}
                      </>
                    )}
                  </button>
                </div>

                {confirmDelete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-400/60 text-center"
                  >
                    This will permanently remove this transaction
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
