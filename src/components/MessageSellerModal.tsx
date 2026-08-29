import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Mail, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import { Listing, UserProfile } from '../types';
import { useToast } from './Toast';

interface MessageSellerModalProps {
  listing: Listing | null;
  currentUser: UserProfile | null;
  onClose: () => void;
}

export const MessageSellerModal: React.FC<MessageSellerModalProps> = ({
  listing,
  currentUser,
  onClose,
}) => {
  const { showToast } = useToast();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!listing) return null;

  const sellerFirstName = listing.sellerName.split(' ')[0] || 'Seller';
  const defaultNote = `Hey ${sellerFirstName}, is your "${listing.name}" (₹${listing.price}) still available on campus? I would like to check it out for pickup.`;

  const currentMessageText = message || defaultNote;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast(`Message sent to ${sellerFirstName}!`, 'They will receive your campus inquiry notification', 'success');
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  };

  const mailtoLink = `mailto:${listing.sellerEmail || 'student@vitstudent.ac.in'}?subject=${encodeURIComponent(
    `[Campus Cart] Inquiry for: ${listing.name}`
  )}&body=${encodeURIComponent(
    `${currentMessageText}\n\nFrom: ${currentUser?.displayName || 'VIT Student'} (${currentUser?.email || ''})`
  )}`;

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

        {/* Clean Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-white border border-[#C9E2F5] rounded-2xl p-6 sm:p-7 shadow-xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[#1B3A5C]/60 hover:text-[#1B3A5C] hover:bg-[#FAFBFC] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-4">
            {listing.sellerPhoto ? (
              <img
                src={listing.sellerPhoto}
                alt={listing.sellerName}
                className="w-11 h-11 rounded-full object-cover border border-[#C9E2F5]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#E63946] text-white flex items-center justify-center font-bold text-base shadow-xs">
                {sellerFirstName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-[#1B3A5C] leading-tight">
                  Message {sellerFirstName}
                </h3>
              </div>
              <p className="text-xs text-[#1B3A5C]/70 font-medium">
                Regarding <strong className="text-[#1B3A5C]">{listing.name}</strong> • ₹{listing.price}
              </p>
            </div>
          </div>

          {/* Item Preview Ticket */}
          <div className="p-3 bg-[#FAFBFC] border border-[#C9E2F5] rounded-xl mb-4 flex items-center justify-between text-xs font-semibold text-[#1B3A5C]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#C9E2F5]/50 text-[10px] uppercase font-bold text-[#1B3A5C]">
                {listing.category}
              </span>
              <span className="truncate max-w-[200px]">{listing.name}</span>
            </div>
            <span className="text-[#E63946] font-bold text-sm">₹{listing.price}</span>
          </div>

          {/* Message Form */}
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1B3A5C]/70 mb-1.5">
                Your Note to Seller
              </label>
              <textarea
                rows={4}
                value={message || defaultNote}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAFBFC] border border-[#C9E2F5] text-sm text-[#1B3A5C] font-medium placeholder:text-[#1B3A5C]/40 focus:outline-hidden focus:border-[#E63946] transition-colors resize-none"
              />
            </div>

            {/* From User badge */}
            <div className="text-[11px] font-medium text-[#1B3A5C]/70 flex items-center gap-1.5">
              <span>Sending as: <strong className="text-[#1B3A5C]">{currentUser?.displayName || 'VIT Student'}</strong> ({currentUser?.email})</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="submit"
                disabled={sent}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#E63946] text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-[#d62839] active:scale-95 transition-all cursor-pointer"
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sent!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 -rotate-45" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <a
                href={mailtoLink}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-[#C9E2F5] bg-[#FAFBFC] hover:bg-white text-[#1B3A5C] font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all text-center"
              >
                <Mail className="w-4 h-4 text-[#1B3A5C]" />
                <span>Open Student Mail</span>
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
