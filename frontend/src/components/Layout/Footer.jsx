import React from 'react';
import { Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-border-light py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo & Name */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-brand-primary rounded-lg flex items-center justify-center text-white shadow-sm shadow-brand-primary/10">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-text-primary text-sm tracking-tight">
              Growth Gear <span className="text-brand-primary font-medium bg-brand-primaryLight/50 px-1.5 py-0.5 rounded-md ml-0.5 text-xs">AI</span>
            </span>
          </div>

          {/* Copyright */}
          <div className="text-text-muted text-[11px] font-medium">
            &copy; {new Date().getFullYear()} Oxygen Sports. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
