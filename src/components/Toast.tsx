import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-[#FAFBFC] border-2 border-[#1B3A5C] rounded-2xl p-4 shadow-[4px_4px_0px_#1B3A5C] flex items-start gap-3 relative overflow-hidden"
              style={{ backgroundColor: '#FAFBFC' }}
            >
              {/* Top sticky tape decoration */}
              <div className="absolute top-0 left-6 w-12 h-2 bg-[#FFD93D]/80 border-b border-[#1B3A5C]/20" />
              
              <div className="mt-0.5 shrink-0">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-[#E63946]" />
                ) : toast.type === 'info' ? (
                  <Sparkles className="w-5 h-5 text-[#1B3A5C]" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#E63946]" />
                )}
              </div>

              <div className="flex-1 pr-2">
                <h4 className="text-sm font-bold text-[#1B3A5C] leading-snug">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs text-[#1B3A5C]/80 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#1B3A5C]/50 hover:text-[#1B3A5C] p-1 rounded-full hover:bg-[#C9E2F5]/30 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
