import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldAlert, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { signInWithGoogle, signInDemoStudent } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  targetActionName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetActionName,
}) => {
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setDomainError(null);
    try {
      const user = await signInWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err: any) {
      if (err?.message === 'INVALID_DOMAIN') {
        setDomainError('This marketplace is for VIT students only. Please sign in with your official @vitstudent.ac.in email address.');
      } else if (err?.message === 'FIREBASE_AUTH_NOT_INITIALIZED') {
        setDomainError('Firebase configuration is in local preview mode. Please use the Instant VIT Student Login below to test full authenticated actions!');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setDomainError('Sign-in failed. Please try again or use the Instant VIT Student login below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (name: string, regno: string) => {
    setDomainError(null);
    const user = signInDemoStudent(name, regno);
    onSuccess(user);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1B3A5C]/40 backdrop-blur-xs"
        />

        {/* Paper Note Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-[#FAFBFC] border-2 border-[#1B3A5C] rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0px_#1B3A5C] overflow-hidden"
          style={{ backgroundColor: '#FAFBFC' }}
        >
          {/* Top Washi Tape */}
          <div className="washi-tape" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#1B3A5C]/60 hover:text-[#1B3A5C] hover:bg-[#C9E2F5]/40 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFD93D] border-2 border-[#1B3A5C] text-[#1B3A5C] mb-3 shadow-[2px_2px_0px_#1B3A5C]">
              <GraduationCap className="w-6 h-6" />
            </div>
            
            <h3 className="text-2xl font-black text-[#1B3A5C] font-marker tracking-tight">
              Campus ID Sign In
            </h3>
            
            <p className="text-sm text-[#1B3A5C]/80 mt-1 font-medium">
              {targetActionName 
                ? `Sign in with your VIT student account to ${targetActionName}.` 
                : 'Exclusive student marketplace verified for VITians.'}
            </p>
          </div>

          {/* Domain Error Sticky Note */}
          {domainError && (
            <motion.div
              initial={{ opacity: 0, y: -6, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              className="mt-5 p-3.5 bg-[#FFD93D] border-2 border-[#1B3A5C] rounded-xl shadow-[3px_3px_0px_#1B3A5C] relative"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-[#E63946] shrink-0 mt-0.5" />
                <div className="text-xs font-bold text-[#1B3A5C] leading-snug">
                  <span className="block text-[#E63946] uppercase tracking-wider text-[11px] mb-0.5">
                    Access Notice
                  </span>
                  {domainError}
                </div>
              </div>
            </motion.div>
          )}

          {/* Notice Badge */}
          <div className="mt-5 p-3 bg-[#C9E2F5]/35 border border-[#1B3A5C]/25 rounded-xl flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#E63946] animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-[#1B3A5C]">
              Restricted to verified <strong className="underline decoration-[#E63946] decoration-2">@vitstudent.ac.in</strong> email IDs
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border-2 border-[#1B3A5C] bg-[#FAFBFC] hover:bg-[#C9E2F5]/20 text-[#1B3A5C] font-bold text-sm shadow-[3px_3px_0px_#1B3A5C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1B3A5C] transition-all"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {loading ? 'Authenticating...' : 'Sign in with Google Account'}
            </button>

            <div className="flex items-center my-1">
              <div className="flex-1 border-t border-dashed border-[#1B3A5C]/30" />
              <span className="px-3 text-[11px] font-bold text-[#1B3A5C]/60 uppercase tracking-widest font-handwriting">
                or quick test
              </span>
              <div className="flex-1 border-t border-dashed border-[#1B3A5C]/30" />
            </div>

            {/* Instant Demo Account */}
            <button
              onClick={() => handleDemoSignIn('Arjun Verma', '22BCE1492')}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#E63946] text-white font-bold text-sm shadow-[3px_3px_0px_#1B3A5C] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1B3A5C] active:translate-y-0.5 active:shadow-[1px_1px_0px_#1B3A5C] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Instant VIT Student Sign In (Demo)</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-[#1B3A5C]/60 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E63946]" /> 
              Instant verification with Hostel / Academic ID
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
