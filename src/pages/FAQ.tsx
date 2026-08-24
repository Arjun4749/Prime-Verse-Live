import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';

const FAQ_ITEMS = [
  {
    q: 'How do I get the Room ID and Password for my match?',
    a: 'Room ID and Password are disclosed on the Tournament Match Card 15 minutes before match time. Registered team captains will also receive a live notification badge in their dashboard.',
  },
  {
    q: 'Are emulators allowed in BGMI.ARENA tournaments?',
    a: 'No. All BGMI.ARENA competitive tournaments are strictly restricted to mobile handheld devices (iOS / Android). Emulators and iPad view tools are automatically blocked and disqualified.',
  },
  {
    q: 'How long does prize distribution take after winning?',
    a: 'Once the final match referee verifies the end-screen screenshot and confirms no fair-play disputes are open, prizes are transferred via UPI/Bank transfer within 2-4 hours, with proof uploaded directly to the Winners page.',
  },
  {
    q: 'Can I change my squad roster after registering?',
    a: 'Yes, team captains can update player BGMI IDs from their Player Dashboard up to 1 hour before the tournament registration deadline closes.',
  },
];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Support & Guidance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <Card
            key={idx}
            className="p-5 cursor-pointer space-y-2 hover:border-orange-500/50 transition-colors"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <div className="flex items-center justify-between font-bold text-white text-sm">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />
                {item.q}
              </span>
              {openIdx === idx ? <ChevronUp className="w-4 h-4 text-orange-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
            {openIdx === idx && (
              <p className="text-xs text-gray-300 font-mono pl-6 leading-relaxed pt-2 border-t border-gray-800/60">
                {item.a}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
