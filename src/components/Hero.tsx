import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, BookOpen, Bike, Laptop } from 'lucide-react';

interface HeroProps {
  onBrowseClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseClick }) => {
  return (
    <section className="relative px-4 sm:px-8 py-10 sm:py-14 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Floating Sticky Notes from Professional Polish theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
          animate={{ opacity: 1, scale: 1, rotate: 6 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="absolute top-0 right-32 sm:right-56 hidden sm:block bg-[#FFD93D] p-3 shadow-md text-sm font-bold border-l-4 border-yellow-500 rounded-xs text-[#1B3A5C]"
        >
          2nd-hand ✓
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ delay: 0.25, type: 'spring' }}
          className="absolute top-10 right-4 sm:right-12 hidden sm:block bg-[#FFD93D] p-3 shadow-md text-sm font-bold border-l-4 border-yellow-500 rounded-xs text-[#1B3A5C]"
        >
          No fees! 💸
        </motion.div>

        {/* Mobile Sticky Note Pills Bar */}
        <div className="flex sm:hidden justify-start gap-2 mb-4 flex-wrap">
          <span className="bg-[#FFD93D] px-2.5 py-1 shadow-sm text-xs font-bold border-l-4 border-yellow-500 rounded-xs text-[#1B3A5C] transform rotate-1">
            2nd-hand ✓
          </span>
          <span className="bg-[#FFD93D] px-2.5 py-1 shadow-sm text-xs font-bold border-l-4 border-yellow-500 rounded-xs text-[#1B3A5C] transform -rotate-1">
            No fees! 💸
          </span>
          <span className="bg-[#FFD93D] px-2.5 py-1 shadow-sm text-xs font-bold border-l-4 border-yellow-500 rounded-xs text-[#1B3A5C]">
            Same day pickup 🚲
          </span>
        </div>

        {/* Main Hero Header */}
        <div className="max-w-2xl text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] mb-3 text-[#1B3A5C] tracking-tight">
            Sell it. Find it.{' '}
            <span className="relative inline-block whitespace-nowrap">
              Campus only.
              {/* Marker underline block */}
              <span className="absolute bottom-0 left-0 w-full h-2.5 sm:h-3 bg-[#E63946] opacity-30 transform -skew-x-12 -z-1 rounded-xs"></span>
            </span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-[#1B3A5C]/80 mt-2 max-w-xl">
            The exclusive marketplace for VIT students to swap gear.
          </p>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm font-semibold text-[#1B3A5C]/75">
            <span className="inline-flex items-center gap-1.5 hover:text-[#1B3A5C]">
              <BookOpen className="w-4 h-4 text-[#E63946]" /> DSA & Textbooks
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 hover:text-[#1B3A5C]">
              <Bike className="w-4 h-4 text-[#E63946]" /> Campus Cycles
            </span>
            <span className="hidden sm:inline-block">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 hover:text-[#1B3A5C]">
              <Laptop className="w-4 h-4 text-[#E63946]" /> Calculators & Gear
            </span>
          </div>

          {/* CTA Button */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={onBrowseClick}
              id="browse-listings-cta"
              className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-[#E63946] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>Browse listings</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

