import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-8 border-t border-[#C9E2F5] text-center text-xs opacity-75 text-[#1B3A5C]">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="font-semibold text-sm text-[#1B3A5C]">
          Built live at the VinnovateIT Vibe Coding Workshop
        </p>
        <p className="text-[11px] text-[#1B3A5C]/60">
          CampusCart • Peer-to-peer student marketplace for VIT
        </p>
      </div>
    </footer>
  );
};
