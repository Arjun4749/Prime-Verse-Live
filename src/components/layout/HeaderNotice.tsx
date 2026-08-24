import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const HeaderNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-950/90 via-black/90 to-blue-950/90 border-b border-orange-500/20 text-xs text-gray-300 py-1.5 px-4 flex items-center justify-between gap-3 relative z-30">
      <div className="flex items-center gap-2 mx-auto text-center font-medium">
        <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0" />
        <span>
          <strong className="text-orange-400 uppercase tracking-wide">Independent Platform Notice:</strong>{' '}
          BGMI.ARENA is an independent community esports platform and is NOT officially affiliated with, sponsored by, or endorsed by Krafton or BGMI.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer shrink-0"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
