import React from 'react';
import { WhatsAppCommunityHub } from '../components/whatsapp/WhatsAppCommunityHub';
import { MessageSquare, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhatsAppPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between font-mono text-xs text-gray-400">
        <Link to="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official BGMI Channels
          </span>
        </div>
      </div>

      {/* Main Hub */}
      <WhatsAppCommunityHub />
    </div>
  );
};
